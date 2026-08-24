import path from "node:path";
import fs from "node:fs";
import { readdir, readFile } from "fs/promises";
import { theme } from "../utils/theme.js";
import { box } from "../utils/box.js";
import { drawInterfaceFrame } from "../utils/frame.js";
import { encodePd, decodePd } from "../src/pd.js";

export async function handleAccountRecovery(ctx) {
    const {
        rl,
        activeAccountState,
        syncTelemetry,
        client
    } = ctx;

    const activeAccountEmail = activeAccountState.currentIdentity?.trim().toLowerCase() || "";

    while (true) {
        drawInterfaceFrame("Account Recovery", activeAccountState);
        console.log(box.top());
        box.drawRow(`${theme.bcyan("ACCOUNT RECOVERY SYSTEM ")}`);
        box.drawRow(theme.bwhite("Restore previous account backups"));
        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.bwhite("Enter")}${theme.bpurple("] ")}${theme.bwhite("Back")}`);
        console.log(box.bottom());

        const email = (await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Enter Account Email")}${theme.bwhite(": ")}\x1b[1;38;2;0;255;255m`)).trim();
        process.stdout.write(theme.RESET);

        if (!email) return;

        const safeEmail = email.replace(/[@.]/g, "_");

        const backupDir = path.join(
            process.cwd(),
            "fr_legends_payloads",
            "backups",
            safeEmail
        );
        if (!fs.existsSync(backupDir)) {
            console.log(`${theme.error(`[-] No backups found for ${email}`)}`);

            await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press Enter To Return")}${theme.bpurple("... ")}\x1b[1;38;2;0;255;255m`);
            process.stdout.write(theme.RESET);
            return;
        }
        const files = (await readdir(backupDir))
            .filter(
                f =>
                f.endsWith(".bin") ||
                f.endsWith(".json")
            );
        if (!files.length) {
            console.log(theme.error("[-] Backup directory empty."));
            await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press Enter To Return")}${theme.bpurple("... ")}\x1b[1;38;2;0;255;255m`);
            process.stdout.write(theme.RESET);
            return;
        }
        console.log(box.top());

        files.forEach((file,index)=>{
            box.drawRow(`${theme.bcyan(index+1)}${theme.bpurple(") ")}${theme.bwhite(file)}`);
        });
        console.log(box.bottom());

        const choice = await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Select backup")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`);
        process.stdout.write(theme.RESET);

        const selected = files[parseInt(choice)-1];
        if (!selected) {
            console.log(theme.error("[-] Invalid selection."));
            continue;
        }
        const confirm = await rl.question(`${theme.warn("[")}${theme.bwhite("!")}${theme.warn("] ")}${theme.bwhite("Restore ")}${theme.warn(selected)}${theme.bwhite(" ? ")}${theme.warn("(")}${theme.bwhite("y")}${theme.warn("/")}${theme.bwhite("n")}${theme.warn(")")}${theme.bwhite(": ")}\x1b[1;38;2;0;255;255m`);
        process.stdout.write(theme.RESET);

        if(confirm.toLowerCase() !== "y")
            continue;
        try {
            const password = await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Verify Account Password")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`);
            process.stdout.write(theme.RESET);

            console.log(`${theme.bcyan("\n[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Logging into target account")}${theme.bcyan("...")}`);

            await client.loginWithEmail(
                email,
                password.trim()
            );
            console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Reading account encryption profile")}${theme.bcyan("...")}`);
            const filesMeta = await client.getFiles();

            if(!filesMeta.Metadata?.pd?.DownloadUrl)
                throw new Error("No PD save found on account.");

            const liveBlob = await client.downloadBlob(filesMeta.Metadata.pd.DownloadUrl);
            const decoded = await decodePd(liveBlob);

            const prefix = decoded.prefix;
            const xorKey = decoded.xorKey;

            const fullPath =
                path.join(
                    backupDir,
                    selected
                );
            const upload = await client.initiateFileUploads(["pd"]);

            let payload;

            if(selected.endsWith(".bin")) {
                console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Uploading binary snapshot")}${theme.bcyan("... ")}`);
                payload = await readFile(fullPath);
            }
            else {
                console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Rebuilding PD from JSON")}${theme.bcyan("...")}`);

                const restoreJson =
                    JSON.parse(
                        await readFile(
                            fullPath,
                            "utf8"
                        )
                    );
                payload =
                    await encodePd(
                        restoreJson,
                        prefix,
                        xorKey
                    );
            }
            console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Uploading restored payload")}${theme.bcyan("...")}`);

            await client.uploadBlockBlob(upload.UploadDetails[0].UploadUrl, payload);
            await client.finalizeFileUploads(["pd"], upload.ProfileVersion);

            console.log(`${theme.success("\n[+] ACCOUNT RESTORED SUCCESSFULLY")}`);

            const recoveryAccountEmail = email.trim().toLowerCase();

            if (recoveryAccountEmail === activeAccountEmail) {
                console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Syncing Telemetry. May Take Awhile")}${theme.bcyan("... ")}\x1b[1;38;2;0;255;255m`);
                process.stdout.write(theme.RESET);
                await syncTelemetry();
                console.log(`${theme.success("[+] Telemetry Synced.")}`);
            }
            else {
                console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Telemetry sync skipped - recovered account is not the active account.")}`);
            }
        }
        catch(err){
            console.log(`${theme.error(`[-] Recovery Failed: ${err.message}`)}`);
        }
        await rl.question(`${theme.bpurple("\n[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press Enter Return")}${theme.bpurple("... ")}\x1b[1;38;2;0;255;255m`);
        process.stdout.write(theme.RESET);
    }
}
