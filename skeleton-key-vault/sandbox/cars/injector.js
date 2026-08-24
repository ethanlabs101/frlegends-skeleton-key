import fs from "node:fs";
import path from "node:path";
import { theme } from "../../utils/theme.js";

export async function injectInstalledCar(
    json,
    performUpload,
    syncTelemetry,
    prefix,
    xorKey,
    carPath
) {
    if (!fs.existsSync(carPath)) {
        throw new Error(`${theme.error(`[!] Missing car payload: ${carPath}`)}`);
    }
    const carFile = path.join(carPath, "car.json");

    if (!fs.existsSync(carFile)) {
        throw new Error(`${theme.error("[!] Missing car.json")}`);
    }
    console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Loading car payload")}${theme.bcyan("... ")}`);

    const raw = fs.readFileSync(carFile, "utf8");
    const carData = JSON.parse(raw);

    if (!json.cars) {
        json.cars = [];
    }
    json.cars.push(carData);

    if (json.cars.length > (json.carport || 0)) {
        json.carport = json.cars.length;
    }
    console.log(`${theme.bcyan("\n[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Uploading Car")}${theme.bcyan("... ")}`);

    await performUpload(
        json,
        prefix,
        xorKey
    );
    if (syncTelemetry) {
        await syncTelemetry();
    }
    console.log(`${theme.success("[+] Upload complete. ")}`);
    return true;
}
