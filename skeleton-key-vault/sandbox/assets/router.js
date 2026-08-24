import { getCategories, filterByCategory, selectCategory } from "./categories.js";
import { fetchDatabase } from "../livery/database/api.js";
import { manageInstalledAssets } from "./installed.js";
import { manageDownloads } from "./downloads.js";
import { loadRegistry } from "./registry.js";
import { browseAssets } from "./browser.js";
import { openAssetVault } from "./open.js";
import { searchAssets } from "./search.js";
import { newAssetsMenu } from "./new.js";
import { browsePacks } from "./packs.js";
import { assetMenu } from "./details.js";

export async function routeAssetMenu(
    choice,
    json,
    rl,
    activeAccountState,
    performUpload,
    syncTelemetry,
    prefix,
    xorKey
) {
    const db = await fetchDatabase();
    const assets = db.assets || db.cars || [];

    switch(choice) {
        case "1":
            await browseAssets(
                json,
                rl,
                performUpload,
                prefix,
                xorKey,
                activeAccountState,
                syncTelemetry,
                null
            );
            break;

        case "2":
            while(true) {
                const categories = getCategories(assets);

                const selected =
                    await selectCategory(
                        rl,
                        categories,
                        assets,
                        activeAccountState
                    );

                if(!selected) {
                    break;
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
            }
            break;

        case "3":
            const results =
                await searchAssets(
                    rl,
                    assets,
                    activeAccountState
                );

            if(results) {
                await browseAssets(
                    json,
                    rl,
                    performUpload,
                    prefix,
                    xorKey,
                    activeAccountState,
                    syncTelemetry,
                    results
                );
            }
            break;

        case "4":
            await newAssetsMenu(
                rl,
                assets,
                json,
                performUpload,
                syncTelemetry,
                prefix,
                xorKey,
                activeAccountState
            );
            break;

        case "5":
            await manageInstalledAssets(
                rl,
                activeAccountState
            );
            break;

        case "6":
            await manageDownloads(
                rl,
                activeAccountState
            );
            break;

        case "7":
            await browsePacks(
                json,
                rl,
                performUpload,
                prefix,
                xorKey,
                activeAccountState,
                syncTelemetry
            );
            break;

        case "8":
            await openAssetVault(
                rl,
                activeAccountState
            );
            break;
    }
}
