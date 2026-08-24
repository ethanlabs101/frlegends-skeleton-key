import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir, readdir, unlink, rm, rename } from "node:fs/promises";
import { drawInterfaceFrame } from "../utils/frame.js";
import { theme } from "../utils/theme.js";
import { box } from "../utils/box.js";
import { loadRegistry, saveRegistry } from "./assets/registry.js";

const moduleFilename = fileURLToPath(import.meta.url);
const moduleDirectory = path.dirname(moduleFilename);
const projectRoot = path.dirname(moduleDirectory);

const DATA_ROOT = path.join(projectRoot, "fr_legends_payloads");
const BACKUPS_DIR = path.join(DATA_ROOT, "backups");
const CARS_DIR = path.join(DATA_ROOT, "cars");
const DOWNLOADS_DIR = path.join(DATA_ROOT, "downloads");
const SNAPSHOTS_DIR = path.join(DATA_ROOT, "snapshots");

async function getDirectoryEntries(directory) {
    await mkdir(directory, { recursive: true });
    return (await readdir(directory, { withFileTypes: true }))
        .sort((a, b) => a.name.localeCompare(b.name));
}

async function confirmDeletion(rl, entryName) {
    const confirmation = await rl.question(`${theme.warn("[")}${theme.bwhite("?")}${theme.warn("] ")}${theme.bwhite(`Delete ${entryName}? `)}${theme.warn("(")}${theme.bwhite("y")}${theme.warn("/")}${theme.bwhite("n")}${theme.warn(")")}${theme.bwhite(": ")}\x1b[1;38;2;0;255;255m`);
    process.stdout.write(theme.RESET);
    return confirmation.trim().toLowerCase() === "y";
}

function removeAssetFromRegistryByName(assetName) {
    const registry = loadRegistry();
    const targetName = assetName.trim().toLowerCase();
    const originalCount = registry.assets.length;

    registry.assets = registry.assets.filter(asset => {
        const registryName = asset.name
            ? asset.name.trim().toLowerCase()
            : "";
        const registryPathName = asset.path
            ? path.basename(asset.path).trim().toLowerCase()
            : "";
        return (
            registryName !== targetName &&
            registryPathName !== targetName
        );
    });
    if (registry.assets.length !== originalCount) {
        saveRegistry(registry);
    }
    return originalCount - registry.assets.length;
}

async function manageBackupEntries(
    rl,
    activeAccountState,
    accountDirectory
) {
    while (true) {
        const entries = await getDirectoryEntries(accountDirectory);

        drawInterfaceFrame("Manage Account Backups", activeAccountState);
        console.log(box.top());
        box.drawRow(`${theme.warn("Account: ")}${theme.bwhite(path.basename(accountDirectory))}`);
        box.drawRow(`${theme.warn("Backup Entries: ")}${theme.bwhite(entries.length)}`);
        console.log(box.bottom());
        console.log(box.top());
        box.drawRow(`${theme.warn("Enter index to delete individual backup")}`);
        console.log(box.mid());

        if (entries.length === 0) {
            box.drawRow(theme.bwhite("No backup entries found."));
        } else {
            entries.forEach((entry, index) => {
                box.drawRow(`${theme.bpurple("[")}${theme.warn(String(index + 1).padStart(2, "0"))}${theme.bpurple("] ")}${theme.bwhite(entry.name)}`);
            });
        }
        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("] ")}${theme.bwhite("Back")}`);
        console.log(box.bottom());

        const choice = (await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Selection: ")}\x1b[1;38;2;0;255;255m`)).trim();
        process.stdout.write(theme.RESET);

        if (choice === "") {
            return;
        }
        const index = Number(choice);

        if (
            !Number.isInteger(index) ||
            index < 1 ||
            index > entries.length
        ) {
            console.log(theme.error("[-] Invalid selection."));

            await new Promise(resolve => setTimeout(resolve, 800));
            continue;
        }
        const entry = entries[index - 1];

        if (await confirmDeletion(rl, entry.name)) {
            const entryPath = path.join(
                accountDirectory,
                entry.name
            );
            if (entry.isDirectory()) {
                await rm(
                    entryPath,
                    {
                        recursive: true,
                        force: true
                    }
                );
            } else {
                await unlink(entryPath);
            }
            console.log(`${theme.success(`[+] Deleted backup: ${entry.name}`)}`);

            await new Promise(resolve => setTimeout(resolve, 800));
        }
    }
}

async function manageBackups(
    rl,
    activeAccountState
) {
    while (true) {
        const accounts = (
            await getDirectoryEntries(BACKUPS_DIR)
        ).filter(
            entry => entry.isDirectory()
        );
        drawInterfaceFrame("Manage Account Backups", activeAccountState);
        console.log(box.top());
        box.drawRow(`${theme.warn("Accounts With Backups: ")}${theme.bwhite(accounts.length)}`);
        console.log(box.bottom());
        console.log(box.top());
        box.drawRow(`${theme.warn("Enter index to manage account backup history")}`);
        console.log(box.mid());

        if (accounts.length === 0) {
            box.drawRow(`${theme.bwhite("No account backup folders found.")}`);
        } else {
            accounts.forEach((account, index) => {
                box.drawRow(`${theme.bpurple("[")}${theme.warn(String(index + 1).padStart(2, "0"))}${theme.bpurple("] ")}${theme.bwhite(account.name)}`);
            });
        }
        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("] ")}${theme.bwhite("Back")}`);
        console.log(box.bottom());

        const choice = (await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Select account: ")}\x1b[1;38;2;0;255;255m`)).trim();
        process.stdout.write(theme.RESET);

        if (choice === "") {
            return;
        }
        const index = Number(choice);

        if (
            !Number.isInteger(index) ||
            index < 1 ||
            index > accounts.length
        ) {
            console.log(theme.error("[-] Invalid selection."));
            await new Promise(resolve => setTimeout(resolve, 800));
            continue;
        }
        await manageBackupEntries(
            rl,
            activeAccountState,
            path.join(
                BACKUPS_DIR,
                accounts[index - 1].name
            )
        );
    }
}

async function renameCarPayload(
    rl,
    activeAccountState,
    entry
) {
    const oldPath = path.join(CARS_DIR, entry.name);

    const rawName = (await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("New payload name (without .json): ")}\x1b[1;38;2;0;255;255m`)).trim();
    process.stdout.write(theme.RESET);

    if (rawName === "") {
        console.log(`${theme.error("[-] Rename cancelled.")}`);
        await new Promise(resolve => setTimeout(resolve, 800));
        return;
    }
    const cleanName = rawName
        .replace(/\.json$/i, "")
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
        .trim();
    if (cleanName === "") {
        console.log(`${theme.error("[-] Invalid payload name.")}`);
        await new Promise(resolve => setTimeout(resolve, 800));
        return;
    }
    const newName = `${cleanName}.json`;

    if (newName === entry.name) {
        console.log(`${theme.warn("[!] Payload already has that name.")}`);
        await new Promise(resolve => setTimeout(resolve, 800));
        return;
    }
    const newPath = path.join(CARS_DIR, newName);
    const existingEntries = await getDirectoryEntries(CARS_DIR);
    if (
        existingEntries.some(
            existingEntry =>
                existingEntry.name.toLowerCase() === newName.toLowerCase()
        )
    ) {
        console.log(`${theme.error("[-] A payload with that name already exists.")}`);
        await new Promise(resolve => setTimeout(resolve, 800));
        return;
    }
    await rename(oldPath, newPath);

    console.log(`${theme.success(`[+] Renamed payload: ${entry.name} -> ${newName}`)}`);
    await new Promise(resolve => setTimeout(resolve, 800));
}

async function manageCars(rl, activeAccountState) {
    while (true) {
        const entries = (
            await getDirectoryEntries(CARS_DIR)
        ).filter(
            entry =>
                entry.isFile() &&
                entry.name.endsWith(".json")
        );
        drawInterfaceFrame("Manage Car Payloads", activeAccountState);
        console.log(box.top());
        box.drawRow(`${theme.warn("Payload Files: ")}${theme.bwhite(entries.length)}`);
        console.log(box.bottom());
        console.log(box.top());
        box.drawRow(`${theme.warn("Enter index to manage payload")}`);
        console.log(box.mid());

        if (entries.length === 0) {
            box.drawRow(`${theme.bwhite("No car payload files found.")}`);
        } else {
            entries.forEach((entry, index) => {
                box.drawRow(`${theme.bpurple("[")}${theme.warn(String(index + 1).padStart(2, "0"))}${theme.bpurple("] ")}${theme.bwhite(entry.name)}`);
            });
        }
        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.warn("R")}${theme.bpurple("] ")}${theme.bwhite("Rename Payload")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.warn("D")}${theme.bpurple("] ")}${theme.bwhite("Delete Payload")}`);
        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("] ")}${theme.bwhite("Back")}`);
        console.log(box.bottom());

        const action = (await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Action: ")}\x1b[1;38;2;0;255;255m`)).trim().toLowerCase();
        process.stdout.write(theme.RESET);

        if (action === "") {
            return;
        }
        if (action !== "r" && action !== "d") {
            console.log(`${theme.error("[-] Invalid selection.")}`);
            await new Promise(resolve => setTimeout(resolve, 800));
            continue;
        }
        if (entries.length === 0) {
            console.log(`${theme.error("[-] No payloads available.")}`);
            await new Promise(resolve => setTimeout(resolve, 800));
            continue;
        }
        const selection = (await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Select payload: ")}\x1b[1;38;2;0;255;255m`)).trim();
        process.stdout.write(theme.RESET);

        const index = Number(selection);

        if (
            !Number.isInteger(index) ||
            index < 1 ||
            index > entries.length
        ) {
            console.log(`${theme.error("[-] Invalid selection.")}`);
            await new Promise(resolve => setTimeout(resolve, 800));
            continue;
        }
        const entry = entries[index - 1];

        if (action === "r") {
            await renameCarPayload(
                rl,
                activeAccountState,
                entry
            );
            continue;
        }
        if (action === "d") {
            if (await confirmDeletion(rl, entry.name)) {
                await unlink(
                    path.join(
                        CARS_DIR,
                        entry.name
                    )
                );
                console.log(`${theme.success(`[+] Deleted payload: ${entry.name}`)}`);
                await new Promise(resolve => setTimeout(resolve, 800));
            }
        }
    }
}

async function manageDownloadedEntries(
    rl,
    activeAccountState,
    modelDirectory
) {
    while (true) {
        const entries = (
            await getDirectoryEntries(modelDirectory)
        ).filter(
            entry => entry.isDirectory()
        );
        drawInterfaceFrame("Manage Downloaded Assets", activeAccountState);
        console.log(box.top());
        box.drawRow(`${theme.warn("Asset Category: ")}${theme.bwhite(path.basename(modelDirectory))}`);
        box.drawRow(`${theme.warn("Installed Assets: ")}${theme.bwhite(entries.length)}`);
        console.log(box.bottom());
        console.log(box.top());
        box.drawRow(`${theme.warn("Enter index to delete individual asset")}`);
        console.log(box.mid());

        if (entries.length === 0) {
            box.drawRow(`${theme.bwhite("No installed assets found.")}`);
        } else {
            entries.forEach((entry, index) => {
                box.drawRow(`${theme.bpurple("[")}${theme.warn(String(index + 1).padStart(2, "0"))}${theme.bpurple("] ")}${theme.bwhite(entry.name)}`);
            });
        }
        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("] ")}${theme.bwhite("Back")}`);
        console.log(box.bottom());

        const choice = (await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Selection: ")}\x1b[1;38;2;0;255;255m`)).trim();
        process.stdout.write(theme.RESET);

        if (choice === "") {
            return;
        }
        const index = Number(choice);

        if (
            !Number.isInteger(index) ||
            index < 1 ||
            index > entries.length
        ) {
            console.log(theme.error("[-] Invalid selection."));
            await new Promise(resolve => setTimeout(resolve, 800));
            continue;
        }
        const entry = entries[index - 1];

        if (await confirmDeletion(rl, entry.name)) {
            const assetPath = path.join(modelDirectory, entry.name);

            await rm(assetPath, { recursive: true, force: true });
            const removedRegistryEntries = removeAssetFromRegistryByName(entry.name);

            console.log(`${theme.success(`[+] Deleted downloaded asset: ${entry.name}`)}`);

            if (removedRegistryEntries > 0) {
                console.log(`${theme.success(`[+] Removed ${removedRegistryEntries} registry entr${removedRegistryEntries === 1 ? "y" : "ies"}.`)}`);
            } else {
                console.log(`${theme.warn("[!] No matching registry entry was found.")}`);
            }
            await new Promise(resolve => setTimeout(resolve, 800));
        }
    }
}

async function manageDownloads(rl, activeAccountState) {
    while (true) {
        const categories = (
            await getDirectoryEntries(DOWNLOADS_DIR)
        ).filter(
            entry => entry.isDirectory()
        );
        drawInterfaceFrame("Manage Downloaded Assets", activeAccountState);
        console.log(box.top());
        box.drawRow(`${theme.warn("Asset Categories: ")}${theme.bwhite(categories.length)}`);
        console.log(box.bottom());
        console.log(box.top());
        box.drawRow(`${theme.warn("Enter index to browse category assets")}`);
        console.log(box.mid());

        if (categories.length === 0) {
            box.drawRow(`${theme.bwhite("No downloaded asset categories found.")}`);
        } else {
            categories.forEach((category, index) => {
                box.drawRow(`${theme.bpurple("[")}${theme.warn(String(index + 1).padStart(2, "0"))}${theme.bpurple("] ")}${theme.bwhite(category.name)}`);
            });
        }
        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("] ")}${theme.bwhite("Back")}`);
        console.log(box.bottom());

        const choice = (await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Select category: ")}\x1b[1;38;2;0;255;255m`)).trim();
        process.stdout.write(theme.RESET);

        if (choice === "") {
            return;
        }
        const index = Number(choice);

        if (
            !Number.isInteger(index) ||
            index < 1 ||
            index > categories.length
        ) {
            console.log(theme.error("[-] Invalid selection."));
            await new Promise(resolve => setTimeout(resolve, 800));
            continue;
        }
        await manageDownloadedEntries(
            rl,
            activeAccountState,
            path.join(
                DOWNLOADS_DIR,
                categories[index - 1].name
            )
        );
    }
}

async function manageSnapshotEntries(
    rl,
    activeAccountState,
    accountDirectory
) {
    while (true) {
        const entries = await getDirectoryEntries(accountDirectory);

        drawInterfaceFrame("Manage Account Snapshots", activeAccountState);
        console.log(box.top());
        box.drawRow(`${theme.warn("Account: ")}${theme.bwhite(path.basename(accountDirectory))}`);
        box.drawRow(`${theme.warn("Snapshot Entries: ")}${theme.bwhite(entries.length)}`);
        console.log(box.bottom());
        console.log(box.top());
        box.drawRow(`${theme.warn("Enter index to delete individual snapshot")}`);
        console.log(box.mid());

        if (entries.length === 0) {
            box.drawRow(`${theme.bwhite("No snapshot entries found.")}`);
        } else {
            entries.forEach((entry, index) => {
                box.drawRow(`${theme.bpurple("[")}${theme.warn(String(index + 1).padStart(2, "0"))}${theme.bpurple("] ")}${theme.bwhite(entry.name)}`);
            });
        }
        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("] ")}${theme.bwhite("Back")}`);
        console.log(box.bottom());

        const choice = (await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Selection: ")}\x1b[1;38;2;0;255;255m`)).trim();
        process.stdout.write(theme.RESET);

        if (choice === "") {
            return;
        }
        const index = Number(choice);

        if (
            !Number.isInteger(index) ||
            index < 1 ||
            index > entries.length
        ) {
            console.log(theme.error("[-] Invalid selection."));
            await new Promise(resolve => setTimeout(resolve, 800));
            continue;
        }
        const entry = entries[index - 1];

        if (await confirmDeletion(rl, entry.name)) {
            const entryPath = path.join(accountDirectory, entry.name);

            if (entry.isDirectory()) {
                await rm(entryPath, {recursive: true, force: true});
            } else {
                await unlink(entryPath);
            }
            console.log(`${theme.success(`[+] Deleted snapshot: ${entry.name}`)}`);
            await new Promise(resolve => setTimeout(resolve, 800));
        }
    }
}

async function manageSnapshots(rl, activeAccountState) {
    while (true) {
        const accounts = (
            await getDirectoryEntries(SNAPSHOTS_DIR)
        ).filter(
            entry => entry.isDirectory()
        );
        drawInterfaceFrame("Manage Snapshots", activeAccountState);
        console.log(box.top());
        box.drawRow(`${theme.warn("Accounts With Snapshots: ")}${theme.bwhite(accounts.length)}`);
        console.log(box.bottom());
        console.log(box.top());
        box.drawRow(`${theme.warn("Enter index to manage account snapshot history")}`);
        console.log(box.mid());

        if (accounts.length === 0) {
            box.drawRow(`${theme.bwhite("No snapshot account folders found.")}`);
        } else {
            accounts.forEach((account, index) => {
                box.drawRow(`${theme.bpurple("[")}${theme.warn(String(index + 1).padStart(2, "0"))}${theme.bpurple("] ")}${theme.bwhite(account.name)}`);
            });
        }
        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("] ")}${theme.bwhite("Back")}`);
        console.log(box.bottom());

        const choice = (await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Select account: ")}\x1b[1;38;2;0;255;255m`)).trim();
        process.stdout.write(theme.RESET);

        if (choice === "") {
            return;
        }
        const index = Number(choice);

        if (
            !Number.isInteger(index) ||
            index < 1 ||
            index > accounts.length
        ) {
            console.log(theme.error("[-] Invalid selection."));
            await new Promise(resolve => setTimeout(resolve, 800));
            continue;
        }
        await manageSnapshotEntries(
            rl,
            activeAccountState,
            path.join(
                SNAPSHOTS_DIR,
                accounts[index - 1].name
            )
        );
    }
}

export async function userDataManager(rl, activeAccountState) {
    while (true) {
        drawInterfaceFrame("User Data Manager", activeAccountState);
        console.log(box.top());
        box.drawRow(`${theme.warn("Manage User-Generated Data")}`);
        console.log(box.bottom());
        console.log(box.top());
        box.drawRow(`${theme.bpurple("[")}${theme.warn("1")}${theme.bpurple("] ")}${theme.bwhite("Account Backups")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.warn("2")}${theme.bpurple("] ")}${theme.bwhite("Car Payloads")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.warn("3")}${theme.bpurple("] ")}${theme.bwhite("Downloaded Assets")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.warn("4")}${theme.bpurple("] ")}${theme.bwhite("Snapshots")}`);
        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("] ")}${theme.bwhite("Return to Sandbox Menu")}`);
        console.log(box.bottom());

        const choice = (await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Selection: ")}\x1b[1;38;2;0;255;255m`)).trim();
        process.stdout.write(theme.RESET);

        switch (choice) {
            case "1":
                await manageBackups(
                    rl,
                    activeAccountState
                );
                break;
            case "2":
                await manageCars(
                    rl,
                    activeAccountState
                );
                break;
            case "3":
                await manageDownloads(
                    rl,
                    activeAccountState
                );
                break;
            case "4":
                await manageSnapshots(
                    rl,
                    activeAccountState
                );
                break;
            case "":
                return;
            default:
                console.log(`${theme.error("[-] Invalid selection.")}`);
                await new Promise(resolve => setTimeout(resolve, 800));
        }
    }
}
