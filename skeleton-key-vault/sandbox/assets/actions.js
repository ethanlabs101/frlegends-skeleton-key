import path from "node:path";
import { injectInstalledLivery } from "../livery/injector.js";
import { injectInstalledCar } from "../cars/injector.js";
import { theme } from "../../utils/theme.js";

const assetHandlers = {
    livery: async (
        manifest,
        json,
        rl,
        performUpload,
        syncTelemetry,
        prefix,
        xorKey
    ) => {
        console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Applying livery")}${theme.bcyan("... ")}`);

        const success = await injectInstalledLivery(
            json,
            rl,
            performUpload,
            syncTelemetry,
            prefix,
            xorKey,
            manifest.model,
            manifest.name
        );

        if (success) {
            console.log(`${theme.success("[+] Livery applied. ")}`);
        }
    },
    car_livery: async (
        manifest,
        json,
        rl,
        performUpload,
        syncTelemetry,
        prefix,
        xorKey
    ) => {
        console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Applying livery")}${theme.bcyan("... ")}`);

        const success = await injectInstalledLivery(
            json,
            rl,
            performUpload,
            syncTelemetry,
            prefix,
            xorKey,
            manifest.model,
            manifest.name
        );

        if (success) {
            console.log(`${theme.success("[+] Livery applied. ")}`);
        }
    },
    full_car: async (
        manifest,
        json,
        rl,
        performUpload,
        syncTelemetry,
        prefix,
        xorKey
    ) => {
        console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Injecting full car")}${theme.bcyan("... ")}`);

        const carPath = path.join(
            process.cwd(),
            "fr_legends_payloads",
            "cars",
            manifest.model,
            manifest.name
        );
        const success = await injectInstalledCar(
            json,
            performUpload,
            syncTelemetry,
            prefix,
            xorKey,
            carPath
        );

        if (success) {
            console.log(`${theme.success("[+] Full car injected.")}`);
        }
    }
};

export async function executeAssetAction(
    manifest,
    json,
    rl,
    performUpload,
    syncTelemetry,
    prefix,
    xorKey
) {
    const handler = assetHandlers[manifest.type];

    if (!handler) {
        console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite(`No action handler for: ${manifest.type}`)}`);
        return;
    }

    await handler(
        manifest,
        json,
        rl,
        performUpload,
        syncTelemetry,
        prefix,
        xorKey
    );
}
