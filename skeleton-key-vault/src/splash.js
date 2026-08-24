import fs from 'fs';
import { exec } from "node:child_process";
import { platform } from "node:process";
import { theme } from '../utils/theme.js';
import { box } from '../utils/box.js';
import { verifyPassword, initializeVault, deriveKey } from './security.js';

const logoLines = [
    '7MM"""YMM  7MM"""Mq.   7MMF\'     ',
    'MM    `7   MM   `MM.   MM      ',
    'MM   d     MM   ,M9    MM      ',
    'MM""MM     MMmmdM9     MM      ',
    'MM   Y     MM  YM.     MM      ,',
    ' MM         MM   `Mb.   MM     ,M',
    'JMML.     .JMML. .JMM..JMMmmmmMMM '
];

const GITHUB_LINK = "https://github.com/ethanlabs101/frlegends-skeleton-key";

function openGitHub() {
    if (platform === "win32") {
        exec(`start "" "${GITHUB_LINK}"`);
    } else if (process.env.TERMUX_VERSION) {
        exec(`termux-open-url "${GITHUB_LINK}"`);
    } else {
        exec(`xdg-open "${GITHUB_LINK}"`);
    }
}

export async function runSplashScreen(rl) {

    const coloredLogo = logoLines.map(line => theme.bcyan(line)).join('\n');

    if (!fs.existsSync('.vault.lock')) {
        let validPass = false;
        while (!validPass) {
            console.clear();
            console.log(box.top());
            box.drawCentered(theme.bpurple("--- FR LEGENDS SKELETON KEY ACCESS PANEL ---"));
            box.drawCentered(" ");
            box.drawCentered(coloredLogo);
            box.drawCentered(" ");
            box.drawCentered(`${theme.bwhite("Build: ")}${theme.bpurple("2026.08.24")}${theme.bwhite(" | github.com/")}${theme.bpurple("ethanlabs101")}`);
            console.log(box.bottom());

            console.log(theme.warn("\n[!] WARNING: Vault Initialization Required."));
            console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("This master key encrypts your saved login credentials.")}`);
            console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("If you lose this key, you will have to re-import your accounts.\n")}`);

            const newPassMessage = `${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("]")} ${theme.bwhite("Set Master Key (min 8 chars)")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`;
            const newPass = (await rl.question(newPassMessage)).trim();
            process.stdout.write(theme.RESET);
            
            if (newPass.length < 8) {
                console.log(theme.error("\n[!] Password too weak. Use at least 8 characters."));
                await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("]")}${theme.bwhite(" Press ")}${theme.bpurple("[Enter]")}${theme.bwhite(" to continue")}${theme.bpurple("...")}`);
            } else {
                const confirmPassMessage = `${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("]")} ${theme.bwhite("Confirm Master Key")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`;
                const confirmPass = (await rl.question(confirmPassMessage)).trim();
                process.stdout.write(theme.RESET);

                if (newPass !== confirmPass) {
                    console.log(theme.error("\n[!] Passwords do not match."));
                    await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press ")}${theme.bpurple("[")}${theme.bwhite("Enter")}${theme.bpurple("] ")}${theme.bwhite("to restart setup")}${theme.bpurple("... ")}\x1b[1;38;2;0;255;255m`);
                    process.stdout.write(theme.RESET);
                } else {
                    initializeVault(newPass);
                    console.log(theme.success("[+] Vault locked and secured.\n"));
                    console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Welcome to the FR Legends Skeleton Key Vault!")}`);
                    await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press ")}${theme.bpurple("[")}${theme.bwhite("Enter")}${theme.bpurple("] ")}${theme.bwhite("to continue...")}`);
                    validPass = true;
                }
            }
        }
    }

    while (true) {
        console.clear();
        console.log(box.top());
        box.drawCentered(theme.bpurple("--- FR LEGENDS SKELETON KEY ACCESS PANEL ---"));
        box.drawCentered(" ");
        box.drawCentered(coloredLogo);
        box.drawCentered(" ");
        box.drawCentered(`${theme.bwhite("Build: ")}${theme.bpurple("2026.08.24")}${theme.bwhite(" | github.com/")}${theme.bpurple("ethanlabs101")}`);
        console.log(box.bottom());
        console.log(`${theme.bpurple("-- [")}${theme.bwhite("Z")}${theme.bpurple("] ")}${theme.bwhite("Recovery Mode ")}${theme.bpurple("| [")}${theme.bwhite("E")}${theme.bpurple("] ")}${theme.bwhite("GitHub ")}${theme.bpurple("| [")}${theme.bwhite("Enter")}${theme.bpurple("] ")}${theme.bwhite("Proceed To Auth")}${theme.bpurple(" --")}`);

        const promptText = `${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Select Action")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`;
        const action = (await rl.question(promptText)).trim().toLowerCase();
        process.stdout.write(theme.RESET);

        if (action.toLowerCase() === 'z') {
            await enterRecoveryMode(rl);
            continue;
        }
        if (action.toLowerCase() === 'e') {
            console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Opening github.com/ethanlabs101")}${theme.bcyan("...")}`);
            console.log(`${theme.warn("[!]")}${theme.bwhite(" Alternatively, enter url manually in browser")}${theme.warn("...")}`);
            openGitHub();
            await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("]")}${theme.bwhite(" Press ")}${theme.bpurple("[")}${theme.bwhite("Enter")}${theme.bpurple("]")}${theme.bwhite(" to continue")}${theme.bpurple("... ")}\x1b[1;38;2;0;255;255m`);
            process.stdout.write(theme.RESET);
            continue;
        }
        if (action !== '') {
            console.log(theme.error("\n[-] Invalid selection. Only [Z], [E], or [Enter] are valid."));
            await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press ")}${theme.bpurple("[")}${theme.bwhite("Enter")}${theme.bpurple("] ")}${theme.bwhite("to try again")}${theme.bpurple("... ")}\x1b[1;38;2;0;255;255m`);
            process.stdout.write(theme.RESET);
            continue;
        }
        const passPrompt = `${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Enter Master Key")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`;
        const pass = (await rl.question(passPrompt)).trim();
        process.stdout.write(theme.RESET);

        if (verifyPassword(pass)) {
            return deriveKey(pass);
        } else {
            console.log(theme.error("[-] Access Denied: Incorrect Master Key."));
            await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press ")}${theme.bpurple("[")}${theme.bwhite("Enter")}${theme.bpurple("] ")}${theme.bwhite("to retry. ")}\x1b[1;38;2;0;255;255m`);
            process.stdout.write(theme.RESET);
        }
    }
}

async function enterRecoveryMode(rl) {
    console.clear();
    console.log(theme.bred("\n[ SECURITY RESET: RECOVERY MODE ]"));
    console.log(`${theme.bred("\n[!] ")}${theme.bwhite("This will clear your LOCAL login vault.")}`);
    console.log(`${theme.bred("[!] ")}${theme.bwhite("You will NOT lose your in-game progress, BUT you will")}`);
    console.log(`${theme.bred("[!] ")}${theme.bwhite("need to manually re-login to your accounts to rebuild the list.")}`);

    const confirm = await rl.question(`${theme.bpurple("\n[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Type")}${theme.bpurple(" '")}${theme.bwhite("RESET")}${theme.bpurple("' ")}${theme.bwhite("to confirm")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`);
    process.stdout.write(theme.RESET);

    if (confirm.toUpperCase() === 'RESET') {
        try {
            if (fs.existsSync('.vault.lock')) fs.unlinkSync('.vault.lock');
            if (fs.existsSync('identity_vault.db')) fs.unlinkSync('identity_vault.db');

            console.log(theme.success("\n[+] Local vault reset successfully."));
            console.log(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Re-launch the system to initialize a new vault.")}`);
            process.exit();
        } catch (err) {
            console.log(theme.error("\n[-] Error wiping files: " + err.message));
            await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press ")}${theme.bpurple("[")}${theme.bwhite("Enter")}${theme.bpurple("] ")}${theme.bwhite("to return")}${theme.bpurple("... ")}\x1b[1;38;2;0;255;255m`);
            process.stdout.write(theme.RESET);
        }
    } else {
        console.log(theme.error("\n[!] Confirmation failed: Input does not match 'RESET'."));
        await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press ")}${theme.bpurple("[")}${theme.bwhite("Enter")}${theme.bpurple("] ")}${theme.bwhite("to return to the splash screen. ")}\x1b[1;38;2;0;255;255m`);
        process.stdout.write(theme.RESET);
    }
}
