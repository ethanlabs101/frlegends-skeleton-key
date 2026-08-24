import { assetManagerMenu } from "./menu.js";
import { routeAssetMenu } from "./router.js";

export async function openAssetManager(
    json,
    rl,
    activeAccountState,
    performUpload,
    syncTelemetry,
    prefix,
    xorKey
) {
    while (true) {
        const choice = await assetManagerMenu(rl, activeAccountState);

        if (choice === "0") {
            return;
        }
        await routeAssetMenu(
            choice,
            json,
            rl,
            activeAccountState,
            performUpload,
            syncTelemetry,
            prefix,
            xorKey
        );
    }
}

export { browseAssets } from "./browser.js";
export { getAssetStatus } from "./status.js";
export { manageDownloads } from "./downloads.js";
export { manageInstalledAssets } from "./installed.js";
export { downloadAsset } from "../livery/downloader.js";
export { installDownloadedAsset } from "./assetInstaller.js";
export { loadRegistry, saveRegistry, registerAsset, removeAsset } from "./registry.js";
