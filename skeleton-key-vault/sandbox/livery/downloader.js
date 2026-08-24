import axios from "axios";
import fs from "fs";
import path from "node:path";
import { theme } from "../../utils/theme.js";
import { box } from "../../utils/box.js";

const DATABASE_RAW = "https://raw.githubusercontent.com/ethanlabs101/FRLegends-Asset-Database/main/";

async function downloadFile(url, destination) {
    const response = await axios.get(url, { responseType: "arraybuffer"});

    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, response.data);
}

async function getManifest(asset) {
    const url = DATABASE_RAW + asset.path + "/manifest.json";
    const response = await axios.get(url);
    return response.data;
}

export async function downloadAsset(asset) {
    const manifest = await getManifest(asset);

    if (!manifest) {
        throw new Error(`${theme.error('[!] Manifest could not be loaded. ')}`);
    }

    if (!manifest.files) {
        throw new Error(`${theme.error('[!] Manifest is missing a files section. ')}`);
    }
    const destination =
        path.join(
            process.cwd(),
            "fr_legends_payloads",
            "downloads",
            asset.model,
            asset.name
        );
    console.log("");
    console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Downloading asset")}${theme.bcyan("...")}`);
    const files = [
        "manifest.json",
        ...Object.values(
            manifest.files
        )
    ];
    const uniqueFiles = [...new Set(files)];
    for (const file of uniqueFiles) {
        const url = DATABASE_RAW + asset.path + "/" + file;
        const target = path.join(destination, file);

        console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite(`${file}`)}${theme.bcyan("... ")}`);
        try {
            await downloadFile(url, target);
        } catch {
            throw new Error(`${theme.error(`[!] Missing asset file: ${file}`)}`);
        }
    }
    console.log("");
    console.log(`${theme.success("[+] Download complete. ")}`);
    return destination;
}
