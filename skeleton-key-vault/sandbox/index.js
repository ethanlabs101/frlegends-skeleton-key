import path from "node:path";
import { writeFile, mkdir } from "node:fs/promises";
import { decodePd, encodePd } from "../src/pd.js";
import { drawInterfaceFrame } from "../utils/frame.js";
import { theme } from "../utils/theme.js";
import { box } from "../utils/box.js";
import { deleteCarAndReduceCarport } from "./delete_car.js";
import { runExoticImporter } from "./exotic_importer.js";
import { userDataManager } from "./user_data_manager.js";
import { managePlayTime } from "./playtime_editor.js";
import { openAssetManager } from "./assets/index.js";
import { runLiveCarEditor } from "./live_editor.js";
import { toggleLiveryPass } from "./livery_pass.js";
import { changeDriverName } from "./change_name.js";
import { manageGarage } from "./garage_manager.js";
import { saveSnapshot } from "./save_snapshot.js";
import { modifySlots } from "./modify_slots.js";
import { drawJsonInBox } from "./view_json.js";
import { unlockMenu } from "./unlock_menu.js";
import { manageMoney } from "./add_money.js";

export async function handleSandboxOperations({
    client,
    rl,
    activeAccountState,
    performUpload,
    syncTelemetry
}) {
    try {
        const files = await client.getFiles();
        if (!files.Metadata?.pd?.DownloadUrl) throw new Error("No save data.");
        const buf = await client.downloadBlob(files.Metadata.pd.DownloadUrl);
        const { json, prefix, xorKey } = await decodePd(buf);

        while (true) {
            drawInterfaceFrame("Modding Sandbox Area", activeAccountState);
            console.log(box.top());
            box.drawRow(`${theme.warn("Select an Option ")}${theme.bpurple("[")}${theme.warn("1")}${theme.bpurple("-")}${theme.warn("15")}${theme.bpurple("] ")}`);
            console.log(box.mid());
            box.drawRow(`${theme.bpurple("[")}${theme.warn("01")}${theme.bpurple("] ")}${theme.bpurple("[")}${theme.warn("DEV TOOLS")}${theme.bpurple("] ")}${theme.bwhite("View Raw JSON Snaphot   ")}`);
            box.drawRow(`${theme.bpurple("[")}${theme.warn("02")}${theme.bpurple("] ")}${theme.bpurple("[")}${theme.warn("DEV TOOLS")}${theme.bpurple("] ")}${theme.bwhite("Save Complete Raw JSON Snapshot")}`);
            box.drawRow(`${theme.bpurple("[")}${theme.warn("03")}${theme.bpurple("] ")}${theme.bwhite("Modify Carport Slots")}`);
            box.drawRow(`${theme.bpurple("[")}${theme.warn("04")}${theme.bpurple("] ")}${theme.bwhite("Unlock/Lock Livery Pass")}`);
            box.drawRow(`${theme.bpurple("[")}${theme.warn("05")}${theme.bpurple("] ")}${theme.bwhite("Change Driver Name")}`);
            box.drawRow(`${theme.bpurple("[")}${theme.warn("06")}${theme.bpurple("] ")}${theme.bwhite("Modify Played Time")}`);
            box.drawRow(`${theme.bpurple("[")}${theme.warn("07")}${theme.bpurple("] ")}${theme.bwhite("Currency Menu - Add Money / Coins")}`);
            box.drawRow(`${theme.bpurple("[")}${theme.warn("08")}${theme.bpurple("] ")}${theme.bwhite("Check Garage - Export Car Payloads")}`);
            box.drawRow(`${theme.bpurple("[")}${theme.warn("09")}${theme.bpurple("] ")}${theme.bwhite("Exotic Importer - Inject Car Payloads")}`);
            box.drawRow(`${theme.bpurple("[")}${theme.warn("10")}${theme.bpurple("] ")}${theme.bwhite("Garage Cleanup - Delete Cars")}`);
            box.drawRow(`${theme.bpurple("[")}${theme.warn("11")}${theme.bpurple("] ")}${theme.bwhite("Live Car Editor - Modify Cars In Garage")}`);
            box.drawRow(`${theme.bpurple("[")}${theme.warn("12")}${theme.bpurple("] ")}${theme.bwhite("Online Asset Manager - Cars/Liveries/Packs")}`);
            box.drawRow(`${theme.bpurple("[")}${theme.warn("13")}${theme.bpurple("] ")}${theme.bwhite("Unlock Menu - Inject Stock Cars")}`);
            box.drawRow(`${theme.bpurple("[")}${theme.warn("14")}${theme.bpurple("] ")}${theme.bwhite("User Data Manager - Manage Downloaded Content")}`);
            box.drawRow(`${theme.bpurple("[")}${theme.warn("15")}${theme.bpurple("] ")}${theme.bwhite("Back to Main Routing Menu")}`);
            console.log(box.bottom());

            const choice = (await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Selection")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).trim();
            process.stdout.write(theme.RESET);

            if (choice === "15") break;

            if (choice < 1 || choice > 15) {
                await rl.question(`${theme.error("[-] Invalid Selection. Press Enter To Continue... ")}\x1b[1;38;2;0;255;255m`);
                process.stdout.write(theme.RESET);
            }
            if (choice === "1") {
                await drawJsonInBox(json, rl);
            } else if (choice === "2") {
                await saveSnapshot(json, rl, activeAccountState);
            } else if (choice === "3") {
                await modifySlots(client, json, rl, activeAccountState, syncTelemetry, prefix, xorKey);
            } else if (choice === "4") {
                await toggleLiveryPass(client, json, rl, activeAccountState, syncTelemetry, prefix, xorKey);
            } else if (choice === "5") {
                await changeDriverName(json, rl, client, activeAccountState, syncTelemetry, prefix, xorKey);
            } else if (choice === "6") {
                await managePlayTime(json, rl, activeAccountState, performUpload, syncTelemetry, prefix, xorKey);
            } else if (choice === "7") {
                await manageMoney(json, rl, activeAccountState, performUpload, syncTelemetry, prefix, xorKey);
            } else if (choice === "8") {
                await manageGarage(json, rl, activeAccountState);
            } else if (choice === "9") {
                await runExoticImporter(json, rl, activeAccountState, performUpload, syncTelemetry, prefix, xorKey);
            } else if (choice === "10") {
                await deleteCarAndReduceCarport(json, rl, activeAccountState, performUpload, syncTelemetry, prefix, xorKey);
            } else if (choice === "11") {
                await runLiveCarEditor(json, rl, activeAccountState, performUpload, syncTelemetry, prefix, xorKey);
            } else if (choice === "12") {
                await openAssetManager(json, rl, activeAccountState, performUpload, syncTelemetry, prefix, xorKey);
            } else if (choice === "13") {
                await unlockMenu(json, rl, activeAccountState, performUpload, syncTelemetry, prefix, xorKey);
            } else if (choice === "14") {
                await userDataManager(rl, activeAccountState);
            }
        }
    } catch (err) {
        await rl.question(`\n${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press ")}${theme.bpurple("[")}${theme.bwhite("Enter")}${theme.bpurple("] ")}${theme.bwhite("to continue")}${theme.bpurple("... ")}\x1b[1;38;2;0;255;255m`);
        process.stdout.write(theme.RESET);
    }
}
