import { assetFilterMenu } from "./filter_menu.js";
import { getAssetStatus } from "./status.js";
import { getAssetIndex } from "./filter.js";
import { ASSET_TYPES } from "./types.js";
import { assetMenu } from "./details.js";
import { fetchDatabase } from "../livery/database/api.js";
import { drawInterfaceFrame } from "../../utils/frame.js";
import { theme } from "../../utils/theme.js";
import { box } from "../../utils/box.js";

async function pause(rl) {
    await rl.question(`\n${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press Enter To Continue")}${theme.bpurple("... ")}\x1b[1;38;2;0;255;255m`);
    process.stdout.write(theme.RESET);
}

function drawAssetSelection(assets, activeAccountState) {
    console.clear();
    drawInterfaceFrame("Asset Selection", activeAccountState);
    console.log(box.top());
    box.drawRow(`${theme.bcyan("Select An Asset: ")}`);
    console.log(box.bottom());
    console.log(box.top());

    assets.forEach(
        (asset,index)=>{
            box.drawRow(`${theme.bcyan(index + 1)}${theme.bpurple(") ")}${theme.warn(asset.name)}`);
            box.drawRow(`   ${theme.bwhite("Author: ")}${theme.bpurple(asset.author || "Unknown")}`);
            box.drawRow(`   ${theme.bwhite("Published: ")}${theme.bpurple(asset.published || "Unknown")}`);
            box.drawRow(`   ${theme.bwhite("Base Model: ")}${theme.bpurple(asset.model || "Unknown")}`);
            box.drawRow(`   ${theme.bwhite("Type: ")}${theme.bpurple(asset.type || "unknown")}`);
            box.drawRow(`   ${theme.bwhite("Status: ")}${theme.bpurple(getAssetStatus(asset))}`);
            console.log(box.mid());
        }
    );
    box.drawRow(`${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("] ")}${theme.bwhite("Back")}`);
    console.log(box.bottom());
}

export async function browseAssets(
    json,
    rl,
    performUpload,
    prefix,
    xorKey,
    activeAccountState = null,
    syncTelemetry,
    overrideAssets = null
) {
    while(true) {
        try {
            let assets;

            if(Array.isArray(overrideAssets)) {
                assets = overrideAssets;
            } else {
                const db = await fetchDatabase();
                assets = db.assets || [];
            }

            if(assets.length === 0) {
                console.log(
                    `${theme.error("[!] No assets available. ")}`
                );
                await pause(rl);
                return;
            }
            let fromFilter = false;

            if(!overrideAssets) {
                const filtered =
                    await assetFilterMenu(
                        rl,
                        assets,
                        activeAccountState
                    );
                if(filtered === null) {
                    return;
                }
                assets = filtered;
                fromFilter = true;
            }
            drawAssetSelection(assets, activeAccountState);

            const choice = (await rl.question(`\n${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Select")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).trim();
            process.stdout.write(theme.RESET);

            if(choice === "") {
                if(fromFilter) {
                    return await browseAssets(
                        json,
                        rl,
                        performUpload,
                        prefix,
                        xorKey,
                        activeAccountState,
                        syncTelemetry,
                        null
                    );
                }
                return;
            }
            const selectedIndex = Number(choice) - 1;
            const asset = assets[selectedIndex];

            if(!asset) {
                await rl.question(`${theme.error("[!] Invalid Selection. Press Enter to retry. ")}\x1b[1;38;2;0;255;255m`);
                process.stdout.write(theme.RESET);
                continue;
            }
            await assetMenu(
                asset,
                json,
                rl,
                performUpload,
                syncTelemetry,
                prefix,
                xorKey,
                activeAccountState
            );
        }
        catch(err) {
            console.log(`\n${theme.error("[!] ASSET MANAGER ERROR: ")}`);
            console.log(`${theme.error(err.message)}`);
            await pause(rl);
        }
    }
}
