import { theme } from "../../utils/theme.js";
import { box } from "../../utils/box.js";
import { drawInterfaceFrame } from "../../utils/frame.js";
import { VAULT_URL } from "./open.js";

export async function assetManagerMenu(
    rl,
    activeAccountState
) {
    const validChoices = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8"
    ];
    while(true) {
        console.clear();
        drawInterfaceFrame("Asset Manager", activeAccountState);
        console.log(box.top());
        box.drawRow(`${theme.warn('Install Cars/Liveries/Packs + Inject Directly To Garage')}`);
        console.log(box.bottom());
        console.log(box.top());
        box.drawRow(`${theme.bwhite('Visit The Asset Repository: ')}`);
        box.drawRow(`${theme.bcyan(`${VAULT_URL}`)}`);
        console.log(box.bottom());
        console.log(box.top());
        box.drawRow(`${theme.bpurple('[')}${theme.warn('1')}${theme.bpurple('] ')}${theme.bwhite('Browse Assets')}`);
        box.drawRow(`${theme.bpurple('[')}${theme.warn('2')}${theme.bpurple('] ')}${theme.bwhite('Categories')}`);
        box.drawRow(`${theme.bpurple('[')}${theme.warn('3')}${theme.bpurple('] ')}${theme.bwhite('Search')}`);
        box.drawRow(`${theme.bpurple('[')}${theme.warn('4')}${theme.bpurple('] ')}${theme.bwhite('New Assets')}`);
        box.drawRow(`${theme.bpurple('[')}${theme.warn('5')}${theme.bpurple('] ')}${theme.bwhite('Installed Assets')}`);
        box.drawRow(`${theme.bpurple('[')}${theme.warn('6')}${theme.bpurple('] ')}${theme.bwhite('Download Cache')}`);
        box.drawRow(`${theme.bpurple('[')}${theme.warn('7')}${theme.bpurple('] ')}${theme.bwhite('Pack Browser')}`);
        box .drawRow(`${theme.bpurple('[')}${theme.warn('8')}${theme.bpurple('] ')}${theme.bwhite('Visit Asset Database')}`);
        box.drawRow(`${theme.bpurple('[')}${theme.warn('0')}${theme.bpurple('] ')}${theme.bwhite('Back')}`);
        console.log(box.bottom());

        const choice = (await rl.question(`${theme.bpurple('[')}${theme.bwhite('>')}${theme.bpurple('] ')}${theme.bwhite('Select')}${theme.bpurple(': ')}\x1b[1;38;2;0;255;255m`)).trim();
        process.stdout.write(theme.RESET);

        if (choice === "0") {
            return "0";
        }

        if (validChoices.includes(choice)) {
            return choice;
        }
        await rl.question(`${theme.error('[!] Invalid Selection. Press Enter to retry. ')}\x1b[1;38;2;0;255;255m`);
        process.stdout.write(theme.RESET);
    }
}
