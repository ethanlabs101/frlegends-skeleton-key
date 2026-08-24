import { drawInterfaceFrame } from "../utils/frame.js";
import { theme } from "../utils/theme.js";
import { box } from "../utils/box.js";
import { encodePd } from "../src/pd.js";

export async function modifySlots(
    client,
    json,
    rl,
    activeAccountState,
    syncTelemetry,
    prefix,
    xorKey
) {
    while (true) {
        drawInterfaceFrame("Modify Car Slots", activeAccountState);
        console.log(box.top());
        box.drawRow(`${theme.warn("WARNING: ")}${theme.bwhite("Only edit slot value to greater than or equal to")}`);
        box.drawRow(`${theme.bwhite("your current slot amount.")}`);
        console.log(box.bottom());
        console.log(box.top());
        box.drawRow(`${theme.warn("Note: ")}${theme.bwhite("Modified Slot amounts cause issues when buying")}`);
        box.drawRow(`${theme.bwhite(`new cars. Modified slots require the ${theme.bpurple("Exotic Importer")}`)}`);
        box.drawRow(`${theme.bwhite("to inject cars safely.")}`);
        console.log(box.mid());
        box.drawRow(`${theme.bcyan("Current Slot Amount: ")}${theme.bwhite(`${json.carport || 0}`)}`);
        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.bwhite("1")}${theme.bpurple("] ")}${theme.bwhite("Set ")}${theme.bpurple("1M ")}${theme.bwhite("Carport")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.bwhite("2")}${theme.bpurple("] ")}${theme.bwhite("Set ")}${theme.bpurple("100K ")}${theme.bwhite("Carport")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.bwhite("3")}${theme.bpurple("] ")}${theme.bwhite("Set ")}${theme.bpurple("10K ")}${theme.bwhite("Carport")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.bwhite("4")}${theme.bpurple("] ")}${theme.bwhite("Set ")}${theme.bpurple("5K ")}${theme.bwhite("Carport")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.bwhite("5")}${theme.bpurple("] ")}${theme.bwhite("Set ")}${theme.bpurple("2.5K ")}${theme.bwhite("Carport")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.bwhite("6")}${theme.bpurple("] ")}${theme.bwhite("Set ")}${theme.bpurple("1K ")}${theme.bwhite("Carport")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.bwhite("7")}${theme.bpurple("] ")}${theme.bwhite("Set ")}${theme.bpurple("500 ")}${theme.bwhite("Carport")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.bwhite("8")}${theme.bpurple("] ")}${theme.bwhite("Set ")}${theme.bpurple("250 ")}${theme.bwhite("Carport")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.bwhite("9")}${theme.bpurple("] ")}${theme.bwhite("Set ")}${theme.bpurple("100 ")}${theme.bwhite("Carport")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.warn("C")}${theme.bpurple("] ")}${theme.bwhite("Set ")}${theme.warn("Custom ")}${theme.bwhite("Amount")}`);
        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.bwhite("Enter")}${theme.bpurple("] ")}${theme.bwhite("Back to Menu")}`);
        console.log(box.bottom());

        const prompt = `${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Selection: ")}\x1b[1;38;2;0;255;255m`;
        const subChoice = (await rl.question(prompt)).trim().toLowerCase();

        process.stdout.write(theme.RESET);
        if (subChoice === '') break;

        let newAmount = 0;
        const lookup = { '1': 1000000, '2': 100000, '3': 10000, '4': 5000, '5': 2500, '6': 1000, '7': 500, '8': 250, '9': 100 };

        if (subChoice === 'c') {
            const custom = await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Enter custom amount: ")}\x1b[1;38;2;0;255;255m`);
            process.stdout.write(theme.RESET);
            newAmount = parseInt(custom);

        } else if (lookup[subChoice]) {
            newAmount = lookup[subChoice];
        } else {
            console.log(theme.error("[-] Invalid selection."));
            await new Promise(r => setTimeout(r, 800));
            continue;
        }
        if (isNaN(newAmount)) {
            console.log(`${theme.error("[-] Invalid number.")}`);
            await new Promise(r => setTimeout(r, 800));
            continue;
        }
        json.carport = newAmount;

        console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Injecting New Carport Value")}${theme.bcyan("...")}`);
        const rebuilt = await encodePd(json, prefix, xorKey);

        console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Initiating Upload To Server")}${theme.bcyan("...")}`);
        const init = await client.initiateFileUploads(["pd"]);
        await client.uploadBlockBlob(init.UploadDetails[0].UploadUrl, rebuilt);
        console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Finalizing Upload")}${theme.bcyan("...")}`);
        await client.finalizeFileUploads(["pd"], init.ProfileVersion);

        console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Syncing Telemetry")}${theme.bcyan("...")}`);
        await syncTelemetry();
        console.log(theme.success("[+] Injection successful."));
        await rl.question(`${theme.bpurple("\n[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press ")}${theme.bpurple("[")}${theme.bwhite("Enter")}${theme.bpurple("] ")}${theme.bwhite("to continue")}${theme.bpurple("... ")}\x1b[1;38;2;0;255;255m`);
        process.stdout.write(theme.RESET);
    }
}
