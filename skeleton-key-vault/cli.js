import path from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import Database from 'better-sqlite3';
import { createInterface } from "readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { writeFile, readFile, mkdir } from "node:fs/promises";
import { PlayFabClient } from "./src/client.js";
import { decodePd, encodePd } from "./src/pd.js";
import { runSplashScreen } from './src/splash.js';
import { checkForUpdates } from "./src/update.js";
import { activeAccountState } from './src/state.js';
import { syncTelemetry as telemetrySync } from "./src/telemetry.js";
import { handleCredentialAuthentication } from './src/auth.js';
import { encrypt } from './src/security.js';
import { getGaussianDelay } from './utils/jitter.js';
import { drawInterfaceFrame } from "./utils/frame.js";
import { theme } from "./utils/theme.js";
import { box } from "./utils/box.js";
import { validateStructure, promptSchemaRisk, validateFileSystem } from "./menu/validate_system.js";
import { handleAccountRecovery } from "./menu/account_recovery.js";
import { getRandomCreds, getManualCreds } from "./menu/get_creds.js";
import { handleAccountCloning } from "./menu/account_cloning.js";
import { formatErrorMessage } from "./menu/error_message.js";
import { getDotNetTicks } from "./menu/calculate_ticks.js";
import { handleFaqMenu } from "./menu/faq.js";
import { handleSandboxOperations } from "./sandbox/index.js";
import { GOODBYE_ART } from './assets/goodbye.js';

const SYSTEM_PATH = path.join(process.cwd());
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
export const rl = createInterface({ input, output });
const client = new PlayFabClient();
const db = new Database(path.join(SYSTEM_PATH, 'identity_vault.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    playfab_id TEXT,
    status TEXT DEFAULT 'ACTIVE',
    last_login DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

const syncIdentity = db.prepare(`
  INSERT OR REPLACE INTO accounts (email, password, playfab_id, last_login) 
  VALUES (?, ?, ?, CURRENT_TIMESTAMP)
`);

async function performAccountBackup() {
    try {
        console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Initiating backup sequence")}${theme.bcyan("...")}`);
        console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Requesting data from server")}${theme.bcyan("...")}`);        
        const files = await client.getFiles();

        if (!files.Metadata?.pd?.DownloadUrl) throw new Error("No data found to back up.");
        const safeEmail = activeAccountState.currentIdentity.replace(/[@.]/g, '_');

        console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite(`Decoding ${safeEmail}'s save file`)}${theme.bcyan("...")}`);
        const rawBlob = await client.downloadBlob(files.Metadata.pd.DownloadUrl);
        const { json } = await decodePd(rawBlob);
        const targetDir = path.join(SYSTEM_PATH, 'fr_legends_payloads', 'backups', safeEmail);

        await mkdir(targetDir, { recursive: true });

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const baseName = `${safeEmail}_${timestamp}`;

        await writeFile(path.join(targetDir, `${baseName}.json`), JSON.stringify(json, null, 4), "utf8");
        await writeFile(path.join(targetDir, `${baseName}.bin`), rawBlob);

        console.log(`${theme.success("\n[+] BACKUP CREATED SUCCESSFULLY.")}`);
        console.log(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("JSON (Readable)")}${theme.bpurple(": ")}${theme.bwhite((baseName) + ".json")}`);
        console.log(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("BIN (Encrypted)")}${theme.bpurple(": ")}${theme.bwhite((baseName) + ".bin")}`);
        console.log(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Directory")}${theme.bpurple(": ")}${theme.bwhite((targetDir))}`);
        console.log("\n");
        return true;
    } catch (err) {
        console.error(`${theme.error(`\n[!!!] BACKUP FAILURE: ${formatErrorMessage(err)}`)}`);
        return false;
    }
}

export async function handleRemoteProvisioning(ctx) {
    const { rl, client, drawInterfaceFrame, db, MASTER_KEY } = ctx;

    while (true) {
        drawInterfaceFrame("Remote Acc Factory", activeAccountState);
        console.log(box.top());
        box.drawRow(`${theme.warn("WARNING:")} ${theme.bwhite("Creating accounts in rapid succession can flag")}`);
        box.drawRow(theme.bwhite("your device ID or IP. For optimal security, limit"));
        box.drawRow(theme.bwhite("provisioning to 5 accounts per 24hrs. Exceeding 5-10+"));
        box.drawRow(theme.bwhite("may result in automated bans."));
        console.log(box.mid());

        box.drawRow(`${theme.warn("INFO: ")}${theme.bwhite("All accounts come with 500k money and coins,")}`);
        box.drawRow(`${theme.bwhite("livery pass unlocked, and a modded")}`);
        box.drawRow(`${theme.bwhite("Kirby Silvia S15 with 999999% tire health.")}`);
        console.log(box.mid());

        box.drawRow(theme.bcyan("Select Provisioning Batch Size:"));
        box.drawRow(`${theme.bpurple("[")}${theme.bwhite("1")}${theme.bpurple("] ")}${theme.bwhite("One")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.bwhite("2")}${theme.bpurple("] ")}${theme.bwhite("Two")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.bwhite("3")}${theme.bpurple("] ")}${theme.bwhite("Three")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.bwhite("4")}${theme.bpurple("] ")}${theme.bwhite("Four")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.bwhite("5")}${theme.bpurple("] ")}${theme.bwhite("Five")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.warn("X")}${theme.bpurple("] ")}${theme.warn("Info/Help")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.bwhite("Enter")}${theme.bpurple("] ")}${theme.bwhite("Back")}`);
        console.log(box.bottom());

        const choice = (await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Selection")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).toLowerCase();
        process.stdout.write(theme.RESET);
        if (choice === '') return;
        if (choice.toLowerCase() === 'enter') return;
        if (choice.toLowerCase() === 'x') {
            await displayProvisioningWarnings(ctx);
            continue;
        }       
        const count = parseInt(choice);
        if (isNaN(count) || count < 1 || count > 5) {
            await rl.question(`${theme.error('[!] Invalid Selection. Press Enter to retry.')}`);
            continue;
        }
        const modePrompt =
            `${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Use ")}${theme.bpurple("[")}${theme.bwhite("M")}${theme.bpurple("]")}${theme.bwhite("anual or ")}${theme.bpurple("[")}${theme.bwhite("R")}${theme.bpurple("]")}${theme.bwhite("andomized info")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`;

        let mode;
        while (true) {
            mode = (await rl.question(modePrompt)).trim().toLowerCase();
            process.stdout.write(theme.RESET);
        if (mode === "") {
            break;
        }
        if (mode === "m" || mode === "r") {
            break;
        }
        console.log(theme.error("[-] Invalid selection. Enter M, R or press Enter to go back."));
        await new Promise(r => setTimeout(r, 1000));
    }
    if (mode === "") {
        continue;
    }
        for (let i = 0; i < count; i++) {
            console.log(`${theme.bcyan("\n[*] ")}${theme.bcyan(`Batch processing item ${i + 1}/${count}...`)}`);
            
            try {
                const creds = (mode.toLowerCase() === 'm') 
                    ? await getManualCreds(rl) 
                    : await getRandomCreds();

                await runProvisioningChain(creds, client, db, MASTER_KEY);
                
                console.log(theme.success(`[+] Account ${creds.email} provisioned and vaulted.`));
                console.log(theme.bwhite(`[!] Password: ${creds.pass}`));
                
                if (i < count - 1) {
                    const delay = getGaussianDelay(4500, 12500);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            } catch (err) {
                console.log(theme.error(`[-] Batch item ${i + 1} failed: ${err.message}`));
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
        }
        await rl.question(`${theme.bpurple("\n[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Batch complete. Press ")}${theme.bpurple("[")}${theme.bwhite("Enter")}${theme.bpurple("] ")}${theme.bwhite("to return. ")}\x1b[1;38;2;0;255;255m`);
        process.stdout.write(theme.RESET);
    }
}

async function displayProvisioningWarnings(ctx) {
    const { rl } = ctx;
    while (true) {
        drawInterfaceFrame("Provisioning Warnings", activeAccountState);
        console.log(box.top());
        box.drawRow(`${theme.warn("WARNING: ")}${theme.bwhite("Accounts created here are external.")}`);
        box.drawRow(theme.bwhite("Be aware: If you use an email you don't own,"));
        box.drawRow(theme.bwhite("it can be claimed by others."));
        console.log(box.bottom());
        console.log(box.top());
        box.drawRow(`${theme.warn("INFO: ")}`);
        box.drawRow(`${theme.bwhite("FR Legends checks cheating based on money/coin values.")}`);
        box.drawRow('');
        box.drawRow(`${theme.bwhite("This causes a 'tampered data' window pop-up to appear")}`);
        box.drawRow(`${theme.bwhite("occasionally which can be bypassed")}`);
        box.drawRow(`${theme.bwhite("by closing and re-opening game.")}`);
        box.drawRow('');
        box.drawRow(`${theme.bwhite("This tool generates account safetly by keeping amounts at")}`);
        box.drawRow(`${theme.bwhite("500k which is near the MAX 'safe' amount.")}`);
        box.drawRow('');
        box.drawRow(`${theme.bwhite("When modifying your account please make backups often.")}`);
        box.drawRow(`${theme.bwhite("Worse-case scenario you can recover your account")}`);
        box.drawRow(`${theme.bwhite("using the ")}${theme.bpurple("Account Recovery ")}${theme.bwhite("tool.")}`);
        console.log(box.bottom());

        await rl.question(`${theme.bpurple("\n[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press ")}${theme.bpurple("[")}${theme.bwhite("Enter")}${theme.bpurple("] ")}${theme.bwhite("to return. ")}\x1b[1;38;2;0;255;255m`);
        process.stdout.write(theme.RESET);
        break;
    }
}

export async function runProvisioningChain(creds, client, db, MASTER_KEY) {
    const { cryptoRandomStringAsync } = await import("crypto-random-string");
    const mockHardwareId = await cryptoRandomStringAsync({ length: 32, type: "hex" });
    
    console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite(`Handshaking [${creds.user}]`)}${theme.bcyan("...")}`);
    await client.loginWithDevice(`DEVICEMOCK-${mockHardwareId.toUpperCase()}`, true);
    await client.linkEmailCredentials(creds.email, creds.user, creds.pass);

    const baseDir = path.join(__dirname, 'fr_legends_payloads', 'templates');
    const masterTemplate = await readFile(path.join(baseDir, 'master.json'), 'utf8');
    const initCar = await readFile(path.join(__dirname, 'fr_legends_payloads', 'init', 'init_car.json'), 'utf8');

    let json = JSON.parse(masterTemplate);
    const now = getDotNetTicks();
    
    json.playerName = creds.user;
    json.createTime = now;
    json.savedTime = now;
    json.carport = 1;
    json.mcoins.store.v = 341170457;
    json.mgems.store.v = 341170457;
    json.liveryCreatorPass = true;
    json.cars = [JSON.parse(initCar)];
    json.gameVersion = 0;

    const files = await client.getFiles();
    if (files.Metadata?.pd?.DownloadUrl) {
        await performUpload(json);
    } else {
        await performInitialization(json);
    }
    const encryptedPass = encrypt(creds.pass, MASTER_KEY);
    db.prepare(`INSERT INTO accounts (email, password, last_login) VALUES (?, ?, ?)`)
      .run(creds.email, encryptedPass, Date.now());
    return creds;
}

async function deployPerfectTemplate(destEmail, destPass, newUsername) {

    const templatePath = path.join(__dirname, 'fr_legends_payloads', 'templates', 'master.json');
    const templateData = await readFile(templatePath, 'utf8');
    const json = JSON.parse(templateData);

    json.playerName = newUsername;
    const now = getDotNetTicks();
    json.createTime = now;
    json.savedTime = now;

    await client.loginWithEmail(destEmail, destPass);

    const files = await client.getFiles();
    const success = (files.Metadata?.pd?.DownloadUrl) 
        ? await performUpload(json) 
        : await performInitialization(json);

    if (success) {
        console.log(`${theme.success(`[+] Template deployed for ${newUsername}.`)}`);
    } else {
        console.error(`${theme.error(`[!] Failed to deploy template for ${newUsername}.`)}`);
    }
}

async function openSandbox() {
    await handleSandboxOperations({
        client,
        rl,
        activeAccountState,
        performUpload,
        syncTelemetry: () => telemetrySync(client, activeAccountState)
    });
}

export async function performUpload(json) {
    try {
        const templatePath = path.join(__dirname, 'fr_legends_payloads', 'templates', 'master.json');
        const templateSchema = JSON.parse(await readFile(templatePath, 'utf8'));
        if (validateStructure(json, templateSchema).length > 0) {
            if (!(await promptSchemaRisk("Structural mismatch detected. Proceed?", rl))) return false;
        }
        const files = await client.getFiles();
        if (!files.Metadata?.pd?.DownloadUrl) throw new Error("No server profile found.");
        
        const blob = await client.downloadBlob(files.Metadata.pd.DownloadUrl);
        const { prefix, xorKey } = await decodePd(blob);
        console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Existing account found. Handshake: ")}${theme.bpurple(`XOR ${xorKey}\n`)}`);
        
        const rebuilt = await encodePd(json, prefix, xorKey);
        const init = await client.initiateFileUploads(["pd"]);
        await client.uploadBlockBlob(init.UploadDetails[0].UploadUrl, rebuilt);
        await client.finalizeFileUploads(["pd"], init.ProfileVersion);
        
        console.log(`${theme.success("[+] SERVER SYNC SUCCESSFUL")}`);
        return true;
    } catch (err) {
        console.error(`${theme.error(`[!!!] SYNC FAILURE: ${err.message}`)}`);
        return false;
    }
}

export async function performInitialization(json) {
    try {
        console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Running Handshake")}${theme.bcyan("...")}`);
        const prefix = Buffer.from("0067250200", "hex");
        const xorKey = 160;

        const rebuilt = await encodePd(json, prefix, xorKey);
        
        console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Initiating server handshake")}${theme.bcyan("...")}`);
        const init = await client.initiateFileUploads(["pd"]);

        console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Transmitting block blob")}${theme.bcyan("...")}`);
        await client.uploadBlockBlob(init.UploadDetails[0].UploadUrl, rebuilt);

        console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Finalizing sync")}${theme.bcyan("...")}`);
        await client.finalizeFileUploads(["pd"], init.ProfileVersion);
        
        console.log(`${theme.success("[+] ACCOUNT INITIALIZED SUCCESSFULLY.\n")}`);
        return true;
    } catch (err) {
        console.error(`${theme.error(`[!!!] INITIALIZATION FAILURE: ${err.message}`)}`);
        return false;
    }
}

function exitSystem() {
    console.clear();

    const artLines = GOODBYE_ART.split('\n');
    const footerText = "Thanks For Using FRL Skeleton Key!";
    
    const artWidth = Math.max(...artLines.map(line => line.length));
    const totalWidth = Math.max(artWidth, footerText.length) + 2;

    const border = "═".repeat(totalWidth);

    console.log(theme.bpurple(`╔${border}╗`));

    artLines.forEach(line => {
        const padding = " ".repeat(totalWidth - line.length);
        console.log(theme.bpurple("║ ") + theme.bwhite(line) + padding.slice(1) + theme.bpurple("║"));
    });
    console.log(theme.bpurple(`╠${border}╣`));

    const fSpaces = totalWidth - footerText.length;
    const fLeft = " ".repeat(Math.floor(fSpaces / 2));
    const fRight = " ".repeat(Math.ceil(fSpaces / 2));
    console.log(theme.bpurple("║") + fLeft + theme.bcyan(footerText) + fRight + theme.bpurple("║"));

    console.log(theme.bpurple(`╚${border}╝`));

    process.stdout.write(theme.RESET);
    rl.close();
    process.exit(0);
}

async function mainLoop() {
    const MASTER_KEY = await runSplashScreen(rl);
    await validateFileSystem(rl);

    const update = await checkForUpdates();

    if(update.checked && update.available) {
        console.clear();
        drawInterfaceFrame("Update Available", activeAccountState);

        console.log(box.top());
        box.drawRow(`${theme.warn("UPDATE AVAILABLE")}`);
        box.drawRow(`${theme.bwhite("Current Version: ")}${theme.bpurple(update.localVersion)}`);
        box.drawRow(`${theme.bwhite("Latest Version: ")}${theme.bcyan(update.remoteVersion)}`);
        console.log(box.mid());

        if(update.message) {
            box.drawRow(`${theme.bwhite(update.message)}`);
            console.log(box.mid());
        }

        box.drawRow(`${theme.bcyan("IMPORTANT: PRESERVE YOUR LOCAL DATA BEFORE UPDATING.")}`);
        box.drawRow(`${theme.bwhite("Keep your ")}${theme.bpurple("fr_legends_payloads/")}${theme.bwhite(" directory.")}`);
        box.drawRow(`${theme.bwhite("Keep your ")}${theme.bpurple(".vault.lock")}${theme.bwhite(" file.")}`);
        box.drawRow(`${theme.bwhite("Keep your ")}${theme.bpurple("identity_vault.db")}${theme.bwhite(" file.")}`);
        console.log(box.mid());

        box.drawRow(`${theme.warn("WARNING: ")}${theme.bwhite("Replacing or deleting these files may cause")}`);
        box.drawRow(`${theme.bwhite("loss of saved accounts, vault access, payloads, or backups.")}`);
        box.drawRow(`${theme.bwhite("After updating, you may need to restore file permissions")}`);
        box.drawRow(`${theme.bwhite("or use chmod/chown so the Vault can write to its database.")}`);
        box.drawRow(' ');
        box.drawRow(`${theme.bwhite("Visit Repo URL & follow update instructions.")}`);
        console.log(box.mid());

        box.drawRow(`${theme.bwhite("Repo URL: ")}`);
        box.drawRow(`${theme.bcyan(update.releaseUrl)}`);
        console.log(box.bottom());

        await rl.question(`\n${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press Enter To Continue")}${theme.bpurple("...")}`);
    }
    while (true) {
        drawInterfaceFrame("Main Navigation", activeAccountState);
        console.log(box.top());
        const options = [
            " 1) Authenticate",
            " 2) Remote Factory",
            " 3) Cloning Matrix",
            " 4) Modding Sandbox",
            " 5) Account Recovery",
            " 6) Documentation / Help",
            " 7) Exit"
        ];
        options.forEach(opt => {
            const [num, text] = opt.split(')');
            const formatted = `${theme.bcyan(num)}${theme.bpurple(')')}${theme.bwhite(text)}`;
            box.drawRow(formatted);
        });
        console.log(box.bottom());

        const promptText = `${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("]")} ${theme.bwhite("Index")}${theme.bpurple(":")} \x1b[1;38;2;0;255;255m`;
        const control = (await rl.question(promptText)).trim();
        process.stdout.write(theme.RESET);

        if (control === "7") {
            exitSystem();
        }
        if (control < 1 || control > 7) {
            await rl.question(`${theme.error("[-] Invalid Index Press Enter To Continue... ")}\x1b[1;38;2;0;255;255m`);
            process.stdout.write(theme.RESET);
        }
        switch (control) {
            case "1": 
                await handleCredentialAuthentication({
                    client,
                    db,
                    rl,
                    activeAccountState,
                    syncIdentity,
                    drawInterfaceFrame,
                    syncTelemetry: () => telemetrySync(client, activeAccountState),
                    performAccountBackup,
                    MASTER_KEY
                }); 
                break;
            case "2": 
                await handleRemoteProvisioning({
                    rl,
                    client,
                    drawInterfaceFrame,
                    db,
                    MASTER_KEY
                }); 
                break;
            case "3":
                await handleAccountCloning({
                    rl,
                    client,
                    activeAccountState,
                    syncTelemetry: () => telemetrySync(client, activeAccountState),
                    db,
                    MASTER_KEY,
                    drawInterfaceFrame
                });
                break;
            case "4": 
                if (activeAccountState.authenticated) {
                    await openSandbox(); 
                } else {
                    process.stdout.write(theme.RESET);
                    console.log(`\n${theme.error("[-]")} ${theme.bred("Access Denied:")} ${theme.bwhite("Authentication Required.")}`);
                    await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("]")} ${theme.bwhite("Press")} ${theme.bpurple("[")}${theme.bwhite("Enter")}${theme.bpurple("] ")}${theme.bwhite("to return")}${theme.bpurple("... ")}\x1b[1;38;2;0;255;255m`);
                    process.stdout.write(theme.RESET);
                }
                break;
            case "5":
                await handleAccountRecovery({
                    rl,
                    activeAccountState,
                    syncTelemetry: () => telemetrySync(client, activeAccountState),
                    client
                }); 
                break;
            case "6":
                await handleFaqMenu({
                    rl,
                    activeAccountState,
                    theme,
                    drawInterfaceFrame
                });
                break;
        }
    }
    rl.close();
    process.exit(0);
}
mainLoop();
