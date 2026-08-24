import fs from "fs";
import path from "node:path";

const REGISTRY_DIR =
    path.join(
        process.cwd(),
        "fr_legends_payloads",
        "asset_library"
    );

const REGISTRY_FILE = path.join(REGISTRY_DIR, "registry.json");

function ensureRegistry() {
    if(!fs.existsSync(REGISTRY_DIR)) {
        fs.mkdirSync(REGISTRY_DIR, { recursive:true });
    }

    if(!fs.existsSync(REGISTRY_FILE)) {
        fs.writeFileSync(
            REGISTRY_FILE,
            JSON.stringify(
                {
                    version:"1.0",
                    assets:[]
                },
                null,
                4
            )
        );
    }
}

export function loadRegistry() {
    ensureRegistry();
    return JSON.parse(fs.readFileSync(REGISTRY_FILE, "utf8"));
}

export function saveRegistry(data) {
    ensureRegistry();

    fs.writeFileSync(
        REGISTRY_FILE,
        JSON.stringify(
            data,
            null,
            4
        )
    );
}

export function registerAsset(manifest, installPath) {
    const registry = loadRegistry();
    const existing =
        registry.assets.find(
            x =>
            x.id === manifest.id
        );
    const entry = {
        id: manifest.id,
        name: manifest.name,
        model: manifest.model,
        author: manifest.author || "Unknown",
        type: manifest.type,
        category: manifest.category || "uncategorized",
        description: manifest.description || "",
        tags: manifest.tags || [],
        version: manifest.version || "1.0.0",
        installed: true,
        path: installPath,
        preview: manifest.preview || null,
        installedAt: new Date().toISOString()
    };

    if(existing) {
        Object.assign(existing, entry);
    }
    else {
        registry.assets.push(entry);
    }
    saveRegistry(registry);
    return entry;
}

export function removeAsset(id) {
    const registry = loadRegistry();

    registry.assets =
        registry.assets.filter(
            x =>
            x.id !== id
        );
    saveRegistry(registry);
}
