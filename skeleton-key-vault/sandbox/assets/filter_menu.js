import { drawInterfaceFrame } from "../../utils/frame.js";
import { theme } from "../../utils/theme.js";
import { box } from "../../utils/box.js";
import { getAssetIndex } from "./filter.js";

export async function assetFilterMenu(
    rl,
    assets,
    activeAccountState
) {
    const index = getAssetIndex(assets);

    while(true) {
        console.clear();
        drawInterfaceFrame("Asset Browser", activeAccountState);
        console.log(box.top());
        box.drawRow(`${theme.warn("TIP:                                                       ")}${theme.bpurple("║")}${theme.bpurple("\n║")}${theme.bwhite(" Visit ")}${theme.bcyan("github.com/ethanlabs101/FRLegends-Asset-Database     ")}`);
        box.drawRow(`${theme.bwhite("to see a catalogue of all included assets!")}`); 
        console.log(box.bottom());
        console.log(box.top());
        box.drawRow(`${theme.bwhite("Total Assets")}${theme.bpurple(": ")}${theme.warn(assets.length)}`);
        console.log(box.bottom());
        console.log(box.top());
        box.drawRow(`${theme.warn("Asset Filter")}${theme.bpurple(": ")}`);
        console.log(box.mid());

        Object.keys(index)
        .sort()
        .forEach(
            key=>{
                box.drawRow(`${theme.bpurple("[")}${theme.warn(key)}${theme.bpurple("]")} ${theme.bpurple(index[key].length)}${theme.bwhite(" assets")}`);
            }
        );
        box.drawRow(`${theme.bpurple("[")}${theme.warn("$")}${theme.bpurple("] ")}${theme.bpurple("All ")}${theme.bwhite("Assets")}`);
        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("] ")}${theme.bwhite("Back")}`);
        console.log(box.bottom());

        const choice = (await rl.question(`\n${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Selection")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).trim().toUpperCase();
        process.stdout.write(theme.RESET);

        if(choice === "") {
            return null;
        }
        if(choice === "$") {
            console.clear();
            drawInterfaceFrame("Viewing All Assets", activeAccountState);
            console.log(box.top());
            box.drawRow(`${theme.bcyan('Select An Asset: ')}`);
            console.log(box.bottom());
            console.log(box.top());
            return assets;
        }
        if(index[choice]) {
            console.clear();
            drawInterfaceFrame("Asset Selection", activeAccountState);
            console.log(box.top());
            box.drawRow(`${theme.bcyan('Select An Asset: ')}`);
            console.log(box.bottom());
            console.log(box.top());
            return index[choice];
        }
        await rl.question(`${theme.error('[!] Invalid Selection. Press Enter to retry. ')}\x1b[1;38;2;0;255;255m`);
        process.stdout.write(theme.RESET);
    }
}
