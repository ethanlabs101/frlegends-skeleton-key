import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import { theme } from "../utils/theme.js";
import { box } from "../utils/box.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function validateStructure(source, template, path = "", errors = []) {
    if (path === "") {
        const mandatoryKeys = [
            "gameVersion",
            "playerName",
            "createTime",
            "savedTime",
            "mcoins",
            "mgems",
            "cars"
        ];
        for (const key of mandatoryKeys) {
            if (!(key in source)) {
                errors.push(`${theme.error("[")}${theme.bwhite("!")}${theme.error("] ")}${theme.warn("CRITICAL: ")}${theme.bwhite(`Missing mandatory key: ${key}`)}`);
            }
        }
    }
    for (const key in template) {
        if (!(key in source)) {
            errors.push(`${theme.error("[")}${theme.bwhite("!")}${theme.error("] ")}${theme.warn("ALERT: ")}${theme.bwhite(`Missing template key: ${path}${key}`)}`);
        } else if (typeof template[key] === 'object' && template[key] !== null && !Array.isArray(template[key])) {
            validateStructure(source[key], template[key], `${path}${key}.`, errors);
        }
    }
    return errors;
}

export async function promptSchemaRisk(mismatchDetails, rl) {
    console.log(`\n${theme.error("[!!!] STRUCTURE MISMATCH DETECTED [!!!]")}`);
    console.log(`${theme.error("[")}${theme.bwhite("!")}${theme.error("] ")}${theme.bwhite(`Reason: ${mismatchDetails}`)}`);
    console.log(`${theme.error("[")}${theme.bwhite("!")}${theme.error("] ")}${theme.warn("WARNING: ")}${theme.bwhite("Pushing an invalid save structure can lead to server-side flags or account corruption.")}`);
    console.log(`${theme.error("[")}${theme.bwhite("!")}${theme.error("] ")}${theme.warn("Recommended Action: ")}${theme.bwhite("ABORT and check your template.")}`);

    const choice = await rl.question(`\n${theme.warn("[")}${theme.bwhite("?")}${theme.warn("] ")}${theme.bwhite("Do you want to PROCEED anyway? ")}${theme.warn("(")}${theme.bwhite("y")}${theme.warn("/")}${theme.bwhite("n")}${theme.warn("): ")}\x1b[1;38;2;0;255;255m`);
    process.stdout.write(theme.RESET);
    return choice.toLowerCase() === 'y';
}

export async function validateFileSystem(rl) {
    const base = path.resolve(__dirname, "..");
    const structure = [
        { path: path.join(base, 'fr_legends_payloads'), name: 'Payloads Folder' },
        { path: path.join(base, 'fr_legends_payloads', 'cars'), name: 'Cars Folder' },
        { path: path.join(base, 'fr_legends_payloads', 'cars', 'stock_cars'), name: 'Stock Car Payloads' },
        { path: path.join(base, 'fr_legends_payloads', 'templates'), name: 'Templates Folder' },
        { path: path.join(base, 'fr_legends_payloads', 'templates', 'master.json'), name: 'Master Template' },
        { path: path.join(base, 'fr_legends_payloads', 'init'), name: 'Init Folder' },
        { path: path.join(base, 'fr_legends_payloads', 'init', 'init_car.json'), name: 'Init Car Data' },
        { path: path.join(base, 'cli.js'), name: 'Entry Point' },
        { path: path.join(base, 'assets'), name: 'Assets Folder' },
        { path: path.join(base, 'assets', 'goodbye.js'), name: 'Goodbye ASCII Art' },
        { path: path.join(base, 'menu'), name: 'Skeleton Key Vault Main Menu Modules Folder' },
        { path: path.join(base, 'menu', 'account_cloning.js'), name: 'Account Cloning Module' },
        { path: path.join(base, 'menu', 'account_recovery.js'), name: 'Account Recovery Module' },
        { path: path.join(base, 'menu', 'calculate_ticks.js'), name: 'DotNetTicks Calculation Module' },
        { path: path.join(base, 'menu', 'error_message.js'), name: 'Format Common Errors Module' },
        { path: path.join(base, 'menu', 'faq.js'), name: 'Project Docs/Git Repo Links Module' },
        { path: path.join(base, 'menu', 'format_playtime.js'), name: 'Format Playtime To Seconds Module' },
        { path: path.join(base, 'menu', 'get_creds.js'), name: 'Credentials Generator/Alerts Module' },
        { path: path.join(base, 'menu', 'validate_system.js'), name: 'System Structure Validation Module' },
        { path: path.join(base, 'sandbox'), name: 'Skeleton Key Vault Sandbox Menu Modules Folder' },
        { path: path.join(base, 'sandbox', 'add_money.js'), name: 'Coins/Gems Modification Menu Module' },
        { path: path.join(base, 'sandbox', 'change_name.js'), name: 'Driver Name Modification Menu Module' },
        { path: path.join(base, 'sandbox', 'delete_car.js'), name: 'Car Deletion Menu Module' },
        { path: path.join(base, 'sandbox', 'exotic_importer.js'), name: 'Car Payload Injection Menu Module' },
        { path: path.join(base, 'sandbox', 'garage_manager.js'), name: 'Garage Viewer / Payload Exporter Menu Module' },
        { path: path.join(base, 'sandbox', 'index.js'), name: 'Sandbox Menu Entry Point + Menu UI Module' },
        { path: path.join(base, 'sandbox', 'live_editor.js'), name: 'Live Car Object Modification Menu Module' },
        { path: path.join(base, 'sandbox', 'livery_pass.js'), name: 'Livery Pass Toggle Menu Module' },
        { path: path.join(base, 'sandbox', 'modify_slots.js'), name: 'Carport Modification Menu Module' },
        { path: path.join(base, 'sandbox', 'playtime_editor.js'), name: 'Playtime Modification Menu Module' },
        { path: path.join(base, 'sandbox', 'save_snapshot.js'), name: '[DEV TOOLS] Save Account Snapshot Module' },
        { path: path.join(base, 'sandbox', 'unlock_menu.js'), name: 'Inject Stock Car Payloads Menu Module' },
        { path: path.join(base, 'sandbox', 'user_data_manager.js'), name: 'User Data Manager Menu Module' },
        { path: path.join(base, 'sandbox', 'view_json.js'), name: '[DEV TOOLS] View JSON Snippet Module' },
        { path: path.join(base, 'sandbox', 'assets'), name: 'Online Asset Manager Modules Folder' },
        { path: path.join(base, 'sandbox', 'assets', 'actions.js'), name: 'Asset Executions Module' },
        { path: path.join(base, 'sandbox', 'assets', 'assetInstaller.js'), name: 'Asset Installation Module' },
        { path: path.join(base, 'sandbox', 'assets', 'browser.js'), name: 'Asset Browser Menu Module' },
        { path: path.join(base, 'sandbox', 'assets', 'categories.js'), name: 'Asset Categories Menu Module' },
        { path: path.join(base, 'sandbox', 'assets', 'details.js'), name: 'Asset Details Menu Module' },
        { path: path.join(base, 'sandbox', 'assets', 'downloads.js'), name: 'Downloaded Assets Menu Module' },
        { path: path.join(base, 'sandbox', 'assets', 'filter.js'), name: 'Filter Menu Logic Module' },
        { path: path.join(base, 'sandbox', 'assets', 'filter_menu.js'), name: 'Filter Menu Module' },
        { path: path.join(base, 'sandbox', 'assets', 'index.js'), name: 'Online Asset Manager Entry Point Module' },
        { path: path.join(base, 'sandbox', 'assets', 'installed.js'), name: 'Installed Asset Menu Module' },
        { path: path.join(base, 'sandbox', 'assets', 'menu.js'), name: 'Online Asset Manager Main Menu Module' },
        { path: path.join(base, 'sandbox', 'assets', 'new.js'), name: 'New Assets Menu Module' },
        { path: path.join(base, 'sandbox', 'assets', 'open.js'), name: 'Visit Asset Database Menu Module' },
        { path: path.join(base, 'sandbox', 'assets', 'packs.js'), name: 'Pack Browser Menu Module' },
        { path: path.join(base, 'sandbox', 'assets', 'registry.js'), name: 'Asset Registry Utility Module' },
        { path: path.join(base, 'sandbox', 'assets', 'router.js'), name: 'Online Asset Manager Menu Routing Module' },
        { path: path.join(base, 'sandbox', 'assets', 'search.js'), name: 'Search Menu Module' },
        { path: path.join(base, 'sandbox', 'assets', 'status.js'), name: 'Asset Status Utility Module' },
        { path: path.join(base, 'sandbox', 'assets', 'types.js'), name: 'Asset Types Utility Module' },
        { path: path.join(base, 'sandbox', 'cars'), name: 'Car Asset Utility Modules Folder' },
        { path: path.join(base, 'sandbox', 'cars', 'cars.js'), name: 'Stock Car Asset Names Module' },
        { path: path.join(base, 'sandbox', 'cars', 'injector.js'), name: 'Online Asset Manager Car Injection Utility Module' },
        { path: path.join(base, 'sandbox', 'livery'), name: 'Online Asset Manager Livery Processing Modules Folder' },
        { path: path.join(base, 'sandbox', 'livery', 'codec.js'), name: 'Livery Binary Codec Module' },
        { path: path.join(base, 'sandbox', 'livery', 'downloader.js'), name: 'Online Asset Manager Downloader Utility Module' },
        { path: path.join(base, 'sandbox', 'livery', 'index.js'), name: 'Livery Utilities Entry Module' },
        { path: path.join(base, 'sandbox', 'livery', 'injector.js'), name: 'Online Asset Manager Livery Injection Utility Module' },
        { path: path.join(base, 'sandbox', 'livery', 'database'), name: 'Online Asset Database Communications Modules Folder' },
        { path: path.join(base, 'sandbox', 'livery', 'database', 'api.js'), name: 'Online Asset Database Api Module'  },
        { path: path.join(base, 'sandbox', 'livery', 'database', 'index.js'), name: 'Online Asset Database Entry Point Module' },
        { path: path.join(base, 'sandbox', 'livery', 'database', 'inspector.js'), name: 'Online Asset Database Asset Inspection Module' },
        { path: path.join(base, 'src'), name: 'Skeleton Key Vault Core Utility Modules Folder' },
        { path: path.join(base, 'src', 'auth.js'), name: 'Authentication Menu + Utility Module' },
        { path: path.join(base, 'src', 'client.js'), name: 'PlayFab Client Wrapper Module' },
        { path: path.join(base, 'src', 'pd.js'), name: 'Player Data Management Utility Module' },
        { path: path.join(base, 'src', 'security.js'), name: 'Skeleton Key Vault Core Database Encryption & Master Key Utilization Module' },
        { path: path.join(base, 'src', 'splash.js'), name: 'Skeleton Key Vault Splash Screen Menu Module' },
        { path: path.join(base, 'src', 'state.js'), name: 'Authentication State Utility Module' },
        { path: path.join(base, 'src', 'telemetry.js'), name: 'Telemetry Sync Utility Module' },
        { path: path.join(base, 'src', 'update.js'), name: 'Skeleton Key Vault Update Checker' },
        { path: path.join(base, 'utils'), name: 'Skeleton Key Vault UI Standardization & Shared Utility Modules Folder' },
        { path: path.join(base, 'utils', 'box.js'), name: 'Skeleton Key Vault CLI Box UI Module' },
        { path: path.join(base, 'utils', 'frame.js'), name: 'Skeleton Key Vault Telemetry Header UI Module' },
        { path: path.join(base, 'utils', 'jitter.js'), name: 'Gaussian Jitter Delay Implementation Module' },
        { path: path.join(base, 'utils', 'theme.js'), name: 'Skeleton Key Vault Custom 24-bit ANSI TrueColor Format UI Standardization Module' }
    ];
    for (const item of structure) {
        if (!fs.existsSync(item.path)) {
            console.log("\n");
            console.log(box.top());
            box.drawRow(`${theme.error("           [")}${theme.bwhite("!!!")}${theme.error("] ")}${theme.bwhite("FILE STRUCTURE ERROR ")}${theme.error("[")}${theme.bwhite("!!!")}${theme.error("] ")}`);
            console.log(box.bottom());
            console.error(`${theme.warn("Missing: ")}${theme.bwhite(`${item.name}`)}`);
            console.error(`${theme.warn("Path: ")}${theme.bwhite(`${item.path}`)}`);
            console.error(`\n${theme.warn("GUIDE:")}`);
            console.error(`${theme.warn("1. ")}${theme.bwhite("Ensure 'cli.js' and '/fr_legends_payloads' are in the same folder.")}`);
            console.error(`${theme.warn("2. ")}${theme.bwhite("Do not move or rename internal files inside 'fr_legends_payloads'.")}`);
            console.error(`${theme.warn("3. ")}${theme.bwhite("If you messed up the folder structure, just redownload the tool.")}`);
            console.error(`${theme.warn("4. ")}${theme.bwhite("Make sure to backup .vault_lock, identity_vault.db, and downloaded content.")}`);
            await rl.question(`\n${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press ")}${theme.bpurple("[")}${theme.bwhite("Enter")}${theme.bpurple("] ")}${theme.bwhite("to exit and fix the files")}${theme.bpurple("... ")}\x1b[1;38;2;0;255;255m`);
            process.stdout.write(theme.RESET);
            process.exit(1);
        }
    }
}
