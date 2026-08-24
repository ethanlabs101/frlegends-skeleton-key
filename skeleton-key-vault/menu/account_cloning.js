import { theme } from "../utils/theme.js";
import { box } from "../utils/box.js";
import { PlayFabClient } from "../src/client.js";
import { decrypt } from "../src/security.js";
import { getGaussianDelay } from "../utils/jitter.js";
import { runProvisioningChain } from "../cli.js";
import { getRandomCreds } from "../menu/get_creds.js";

export async function handleAccountCloning(ctx) {
    const {
        rl,
        client,
        activeAccountState,
        syncTelemetry,
        db,
        MASTER_KEY,
        drawInterfaceFrame
    } = ctx;

    while (true) {
        drawInterfaceFrame("Account Cloning Matrix", activeAccountState);
        console.log(box.top());
        box.drawRow(`${theme.warn("WARNING:")} ${theme.bwhite("All accounts receiving cloned data are wiped.")}`);
        box.drawRow(theme.bwhite("Backup important data before proceeding."));
        console.log(box.mid());
        box.drawRow(`${theme.warn("INFO:")} ${theme.bwhite("Rapid cloning can flag device IDs & IPs.")}`);
        box.drawRow(theme.bwhite("Limit to 5-10 operations per 24hrs."));
        console.log(box.mid());

        box.drawRow(theme.bcyan("Select Batch Operations:"));
        for (let i = 5; i >= 1; i--) {
            box.drawRow(`${theme.bpurple("[")}${theme.bwhite(i)}${theme.bpurple("] ")}${theme.bwhite("Clone to ")}${theme.bpurple(i)}${theme.bwhite(" accounts")}`);
        }
        box.drawRow(`${theme.bpurple("[")}${theme.warn("C")}${theme.bpurple("] ")}${theme.warn("Crazy Mode ")}${theme.bpurple("(")}${theme.bwhite("Create + Max ")}${theme.bpurple("5 ")}${theme.bwhite("Accounts")}${theme.bpurple(")")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.bwhite("Enter")}${theme.bpurple("] ")}${theme.bwhite("Back")}`);
        console.log(box.bottom());

        const choice = (await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Selection")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).toLowerCase();
        process.stdout.write(theme.RESET);

        if (choice === '' || choice === 'enter') return;

        if (choice === 'c') {
            const donor = await selectAccountFromDB(
                db,
                rl,
                "Select Donor Account",
                drawInterfaceFrame,
                activeAccountState
            );

            if (!donor) continue;

            const donorPass = decrypt(donor.password, MASTER_KEY);
            const results = [];

            for (let i = 0; i < 5; i++) {
                const delay = getGaussianDelay(4500, 12500);

                console.log(`${theme.bcyan("\n[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Jitter ")}${theme.bcyan("(")}${theme.bwhite("Gaussian")}${theme.bcyan("): ")}${theme.bwhite(`Waiting ${Math.round(delay / 1000)}s`)}${theme.bcyan("...")}`);
                await new Promise(resolve => setTimeout(resolve, delay));

                console.log(`${theme.bcyan("\n[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite(`Provisioning target ${i + 1}/5...`)}`);
                const target = await getRandomCreds();

                await runProvisioningChain(
                    target,
                    client,
                    db,
                    MASTER_KEY
                );
                const success = await performClone(
                    client,
                    donor.email,
                    donorPass,
                    target.email,
                    target.pass,
                    syncTelemetry
                );
                results.push({
                    email: target.email,
                    success
                });
            }
            console.log("\n" + box.top());
            box.drawRow(theme.bcyan("CRAZY MODE SUMMARY"));
            console.log(box.mid());

            results.forEach(res => {
                const status = res.success
                    ? theme.success("[OK]")
                    : theme.error("[FAIL]");

                box.drawRow(`${status} ${theme.bwhite(res.email)}`);
            });

            console.log(box.bottom());

            await rl.question(`${theme.warn("\n[")}${theme.bwhite("+")}${theme.warn("] ")}${theme.bwhite("Crazy Mode complete. Press [Enter] to return ")}\x1b[1;38;2;0;255;255m`);
            process.stdout.write(theme.RESET);
            continue;
        }
        const count = parseInt(choice);

        if (isNaN(count) || count < 1 || count > 5) {
            await rl.question(`${theme.error("[-] Invalid Selection. Press Enter To Retry... ")}\x1b[1;38;2;0;255;255m`);
            process.stdout.write(theme.RESET);
            continue;
        }
        const donor = await selectAccountFromDB(
            db,
            rl,
            "Select Donor Account",
            drawInterfaceFrame,
            activeAccountState
        );
        if (!donor) continue;

        const donorPass = decrypt(donor.password, MASTER_KEY);
        const results = [];

        for (let i = 0; i < count; i++) {
            const delay = getGaussianDelay(4500, 12500);

            console.log(`${theme.bcyan("\n[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Jitter ")}${theme.bcyan("(")}${theme.bwhite("Gaussian")}${theme.bcyan("): ")}${theme.bwhite(`Waiting ${Math.round(delay / 1000)}s`)}${theme.bcyan("...")}`);
            await new Promise(resolve => setTimeout(resolve, delay));

            console.log(`${theme.bcyan("\n[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite(`Target ${i + 1}/${count}:`)}`);
            const receiver = await selectAccountFromDB(
                db,
                rl,
                `Select Receiver ${i + 1}`,
                drawInterfaceFrame,
                activeAccountState
            );
            if (!receiver) continue;

            const receiverPass = decrypt(receiver.password, MASTER_KEY);
            const success = await performClone(
                client,
                donor.email,
                donorPass,
                receiver.email,
                receiverPass,
                syncTelemetry
            );
            results.push({
                email: receiver.email,
                success
            });
        }
        console.log("\n" + box.top());
        box.drawRow(theme.bcyan("BATCH OPERATION SUMMARY"));
        console.log(box.mid());

        results.forEach(res => {
            const status = res.success
                ? theme.success("[OK]")
                : theme.error("[FAIL]");

            box.drawRow(`${status} ${theme.bwhite(res.email)}`);
        });

        console.log(box.bottom());
        await rl.question(`${theme.bpurple("\n[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Operation finished. Press ")}${theme.bpurple("[")}${theme.bwhite("Enter")}${theme.bpurple("] ")}${theme.bwhite("To Return")}${theme.bpurple("... ")}\x1b[1;38;2;0;255;255m`);
        process.stdout.write(theme.RESET);
    }
}

async function selectAccountFromDB(
    db,
    rl,
    title,
    drawInterfaceFrame,
    activeAccountState
) {
    while (true) {
        const stats = db.prepare(`SELECT upper(substr(email, 1, 1)) as char, count(*) as count FROM accounts GROUP BY char ORDER BY char ASC`).all();
        const totalStats = db.prepare('SELECT COUNT(*) as total FROM accounts').get();

        drawInterfaceFrame(title, activeAccountState);
        console.log(box.top());
        box.drawRow(`${theme.bwhite("Vault Inventory: ")}${theme.bpurple(totalStats.total)}${theme.bwhite(" accounts")}`);
        console.log(box.mid());
        box.drawRow(theme.bcyan("Filter by starting character:"));

        stats.forEach(s => {
            box.drawRow(`${theme.bcyan(s.char.toUpperCase())}${theme.bpurple(": ")}${theme.bwhite(s.count + " account(s)")}`);
        });

        console.log(box.bottom());

        const inputPrompt = `${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Filter by letter, ")}${theme.bpurple("[$] ")}${theme.bwhite("for All, ")}${theme.bpurple("[Enter] ")}${theme.bwhite("to Back: ")}\x1b[1;38;2;0;255;255m`;
        const input = (await rl.question(inputPrompt)).trim().toLowerCase();
        process.stdout.write(theme.RESET);

        if (input === "") return null;

        const accounts = db.prepare(`SELECT * FROM accounts WHERE email LIKE ? ORDER BY email ASC`)
            .all((input === "$") ? '%' : `${input}%`);

        if (accounts.length === 0) {
            console.log(theme.error("[-] No accounts found."));
            await new Promise(r => setTimeout(r, 800));
            continue;
        }
        let searching = true;

        while (searching) {
            drawInterfaceFrame(`${title}`, activeAccountState);
            console.log(box.top());

            accounts.forEach((a, i) => {
                box.drawRow(`${theme.bcyan(i + 1)}${theme.bpurple(") ")}${theme.bwhite(a.email)}`);
            });
            console.log(box.bottom());

            const subPrompt = `${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Selection ")}${theme.bpurple("(")}${theme.bwhite("or ")}${theme.bpurple("[")}${theme.bwhite("Enter")}${theme.bpurple("] ")}${theme.bwhite("to go back")}${theme.bpurple(")")}${theme.bwhite(": ")}\x1b[1;38;2;0;255;255m`;
            const subChoice = (await rl.question(subPrompt)).trim().toLowerCase();
            process.stdout.write(theme.RESET);

            if (subChoice === '') {
                searching = false;
            } else {
                const idx = parseInt(subChoice) - 1;

                if (!isNaN(idx) && accounts[idx]) {
                    return accounts[idx];
                } else {
                    console.log(theme.error("[-] Invalid selection."));
                    await new Promise(r => setTimeout(r, 800));
                }
            }
        }
    }
}

async function performClone(
    client,
    sourceEmail,
    sourcePassword,
    targetEmail,
    targetPassword,
    syncTelemetry
) {
    try {
        console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Initializing cloning handshake")}${theme.bcyan("...")}`);
        const sourceClient = new PlayFabClient();

        console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Connecting to donor")}${theme.bcyan("...")}`);
        await sourceClient.loginWithEmail(sourceEmail, sourcePassword);

        console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Fetching remote data blobs")}${theme.bcyan("...")}`);
        const files = await sourceClient.getFiles();

        console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Downloading source payload")}${theme.bcyan("...")}`);
        const rawSourceBuffer = await sourceClient.downloadBlob(files.Metadata.pd.DownloadUrl);

        console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Authenticating receiver")}${theme.bcyan("...")}`);
        await client.loginWithEmail(targetEmail, targetPassword);

        console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Uploading cloned data to target")}${theme.bcyan("...")}`);
        const uploadSession = await client.initiateFileUploads(["pd"]);

        await client.uploadBlockBlob(
            uploadSession.UploadDetails[0].UploadUrl,
            rawSourceBuffer
        );
        await client.finalizeFileUploads(
            ["pd"],
            uploadSession.ProfileVersion
        );
        console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Syncing telemetry")}${theme.bcyan("... ")}${theme.bwhite("This may take awhile")}${theme.bcyan("...")}`);
        await syncTelemetry();

        console.log(theme.success(`\n[+] CLONE SUCCESSFUL`));
        console.log(`${theme.success("[+] ")}${theme.bwhite(`Cloned ${sourceEmail} -> ${targetEmail}`)}`);

        return true;
    } catch (err) {
        console.log(theme.error(`[-] Clone failed: ${err.message}`));
        return false;
    }
}
