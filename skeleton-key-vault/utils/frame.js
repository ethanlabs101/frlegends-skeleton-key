import { theme } from "../utils/theme.js";
import { box } from "../utils/box.js";
import { formatPlaytime } from "../menu/format_playtime.js";

export function drawInterfaceFrame(title, state) {
    const safeState = state || {
        authenticated: false,
        balances: { totalCars: "N/A", playerName: "N/A", liveryPass: false, playTime: "N/A", money: "N/A", gems: "N/A" }
    };
    process.stdout.write(theme.RESET);
    console.clear();
    console.log(box.top());
    box.drawRow(theme.bcyan(`  FR LEGENDS SKELETON KEY VAULT - ${title.toUpperCase()}`));
    console.log(box.mid());

    const tag = (text) => `${theme.bpurple("[")}${theme.bcyan(text)}${theme.bpurple("]")}`;

    box.drawRow(`  ${tag("STATUS")}     ${theme.bwhite("Session:")} ${safeState.authenticated ? theme.success("[ ON ]") : theme.bred("[ OFF ]")}`);
    box.drawRow(`  ${tag("IDENTITY")}   ${theme.bwhite("ID:")} ${theme.bpurple(`${safeState.playFabId || "N/A"}`)}`);
    box.drawRow(`  ${tag("ACCOUNT")}    ${theme.bwhite("User:")} ${theme.bpurple(`${safeState.currentIdentity || "None (Unauthenticated)"}`)}`);

    if (safeState.authenticated && safeState.balances) {
        const isUnlocked = safeState.balances.liveryPass === true || safeState.balances.liveryPass === "true";
        const passStatus = isUnlocked ? theme.success("UNLOCKED") : theme.error("LOCKED");

        box.drawRow(`  ${tag("TELEMETRY")}  ${theme.bwhite("Garage:")} ${theme.bpurple(`${safeState.balances.totalCars}`)} ${theme.bwhite("Livery Pass: ")}${passStatus}`);
        box.drawRow(`  ${tag("CURRENCY")}   ${theme.bwhite("Money:")} ${theme.bpurple(`${safeState.balances.money}`)} ${theme.bwhite('Coins: ')}${theme.bpurple(`${safeState.balances.gems}`)}`);
        box.drawRow(`  ${tag("PLAYTIME")}   ${theme.bwhite('Playtime: ')}${theme.bpurple(`${formatPlaytime(`${safeState.balances.playTime}`)}`)}`);
        box.drawRow(`  ${tag("PLAYER")}     ${theme.bwhite('Welcome Back: ')}${theme.bpurple(`${safeState.balances.playerName}`)}`);
    }
    console.log(box.bottom());
}
