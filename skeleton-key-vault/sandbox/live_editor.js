import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { drawInterfaceFrame } from "../utils/frame.js";
import { theme } from "../utils/theme.js";
import { box } from "../utils/box.js";
import { __dirname } from "../cli.js";

export async function runLiveCarEditor(
    json,
    rl,
    activeAccountState,
    performUpload,
    syncTelemetry,
    prefix,
    xorKey
) {
    while (true) {
        drawInterfaceFrame("Live Car Editor", activeAccountState);
        console.log(box.top());
        box.drawRow(`${theme.bcyan("LIVE CAR EDITOR")}`);
        box.drawRow(`${theme.bwhite("Create a modified clone of an existing garage car.")}`);
        box.drawRow(`${theme.bwhite("The original car is never modified directly.")}`);
        console.log(box.bottom());

        if (!json.cars || json.cars.length === 0) {
            console.log(`${theme.error("[-] No cars found in garage.")}`);
            await pause(rl);
            return;
        }
        console.log(box.top());

        json.cars.forEach(
            (car, index) => {
                const name =
                    car.carName?.trim() ||
                    "Unknown";

                box.drawRow(`${theme.bpurple("[")}${theme.warn(index + 1)}${theme.bpurple("] ")}${theme.bwhite(name)} ${theme.bwhite(`(ID: ${car.carSynID})`)}`);
            }
        );
        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("] ")}${theme.bwhite("Back")}`);
        console.log(box.bottom());

        const rawInput = await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Select car")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`);
        process.stdout.write(theme.RESET);

        if (rawInput.trim() === "") {
            return;
        }
        const idx = parseInt(rawInput, 10) - 1;

        if (isNaN(idx) || !json.cars[idx]) {
            console.log(`${theme.error("[-] Invalid selection.")}`);
            await pause(rl);
            continue;
        }
        await stageCarModification(
            json.cars[idx],
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

export async function stageCarModification(
    car,
    json,
    rl,
    activeAccountState,
    performUpload,
    syncTelemetry,
    prefix,
    xorKey
) {
    console.clear();
    drawInterfaceFrame("Stage Car Modification", activeAccountState);
    console.log(box.top());
    box.drawRow(`${theme.warn("STAGING MODIFICATION")}`);
    box.drawRow(`${theme.bwhite("Target: ")}${theme.bcyan(car.carName || "Unknown")}`);
    box.drawRow(`${theme.bwhite("Car ID: ")}${theme.bpurple(car.carSynID)}`);
    console.log(box.mid());
    box.drawRow(`${theme.bwhite("A full account pre-edit backup will be created before editing.")}`);
    console.log(box.bottom());

    const backupName = `PRE_EDIT_${car.carSynID}_${Date.now()}.json`;

    await saveBackupToDisk(
        json,
        backupName,
        activeAccountState
    );

    const confirm = await rl.question(`${theme.warn("[")}${theme.bwhite("?")}${theme.warn("] ")}${theme.bwhite("Proceed to editor? ")}${theme.warn("(")}${theme.bwhite("y")}${theme.warn("/")}${theme.bwhite("n")}${theme.warn(")")}${theme.bwhite(": ")}\x1b[1;38;2;0;255;255m`);
    process.stdout.write(theme.RESET);

    if (confirm.trim().toLowerCase() !== "y") {
        return;
    }
    let draft = JSON.parse(JSON.stringify(car));
    draft = await carEditMenu(draft, rl, activeAccountState);

    console.clear();
    drawInterfaceFrame("Modification Verification", activeAccountState);
    console.log(box.top());
    box.drawRow(`${theme.warn("MODIFICATION STAGING - VERIFICATION")}`);
    console.log(box.mid());
    box.drawRow(`${theme.bwhite("Draft Ready: ")}${theme.bcyan(draft.carName || "Unknown")}`);
    box.drawRow(`${theme.bwhite("Original: ")}${theme.bwhite(car.carName || "Unknown")}`);
    console.log(box.bottom());

    const finalConfirm = await rl.question(`${theme.warn("[?] ")}${theme.bwhite("Inject this modified car into your garage? ")}${theme.warn("(")}${theme.bwhite("y")}${theme.warn("/")}${theme.bwhite("n")}${theme.warn(")")}${theme.warn(": ")}\x1b[1;38;2;0;255;255m`);
    process.stdout.write(theme.RESET);

    if (finalConfirm.trim().toLowerCase() === "y") {
        if (!json.cars) {
            json.cars = [];
        }
        json.cars.push(draft);
        json.carport = (json.carport || 0) + 1;

        console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Syncing modified car to server...")}`);

        await performUpload(
            json,
            prefix,
            xorKey
        );
        await syncTelemetry();

        console.log(`${theme.success("[+] Injection complete.")}`);
        console.log(`${theme.success("[+] ")}${theme.bwhite("Carport increased to: ")}${theme.bpurple(json.carport)}`);
        console.log(`${theme.success("[+] Done ")}\n`);
    } else {
        console.log(`${theme.error("[-] Injection aborted.")}`);
    }
    await pause(rl);
}

async function carEditMenu(
    draft,
    rl,
    activeAccountState
) {
    while (true) {
        console.clear();
        drawInterfaceFrame(`Editing: ${draft.carName || "Unknown"}`, activeAccountState);
        console.log(box.top());
        box.drawRow(`${theme.bcyan("CAR MODIFICATION MENU")}`);
        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.warn("1")}${theme.bpurple("] ")}${theme.bwhite("Modify Wheel Offset (ET) [All 4 rims]")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.warn("2")}${theme.bpurple("] ")}${theme.bwhite("Modify Front Wheel Offset (ET) [FL + FR]")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.warn("3")}${theme.bpurple("] ")}${theme.bwhite("Modify Rear Wheel Offset (ET) [RL + RR]")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.warn("4")}${theme.bpurple("] ")}${theme.bwhite("Rename Car")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.warn("5")}${theme.bpurple("] ")}${theme.bwhite("Modify Tire Health")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.warn("6")}${theme.bpurple("] ")}${theme.bwhite("Remove Body Livery")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.warn("7")}${theme.bpurple("] ")}${theme.bwhite("Remove Window Livery")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.warn("8")}${theme.bpurple("] ")}${theme.bwhite("Remove All Livery")}`);
        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.warn("0")}${theme.bpurple("] ")}${theme.warn("FINISH AND SAVE")}`);
        console.log(box.bottom());

        const choice = (await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Select")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).trim();
        process.stdout.write(theme.RESET);

        if (choice === "1") {
            const val = await getETValue(rl);

            if (val !== null) {
                const rims = [
                    "rimFL",
                    "rimFR",
                    "rimRL",
                    "rimRR"
                ];
                for (const rimKey of rims) {
                    if (draft[rimKey]) {
                        draft[rimKey].ET = val;
                    }
                }
                console.log(`${theme.success(`[+] All rim offsets set to ${val}`)}`);
            }
            await pause(rl);
        }
        else if (choice === "2") {
            const val = await getETValue(rl);

            if (val !== null) {
                const rims = [
                    "rimFL",
                    "rimFR"
                ];
                for (const rimKey of rims) {
                    if (draft[rimKey]) {
                        draft[rimKey].ET = val;
                    }
                }
                console.log(`${theme.success(`[+] Front rim offsets set to ${val}`)}`);
            }
            await pause(rl);
        }
        else if (choice === "3") {
            const val = await getETValue(rl);

            if (val !== null) {
                const rims = [
                    "rimRL",
                    "rimRR"
                ];
                for (const rimKey of rims) {
                    if (draft[rimKey]) {
                        draft[rimKey].ET = val;
                    }
                }
                console.log(`${theme.success(`[+] Rear rim offsets set to ${val}`)}`);
            }
            await pause(rl);
        }
        else if (choice === "4") {
            const newName = (await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Enter new name for ")}${theme.bcyan(draft.carName || "Unknown")}${theme.bwhite(": ")}\x1b[1;38;2;0;255;255m`)).trim();
            process.stdout.write(theme.RESET);

            if (newName.length > 0) {
                draft.carName = newName;

                console.log(`${theme.success(`[+] Car renamed to: ${draft.carName}`)}`);
            } else {
                console.log(`${theme.error("[-] Name cannot be empty.")}`);
            }
            await pause(rl);
        }
        else if (choice === "5") {
            const input = await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Enter tire health (0 - 9999999): ")}\x1b[1;38;2;0;255;255m`);
            process.stdout.write(theme.RESET);

            const value = Number(input.trim());

            if (Number.isInteger(value) && value >= 0 && value <= 9999999) {
                if (!draft.tire) {
                    draft.tire = {};
                }
                draft.tire.health = value;
                console.log(`${theme.success(`[+] Tire health set to ${value}`)}`);
            } else {
                console.log(`${theme.error("[-] Invalid tire health. Use a whole number from 0 to 9999999.")}`);
            }
            await pause(rl);
        }
        else if (choice === "6") {
            if (draft.bodyDecal) {
                draft.bodyDecal = {
                    revision: draft.bodyDecal.revision ?? 1,
                    capacity: draft.bodyDecal.capacity ?? 0,
                    binary: []
                };
            }
            draft.liveryUrl = "";
            console.log(`${theme.success("[+] Body livery removed.")}`);
            await pause(rl);
        }
        else if (choice === "7") {
            if (draft.windowDecal) {
                draft.windowDecal = {
                    revision: draft.windowDecal.revision ?? 1,
                    capacity: draft.windowDecal.capacity ?? 0,
                    binary: []
                };
            }
            console.log(`${theme.success("[+] Window livery removed.")}`);
            await pause(rl);
        }
        else if (choice === "8") {
            if (draft.bodyDecal) {
                draft.bodyDecal = {
                    revision: draft.bodyDecal.revision ?? 1,
                    capacity: draft.bodyDecal.capacity ?? 0,
                    binary: []
                };
            }
            if (draft.windowDecal) {
                draft.windowDecal = {
                    revision: draft.windowDecal.revision ?? 1,
                    capacity: draft.windowDecal.capacity ?? 0,
                    binary: []
                };
            }
            draft.liveryUrl = "";
            console.log(`${theme.success("[+] All livery removed.")}`);
            await pause(rl);
        }
        else if (choice === "0") {
            return draft;
        }
        else {
            console.log(`${theme.error("[-] Invalid selection.")}`);
            await pause(rl);
        }
    }
}

async function getETValue(rl) {
    console.log(box.top());

    box.drawRow(`${theme.warn("RECOMMENDED: ")}${theme.bwhite("Normal ET range is -30 to +30.")}`);
    box.drawRow(`${theme.bwhite("Full supported range: ")}${theme.bcyan("-1,000,000 to +1,000,000")}`);
    console.log(box.bottom());

    const input = await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Enter ET (-1000000 to 1000000): ")}\x1b[1;38;2;0;255;255m`);
    process.stdout.write(theme.RESET);

    const value = Number(input.trim());

    if (!Number.isInteger(value) || value < -1000000 || value > 1000000) {
        console.log(`${theme.error("[-] Invalid ET. Use a whole number from -1000000 to 1000000.")}`);
        return null;
    }
    return value;
}

async function pause(rl) {
    await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press ")}${theme.bpurple("[")}${theme.bwhite("Enter")}${theme.bpurple("] ")}${theme.bwhite("to continue... ")}`);
}

async function saveBackupToDisk(
    data,
    filename,
    activeAccountState
) {
    const safeEmail = activeAccountState.currentIdentity.replace(/[@.]/g, "_");
    const targetDir =
        path.join(
            __dirname,
            "fr_legends_payloads",
            "backups",
            safeEmail
        );
    await mkdir(targetDir, {recursive: true});

    const filePath =
        path.join(
            targetDir,
            filename
        );

    await writeFile(
        filePath,
        JSON.stringify(
            data,
            null,
            4
        ),
        "utf8"
    );
    console.log(`${theme.success("[+] ")}${theme.bwhite("Backup secured in:\n")}${theme.bwhite(`${targetDir}\n`)}`);
}
