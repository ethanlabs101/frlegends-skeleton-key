import fs from "node:fs";
import path from "node:path";
import { encode, countNodes, parseTreeText } from "./codec.js";
import { theme } from "../../utils/theme.js";

const STOCK_DIR = path.join(
    process.cwd(),
    "fr_legends_payloads",
    "cars",
    "stock_cars"
);

const LIVERY_DIR = path.join(
    process.cwd(),
    "fr_legends_payloads",
    "liveries"
);

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function loadJSON(file) {
    return JSON.parse(fs.readFileSync(file, "utf8"));
}

function loadLiveryFile(file) {
    const raw = fs.readFileSync(file, "utf8").trim();

    if (raw.startsWith("{")) {
        return JSON.parse(raw);
    }
    return { rawText: raw };
}

function injectDecal(car, field, livery) {
    if (!livery) return;

    let nodes;
    let binary;

    if (livery.rawText) {
        const tree = parseTreeText(livery.rawText);
        nodes = countNodes(tree);
        binary = Array.from(encode(livery.rawText));
    } else {
        nodes = livery.nodes;
        binary = livery.binary;
    }
    const old = car[field];

    car[field] = {
        revision: old ? old.revision + 1 : 1,
        capacity: old ? old.capacity : nodes,
        binary
    };

    console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bcyan(`${field} `)}${theme.bwhite("injecting: ")}${theme.bcyan("(")}${theme.bcyan(`${nodes} `)}${theme.bwhite("nodes ")}${theme.bcyan("/ ")}${theme.bcyan(`${binary.length} `)}${theme.bwhite("bytes")}${theme.bcyan(") ")}`);
}

export async function injectInstalledLivery(
    json,
    rl,
    performUpload,
    syncTelemetry,
    prefix,
    xorKey,
    model,
    liveryName
) {
    const stockPath = path.join(STOCK_DIR, `${model}.json`);

    if (!fs.existsSync(stockPath)) {
        throw new Error(`Missing stock template: ${model}`);
    }

    const folder = path.join(
        LIVERY_DIR,
        model,
        liveryName
    );

    const bodyFile = path.join(
        folder,
        "compiled",
        "body.json"
    );

    const windowFile = path.join(
        folder,
        "compiled",
        "window.json"
    );

    const car = clone(loadJSON(stockPath));

    console.log(`\n${theme.warn(`Loading ${model}/${liveryName}`)}`);

    if (fs.existsSync(bodyFile)) {
        injectDecal(
            car,
            "bodyDecal",
            loadLiveryFile(bodyFile)
        );
    }

    if (fs.existsSync(windowFile)) {
        injectDecal(
            car,
            "windowDecal",
            loadLiveryFile(windowFile)
        );
    }

    const confirm = await rl.question(`${theme.bpurple("\n[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Inject this car into garage")}${theme.bpurple("? (")}${theme.bwhite("y")}${theme.bpurple("/")}${theme.bwhite("n")}${theme.bpurple("): ")}\x1b[1;38;2;0;255;255m`);

    process.stdout.write(theme.RESET);

    if (confirm.toLowerCase() !== "y") {
        console.log(`${theme.error("[!] Cancelled.")}`);
        return false;
    }

    if (!json.cars) {
        json.cars = [];
    }

    json.cars.push(car);

    if (json.cars.length > (json.carport || 0)) {
        json.carport = json.cars.length;
    }

    console.log(`${theme.bcyan("\n[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Uploading Car")}${theme.bcyan("... ")}`);

    await performUpload(
        json,
        prefix,
        xorKey
    );

    if (syncTelemetry) {
        await syncTelemetry();
    }
    console.log(`${theme.success("[+] Upload complete.")}`);
    return true;
}
