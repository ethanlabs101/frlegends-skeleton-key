import { exec } from "node:child_process";
import { platform } from "node:process";
import { drawInterfaceFrame } from "../../utils/frame.js";
import { theme } from "../../utils/theme.js";
import { box } from "../../utils/box.js";

export const VAULT_URL = "https://github.com/ethanlabs101/FRLegends-Asset-Database";

function openGitHub() {
    if (platform === "win32") {
        exec(`start "" "${VAULT_URL}"`);
    } else if (process.env.TERMUX_VERSION) {
        exec(`termux-open-url "${VAULT_URL}"`);
    } else {
        exec(`xdg-open "${VAULT_URL}"`);
    }
}

export async function openAssetVault(
    rl,
    activeAccountState
) {
    while (true) {
        console.clear();
        drawInterfaceFrame("Online Asset Vault", activeAccountState);
        console.log(box.top());
        box.drawRow(`${theme.warn("Official Skeleton Key Asset Repository")}`);
        console.log(box.bottom());
        console.log(box.top());
        box.drawRow(`${theme.bwhite('Repository')}${theme.bpurple(': ')}`);
        box.drawRow(`${theme.bcyan(`${VAULT_URL}`)}`);
        console.log(box.bottom());
        console.log(box.top());
        box.drawRow(`${theme.bwhite('Repository Includes')}${theme.bpurple(': ')}`);
        box.drawRow(`${theme.warn('• ')}${theme.bwhite('Cars')}`);
        box.drawRow(`${theme.warn('• ')}${theme.bwhite('Liveries')}`);
        box.drawRow(`${theme.warn('• ')}${theme.bwhite('Asset Packs')}`);
        box.drawRow(`${theme.warn('• ')}${theme.bwhite('Community Uploads')}`);
        box.drawRow(`${theme.warn('• ')}${theme.bwhite('Documentation')}`);
        console.log(box.mid());
        box.drawRow(`${theme.bpurple('[')}${theme.warn('1')}${theme.bpurple('] ')}${theme.bwhite('Open GitHub Repository ')}`);
        box.drawRow(`${theme.bpurple('[')}${theme.warn('Enter')}${theme.bpurple('] ')}${theme.bwhite('Back')}`);
        console.log(box.bottom());

        const choice = (await rl.question(`\n${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Select")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).trim();
        process.stdout.write(theme.RESET);

        if (choice === "")
            return;
        if (choice === "1") {
            try {
                console.log(`${theme.success("\n[+] Launching browser... ")}`);
                openGitHub();
            }
            catch {
                console.log(`${theme.error("\n[-] Unable to launch browser. ")}\x1b[1;38;2;0;255;255m`);
                process.stdout.write(theme.RESET);
            }
            await rl.question(`\n${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press Enter To Continue")}${theme.bpurple("... ")}\x1b[1;38;2;0;255;255m`);
            process.stdout.write(theme.RESET);
            continue;
        }
        await rl.question(`${theme.error('[!] Invalid Selection. Press Enter to retry. ')}\x1b[1;38;2;0;255;255m`);
        process.stdout.write(theme.RESET);
    }
}
