import { drawInterfaceFrame } from "../utils/frame.js";
import { theme } from "../utils/theme.js";
import { box } from "../utils/box.js";
import { encodePd } from "../src/pd.js";

const SPAM_REPEAT_COUNT = 400;
const SIGNATURE = "-------[ *NAMESPAM BY: github.com/ethanlabs101* ]";

function generateNameSpam(word) {
    return `[${word}]`.repeat(SPAM_REPEAT_COUNT) + SIGNATURE;
}

async function uploadName({
    json,
    client,
    rl,
    activeAccountState,
    syncTelemetry,
    newName,
    prefix,
    xorKey
}) {
    console.log(`${theme.bcyan("\n[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Updating driver name")}${theme.bcyan("...")}`);
    json.playerName = newName;
    const rebuilt = await encodePd(json, prefix, xorKey);

    console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Initiating Upload To Server")}${theme.bcyan("...")}`);
    const init = await client.initiateFileUploads(["pd"]);
    await client.uploadBlockBlob(init.UploadDetails[0].UploadUrl, rebuilt);

    console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Finalizing Upload")}${theme.bcyan("...")}`);
    await client.finalizeFileUploads(["pd"], init.ProfileVersion);

    console.log(`${theme.bcyan("[")}${theme.bwhite("*")}${theme.bcyan("] ")}${theme.bwhite("Syncing Telemetry (May take awhile)")}${theme.bcyan("...")}`);
    await syncTelemetry();

    console.log(`${theme.success("\n[+] Player name successfully updated.")}`);

    drawInterfaceFrame("Change Driver Name", activeAccountState);
    await rl.question(`${theme.bpurple("\n[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Press Enter to continue")}${theme.bpurple("... ")}\x1b[1;38;2;0;255;255m`);
    process.stdout.write(theme.RESET);
}

export async function changeDriverName(
    json,
    rl,
    client,
    activeAccountState,
    syncTelemetry,
    prefix,
    xorKey
) {
    while (true) {
        drawInterfaceFrame("Change Driver Name", activeAccountState);
        console.log(box.top());
        box.drawRow(`${theme.warn("Current Name: ")}${theme.bwhite(json.playerName || "Unknown")}`);
        console.log(box.bottom());
        console.log(box.top());
        box.drawRow(`${theme.bpurple("[")}${theme.warn("1")}${theme.bpurple("] ")}${theme.bwhite("ethanlabs101 Name Spam")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.warn("2")}${theme.bpurple("] ")}${theme.bwhite("Custom Name Spam")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.warn("3")}${theme.bpurple("] ")}${theme.bwhite("Change Name")}`);
        box.drawRow(`${theme.bpurple("[")}${theme.warn("4")}${theme.bpurple("] ")}${theme.bwhite("Empty Name")}`);
        console.log(box.mid());
        box.drawRow(`${theme.bpurple("[")}${theme.warn("Enter")}${theme.bpurple("] ")}${theme.bwhite("Back")}`);
        console.log(box.bottom());

        const selection = (await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Selection")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).trim();
        process.stdout.write(theme.RESET);

        if (selection === "") {
            break;
        }
        if (!["1", "2", "3", "4"].includes(selection)) {
            console.log(`${theme.error("[-] Invalid Selection.")}`);
            await new Promise(resolve => setTimeout(resolve, 800));
            continue;
        }
        if (selection === "1") {
            const spamName = generateNameSpam("ETHANLABS101");

            await uploadName({
                json,
                client,
                rl,
                activeAccountState,
                syncTelemetry,
                newName: spamName,
                prefix,
                xorKey
            });
            continue;
        }
        if (selection === "2") {
            const customWord = (await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Enter one word")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).trim();
            process.stdout.write(theme.RESET);

            if (!customWord) {
                console.log(`${theme.error("[-] Word cannot be empty. ")}`);
                await new Promise(resolve => setTimeout(resolve, 800));
                continue;
            }
            if (/\s/.test(customWord)) {
                console.log(`${theme.error("[-] Please enter one word only.")}`);
                await new Promise(resolve => setTimeout(resolve, 800));
                continue;
            }
            const spamName = generateNameSpam(customWord);

            await uploadName({
                json,
                client,
                rl,
                activeAccountState,
                syncTelemetry,
                newName: spamName,
                prefix,
                xorKey
            });
            continue;
        }
        if (selection === "3") {
            const newName = (await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Enter new name")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).trim();
            process.stdout.write(theme.RESET);

            if (!newName) {
                console.log(`${theme.error("[-] Name cannot be empty. ")}`);
                await new Promise(resolve => setTimeout(resolve, 800));
                continue;
            }
            await uploadName({
                json,
                client,
                rl,
                activeAccountState,
                syncTelemetry,
                newName,
                prefix,
                xorKey
            });
            continue;
        }
        if (selection === "4") {
            await uploadName({
                json,
                client,
                rl,
                activeAccountState,
                syncTelemetry,
                newName: " ",
                prefix,
                xorKey
            });
            continue;
        }
    }
}
