import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { drawInterfaceFrame } from "../utils/frame.js";
import { theme } from "../utils/theme.js";
import { box } from "../utils/box.js";

const getRootPath = () => path.resolve(process.cwd());
const getPayloadPath = () => path.join(getRootPath(), 'fr_legends_payloads', 'cars');

export async function exportCarAsPayload(car, rl, activeAccountState) {
    const targetDir = getPayloadPath();
    await mkdir(targetDir, { recursive: true });
    
    let carName = (car.carName && car.carName.trim() !== "") ? car.carName.trim() : "unknown-car";

    const filename = `${carName.replace(/\s+/g, '-').toLowerCase()}_${Date.now()}.json`;
    const exportPath = path.join(targetDir, filename);

    try {
        await writeFile(exportPath, JSON.stringify(car, null, 4), "utf8");
        return { success: true, filename };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

export async function manageGarage(json, rl, activeAccountState) {
    while (true) {
        const garage = (json.cars || []).sort((a, b) => (a.carName || "").localeCompare(b.carName || ""));
        
        drawInterfaceFrame("Garage Exporter", activeAccountState);
        console.log(box.top());
        box.drawRow(`${theme.warn("Tip: ")}${theme.bwhite("Export any car in your garage as a reusable asset.")}`);
        box.drawRow(`${theme.bwhite("Export here and navigate to the ")}${theme.bpurple("Exotic Importer")}${theme.bwhite(" to")}`);
        box.drawRow(`${theme.bwhite("inject your car into any account.")}`);
        console.log(box.bottom());
        console.log(box.top());

        const balances = activeAccountState.balances || { totalCars: "N/A" };

        box.drawRow(`${theme.warn(`${theme.bwhite("Current Garage Amount:")} ${theme.bcyan(`${activeAccountState.balances.totalCars}`)}`)}`);
        console.log(box.bottom());
        console.log(box.top());
        box.drawRow(`${theme.warn("Quick Access [1-9]:")}`);
        console.log(box.mid());
        garage.slice(0, 9).forEach((car, i) => {
            const displayName = (car.carName && car.carName.trim() !== "") ? car.carName : theme.error("Unknown");
            box.drawRow(`${theme.bpurple("[")}${theme.warn(i + 1)}${theme.bpurple("] ")}${theme.bwhite(displayName)}`);
        });
        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.warn("1-9")}${theme.bpurple("]")}${theme.bwhite(": Quick-Access")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.warn("A")}${theme.bpurple("]")}${theme.bwhite(": Export ALL Cars")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.warn("X")}${theme.bpurple("]")}${theme.bwhite(": View Garage")}`);
        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("]")}${theme.bwhite(": Back")}`);
        console.log(box.bottom());

        const choice = (await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Selection")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).trim().toLowerCase();
        process.stdout.write(theme.RESET);

        if (choice === '') return;
        if (choice === 'a') {
            const confirm = await rl.question(
                `${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Are you sure you want to export ")}${theme.bpurple(garage.length)}${theme.bwhite(" cars? (y/n): ")}\x1b[1;38;2;0;255;255m`

            );
            if (confirm.toLowerCase() === 'y') {
                process.stdout.write(`${theme.bcyan("[*] ")}${theme.bwhite("Exporting")}${theme.bcyan("...")}`);

                for (const car of garage) {
                    await exportCarAsPayload(car, rl, activeAccountState);
                }
                process.stdout.write(theme.success(" Done.\n"));
                console.log(theme.success(`[+] Successfully exported ${garage.length} cars.`));
                await new Promise(r => setTimeout(r, 2000));
            } else {
                console.log(`${theme.error("[-] Export Aborted.")}`);
                await new Promise(r => setTimeout(r, 800));
            }
        } else if (choice === 'x') {
            await runGarageDatabaseMode(garage, rl, activeAccountState);
        } else {
            const idx = parseInt(choice) - 1;
            if (isNaN(idx) || idx < 0 || idx >= 9 || !garage[idx]) {
                console.log(theme.error("[-] Invalid selection."));
                await new Promise(r => setTimeout(r, 1000));
                continue;
            }
            const res = await exportCarAsPayload(garage[idx], rl, activeAccountState);
            console.log(res.success ? theme.success(`[+] Exported: ${res.filename}`) : theme.error(`[-] Fail`));
            await new Promise(r => setTimeout(r, 1000));
        }
    }
}

async function runGarageDatabaseMode(garage, rl, activeAccountState) {
    while (true) {
        const stats = {};
        garage.forEach(car => {
            const name = (car.carName && car.carName.trim() !== "") ? car.carName.trim() : "Unknown";
            const category = name === "Unknown" ? "Unknown" : name.charAt(0).toUpperCase();
            stats[category] = (stats[category] || 0) + 1;
        });
        drawInterfaceFrame("Garage Database", activeAccountState);
        console.log(box.top());
        box.drawRow(`${theme.warn("INFO: ")}${theme.bwhite("Enter selection to filter for car.")}`);
        console.log(box.mid());

        Object.keys(stats).sort((a, b) => {
            if (a === "Unknown") return 1;
            if (b === "Unknown") return -1;
            return a.localeCompare(b);
        }).forEach(char => {
            box.drawRow(`${theme.bpurple("[")}${theme.warn(char)}${theme.bpurple("] ")}${theme.bwhite(stats[char] + " car(s)")}`);
        });        
        console.log(box.mid());
        box.drawRow(`${theme.bwhite("Use ")}${theme.bpurple("[")}${theme.warn("$")}${theme.bpurple("] ")}${theme.bwhite("to view ALL.")}${theme.bwhite(" | ")}${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("] ")}${theme.bwhite("to return.")}`);
        console.log(box.bottom());

        const filter = (await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Selection")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).trim().toUpperCase();
        process.stdout.write(theme.RESET);

        if (filter === '') break;

        if (filter !== "$") {
            const validFilters = Object.keys(stats).map(key => key.toUpperCase());

            if (!validFilters.includes(filter)) {
                console.log(theme.error("\n[-] Invalid filter."));
                await new Promise(r => setTimeout(r, 1200));
                continue;
            }
        }
        const filtered =
            filter === "$"
                ? garage
                : garage.filter(car => {

                    const name =
                        (car.carName && car.carName.trim() !== "")
                            ? car.carName.trim()
                            : "Unknown";
                    if (filter === "UNKNOWN") {
                        return name.toUpperCase() === "UNKNOWN";
                    }
                    return name.charAt(0).toUpperCase() === filter;
                });
        let browsing = true;
        while (browsing) {
            drawInterfaceFrame(`Browsing: ${filter}`, activeAccountState);
            console.log(box.top());
            box.drawRow(`${theme.warn("INFO: ")}${theme.bwhite("Enter index to export car payload.")}`);
            console.log(box.mid());
            filtered.forEach((car, i) => {
                const name = (car.carName && car.carName.trim() !== "") ? car.carName : theme.error("Unknown");
                box.drawRow(`${theme.bpurple("[")}${theme.warn(i + 1)}${theme.bpurple("] ")}${theme.bwhite(name)}`);
            });
            console.log(box.mid());
            box.drawRow(`${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("] ")}${theme.bwhite("Back")}`);
            console.log(box.bottom());

            const choice = await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Selection")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`);
            process.stdout.write(theme.RESET);

            if (choice === '') {
                browsing = false;
            } else {
                const idx = parseInt(choice) - 1;

                if (isNaN(idx) || idx < 0 || idx >= filtered.length) {
                    console.log(theme.error("\n[-] Invalid selection. Select a number from the list."));
                    await new Promise(r => setTimeout(r, 1200));
                } else {
                    const res = await exportCarAsPayload(filtered[idx], rl, activeAccountState);
                    if (res.success) {
                        console.log(theme.success("[+] Exported"));
                        await new Promise(r => setTimeout(r, 800));

                    }
                }
            }
        }
    }
}
