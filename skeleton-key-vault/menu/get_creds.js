import { theme } from "../utils/theme.js";

export async function getRandomCreds() {
    const { cryptoRandomStringAsync } = await import("crypto-random-string");
    const domains = ["@microsoft.org", "@icloud.com", "@gmail.com", "@yahoo.com", "@google.com", "@bing.com", "@duckduckgo.com", "@tor.onion", "@garbage.lol", "@test.void", "@frl-vault.net", "@mail-tmp.com", "@null-box.org", "@skeleton-key.vault", "@frlegends.com", "@frlegends.org", "@ethanlabs101.git", "@ethanlabs101.com", "@ethanlabs101.dev"];
    const user = await cryptoRandomStringAsync({ length: 10, type: "alphanumeric" });
    const pass = await cryptoRandomStringAsync({ length: 14, type: "alphanumeric" });
    const email = `${user}${Math.floor(Math.random() * 999999)}${domains[Math.floor(Math.random() * domains.length)]}`;
    return { email, user, pass };
}
export async function getManualCreds(rl) {
    return {
        email: (await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Set Email")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).trim(),
        user: (await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Set Username")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).trim(),
        pass: (await rl.question(`${theme.bpurple("[")}${theme.bwhite(">")}${theme.bpurple("] ")}${theme.bwhite("Set Password")}${theme.bpurple(": ")}\x1b[1;38;2;0;255;255m`)).trim()
    };
}
