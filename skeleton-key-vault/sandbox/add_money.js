import { theme } from "../utils/theme.js";
import { box } from "../utils/box.js";
import { drawInterfaceFrame } from "../utils/frame.js";

const XOR_KEY = 340949049;

export async function manageMoney(json, rl, activeAccountState, performUpload, syncTelemetry, prefix, xorKey) {
    const MAX_32_INT = 2147483647;

    const presets = [
        { label: "1B", val: 1000000000 },
        { label: "500M", val: 500000000 },
        { label: "50M", val: 50000000 },
        { label: "5M", val: 5000000 },
        { label: "1M", val: 1000000 },
        { label: "500K", val: 500000 },
        { label: "250K", val: 250000 },
        { label: "100K", val: 100000 },
        { label: "50K", val: 50000 }
    ];
    while (true) {
        drawInterfaceFrame("Currency Editor", activeAccountState);
        console.log(box.top());
        box.drawRow(`${theme.warn("WARNING: ")}${theme.bwhite("Values above 1M may flag account for cheating.")}`);
        box.drawRow(`${theme.bwhite("Make sure to backup account before risky operations.")}`);        
        console.log(box.bottom());
        console.log(box.top());
        box.drawRow(`${theme.warn("Current Amounts: ")}`);
        box.drawRow(`${theme.bpurple("Money: ")}${theme.bwhite(`${activeAccountState.balances.money}`)}`);
        box.drawRow(`${theme.bpurple("Coins: ")}${theme.bwhite(`${activeAccountState.balances.gems}`)}`);
        console.log(box.bottom());
        console.log(box.top());
        box.drawRow(`${theme.warn("Set Cash/Coin value: ")}`);
        console.log(box.bottom());
        console.log(box.top());
        presets.forEach((p, i) => {
            box.drawRow(`${theme.bpurple("[")}${theme.bwhite(i + 1)}${theme.bpurple("] ")}${theme.bwhite(p.label)}`);
        });
        box.drawRow(`${theme.bpurple("[")}${theme.warn("C")}${theme.bpurple("] ")}${theme.warn("Custom Amount")}`);
        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.bwhite("Enter")}${theme.bpurple("] ")}${theme.bwhite("Back")}`);
        console.log(box.bottom());

        const choice = (await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Selection")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).trim().toLowerCase();
        process.stdout.write(theme.RESET);
        if (choice === "") break;

        let targetAmount;

        if (choice === 'c') {
            const input = await rl.question(`${theme.bpurple("\n[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Enter amount")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`);
            process.stdout.write(theme.RESET);
            const val = parseInt(input);
            if (isNaN(val) || val < 0 || val > MAX_32_INT) {
                console.log(theme.error("[-] Invalid amount. Must be positive, < 2.14B."));
                await new Promise(r => setTimeout(r, 1200));
                continue;
            }
            targetAmount = val;
        } else {
            const idx = parseInt(choice) - 1;
            if (presets[idx]) {
                targetAmount = presets[idx].val;
            } else {
                continue;
            }
        }
        json.mcoins.store.v = targetAmount ^ XOR_KEY;
        json.mgems.store.v = targetAmount ^ XOR_KEY;

        console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Syncing changes to cloud")}${theme.bcyan("...")}`);        
        await performUpload(json, prefix, xorKey);

        console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Syncing Telemetry. May Take Awhile")}${theme.bcyan("... ")}\x1b[1;38;2;0;255;255m`);
        process.stdout.write(theme.RESET);
        await syncTelemetry();

        console.log(theme.success(`[+] Currency set to ${targetAmount.toLocaleString()}.`));
        await new Promise(r => setTimeout(r, 1500));
        continue;
    }
}
