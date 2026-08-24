import { drawInterfaceFrame } from '../utils/frame.js';
import { theme } from '../utils/theme.js';
import { box } from '../utils/box.js';
import { encrypt, decrypt, deriveKey, verifyPassword } from './security.js';

const UI = {
    PAUSE: async (rl) => {
        return rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press ")}${theme.bpurple("[")}${theme.bwhite("Enter")}${theme.bpurple("] ")}${theme.bwhite("to continue")}${theme.bpurple("... ")}\x1b[1;38;2;0;255;255m`);
        process.stdout.write(theme.RESET);
    },
    LIMITS: { QUICK_ENTRY: 9 },
    PROMPT: async (rl, text, showColon = true) => {
        const suffix = showColon ? `${theme.bpurple(": ")}` : " ";
        return (await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite(text)}${suffix}\x1b[1;38;2;0;255;255m`)).trim();
    },
    WAIT: async (ms = 1000) => new Promise(r => setTimeout(r, ms))
};

async function requestAuth(rl) {
    const key = await UI.PROMPT(rl, "Confirm Master Key");
    return deriveKey(key);
}

export async function handleCredentialAuthentication(ctx) {
    const { client, db, rl, activeAccountState, syncIdentity, syncTelemetry, performAccountBackup, MASTER_KEY } = ctx;

    while (true) {
        drawInterfaceFrame("Account Auth", activeAccountState);
        const hotList = db.prepare('SELECT * FROM accounts ORDER BY last_login DESC LIMIT ?').all(UI.LIMITS.QUICK_ENTRY);
        renderAuthMenu(hotList);

        const choice = await UI.PROMPT(rl, "Selection");
        process.stdout.write(theme.RESET);
        if (!choice) return;

        if (choice.toLowerCase() === 'm') {
            const email = await UI.PROMPT(rl, "Enter target Email");
            await runMaintenance(email, ctx);
            continue;
        }
        const creds = await resolveCredentials(choice, hotList, {...ctx, activeAccountState });
        if (!creds) continue;

        try {
            process.stdout.write(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Contacting Server")}${theme.bcyan("... ")}`);
            await client.loginWithEmail(creds.email, creds.password);
            process.stdout.write(theme.success("Done.\n"));
            
            process.stdout.write(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Syncing Identity")}${theme.bcyan("... ")}`);
            syncIdentity.run(creds.email, encrypt(creds.password, MASTER_KEY), client.playFabId);
            activeAccountState.authenticated = true;
            activeAccountState.currentIdentity = creds.email;
            activeAccountState.playFabId = client.playFabId;            
            creds.password = null;
            process.stdout.write(theme.success("Done.\n"));

            process.stdout.write(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Syncing Telemetry")}${theme.bcyan("... ")}${theme.bwhite("This may take awhile")}${theme.bcyan("... ")}`);
            await syncTelemetry();
            process.stdout.write(theme.success("Done.\n"));     

            console.log(theme.success("[+] Authentication success!\n"));
            
            if ((await UI.PROMPT(rl, "Create a fresh account backup? (y/n)")).toLowerCase() === 'y') {
                const success = await performAccountBackup();

                if (success) {
                    await UI.PROMPT(rl, "Backup complete. Press [Enter] to return.", false);
                } else {
                    await UI.WAIT(3000);
                }
            }
            return;
        } catch (err) {
            console.log(theme.error(`\n[-] Login failure: ${err.message}`));
            if (!creds.isManual && err.message.toLowerCase().includes("invalid")) {
                if ((await UI.PROMPT(rl, "Manage this account? (y/n)")).toLowerCase() === 'y') {
                    await runMaintenance(creds.email, ctx);
                }
            }
            await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press ")}${theme.bpurple("[")}${theme.bwhite("Enter")}${theme.bpurple("] ")}${theme.bwhite("to continue")}${theme.bpurple("... ")}\x1b[1;38;2;0;255;255m`);
            process.stdout.write(theme.RESET);
        }
    }
}

async function accountDatabase(db, rl, activeAccountState, MASTER_KEY) {
    while (true) {
        console.clear();
        const stats = db.prepare(`SELECT upper(substr(email, 1, 1)) as char, count(*) as count FROM accounts GROUP BY char ORDER BY char ASC`).all();
        const totalStats = db.prepare('SELECT COUNT(*) as total FROM accounts').get();

        drawInterfaceFrame("Account Database", activeAccountState);
        console.log(box.top());
        box.drawRow(theme.bwhite(`Total Vault Inventory: ${theme.bpurple(totalStats.total)} ${theme.bwhite("accounts")}`));
        console.log(box.mid());
        box.drawRow(theme.bcyan("Account Quantity per character:"));

        if (stats.length === 0) {
            box.drawRow(theme.error("[-] Vault is empty."));
        } else {
            stats.forEach(s => {
                box.drawRow(`${theme.bcyan(s.char.toUpperCase())}${theme.bpurple(": ")}${theme.bwhite(s.count + " account(s)")}`);
            });
        }
        console.log(box.bottom());

        const input = await UI.PROMPT(rl, "Filter by character, [$] for All, [Enter] to Back");
        if (input === "") return null;

        const accounts = db.prepare(`SELECT * FROM accounts WHERE email LIKE ? ORDER BY email ASC`).all((input === "$") ? '%' : `${input.toLowerCase()}%`);

        if (accounts.length === 0) {
            console.log(theme.error("\n[-] No accounts found for that filter."));
            await UI.WAIT(1500);
            continue;
        }
        let searching = true;
        while (searching) {
            console.clear();
            drawInterfaceFrame("Account Database", activeAccountState);
            console.log(box.top());
            box.drawRow(theme.warn("Select index or [Enter] to back"));
            console.log(box.mid());
            accounts.forEach((a, i) => {
                box.drawRow(`${theme.bcyan(i + 1)}${theme.bpurple(") ")}${theme.bwhite(a.email)}`)
            });
            console.log(box.bottom());

            const subChoice = (await UI.PROMPT(rl, "Selection")).toLowerCase();
            if (subChoice === '') {
                searching = false;
            } else {
                const idx = parseInt(subChoice) - 1;
                if (!isNaN(idx) && accounts[idx]) return accounts[idx];
                else {
                    console.log(theme.error("[-] Invalid selection."));
                    await UI.WAIT(800);
                }
            }
        }
    }
}

async function resolveCredentials(choice, hotList, ctx) {
    const { db, rl, activeAccountState, MASTER_KEY } = ctx;
    if (choice.toLowerCase() === 'x') {
        const acc = await accountDatabase(db, rl, activeAccountState, MASTER_KEY);
        return acc ? { email: acc.email, password: decrypt(acc.password, MASTER_KEY), isManual: false } : null;
    } 
    if (choice === '0') {
        return { 
            email: await UI.PROMPT(rl, "Email"), 
            password: await UI.PROMPT(rl, "Password"), 
            isManual: true 
        };
    }
    const idx = parseInt(choice) - 1;
    if (idx >= 0 && idx < hotList.length) {
        return { email: hotList[idx].email, password: decrypt(hotList[idx].password, MASTER_KEY), isManual: false };
    }
    await UI.PROMPT(rl, "Invalid selection. Press [Enter] to retry.", false);
    return null;
}

async function runMaintenance(email, ctx) {
    const { db, rl, MASTER_KEY, activeAccountState } = ctx;
    let keepRunning = true;

    while (keepRunning) {
        const acc = db.prepare('SELECT * FROM accounts WHERE email = ?').get(email);
        if (!acc) { return; }

        drawInterfaceFrame(`Maintenance Menu`, activeAccountState);
        console.log(box.top());
        box.drawRow(`${theme.warn("Note: ")}${theme.bwhite("You are editing your LOCAL database.                 ")}${theme.bpurple("║")}${theme.bpurple("\n║")}${theme.bwhite(" please update password in-game before editing here.        ")}`);
        console.log(box.mid());
        box.drawRow(`${theme.bcyan("Editing: ")}${theme.bwhite(email)}`);
        console.log(box.mid());

        const maintenanceText = "║ [1] Update Password                                        ║\n║ [2] View Password                                          ║\n║ [3] Delete                                                 ║\n║ [Enter] Back                                               ║";
        const styledMaintenance = maintenanceText.split(/(\[.*?\]|║)/g).map(part => {
            if (part.startsWith('[') || part === '║') {
                return theme.bpurple(part);
            }
            return theme.bwhite(part);
        }).join('');

        console.log(styledMaintenance);
        console.log(box.bottom());

        const choice = await UI.PROMPT(rl, "Selection", false);

        switch (choice.toLowerCase()) {
            case '1':
                const key1 = await requestAuth(rl);
                const decryptedPass1 = decrypt(acc.password, key1);

                if (decryptedPass1) {
                    console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Current Password: ")}${theme.bwhite(decryptedPass1)}`);
                    const pass = await UI.PROMPT(rl, "Enter New Password (min 6 chars):", false);

                    if (pass.length < 6) {
                        console.log(theme.bred("[-] Password too short. Must be 6+ characters."));
                        await UI.WAIT();
                    } else {
                        db.prepare('UPDATE accounts SET password = ? WHERE email = ?')
                          .run(encrypt(pass, key1), email);
                        console.log(theme.success("[+] Password updated."));
                        await UI.WAIT();
                    }
                    break;
                } else {
                    console.log(theme.error("[-] Incorrect Master Key."));
                }
                await UI.PAUSE(rl);
                break;
            case '2':
                const key2 = await requestAuth(rl);
                const decryptedPass2 = decrypt(acc.password, key2);

                if (decryptedPass2) {
                    console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Password: ")}${theme.bwhite(decryptedPass2)}`);
                } else {
                    console.log(theme.error("[-] Incorrect Master Key."));
                }
                await UI.PAUSE(rl);
                break;
            case '3':
                const key3 = await requestAuth(rl);
                const decryptedPass3 = decrypt(acc.password, key3);

                if (decryptedPass3) {
                    const confirm = await UI.PROMPT(rl, "Confirm deletion? (y/n)", false);
                    if (confirm.toLowerCase() === 'y') {
                         db.prepare('DELETE FROM accounts WHERE email = ?').run(email);

                         if (activeAccountState.currentIdentity === email) {
                             activeAccountState.authenticated = false;
                             activeAccountState.currentIdentity = null;
                             activeAccountState.playFabId = null;
                         }

                         console.log(theme.success("[-] Account purged."));
                         await UI.WAIT();
                         keepRunning = false;
                    }
                    break;
                } else {
                    console.log(theme.error("[-] Incorrect Master Key."));
                }
                await UI.PAUSE(rl);
                break;
            case '':
                keepRunning = false;
                break;
            default:
                console.log(theme.bred("[-] Invalid selection."));
                await UI.WAIT();
                break;
        }
    }
}

function renderAuthMenu(hotList) {
    console.log(box.top());
    box.drawRow(theme.warn("Quick-Entry [1-9]"));
    console.log(box.mid());
    hotList.forEach((acc, i) => {
        box.drawRow(`${theme.bcyan(i + 1)}${theme.bpurple(") ")}${theme.bwhite(acc.email)}`);
    });
    console.log(box.bottom());
    console.log(box.top());
    ["[1-9] Quick-Entry", "[0] Manual Login", "[X] Account Database", "[M] Maintenance", "[Enter] Return"].forEach(row => {
        const [_, content] = row.split(']');
        const formatted = `${theme.bpurple("[")}${theme.warn(row.substring(1, row.indexOf(']')))}${theme.bpurple("]")}${theme.bwhite(content)}`;
        box.drawRow(formatted);
    });
    console.log(box.bottom());
}
