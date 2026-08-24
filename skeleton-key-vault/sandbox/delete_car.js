import { theme } from "../utils/theme.js";
import { box } from "../utils/box.js";
import { drawInterfaceFrame } from "../utils/frame.js";

export async function deleteCarAndReduceCarport(
    json,
    rl,
    activeAccountState,
    performUpload,
    syncTelemetry,
    prefix,
    xorKey
) {
    while (true) {
        const stats = {};
        json.cars.forEach((c, i) => {
            const cat = c.carName.charAt(0).toUpperCase();
            stats[cat] = (stats[cat] || 0) + 1;
        });
        drawInterfaceFrame("Garage Cleanup", activeAccountState);
        console.log(box.top());
        box.drawRow(`${theme.warn("Filter To Delete Cars From Garage")}`);
        console.log(box.bottom());
        console.log(box.top());
        
        Object.keys(stats).sort((a, b) => {
            if (/[A-Z]/.test(a) && !/[A-Z]/.test(b)) return -1;
            if (!/[A-Z]/.test(a) && /[A-Z]/.test(b)) return 1;
            return a.localeCompare(b);
        }).forEach(cat => {
            box.drawRow(`${theme.bpurple("[")}${theme.warn(cat)}${theme.bpurple("] ")}${theme.bwhite(stats[cat] + " cars")}`);
        });
        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.warn("$")}${theme.bpurple("] ")}${theme.bwhite("View All | ")}${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("] ")}${theme.bwhite("Exit")}`);
        console.log(box.bottom());

        const catChoice = (await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Select category")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).trim().toUpperCase();
        process.stdout.write(theme.RESET);

        if (catChoice === "") break;

        const filteredCars = catChoice === "$"
            ? json.cars.map((c, i) => ({ ...c, originalIdx: i }))
            : json.cars
                .map((c, i) => ({ ...c, originalIdx: i }))
                .filter(c => c.carName.toUpperCase().startsWith(catChoice));

        if (filteredCars.length === 0) {
            console.log(theme.error("[-] No cars found for that filter."));
            await new Promise(r => setTimeout(r, 1000));
            continue;
        }
        console.clear();
        drawInterfaceFrame(`Filtering: ${catChoice}`, activeAccountState);
        console.log(box.top());
        box.drawRow(`${theme.warn("Enter number")}${theme.bpurple("(")}${theme.warn("s")}${theme.bpurple(") ")}${theme.warn("to delete ")}${theme.bpurple("(")}${theme.warn("e.g., ")}${theme.bpurple("'")}${theme.warn("1, 2")}${theme.bpurple("')")}`);
        console.log(box.bottom());
        console.log(box.top());
        filteredCars.forEach((c, i) => {
            box.drawRow(`${theme.bpurple("[")}${theme.warn((i + 1).toString().padStart(2, '0'))}${theme.bpurple("] ")}${theme.bwhite(c.carName)}`);
        });
        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("] ")}${theme.bwhite("back")}`);
        console.log(box.bottom());

        const input = await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Selection")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`);
        process.stdout.write(theme.RESET);

        if (input === '') continue;

        const selections = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        
        const indicesToDelete = selections
            .filter(sel => sel > 0 && sel <= filteredCars.length)
            .map(sel => filteredCars[sel - 1].originalIdx)
            .sort((a, b) => b - a);

        if (indicesToDelete.length === 0) {
            console.log(theme.error("[-] No valid selection."));
            await new Promise(r => setTimeout(r, 1000));
            continue;
        }
        if (json.cars.length - indicesToDelete.length < 1) {
            console.log(theme.error("[-] Cannot delete: At least one car is required in the garage."));
            await rl.question(`${theme.bpurple("\n[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press Enter to continue")}${theme.bpurple("... ")}`);
            continue;
        }
        console.log(`\n${theme.warn("[!] ")}${theme.bwhite(`You are about to delete ${indicesToDelete.length} car(s):`)}`);
        indicesToDelete.forEach(idx => console.log(`     ${theme.warn("- ")}${theme.bwhite(`${json.cars[idx].carName}`)}`));

        const confirm = await rl.question(`${theme.warn(`\n[?] Proceed with deletion? (y/n): `)}\x1b[1;38;2;0;255;255m`);
        process.stdout.write(theme.RESET);

        if (confirm.toLowerCase() === 'y') {
            for (const idx of indicesToDelete) {
                json.cars.splice(idx, 1);
            }            
            json.carport = json.cars.length;
 
            console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Syncing changes to cloud")}${theme.bcyan("...")}`);            
            await performUpload(json, prefix, xorKey);

            console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Syncing Telemetry. May Take Awhile")}${theme.bcyan("... ")}\x1b[1;38;2;0;255;255m`);
            process.stdout.write(theme.RESET);
            await syncTelemetry();
            
            console.log(`${theme.success(`\n[+] Successfully removed ${indicesToDelete.length} car(s).`)}`);
            await rl.question(`${theme.bpurple("\n[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press ")}${theme.bpurple("[")}${theme.bwhite("Enter")}${theme.bpurple("] ")}${theme.bwhite("to continue. ")}`);
        }
    }
}
