import fs from "fs";
import path from "node:path";
import { drawInterfaceFrame } from "../../utils/frame.js";
import { theme } from "../../utils/theme.js";
import { box } from "../../utils/box.js";
import { installDownloadedAsset } from "./assetInstaller.js";
import { getAssetStatus } from "./status.js";
import { inspectAsset } from "../livery/database/inspector.js";

const DOWNLOAD_DIR =
    path.join(
        process.cwd(),
        "fr_legends_payloads",
        "downloads"
    );

async function pause(rl){
    await rl.question(`\n${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press Enter To Continue")}${theme.bpurple("... ")}\x1b[1;38;2;0;255;255m`);
    process.stdout.write(theme.RESET);
}

function getDownloads(){
    if(!fs.existsSync(DOWNLOAD_DIR))
        return [];

    const assets=[];

    const models =
        fs.readdirSync(
            DOWNLOAD_DIR,
            {
                withFileTypes:true
            }
        )
        .filter(
            x=>x.isDirectory()
        );

    for(const model of models){
        const modelPath = path.join(DOWNLOAD_DIR, model.name);
        const folders =
            fs.readdirSync(
                modelPath,
                {
                    withFileTypes:true
                }
            )
            .filter(
                x=>x.isDirectory()
            );
        for(const folder of folders){
            const assetPath = path.join(modelPath, folder.name);

            let data=null;

            const manifest = path.join(assetPath, "manifest.json");

            if(fs.existsSync(manifest)){
                try{
                    data =
                        JSON.parse(
                            fs.readFileSync(
                                manifest,
                                "utf8"
                            )
                        );
                }
                catch{
                    data=null;
                }
            }
            assets.push({
                name:
                    data?.name ||
                    folder.name,
                author:
                    data?.author ||
                    "Unknown",
                model:
                    data?.model ||
                    model.name,
                type:
                    data?.type ||
                    "unknown",
                version:
                    data?.version ||
                    "Unknown",
                path:
                    assetPath
            });
        }
    }
    return assets;
}

function searchDownloads(
    assets,
    query
){
    if(!query)
        return assets;

    return assets.filter(
        asset=>{
            return [
                asset.name,
                asset.author,
                asset.model,
                asset.type,
                asset.version
            ]
            .join(" ")
            .toLowerCase()
            .includes(
                query
            );
        }
    );
}

function deleteFolder(
    folder
){
    fs.rmSync(
        folder,
        {
            recursive:true,
            force:true
        }
    );
}

async function assetDetails(
    rl,
    asset,
    activeAccountState
){
    while(true){
        console.clear();
        drawInterfaceFrame("Downloaded Asset", activeAccountState);
        console.log(box.top());
        box.drawRow(`${theme.warn("Download Cache")}${theme.bpurple(": ")}`);
        console.log(box.mid());
        box.drawRow(`${theme.warn("Name")}${theme.bpurple(": ")}${theme.bwhite(`${asset.name}`)}`);
        box.drawRow(`${theme.warn("Author")}${theme.bpurple(": ")}${theme.bwhite(`${asset.author}`)}`);
        box.drawRow(`${theme.warn("Model")}${theme.bpurple(": ")}${theme.bwhite(`${asset.model}`)}`);
        box.drawRow(`${theme.warn("Type")}${theme.bpurple(": ")}${theme.bwhite(`${asset.type}`)}`);
        box.drawRow(`${theme.warn("Version")}${theme.bpurple(": ")}${theme.bwhite(`${asset.version}`)}`);
        box.drawRow(`${theme.warn("Status")}${theme.bpurple(": ")}${theme.bwhite(`${getAssetStatus(asset)}`)}`);

        const details = inspectAsset(asset.path);
        if(details){
            box.drawRow(`${theme.warn("Files")}${theme.bpurple(": ")}${theme.bwhite(`${details.files.length}`)}`);
        }
        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.warn("1")}${theme.bpurple("] ")}${theme.bwhite("Install")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.warn("2")}${theme.bpurple("] ")}${theme.bwhite("View Files")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.warn("3")}${theme.bpurple("] ")}${theme.bwhite("Delete Cache")}`);
        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("] ")}${theme.bwhite("Back")}`);
        console.log(box.bottom());

        const choice = (await rl.question(`${theme.bpurple("\n[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Action")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).trim();
        process.stdout.write(theme.RESET);

        if(choice==="")
            return;

        if(choice==="1"){
            await installDownloadedAsset(asset.path);
            console.log(`${theme.success("\n[+] Installed Successfully.")}`);
            await pause(rl);
        }
        if(choice==="2"){
            console.clear();
            drawInterfaceFrame("Cached Files", activeAccountState);
            console.log(box.top());
            box.drawRow(`${theme.warn('Viewing: ')}${theme.bpurple(`${asset.name}`)}`);
            console.log(box.bottom());
            console.log(box.top());

            if(
                fs.existsSync(
                    asset.path
                )
            ){
                fs.readdirSync(
                    asset.path
                )
                .forEach(
                    file=> 
                    box.drawRow(`${theme.bwhite(file)}`)
                );
            }
            console.log(box.bottom());
            await pause(rl);
        }

        if(choice==="3"){

            const confirm = (await rl.question(`\n${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Delete cached asset? ")}${theme.bpurple("(")}${theme.bwhite("y/n")}${theme.bpurple(")")}${theme.bwhite(": ")}\x1b[1;38;2;0;255;255m`)).trim().toLowerCase();
            process.stdout.write(theme.RESET);

            if(confirm==="y"){

                deleteFolder(
                    asset.path
                );
                console.log(`${theme.success("\n[+] Cache deleted.")}`);
                await pause(rl);
                return;
            }
        }
        if(choice !== "1" && choice !== "2" && choice !== "3" && choice !== '') {
            await rl.question(`${theme.error('[!] Invalid Selection. Press Enter to retry. ')}\x1b[1;38;2;0;255;255m`)
            process.stdout.write(theme.RESET);
            continue;
        }
    }
}

export async function manageDownloads(
    rl,
    activeAccountState=null
){
    let displayAssets=null;

    while(true){
        console.clear();
        drawInterfaceFrame("Downloaded Assets", activeAccountState);

        let assets = getDownloads();

        if(displayAssets)
            assets=displayAssets;

        console.log(box.top());
        box.drawRow(`${theme.warn('Downloaded Assets: ')}${theme.bwhite(`${assets.length}`)}`);
        console.log(box.mid());

        assets.forEach(
            (asset,index)=>{
                box.drawRow(`${theme.bcyan(index+1)}${theme.bpurple(") ")}${theme.warn(asset.name)}`);
                box.drawRow(`   ${theme.bpurple("Model: ")}${theme.bwhite(`${asset.model}`)}`);
                box.drawRow(`   ${theme.bpurple("Type: ")}${theme.bwhite(`${asset.type}`)}`);
                console.log(box.mid());
            }
        );
        box.drawRow(`${theme.bpurple("[")}${theme.warn("S")}${theme.bpurple("] ")}${theme.bwhite("Search")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.warn("C")}${theme.bpurple("] ")}${theme.bwhite("Clear Search")}`);
        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("] ")}${theme.bwhite("Back")}`);
        console.log(box.bottom());

        const choice = (await rl.question(`${theme.bpurple("\n[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Select")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).trim().toLowerCase();
        process.stdout.write(theme.RESET);

        if(choice==="")
            return;

        if(choice==="s"){
            const query = (await rl.question(`${theme.bpurple("\n[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Search")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).trim().toLowerCase();
            process.stdout.write(theme.RESET);

            displayAssets =
                searchDownloads(
                    assets,
                    query
                );
            continue;
        }
        if(choice==="c"){
            displayAssets=null;
            continue;
        }

        const selected =
            assets[
                Number(choice)-1
            ];

        if(selected){
            await assetDetails(
                rl,
                selected,
                activeAccountState
            );
        }
        if(!selected) {
            await rl.question(`${theme.error('[!] Invalid Selection. Press Enter to retry. ')}\x1b[1;38;2;0;255;255m`);
            process.stdout.write(theme.RESET);
        }
    }
}
