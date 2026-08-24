import fs from "fs";
import { drawInterfaceFrame } from "../../utils/frame.js";
import { theme } from "../../utils/theme.js";
import { box } from "../../utils/box.js";
import { loadRegistry, removeAsset } from "./registry.js";

async function pause(rl){
    await rl.question(`\n${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press Enter")}${theme.bpurple("... ")}\x1b[1;38;2;0;255;255m`);
    process.stdout.write(theme.RESET);
}

async function searchMenu(
    rl,
    assets,
    activeAccountState
){
    const query = (await rl.question(`\n${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Search")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).trim().toLowerCase();
    process.stdout.write(theme.RESET);

    if(!query)
        return assets;

    return assets.filter(
        asset =>
        [
            asset.name,
            asset.author,
            asset.model,
            asset.type,
            asset.version
        ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
}

async function viewManifest(
    rl,
    asset,
    activeAccountState
){
    console.clear();
    drawInterfaceFrame("Asset Manifest", activeAccountState);
    console.log(box.top());
    box.drawRow(`${theme.warn("Asset Manifest Dump")}${theme.bpurple(": ")}`);
    console.log(box.bottom());
    console.log(box.top());
    Object.entries(asset)
    .forEach(
        ([key,value])=>{
            box.drawRow(
                `${theme.warn(`${key}`)}${theme.bpurple(`: `)}${
                    Array.isArray(value)
                    ? theme.bwhite(value.join(", "))
                    : theme.bwhite(value)
                }`
            );
        }
    );
    console.log(box.bottom());
    await pause(rl);
}

async function viewFiles(
    rl,
    asset,
    activeAccountState
){

    console.clear();
    drawInterfaceFrame("Installed Files", activeAccountState);
    console.log(box.top());

    if(fs.existsSync(asset.path)){
        const files = fs.readdirSync(asset.path);
            box.drawRow(`${theme.warn("Total Files: ")}${theme.bpurple(`${files.length}`)}`);
            console.log(box.bottom());
            console.log(box.top());
        files.forEach(
            file =>
                box.drawRow(`${theme.bwhite(file)}`)
        );
    }
    else{
        box.drawRow(`${theme.error("Asset folder missing.")}`);
    }
    console.log(box.bottom());
    await pause(rl);
}

async function deleteAsset(
    rl,
    asset
){
    const confirm = (await rl.question(`\n${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Delete asset? ")}${theme.bpurple("(")}${theme.bwhite("y/n")}${theme.bpurple("): ")}\x1b[1;38;2;0;255;255m`)).trim().toLowerCase();
    process.stdout.write(theme.RESET);

    if(confirm !== "y")
        return;

    try{
        if(fs.existsSync(asset.path)){
            fs.rmSync(
                asset.path,
                {
                    recursive:true,
                    force:true
                }
            );
        }
        removeAsset(asset.id);
        console.log(`${theme.success("\n[+] Asset deleted.")}`);
    }
    catch(err){
        console.log(`${theme.error(err.message)}`);
    }
    await pause(rl);
}

async function installedAssetMenu(
    rl,
    asset,
    activeAccountState
){
    while(true){
        console.clear();
        drawInterfaceFrame(asset.name, activeAccountState);
        console.log(box.top());
        box.drawRow(`${theme.warn("Now Viewing: ")}${theme.bpurple(`${asset.name}`)}`);
        console.log(box.bottom());
        console.log(box.top());
        box.drawRow(`${theme.warn('Name')}${theme.bpurple(': ')}${theme.bwhite(`${asset.name}`)}`);
        box.drawRow(`${theme.warn('Author')}${theme.bpurple(': ')}${theme.bwhite(`${asset.author || "Unknown"}`)}`);
        box.drawRow(`${theme.warn('Model')}${theme.bpurple(': ')}${theme.bwhite(`${asset.model || "Unknown"}`)}`);
        box.drawRow(`${theme.warn('Type')}${theme.bpurple(': ')}${theme.bwhite(`${asset.type || "Unknown"}`)}`);
        box.drawRow(`${theme.warn('Version')}${theme.bpurple(': ')}${theme.bwhite(`${asset.version || "Unknown"}`)}`);
        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.warn("1")}${theme.bpurple("] ")}${theme.bwhite("View Manifest")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.warn("2")}${theme.bpurple("] ")}${theme.bwhite("View Files")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.warn("3")}${theme.bpurple("] ")}${theme.bwhite("Delete Asset")}`);
        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("] ")}${theme.bwhite("Back")}`);
        console.log(box.bottom());

        const choice = (await rl.question(`\n${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Action")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).trim();
        process.stdout.write(theme.RESET);

        if(choice==="")
            return;

        if(choice==="1"){
            await viewManifest(
                rl,
                asset,
                activeAccountState
            );
        }
        if(choice==="2"){
            await viewFiles(
                rl,
                asset,
                activeAccountState
            );
        }
        if(choice==="3"){
            await deleteAsset(
                rl,
                asset
            );
            return;
        }
        if(choice !== '' && choice !== "1" && choice !== "2" && choice !== "3"){
        await rl.question(`${theme.error('[!] Invalid Selection. Press Enter to retry. ')}\x1b[1;38;2;0;255;255m`);
        process.stdout.write(theme.RESET);
        }
    }
}

export async function manageInstalledAssets(
    rl,
    activeAccountState=null
){
    let displayAssets = null;
    while(true){
        console.clear();
        drawInterfaceFrame("Installed Assets", activeAccountState);
        const registry =
            loadRegistry();
        let assets =
            registry.assets || [];
        if(displayAssets)
            assets = displayAssets;
        console.log(box.top());
        box.drawRow(`${theme.warn('Total Installed Assets')}${theme.bpurple(': ')}${theme.bwhite(`${assets.length}`)}`);
        console.log(box.bottom());
        console.log(box.top());

        if(assets.length === 0){
            box.drawRow(`${theme.warn("No installed assets.")}`);
        }
        assets.forEach(
            (asset,index)=>{
                box.drawRow(`${theme.bcyan(index+1)}${theme.bpurple(")")} ${theme.warn(asset.name)}`);
                box.drawRow(`   ${theme.bpurple("Model: ")}${theme.bwhite(`${asset.model || "Unknown"}`)}`);
                box.drawRow(`   ${theme.bpurple("Type: ")}${theme.bwhite(`${asset.type || "Unknown"}`)}`);
                console.log(box.mid());
            }
        );
        box.drawRow(`${theme.bpurple("[")}${theme.warn("S")}${theme.bpurple("] ")}${theme.bwhite("Search")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.warn("C")}${theme.bpurple("] ")}${theme.bwhite("Clear Search")}`);
        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("] ")}${theme.bwhite("Back")}`);
        console.log(box.bottom());

        const choice = (await rl.question(`\n${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Select")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).trim().toLowerCase();
        process.stdout.write(theme.RESET);
 
        if(choice==="")
            return;
        if(choice==="s"){
            displayAssets = await searchMenu(rl, assets);
            continue;
        }
        if(choice==="c"){
            displayAssets = null;
            continue;
        }
        const selected = assets[Number(choice)-1];

        if(selected){
            await installedAssetMenu(
                rl,
                selected,
                activeAccountState
            );
        }
        if(!selected){
            await rl.question(`${theme.error('[!] Invalid Selection. Press Enter to retry. ')}\x1b[1;38;2;0;255;255m`);
            process.stdout.write(theme.RESET);
        }
    }
}
