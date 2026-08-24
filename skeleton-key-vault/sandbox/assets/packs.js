import path from "path";
import { fetchDatabase } from "../livery/database/api.js";
import { downloadAsset } from "../livery/downloader.js";
import { installDownloadedAsset as installAsset } from "./assetInstaller.js";
import { injectInstalledCar } from "../cars/injector.js";
import { executeAssetAction } from "./actions.js";
import { getAssetStatus } from "./status.js";
import { assetMenu } from "./details.js";
import { drawInterfaceFrame } from "../../utils/frame.js";
import { theme } from "../../utils/theme.js";
import { box } from "../../utils/box.js";

async function pause(rl) {
    await rl.question(`\n${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press Enter To Continue")}${theme.bpurple("... ")}\x1b[1;38;2;0;255;255m`);
    process.stdout.write(theme.RESET);
}

function findPackAssets(pack, assets) {
    if(!pack.assets || !Array.isArray(pack.assets)) {
        return [];
    }
    return pack.assets
        .map(
            id =>
                assets.find(
                    asset =>
                        asset.id === id
                )
        )
        .filter(Boolean);
}

async function downloadPack(packAssets) {
    console.log(`\n${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Downloading pack")}${theme.bcyan("...")}\n`);

    for(const [i, asset] of packAssets.entries()) {
        console.log(`${theme.bcyan(`[${i + 1}/${packAssets.length}] `)}${theme.bwhite(`${asset.name}`)}`);
        await downloadAsset(asset);
    }
    console.log(`\n${theme.success("[+] Pack download complete. ")}`);
}

async function installPack(packAssets) {
    console.log(`\n${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Installing pack")}${theme.bcyan("... ")}\n`);

    for(const [i, asset] of packAssets.entries()) {
        console.log(`${theme.bcyan(`[${i + 1}/${packAssets.length}] `)}${theme.bwhite(`${asset.name}`)}`);

        const location = await downloadAsset(asset);
        await installAsset(location);
    }
    console.log(`${theme.success("\n[+] Pack installation complete.")}`);
}

async function installMissing(packAssets) {
    console.log(`${theme.bcyan("\n[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Checking missing assets")}${theme.bcyan("... ")}\n`);

    for(const asset of packAssets) {
        const status = getAssetStatus(asset);

        if(status.includes("INSTALLED")) {
            console.log(`${theme.warn("[")}${theme.bwhite("SKIP")}${theme.warn("] ")}${theme.bwhite(`${asset.name}`)}`);
            continue;
        }
        console.log(`${theme.warn("[")}${theme.bwhite("INSTALL")}${theme.warn("] ")}${theme.bwhite(`${asset.name}`)}`);

        const location = await downloadAsset(asset);
        await installAsset(location);
    }
    console.log(`\n${theme.success("[+] Missing assets installed.")}`);
}

async function injectPack(
    packAssets,
    json,
    rl,
    performUpload,
    prefix,
    xorKey,
    syncTelemetry
) {
    console.log(`\n${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Injecting pack")}${theme.bcyan("...\n")}`);

    for(const [i, asset] of packAssets.entries()) {
        console.log(`${theme.bcyan(`[${i + 1}/${packAssets.length}] `)}${theme.bwhite(`${asset.name}`)}`);

        if(asset.type === "full_car") {
            await injectInstalledCar(
                json,
                performUpload,
                syncTelemetry,
                prefix,
                xorKey,
                path.join(
                    process.cwd(),
                    "fr_legends_payloads",
                    "cars",
                    asset.model,
                    asset.name
                )
            );
            console.log(`${theme.success("[+] Car injected.")}`);
        }
        else if(
            asset.type === "livery" ||
            asset.type === "car_livery"
        ) {
            const location = await downloadAsset(asset);
            const manifest = await installAsset(location);

            await executeAssetAction(
                manifest,
                json,
                rl,
                performUpload,
                syncTelemetry,
                prefix,
                xorKey
            );
            console.log(`${theme.success("[+] Livery injected.")}`);
        }
        else {
            console.log(`${theme.warn("[")}${theme.bwhite("SKIP")}${theme.warn("] ")}${theme.bwhite("Unsupported asset type.")}`);
        }
    }
    console.log(`${theme.success("\n[+] Pack injection complete.")}`);
}

export async function browsePacks(
    json,
    rl,
    performUpload,
    prefix,
    xorKey,
    activeAccountState = null,
    syncTelemetry
) {
    while(true) {
        const db = await fetchDatabase();

        const packs =
            db.packs || [];

        const assets = [
            ...(db.assets || []),
            ...(db.cars || [])
        ];

        if(packs.length === 0) {
            drawInterfaceFrame("Pack Manager", activeAccountState);

            console.log(box.top());
            box.drawRow(`${theme.error("No packs available.")}`);
            console.log(box.bottom());

            await pause(rl);
            return;
        }

        drawInterfaceFrame("Pack Browser", activeAccountState);

        console.log(box.top());
        box.drawRow(`${theme.bcyan("Pack Browser")}`);
        console.log(box.bottom());
        console.log(box.top());

        packs.forEach(
            (pack,index)=>{
                box.drawRow(`${theme.bcyan(index + 1)}${theme.bpurple(")")} ${theme.warn(pack.name)}`);
                box.drawRow(`   ${theme.bwhite("Type: ")}${theme.bpurple(pack.type || "pack")}`);
                box.drawRow(`   ${theme.bwhite("Assets: ")}${theme.bpurple(pack.assets?.length || 0)}`);
                console.log(box.mid());
            }
        );
        box.drawRow(`${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("]")} ${theme.bwhite("Back")}`);
        console.log(box.bottom());

        const choice = (await rl.question(`\n${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("]")} ${theme.bwhite("Select")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).trim();
        process.stdout.write(theme.RESET);

        if(choice === '') {
            return;
        }
        const pack = packs[Number(choice)-1];

        if(!pack) {
            await rl.question(`${theme.error("[!] Invalid Selection. Press Enter to retry. ")}\x1b[1;38;2;0;255;255m`);
            process.stdout.write(theme.RESET);
            continue;
        }

        const packAssets = findPackAssets(
            pack,
            assets
        );
        while(true) {
            drawInterfaceFrame(pack.name, activeAccountState);
            console.log(box.top());
            box.drawRow(`${theme.warn(pack.name)}`);
            console.log(box.mid());
            box.drawRow(`${theme.bcyan("Contents: ")}`);
            console.log(box.mid());

            packAssets.forEach(
                (asset,index)=>{
                    box.drawRow(`${theme.bcyan(index + 1)}${theme.bpurple(")")} ${theme.warn(asset.name)}`);
                    box.drawRow(`   ${theme.bwhite("Author: ")}${theme.bpurple(asset.author)}`);
                    box.drawRow(`   ${theme.bwhite("Published: ")}${theme.bpurple(asset.published)}`);
                    box.drawRow(`   ${theme.bwhite("Base Model: ")}${theme.bpurple(asset.model || "N/A")}`);
                    box.drawRow(`   ${theme.bwhite("Type: ")}${theme.bpurple(asset.type)}`);
                    box.drawRow(`   ${theme.bwhite("Status: ")}${theme.bpurple(getAssetStatus(asset))}`);
                    console.log(box.mid());
                }
            );
            box.drawRow(`${theme.warn("Note: ")}${theme.bwhite("Install Packs Before Injection.")}`);
            console.log(box.mid());
            box.drawRow(`${theme.bpurple("[")}${theme.warn("D")}${theme.bpurple("]")} ${theme.bwhite("Download Pack")}`);
            box.drawRow(`${theme.bpurple("[")}${theme.warn("I")}${theme.bpurple("]")} ${theme.bwhite("Install Pack")}`);
            box.drawRow(`${theme.bpurple("[")}${theme.warn("M")}${theme.bpurple("]")} ${theme.bwhite("Install Missing")}`);
            box.drawRow(`${theme.bpurple("[")}${theme.warn("G")}${theme.bpurple("]")} ${theme.bwhite("Inject Pack")}`);
            console.log(box.mid());
            box.drawRow(`${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("]")} ${theme.bwhite("Back")}`);
            console.log(box.bottom());

            const action = (await rl.question(`\n${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("]")} ${theme.bwhite("Select")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).trim().toLowerCase();
            process.stdout.write(theme.RESET);

            if(action === '') {
                break;
            }

            if(action === "d") {
                await downloadPack(packAssets);
                await pause(rl);
                continue;
            }

            if(action === "i") {
                await installPack(packAssets);
                await pause(rl);
                continue;
            }

            if(action === "m") {
                await installMissing(packAssets);
                await pause(rl);
                continue;
            }

            if(action === "g") {
                await injectPack(
                    packAssets,
                    json,
                    rl,
                    performUpload,
                    prefix,
                    xorKey,
                    syncTelemetry
                );
                await pause(rl);
                continue;
            }

            const selected = packAssets[Number(action)-1];

            if(selected) {
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

            if(!selected) {
                await rl.question(`${theme.error("[!] Invalid Selection. Press Enter to retry. ")}\x1b[1;38;2;0;255;255m`);
                process.stdout.write(theme.RESET);
            }
        }
    }
}
