import { formatPlaytime } from "../menu/format_playtime.js";
import { drawInterfaceFrame } from "../utils/frame.js";
import { theme } from "../utils/theme.js";
import { box } from "../utils/box.js";

export async function managePlayTime(json, rl, activeAccountState, performUpload, syncTelemetry, prefix, xorKey) {
    const presets = [
        { label: "987,654,321h 0m 0s", h: 987654321, m: 0, s: 0 },
        { label: "123,456,789h 0m 0s", h: 123456789, m: 0, s: 0 },
        { label: "9,999,999h 0m 0s", h: 9999999, m: 0, s: 0 },
        { label: "500,000h 0m 0s", h: 500000, m: 0, s: 0 },
        { label: "250,000h 0m 0s", h: 250000, m: 0, s: 0 },
        { label: "100,000h 0m 0s", h: 100000, m: 0, s: 0 },
        { label: "50,000h 0m 0s", h: 50000, m: 0, s: 0 },
        { label: "25,000h 0m 0s", h: 25000, m: 0, s: 0 },
        { label: "0h 0m 0s", h: 0, m: 0, s: 0 }
    ];
    while (true) {
        drawInterfaceFrame("Playtime Editor", activeAccountState);
        console.log(box.top());
        box.drawRow(`${theme.bwhite("Current Playtime: ")}${theme.bcyan(`${formatPlaytime(`${activeAccountState.balances.playTime}`)}`)}`);
        console.log(box.bottom());
        console.log(box.top());
        box.drawRow(`${theme.warn("Select a preset or [C] for custom")}`);
        console.log(box.mid());
        presets.forEach((p, i) => {
            box.drawRow(`${theme.bpurple("[")}${theme.bwhite(i + 1)}${theme.bpurple("]")} ${theme.bwhite(p.label)}`);
        });
        box.drawRow(`${theme.bpurple("[")}${theme.warn("C")}${theme.bpurple("]")} ${theme.bwhite("Custom Input")}`);
        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.bwhite("Enter")}${theme.bpurple("] ")}${theme.bwhite("Back to menu")}`);
        console.log(box.bottom());

        const choice = (await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Selection")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).trim().toLowerCase();
        process.stdout.write(theme.RESET);

        if (choice === "") return;

        let targetH, targetM, targetS;

        if (choice === 'c') {
            const getValidNum = async (prompt) => {
                while (true) {
                    const input = await rl.question(prompt);
                    const val = parseInt(input);
                    if (!isNaN(val) && val >= 0) return val;
                    console.log(theme.error("[-] Invalid number. Please enter positive digits."));
                    await new Promise(r => setTimeout(r, 800));
                    continue;
                }
            };
            targetH = await getValidNum(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Hours")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`);
            process.stdout.write(theme.RESET);
            targetM = await getValidNum(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Minutes")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`);
            process.stdout.write(theme.RESET);
            targetS = await getValidNum(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Seconds")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`);
            process.stdout.write(theme.RESET);
        } else {
            const idx = parseInt(choice) - 1;
            if (presets[idx]) {
                ({ h: targetH, m: targetM, s: targetS } = presets[idx]);
            } else {
                console.log(theme.error("[-] Invalid selection."));
                await new Promise(r => setTimeout(r, 1000));
                continue;
            }
        }
        const totalSeconds = (targetH * 3600) + (targetM * 60) + targetS;
        json.totalPlayedTime = totalSeconds;
        await performUpload(json, prefix, xorKey);
        await syncTelemetry();

        console.log(theme.success(`[+] Playtime updated to ${targetH}h ${targetM}m ${targetS}s.`));
        await new Promise(r => setTimeout(r, 2000));
        continue;
    }
}
