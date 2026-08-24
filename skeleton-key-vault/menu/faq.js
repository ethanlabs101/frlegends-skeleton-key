import { exec } from "node:child_process";
import { platform } from "node:process";
import { box } from "../utils/box.js";

const GITHUB_URL = "https://github.com/ethanlabs101/frlegends-skeleton-key";

function openGitHub() {
    if (platform === "win32") {
        exec(`start "" "${GITHUB_URL}"`);
    } else if (process.env.TERMUX_VERSION) {
        exec(`termux-open-url "${GITHUB_URL}"`);
    } else {
        exec(`xdg-open "${GITHUB_URL}"`);
    }
}

export async function handleFaqMenu({
    rl,
    activeAccountState,
    theme,
    drawInterfaceFrame
}) {
    while (true) {
        drawInterfaceFrame("Project Documentation", activeAccountState);
        console.log(box.top());
        box.drawRow(`${theme.warn("Need Help? Visit Link Below!")}`);
        box.drawRow(`${theme.bwhite(`${GITHUB_URL}`)}`);
        console.log(box.bottom());
        console.log(box.top());
        box.drawRow(`${theme.bpurple("[")}${theme.warn("1")}${theme.bpurple("] ")}${theme.bwhite("Open GitHub Documentation")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("] ")}${theme.bwhite("Return to Main Menu")}`);
        console.log(box.bottom());

        const choice = (await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Select option")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).trim();
        process.stdout.write(theme.RESET);

        if (choice !== "1" && choice !== "") {
            await rl.question(`${theme.error("[-] Invalid Selection. Press Enter To Continue ")}`);
            continue;
        }

        if (choice === "1") {
            console.log(`${theme.bcyan("\n[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Opening GitHub documentation")}${theme.bcyan("... ")}`);
            openGitHub();

            console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Check your browser, or visit url manually. ")}`);

            await rl.question(`${theme.bpurple("\n[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press Enter To Return")}${theme.bpurple("... ")}`);
            continue;
        }
        if (choice === "") {
            return null;
        }
    }
}
