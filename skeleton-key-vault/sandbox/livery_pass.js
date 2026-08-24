import { drawInterfaceFrame } from "../utils/frame.js";
import { theme } from "../utils/theme.js";
import { box } from "../utils/box.js";
import { encodePd } from "../src/pd.js";

export async function toggleLiveryPass(
    client,
    json,
    rl,
    activeAccountState,
    syncTelemetry,
    prefix,
    xorKey
) {
    while (true) {
        const passKey = "liveryCreatorPass";
        const isCurrentlyActive = json[passKey] === true;

        drawInterfaceFrame("Unlock Livery Pass", activeAccountState);
        console.log(box.top());

        const statusStr = isCurrentlyActive ? theme.success("ACTIVE") : theme.error("INACTIVE");
        box.drawRow(`${theme.warn("Livery Pass Status: ")}${statusStr}`);
        console.log(box.bottom());
        console.log(box.top());
        box.drawRow(`${theme.bpurple("[")}${theme.warn("1")}${theme.bpurple("] ")}${theme.bwhite("Toggle State")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("] ")}${theme.bwhite("Back")}`);
        console.log(box.bottom());

        const prompt = `${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Selection: ")}\x1b[1;38;2;0;255;255m`;
        const subChoice = (await rl.question(prompt)).trim().toLowerCase();
        process.stdout.write(theme.RESET);

        if (subChoice === '') break;
        if (subChoice !== '' && subChoice !== '1') {
            console.log(theme.error("[-] Invalid Selection."));
            await new Promise(r => setTimeout(r, 800))
            continue;
        }
        if (subChoice === '1') {
            json[passKey] = !isCurrentlyActive;

            console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Rebuilding and pushing metadata")}${theme.bcyan("...")}`);
            const rebuilt = await encodePd(json, prefix, xorKey);

            console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Initiating Upload To Server")}${theme.bcyan("...")}`);
            const init = await client.initiateFileUploads(["pd"]);
            await client.uploadBlockBlob(init.UploadDetails[0].UploadUrl, rebuilt);

            console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Finalizing Upload")}${theme.bcyan("...")}`);
            await client.finalizeFileUploads(["pd"], init.ProfileVersion);

            console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Syncing Telemetry")}${theme.bcyan("...")}`);
            await syncTelemetry();

            console.log(theme.success("[+] Livery Pass state toggled successfully."));
            await rl.question(`${theme.bpurple("\n[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press ")}${theme.bpurple("[")}${theme.bwhite("Enter")}${theme.bpurple("] ")}${theme.bwhite("to continue")}${theme.bpurple("... ")}\x1b[1;38;2;0;255;255m`);
            process.stdout.write(theme.RESET);
        }
    }
}
