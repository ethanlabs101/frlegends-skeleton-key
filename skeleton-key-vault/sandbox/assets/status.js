import fs from "fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "fr_legends_payloads");

function exists(file) {
    return fs.existsSync(file);
}

function checkCar(dir) {
    return exists(
        path.join(
            dir,
            "manifest.json"
        )
    )
    &&
    exists(
        path.join(
            dir,
            "car.json"
        )
    );
}

function checkLivery(dir) {
    return exists(
        path.join(
            dir,
            "manifest.json"
        )
    )
    &&
    (
        exists(
            path.join(
                dir,
                "body.txt"
            )
        )
        ||
        exists(
            path.join(
                dir,
                "compiled"
            )
        )
    );
}

export function getAssetStatus(asset) {
    const model = asset.model;
    const name = asset.name;

    const installedCar =
        path.join(
            ROOT,
            "cars",
            model,
            name
        );
    const installedLivery =
        path.join(
            ROOT,
            "liveries",
            model,
            name
        );
    const downloaded =
        path.join(
            ROOT,
            "downloads",
            model,
            name
        );

    if(checkCar(installedCar)) {
        return "INSTALLED CAR";
    }

    if(checkLivery(installedLivery)) {
        return "INSTALLED LIVERY";
    }

    if(exists(downloaded)) {
        return "DOWNLOADED";
    }
    return "NOT INSTALLED";
}

export function getVersionStatus(asset, registry) {

    const installed =
        registry.assets.find(
            x =>
            x.id === asset.id
        );

    if(!installed) {
        return "NOT INSTALLED";
    }

    if(installed.version !== asset.version) {
        return "UPDATE AVAILABLE";
    }
    return "UP TO DATE";
}
