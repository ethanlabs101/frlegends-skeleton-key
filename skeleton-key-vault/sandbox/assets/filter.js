export function getAssetIndex(assets) {
    const index = {};

    for(const asset of assets) {
        let char =
            asset.name
            .trim()
            .charAt(0)
            .toUpperCase();

        if(!char) {
            char = "#";
        }
        if(!/[A-Z0-9]/.test(char)) {
            char = "#";
        }
        if(!index[char]) {
            index[char] = [];
        }
        index[char].push(asset);
    }
    return index;
}

export function printAssetFilters(index) {
    const keys =
        Object.keys(index)
        .sort((a,b)=>{
            if(a === "#") return 1;
            if(b === "#") return -1;

            return a.localeCompare(b);
        });
    console.log("\nAvailable Filters:\n");

    for(const key of keys) {
        console.log(`[${key}] ${index[key].length} asset(s)`);
    }
    console.log("[$] All Assets");
}

export function filterAssets(assets, character) {

    if(character === "$") {
        return assets;
    }

    const target = character.toUpperCase();

    return assets.filter(
        asset=>{
            let first =
                asset.name
                .trim()
                .charAt(0)
                .toUpperCase();

            if(!/[A-Z0-9]/.test(first)) {
                first="#";
            }
            return first === target;
        }
    );
}
