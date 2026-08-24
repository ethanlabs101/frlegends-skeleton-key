import { drawInterfaceFrame } from "../../utils/frame.js";
import { theme } from "../../utils/theme.js";
import { box } from "../../utils/box.js";

function normalize(value) {
    return String(value || "")
        .toLowerCase()
        .trim();
}

function assetSearchText(asset) {
    return [
        asset.name,
        asset.author,
        asset.brand,
        asset.model,
        asset.category,
        asset.type,
        ...(asset.tags || [])
    ]
        .join(" ")
        .toLowerCase();
}

export async function searchAssets(
    rl,
    assets,
    activeAccountState,
    json,
    performUpload,
    prefix,
    xorKey,
    returnTo
) {
    const modes = {
        "1": {
            title: "Asset Name",
            filter: (asset, query) =>
                normalize(asset.name).includes(query)
        },
        "2": {
            title: "Author",
            filter: (asset, query) =>
                normalize(asset.author).includes(query)
        },
        "3": {
            title: "Model",
            filter: (asset, query) =>
                normalize(asset.model).includes(query)
        },
        "4": {
            title: "Brand",
            filter: (asset, query) =>
                normalize(asset.brand).includes(query)
        },
        "5": {
            title: "Category",
            filter: (asset, query) =>
                normalize(asset.category).includes(query)
        },
        "6": {
            title: "Tags",
            filter: (asset, query) =>
                (asset.tags || []).some(
                    tag =>
                        normalize(tag).includes(query)
                )
        },
        "7": {
            title: "Asset Type",
            filter: (asset, query) =>
                normalize(asset.type).includes(query)
        },
        "8": {
            title: "Global Search",
            filter: (asset, query) => {
                const text = assetSearchText(asset);

                const terms = query
                    .split(/\s+/)
                    .filter(Boolean);

                return terms.every(
                    term =>
                        text.includes(term)
                );
            }
        }
    };
    while (true) {
        console.clear();
        drawInterfaceFrame("Asset Search", activeAccountState);
        console.log(box.top());
        box.drawRow(`${theme.warn("Search Assets")}${theme.bpurple(": ")}`);
        console.log(box.mid());

        Object.entries(modes).forEach(
            ([key, value]) => {
                box.drawRow(`${theme.bpurple("[")}${theme.warn(key)}${theme.bpurple("]")} ${theme.bwhite(value.title)}`);
            }
        );
        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("] ")}${theme.bwhite("Back")}`);
        console.log(box.bottom());

        const mode = (await rl.question(`\n${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Search By")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).trim();
        process.stdout.write(theme.RESET);

        if (mode === "") {
            if (returnTo) {
                await returnTo();
            }
            return null;
        }
        if (!modes[mode]) {
            await rl.question(`${theme.error("[!] Invalid Selection. Press Enter to retry. ")}\x1b[1;38;2;0;255;255m`);
            process.stdout.write(theme.RESET);
            continue;
        }
        const query = (await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite(`${modes[mode].title}`)}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).trim().toLowerCase();
        process.stdout.write(theme.RESET);

        if (query === "") {
            continue;
        }
        const results = assets.filter(
            asset =>
                modes[mode].filter(
                    asset,
                    query
                )
        );

        if (results.length === 0) {
            console.clear();
            drawInterfaceFrame("Asset Search", activeAccountState);
            console.log(box.top());
            box.drawRow(`${theme.warn("No matching assets found.")}`);
            console.log(box.mid());
            box.drawRow(`${theme.bcyan("Query: ")}${theme.bwhite(query)}`);
            box.drawRow(`${theme.bcyan("Matches: ")}${theme.bwhite("0")}`);
            console.log(box.bottom());

            await rl.question(`\n${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press Enter To Return")}${theme.bpurple("... ")}\x1b[1;38;2;0;255;255m`);
            process.stdout.write(theme.RESET);
            continue;
        }
        return results;
    }
}
