import path from "node:path";
import { drawInterfaceFrame } from "../../utils/frame.js";
import { theme } from "../../utils/theme.js";
import { box } from "../../utils/box.js";
import { downloadAsset } from "../livery/downloader.js";
import { installDownloadedAsset as installAsset } from "./assetInstaller.js";
import { getAssetStatus, getVersionStatus } from "./status.js";
import { executeAssetAction } from "./actions.js";
import { loadRegistry } from "./registry.js";
import { ASSET_TYPES } from "./types.js";

async function pause(rl) {
    await rl.question(`\n${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press Enter To Continue")}${theme.bpurple("... ")}\x1b[1;38;2;0;255;255m`);
    process.stdout.write(theme.RESET);
}

function getActions(asset) {
    if(ASSET_TYPES.LIVERY.includes(asset.type)) {
        return [
            "Download Livery",
            "Install Livery",
            "Install + Apply + Inject"
        ];
    }

    if(ASSET_TYPES.FULL_CAR.includes(asset.type)) {
        return [
            "Download Car",
            "Install Car",
            "Install + Inject Car"
        ];
    }

    if(ASSET_TYPES.PACK.includes(asset.type)) {
        return [
            "Download Pack",
            "Install Pack",
            "View Contents"
        ];
    }
    return [
        "Download",
        "Install",
        "Details"
    ];
}

export async function assetMenu(
    asset,
    json,
    rl,
    performUpload,
    syncTelemetry,
    prefix,
    xorKey,
    activeAccountState
) {
    while(true) {
        console.clear();
        drawInterfaceFrame("Asset Details", activeAccountState);

        console.log(box.top());
        box.drawRow(`${theme.warn("Viewing")}${theme.bpurple(": ")}${theme.bwhite(`${asset.name}`)}`);
        console.log(box.bottom());

        console.log(box.top());
        box.drawRow(`${theme.warn("Name: ")}${theme.bwhite(`${asset.name}`)}`);
        box.drawRow(`${theme.warn("Model: ")}${theme.bwhite(`${asset.model}`)}`);
        box.drawRow(`${theme.warn("Type: ")}${theme.bwhite(`${asset.type}`)}`);
        box.drawRow(`${theme.warn("Author: ")}${theme.bwhite(`${asset.author || "Unknown"}`)}`);
        box.drawRow(`${theme.warn("Category: ")}${theme.bwhite(`${asset.category || "uncategorized"}`)}`);

        if(asset.tags && asset.tags.length > 0) {
            box.drawRow(`${theme.warn("Tags: ")}${theme.bwhite(`${asset.tags.join(", ")}`)}`);
        }

        if(asset.description) {
            box.drawRow(`${theme.warn("Description:")}`);
            box.drawRow(`${theme.bwhite(`${asset.description}`)}`);
        }

        const registry = loadRegistry();

        box.drawRow(`${theme.warn("Status: ")}${theme.bwhite(`${getAssetStatus(asset)}`)}`);
        box.drawRow(`${theme.warn("Version: ")}${theme.bwhite(`${getVersionStatus(asset, registry)}`)}`);

        const actions = getActions(asset);

        console.log(box.bottom());
        console.log(box.top());

        actions.forEach(
            (action,index)=>{
                box.drawRow(`${theme.bpurple("[")}${theme.warn(`${index + 1}`)}${theme.bpurple("] ")}${theme.bwhite(`${action}`)}`);
            }
        );

        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("] ")}${theme.bwhite("Back")}`);
        console.log(box.bottom());

        const choice = (await rl.question(`\n${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Select")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).trim();
        process.stdout.write(theme.RESET);

        if(choice === '') {
            break;
        }

        if(choice === "1") {
            await downloadAsset(asset);
            await pause(rl);
            continue;
        }

        else if(choice === "2") {
            const location = await downloadAsset(asset);
            await installAsset(location);

            console.log(`\n${theme.success("[+] Installed Successfully.")}`);

            await pause(rl);
            continue;
        }

        else if(choice === "3") {
            const location = await downloadAsset(asset);
            const manifest = await installAsset(location);

            console.log("");

            await executeAssetAction(
                manifest,
                json,
                rl,
                performUpload,
                syncTelemetry,
                prefix,
                xorKey
            );

            await pause(rl);
            continue;
        }

        await rl.question(`${theme.error("[!] Invalid Selection. Press Enter to retry. ")}\x1b[1;38;2;0;255;255m`);
        process.stdout.write(theme.RESET);
    }
}
