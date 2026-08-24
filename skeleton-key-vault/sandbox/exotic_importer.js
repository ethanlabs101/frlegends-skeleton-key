import path from "node:path";
import { mkdir, readdir, readFile, unlink } from "node:fs/promises";
import { drawInterfaceFrame } from "../utils/frame.js";
import { theme } from "../utils/theme.js";
import { box } from "../utils/box.js";
import { __dirname } from "../cli.js";

async function discoverCarAssets() {
    const payloadDir = path.join(__dirname, "fr_legends_payloads", "cars");
    const downloadsDir = path.join(__dirname, "fr_legends_payloads", "downloads");

    await mkdir(payloadDir, { recursive: true });
    await mkdir(downloadsDir, { recursive: true });

    const assets = [];
    const seen = new Set();
    const rootFiles = await readdir(payloadDir).catch(() => []);

    for (const file of rootFiles) {
        if (!file.endsWith(".json")) continue;

        const fullPath = path.join(payloadDir, file);

        assets.push({
            fileName: file,
            displayName: file.replace(".json", "").replace(/_/g, " "),
            source: "payload",
            sourcePath: fullPath,
            deleteAllowed: true
        });
    }
    const carDirectories = await readdir(payloadDir, { withFileTypes: true }).catch(() => []);

    for (const entry of carDirectories) {
        if (!entry.isDirectory()) continue;

        const assetDirectory = path.join(payloadDir, entry.name);
        const carPath = path.join(assetDirectory, "car.json");

        try {
            await readFile(carPath, "utf8");
            const fileName = `${entry.name.replace(/\s+/g, "_")}.json`;

            if (seen.has(fileName)) continue;
            seen.add(fileName);

            assets.push({
                fileName,
                displayName: entry.name,
                source: "installed",
                sourcePath: carPath,
                assetDirectory,
                deleteAllowed: false
            });
        } catch {}
    }
    const models = await readdir(downloadsDir, { withFileTypes: true }).catch(() => []);

    for (const modelDirectory of models) {
        if (!modelDirectory.isDirectory()) continue;

        const modelPath = path.join(downloadsDir, modelDirectory.name);
        const downloadedAssets = await readdir(modelPath, { withFileTypes: true }).catch(() => []);

        for (const assetDirectory of downloadedAssets) {
            if (!assetDirectory.isDirectory()) continue;

            const assetPath = path.join(modelPath, assetDirectory.name);
            const carPath = path.join(assetPath, "car.json");

            try {
                await readFile(carPath, "utf8");

                const fileName = `${assetDirectory.name.replace(/\s+/g, "_")}.json`;

                if (seen.has(fileName)) continue;
                seen.add(fileName);

                assets.push({
                    fileName,
                    displayName: assetDirectory.name,
                    source: "downloaded",
                    sourcePath: carPath,
                    assetDirectory: assetPath,
                    deleteAllowed: false
                });
            } catch {}
        }
    }
    return assets.sort((a, b) => a.fileName.localeCompare(b.fileName));
}

export async function runExoticImporter(json, rl, activeAccountState, performUpload, syncTelemetry, prefix, xorKey) {
    while (true) {
        try {
            const payloadDir = path.join(__dirname, "fr_legends_payloads", "cars");
            const assets = await discoverCarAssets();

            if (assets.length === 0) {
                drawInterfaceFrame("Exotic Importer", activeAccountState);
                console.log(box.top());
                box.drawRow(`${theme.warn("TIP: ")}${theme.bwhite("Install a full-car asset or export a payload")}`);
                box.drawRow(`${theme.bwhite("to activate the ")}${theme.bpurple("Exotic Importer")}`);
                console.log(box.bottom());
                await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press ")}${theme.bpurple("[")}${theme.bwhite("Enter")}${theme.bpurple("] ")}${theme.bwhite("to return. ")}\x1b[1;38;2;0;255;255m`);
                process.stdout.write(theme.RESET);
                return;
            }
            const stats = {};

            assets.forEach(asset => {
                const category = asset.fileName.charAt(0).toUpperCase();
                stats[category] = (stats[category] || 0) + 1;
            });
            drawInterfaceFrame("Exotic Importer", activeAccountState);
            console.log(box.top());
            box.drawRow(`${theme.warn("Enter Filter To Browse Payloads: ")}`);
            console.log(box.bottom());
            console.log(box.top());

            Object.keys(stats).sort((a, b) => {
                if (/[A-Z]/.test(a) && !/[A-Z]/.test(b)) return -1;
                if (!/[A-Z]/.test(a) && /[A-Z]/.test(b)) return 1;
                return a.localeCompare(b);
            }).forEach(category => {
                box.drawRow(`${theme.bpurple("[")}${theme.warn(category)}${theme.bpurple("] ")}${theme.bwhite(`${stats[category]} assets`)}`);
            });
            console.log(box.mid());
            box.drawRow(`${theme.bpurple("[")}${theme.warn("?")}${theme.bpurple("] ")}${theme.bwhite("Asset Types | ")}${theme.bpurple("[")}${theme.warn("$")}${theme.bpurple("] ")}${theme.bwhite("View All | ")}${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("] ")}${theme.bwhite("Exit")}`);
            console.log(box.bottom());

            const catChoice = (await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Select category")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).trim().toUpperCase();
            process.stdout.write(theme.RESET);

            if (catChoice === "") break;

            if (catChoice === "?") {
                while(true) {
                    console.clear();
                    drawInterfaceFrame("Exotic Importer Info", activeAccountState);
                    console.log(box.top());
                    box.drawRow(`${theme.warn("Exotic Importer Asset Types")}`);
                    console.log(box.bottom());
                    console.log(box.top());
                    box.drawRow(`${theme.warn("[DOWNLOADED] ")}${theme.bwhite("- Downloaded from ")}${theme.bpurple("Online Asset Manager")}${theme.bwhite(".")}`);
                    box.drawRow(`${theme.bpurple("[PAYLOAD] ")}${theme.bwhite("- Generated from Garage Assets.")}`);
                    box.drawRow(" ");
                    box.drawRow(`${theme.bwhite("If you havent already check out the Online Asset Manager")}`);
                    box.drawRow(`${theme.bwhite("to download liveries + cars, and inject them to garage!")}`);
                    console.log(box.mid());
                    box.drawRow(`${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("] ")}${theme.bwhite("Back")}`);
                    console.log(box.bottom());

                    const helpInput = await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press Enter To Return")}${theme.bpurple("... ")}\x1b[1;36;2;0;255;255m`);
                    process.stdout.write(theme.RESET);

                    if (helpInput === "") break;

                    await rl.question(`${theme.error("[-] Invalid input. Press Enter to continue. ")}\x1b[1;38;2;0;255;255m`);
                    process.stdout.write(theme.RESET);
                }
                continue;
            }
            const filteredAssets = catChoice === "$" ? assets : assets.filter(asset => asset.fileName.toUpperCase().startsWith(catChoice));

            if (filteredAssets.length === 0) {
                console.log(theme.error("[-] No assets found for that filter."));
                await new Promise(resolve => setTimeout(resolve, 1000));
                continue;
            }
            console.clear();
            drawInterfaceFrame(`Filtering: ${catChoice}`, activeAccountState);
            console.log(box.top());
            box.drawRow(theme.warn("Available Assets:"));
            console.log(box.bottom());
            console.log(box.top());

            filteredAssets.forEach((asset, index) => {
                const sourceLabel = asset.source === "installed" ? theme.bcyan("[INSTALLED]") : asset.source === "downloaded" ? theme.warn("[DOWNLOADED]") : theme.bpurple("[PAYLOAD]");
                box.drawRow(`${theme.bpurple("[")}${theme.warn(String(index + 1).padStart(2, "0"))}${theme.bpurple("]")} ${theme.bwhite(asset.displayName)} ${sourceLabel}`);
            });
            console.log(box.mid());
            box.drawRow(`${theme.warn("TIP: ")}${theme.bwhite("Use a comma ")}${theme.bpurple("(")}${theme.warn(",")}${theme.bpurple(") ")}${theme.bwhite("for batch operations.")}`);
            console.log(box.mid());
            box.drawRow(`${theme.warn("Commands: ")}${theme.bpurple("[")}${theme.warn("1")}${theme.bpurple(",")}${theme.warn("2")}${theme.bpurple("] ")}${theme.bwhite("Inject ")}${theme.bwhite("| ")}${theme.bpurple("[")}${theme.warn("-1")}${theme.bpurple(",")}${theme.warn("-2")}${theme.bpurple("] ")}${theme.bwhite("Delete ")}${theme.bwhite("| ")}${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("] ")}${theme.bwhite("Back")}`);
            console.log(box.bottom());

            const input = await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Selection")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`);
            process.stdout.write(theme.RESET);

            if (input === "") continue;

            const selections = input.split(",").map(value => parseInt(value.trim())).filter(value => !isNaN(value));
            let injectionCount = 0;

            for (const selection of selections) {
                if (selection > 0 && selection <= filteredAssets.length) {
                    const asset = filteredAssets[selection - 1];
                    const raw = await readFile(asset.sourcePath, "utf8");
                    const carData = JSON.parse(raw);

                    if (!Array.isArray(json.cars)) json.cars = [];

                    json.cars.push(carData);
                    injectionCount++;

                    console.log(theme.success(`[+] Injected: ${asset.displayName}`));
                } else if (selection < 0 && Math.abs(selection) <= filteredAssets.length) {
                    const asset = filteredAssets[Math.abs(selection) - 1];

                    if (!asset.deleteAllowed) {
                        console.log(theme.warn(`[-] ${asset.displayName} is managed by Asset Manager.`));
                        console.log(theme.bwhite("    Delete it through Asset Manager instead."));
                        continue;
                    }
                    const confirm = await rl.question(`${theme.warn(`[?] Are you sure you want to delete ${asset.fileName}? (y/n): `)}\x1b[1;38;2;0;255;255m`);
                    process.stdout.write(theme.RESET);

                    if (confirm.trim().toLowerCase() === "y") {
                        await unlink(path.join(payloadDir, asset.fileName));
                        console.log(theme.warn(`[-] Deleted: ${asset.fileName}`));
                    }
                } else {
                    console.log(theme.error(`[-] Invalid selection: ${selection}`));
                }
            }
            if (injectionCount > 0) {
                if (json.cars.length > (json.carport || 0)) json.carport = json.cars.length;

                console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Syncing changes to cloud")}${theme.bcyan("...")}`);
                await performUpload(json, prefix, xorKey);

                console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Syncing Telemetry. May Take Awhile")}${theme.bcyan("... ")}\x1b[1;38;2;0;255;255m`);
                process.stdout.write(theme.RESET);

                await syncTelemetry();
                continue;
            }
        } catch (err) {
            console.log(`${theme.error(`[-] Importer Error: ${err.message}`)}`);
        }
        await rl.question(`${theme.bpurple("\n[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press ")}${theme.bpurple("[")}${theme.bwhite("Enter")}${theme.bpurple("] ")}${theme.bwhite("to continue. ")}`);
    }
}
