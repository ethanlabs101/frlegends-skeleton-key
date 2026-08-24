import { theme } from "../utils/theme.js";
import { box } from "../utils/box.js";

export async function drawJsonInBox(json, rl) {
    const jsonStr = JSON.stringify(json, null, 2).substring(0, 2000);
    const lines = jsonStr.split('\n');

    console.log("\n" + box.top());
    box.drawRow(theme.bcyan("JSON PAYLOAD DUMP"));
    console.log(box.mid());

    lines.forEach(line => {
        box.drawRow(theme.bwhite(line));
    });
    console.log(box.bottom());
    await rl.question(`${theme.bpurple("\n[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press ")}${theme.bpurple("[")}${theme.bwhite("Enter")}${theme.bpurple("] ")}${theme.bwhite("to continue")}${theme.bpurple("... ")}\x1b[1;38;2;0;255;255m`);
    process.stdout.write(theme.RESET);
}
