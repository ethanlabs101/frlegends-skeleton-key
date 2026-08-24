import fs from "fs";
import path from "node:path";
import { registerAsset } from "../assets/registry.js";
import { theme } from "../../utils/theme.js";

const ROOT =
    path.join(
        process.cwd(),
        "fr_legends_payloads"
    );

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(
            dir,
            {
                recursive:true
            }
        );
    }
}

function copyFolder(
    source,
    destination
) {
    ensureDir(
        destination
    );
    const entries =
        fs.readdirSync(
            source,
            {
                withFileTypes:true
            }
        );
    for (const entry of entries) {
        const src =
            path.join(
                source,
                entry.name
            );
        const dst =
            path.join(
                destination,
                entry.name
            );
        if (entry.isDirectory()) {
            copyFolder(
                src,
                dst
            );
        } else {
            fs.copyFileSync(
                src,
                dst
            );
        }
    }
}

function normalizeType(type) {

    if (!type)
        return null;
    switch(
        type.toLowerCase()
    ) {
        case "car_livery":
            return "livery";
        case "livery":
            return "livery";
        case "full_car":
            return "full_car";
        case "car":
            return "full_car";
        case "car_only":
            return "full_car";
        default:
            return null;
    }
}

export async function installDownloadedAsset(
    assetPath
) {
    const manifestPath =
        path.join(
            assetPath,
            "manifest.json"
        );
    if (
        !fs.existsSync(
            manifestPath
        )
    ) {
        throw new Error(
            `${theme.error('[!] Missing manifest.json')}`
        );
    }
    const manifest =
        JSON.parse(
            fs.readFileSync(
                manifestPath,
                "utf8"
            )
        );
    const type =
        normalizeType(
            manifest.type
        );
    console.log("");
    console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bcyan("Installing:")}`);
    console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bcyan('Name: ')}${theme.bwhite(`${manifest.name}`)}`);
    console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bcyan('Type: ')}${theme.bwhite(`${type || manifest.type}`)}`);

    if (!type) {
        throw new Error(`${theme.error(`[!] Unknown asset type: ${manifest.type}`)}`);
    }
    let destination;
    if (
        type === "livery"
    ) {
        destination =
            path.join(
                ROOT,
                "liveries",
                manifest.model,
                manifest.name
            );
    }
    if (
        type === "full_car"
    ) {
        destination =
            path.join(
                ROOT,
                "cars",
                manifest.model,
                manifest.name
            );
    }
    copyFolder(
        assetPath,
        destination
    );
    console.log(`${theme.success('\n[+] Installed successfully.')}`);

    registerAsset(
        manifest,
        destination
    );
    console.log(`${theme.success(`[+] Registered: ${manifest.name}`)}`);
    return {...manifest, type};
}
