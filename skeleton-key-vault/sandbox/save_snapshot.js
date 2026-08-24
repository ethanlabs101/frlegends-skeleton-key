import path from "node:path";
import { writeFile, mkdir } from "node:fs/promises";
import { theme } from "../utils/theme.js";
import { box } from "../utils/box.js";
import { __dirname } from "../cli.js";

export async function saveSnapshot(
    json,
    rl,
    activeAccountState
) {
    try {
        console.log(`${theme.bcyan("\n[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Initiating snapshot capture")}${theme.bcyan("...")}`);
        const safeEmail = activeAccountState.currentIdentity.replace(/[@.]/g, '_');
        const targetDir = path.join(__dirname, 'fr_legends_payloads', 'snapshots', safeEmail);

        console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Checking if directory exists")}${theme.bcyan("...")}`);
        await mkdir(targetDir, { recursive: true });

        console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Creating unique timestamp filename")}${theme.bcyan("...")}`);
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const fileName = `${safeEmail}_snapshot_${timestamp}.json`;
        const dumpPath = path.join(targetDir, fileName);

        console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Writing snapshot to disk")}${theme.bcyan("...")}`);
        await writeFile(dumpPath, JSON.stringify(json, null, 4), "utf8");

        console.log(`${theme.success("\n[+] SUCCESS: Snapshot captured.\n")}`);
        console.log(box.top());
        box.drawRow(`${theme.bcyan("Snapshot Summary:")}`);
        console.log(box.bottom());
        console.log(`${theme.bpurple("\n[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite(`File: ${fileName}`)}`);
        console.log(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite(`Path: ${targetDir}`)}`);

        await rl.question(`${theme.bpurple("\n[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press ")}${theme.bpurple("[")}${theme.bwhite("Enter")}${theme.bpurple("] ")}${theme.bwhite("to return")}${theme.bpurple("... ")}\x1b[1;38;2;0;255;255m`);
        process.stdout.write(theme.RESET);
    } catch (err) {
        console.error(`${theme.error(`\n[!!!] SNAPSHOT ERROR: ${err.message}`)}`);
        await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press ")}${theme.bpurple("[")}${theme.bwhite("Enter")}${theme.bpurple("] ")}${theme.bwhite("to return")}${theme.bpurple("... ")}\x1b[1;38;2;0;255;255m`);
        process.stdout.write(theme.RESET);
    }
}
