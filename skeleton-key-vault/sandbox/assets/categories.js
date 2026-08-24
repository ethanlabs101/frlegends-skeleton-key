export function getCategories(assets) {
    return [
        "All Assets",
        ...new Set(
            assets
                .map(
                    asset =>
                        asset.category ||
                        "uncategorized"
                )
                .sort()
        )
    ];
}

export function filterByCategory(
    assets,
    category
) {
    if(category === "All Assets") {
        return assets;
    }
    return assets.filter(
        asset =>
            (
                asset.category ||
                "uncategorized"
            ) === category
    );
}

export async function selectCategory(
    rl,
    categories,
    assets,
    activeAccountState
) {
    const { drawInterfaceFrame } = await import("../../utils/frame.js");
    const { theme } = await import("../../utils/theme.js");
    const { box } = await import("../../utils/box.js");
    while(true) {
        console.clear();
        drawInterfaceFrame("Category Selection", activeAccountState);
        console.log(box.top());
        box.drawRow(`${theme.warn("Select a Category")}${theme.bpurple(": ")}`);
        console.log(box.mid());
        categories.forEach(
            (category,index)=>{
                box.drawRow(`${theme.bpurple("[")}${theme.warn(index + 1)}${theme.bpurple("]")} ${theme.bwhite(category)}`);
            }
        );
        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("]")} ${theme.bwhite("Back")}`);
        console.log(box.bottom());

        const categoryChoice = (await rl.question(`\n${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Selection")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).trim();
        process.stdout.write(theme.RESET);

        if(categoryChoice === "") {
            return null;
        }
        const categoryIndex =
            Number(categoryChoice) - 1;

        if(!categories[categoryIndex]) {
            await rl.question(`${theme.error("[!] Invalid Selection. Press Enter to retry. ")}\x1b[1;38;2;0;255;255m`);
            process.stdout.write(theme.RESET);
            continue;
        }
        const filtered =
            filterByCategory(
                assets,
                categories[categoryIndex]
            );
        while(true) {
            console.clear();
            drawInterfaceFrame("Asset Selection", activeAccountState);
            console.log(box.top());
            box.drawRow(`${theme.bcyan("Select An Asset")}${theme.bpurple(": ")}`);
            console.log(box.mid());

            filtered.forEach(
                (asset,index)=>{
                    box.drawRow(`${theme.bcyan(index + 1)}${theme.bpurple(")")} ${theme.warn(asset.name)}`);
                    box.drawRow(`   ${theme.bwhite("Author: ")}${theme.bpurple(asset.author || "Unknown")}`);
                    box.drawRow(`   ${theme.bwhite("Model: ")}${theme.bpurple(asset.model || "Unknown")}`);
                    box.drawRow(`   ${theme.bwhite("Type: ")}${theme.bpurple(asset.type || "Unknown")}`);
                    console.log(box.mid());
                }
            );
            box.drawRow(`${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("]")} ${theme.bwhite("Back")}`);
            console.log(box.bottom());

            const assetChoice = (await rl.question(`\n${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Select")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).trim();
            process.stdout.write(theme.RESET);

            if(assetChoice === "") {
                break;
            }
            const selected =
                filtered[
                    Number(assetChoice)-1
                ];
            if(!selected) {
                await rl.question(`${theme.error("[!] Invalid Selection. Press Enter to retry.")}`);
                continue;
            }
            return selected;
        }
    }
}
