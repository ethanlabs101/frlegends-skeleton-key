import { drawInterfaceFrame } from "../../utils/frame.js";
import { theme } from "../../utils/theme.js";
import { box } from "../../utils/box.js";
import { assetMenu } from "./details.js";

function sortNewest(assets) {
    return [...assets]
        .sort(
            (a,b)=>{
                const dateA = new Date(a.published || 0);
                const dateB = new Date(b.published || 0);
                return dateB - dateA;
            }
        );
}

function filterRecent(assets, days) {
    const now = new Date();
    const cutoff =
        new Date(
            now.getTime()
            -
            days *
            24 *
            60 *
            60 *
            1000
        );
    return assets.filter(
        asset=>{
            if(!asset.published)
                return false;
            return (
                new Date(asset.published)
                >=
                cutoff
            );
        }
    );
}

export async function newAssetsMenu(
    rl,
    assets,
    json,
    performUpload,
    syncTelemetry,
    prefix,
    xorKey,
    activeAccountState
) {

    while(true) {
        console.clear();
        drawInterfaceFrame("New Assets", activeAccountState);
        console.log(box.top());
        box.drawRow(`${theme.warn("New Assets")}${theme.bpurple(": ")}`);
        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.warn("1")}${theme.bpurple("] ")}${theme.bwhite("Latest Assets")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.warn("2")}${theme.bpurple("] ")}${theme.bwhite("Added This Week")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.warn("3")}${theme.bpurple("] ")}${theme.bwhite("Added This Month")}`);
        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("] ")}${theme.bwhite("Back")}`);
        console.log(box.bottom());

        const choice = (await rl.question(`\n${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Select")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).trim();
        process.stdout.write(theme.RESET);

        if(choice === "") {
            return null;
        }
        let results = [];

        switch(choice) {
            case "1":
                results =
                    sortNewest(
                        assets
                    ).slice(
                        0,
                        25
                    );
                break;
            case "2":
                results =
                    filterRecent(
                        assets,
                        7
                    );
                break;
            case "3":
                results =
                    filterRecent(
                        assets,
                        30
                    );
                break;
            default:
                await rl.question(`${theme.error("[!] Invalid Selection. Press Enter to retry. ")}`);
                continue;
        }
        if(results.length === 0) {
            console.log(`${theme.warn("\nNo new assets found.")}`);

            await rl.question(`\n${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press Enter To Return")}${theme.bpurple("... ")}`);
            continue;
        }
        while(true) {
            console.clear();
            drawInterfaceFrame("New Assets", activeAccountState);
            console.log(box.top());
            box.drawRow(`${theme.bcyan("Select An Asset")}${theme.bpurple(": ")}`);
            console.log(box.mid());

            results.forEach(
                (asset,index)=>{
                    box.drawRow(`${theme.bcyan(index + 1)}${theme.bpurple(")")} ${theme.warn(asset.name)}`);
                    box.drawRow(`   ${theme.bwhite("Author: ")}${theme.bpurple(asset.author || "Unknown")}`);
                    box.drawRow(`   ${theme.bwhite("Model: ")}${theme.bpurple(asset.model || "Unknown")}`);
                    box.drawRow(`   ${theme.bwhite("Type: ")}${theme.bpurple(asset.type || "Unknown")}`);
                    console.log(box.mid());
                }
            );
            box.drawRow(`${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("]")} ${theme.bwhite("Back")}`);
            console.log(box.bottom());

            const assetChoice = (await rl.question(`\n${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Select")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).trim();
            process.stdout.write(theme.RESET);

            if(assetChoice === "") {
                break;
            }
            const selected = results[Number(assetChoice) - 1];

            if(!selected) {
                await rl.question(`${theme.error("[!] Invalid Selection. Press Enter to retry.")}`);
                continue;
            }
            await assetMenu(
                selected,
                json,
                rl,
                performUpload,
                syncTelemetry,
                prefix,
                xorKey,
                activeAccountState
            );
            continue;
        }
    }
}
