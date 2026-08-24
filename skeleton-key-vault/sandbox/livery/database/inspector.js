import fs from "fs";
import path from "path";

export function inspectAsset(assetPath) {
    const manifestPath = path.join(assetPath, "manifest.json");

    if (!fs.existsSync(manifestPath)) {
        return null;
    }
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

    let info = {
        manifest,
        files:[]
    };

    function scan(dir, prefix="") {
        const entries = fs.readdirSync(dir, {withFileTypes:true});

        for (const entry of entries) {
            const full = path.join(dir, entry.name);

            if(entry.isDirectory()) {
                scan(full, prefix + entry.name + "/");
            } else {
                info.files.push(prefix + entry.name);
            }
        }
    }
    scan(assetPath);
    return info;
}
