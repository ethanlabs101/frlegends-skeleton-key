import path from "node:path";
import { mkdir, readdir, readFile, copyFile } from "node:fs/promises";
import { drawInterfaceFrame } from "../utils/frame.js";
import { theme } from "../utils/theme.js";
import { box } from "../utils/box.js";
import { __dirname } from "../cli.js";

export async function unlockMenu(
    json,
    rl,
    activeAccountState,
    performUpload,
    syncTelemetry,
    prefix,
    xorKey
) {
    const stockCarsDir = path.join(
        __dirname,
        "fr_legends_payloads",
        "cars",
        "stock_cars"
    );
    const exoticImporterDir = path.join(
        __dirname,
        "fr_legends_payloads",
        "cars"
    );
    while (true) {
        try {
            await mkdir(stockCarsDir, { recursive: true });
            await mkdir(exoticImporterDir, { recursive: true });

            const files = await readdir(stockCarsDir);

            const stockCars = files
                .filter(file => file.endsWith(".json"))
                .sort((a, b) => a.localeCompare(b));

            if (stockCars.length === 0) {
                drawInterfaceFrame("Unlock Menu", activeAccountState);

                console.log(box.top());
                box.drawRow(theme.error("No stock car payloads found."));
                box.drawRow(theme.bwhite("Expected directory:"));
                box.drawRow(theme.bcyan(stockCarsDir));
                console.log(box.bottom());

                await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press Enter to return")}${theme.bpurple("... ")}\x1b[1;38;2;0;255;255m`);
                process.stdout.write(theme.RESET);
                return;
            }
            drawInterfaceFrame("Unlock Menu", activeAccountState);
            console.log(box.top());
            box.drawRow(`${theme.bcyan("Stock Cars Available: ")}${theme.bwhite(stockCars.length)}`);
            console.log(box.bottom());
            console.log(box.top());
            box.drawRow(`${theme.warn("Enter Index to Inject Car to Garage")}`);
            console.log(box.mid());

            stockCars.forEach((file, index) => {
                const carName = file.replace(".json", "");

                box.drawRow(`${theme.bpurple("[")}${theme.warn(String(index + 1).padStart(2, "0"))}${theme.bpurple("] ")}${theme.bwhite(carName)}`);
            });
            console.log(box.mid());
            box.drawRow(`${theme.bpurple("[")}${theme.warn("X")}${theme.bpurple("] ")}${theme.bwhite("Export ALL Stock Cars to Exotic Importer")}`);
            box.drawRow(`${theme.bpurple("[")}${theme.warn("Z")}${theme.bpurple("] ")}${theme.bwhite("Inject COMPLETE Stock Car Set")}`);
            console.log(box.mid());
            box.drawRow(`${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("] ")}${theme.bwhite("Back")}`);
            console.log(box.bottom());

            const choice = (await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Selection: ")}\x1b[1;38;2;0;255;255m`)).trim().toLowerCase();
            process.stdout.write(theme.RESET);

            if (choice === "") {
                return null;
            }
            if (choice === "x") {
                console.log(`${theme.bcyan("\n[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Exporting stock car payloads")}${theme.bcyan("... ")}`);

                let exported = 0;

                for (const file of stockCars) {
                    const source = path.join(stockCarsDir, file);
                    const destination = path.join(exoticImporterDir, file);

                    await copyFile(source, destination);
                    exported++;

                    console.log(`${theme.success(`[+] Exported: ${file}`)}`);
                }
                console.log(`${theme.success(`\n[+] Successfully exported ${exported} stock car payloads.`)}`);

                await rl.question(`${theme.bpurple("\n[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press Enter to continue")}${theme.bpurple("... ")}\x1b[1;38;2;0;255;255m`);
                process.stdout.write(theme.RESET);
                continue;
            }
            if (choice === "z") {
                const confirm = await rl.question(`${theme.warn("\n[")}${theme.bwhite("?")}${theme.warn("] ")}${theme.bwhite("Inject all stock cars into your garage? ")}${theme.warn("(")}${theme.bwhite("y")}${theme.warn("/")}${theme.bwhite("n")}${theme.warn(")")}${theme.bwhite(": ")}\x1b[1;38;2;0;255;255m`);
                process.stdout.write(theme.RESET);

                if (confirm.trim().toLowerCase() !== "y") {
                    continue;
                }
                if (!Array.isArray(json.cars)) {
                    json.cars = [];
                }
                console.log(`${theme.bcyan("\n[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Injecting complete stock car set")}${theme.bcyan("... ")}`);

                let injected = 0;

                for (const file of stockCars) {
                    const raw = await readFile(
                        path.join(stockCarsDir, file),
                        "utf8"
                    );
                    const carData = JSON.parse(raw);
                    json.cars.push(carData);
                    injected++;

                    console.log(`${theme.success(`[${injected}/${stockCars.length}] Injected: ${file}`)}`);
                }
                if (json.cars.length > (json.carport || 0)) {
                    json.carport = json.cars.length;
                }
                console.log(`${theme.bcyan("\n[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Uploading complete stock car set")}${theme.bcyan("... ")}`);
                await performUpload(json, prefix, xorKey);

                console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Syncing Telemetry")}${theme.bcyan("... ")}`);
                await syncTelemetry();

                console.log(`${theme.success(`\n[+] Successfully injected ${injected} stock cars.`)}`);

                await rl.question(`${theme.bpurple("\n[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press Enter to continue")}${theme.bpurple("... ")}\x1b[1;38;2;0;255;255m`);
                process.stdout.write(theme.RESET);
                continue;
            }
            const index = Number(choice);

            if (!Number.isInteger(index) || index < 1 || index > stockCars.length) {
                console.log(theme.error("[-] Invalid selection."));
                await new Promise(resolve => setTimeout(resolve, 800));
                continue;
            }
            const selectedFile = stockCars[index - 1];
            const raw = await readFile(path.join(stockCarsDir, selectedFile), "utf8");
            const carData = JSON.parse(raw);

            if (!Array.isArray(json.cars)) {
                json.cars = [];
            }
            json.cars.push(carData);

            if (json.cars.length > (json.carport || 0)) {
                json.carport = json.cars.length;
            }
            console.log(`${theme.success(`\n[+] Injected: ${selectedFile}`)}`);

            console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Uploading changes")}${theme.bcyan("... ")}`);
            await performUpload(json, prefix, xorKey);

            console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Syncing Telemetry")}${theme.bcyan("... ")}`);
            await syncTelemetry();

            console.log(`${theme.success("[+] Stock car successfully added to garage.")}`);

            await rl.question(`${theme.bpurple("\n[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press Enter to continue")}${theme.bpurple("... ")}\x1b[1;38;2;0;255;255m`);
            process.stdout.write(theme.RESET);
            continue;
        } catch (err) {
            console.log(`${theme.error(`[-] Unlock Menu Error: ${err.message}`)}`);
            await rl.question(`${theme.bpurple("\n[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press Enter to continue")}${theme.bpurple("... ")}\x1b[1;38;2;0;255;255m`);
            process.stdout.write(theme.RESET);
        }
    }
}
