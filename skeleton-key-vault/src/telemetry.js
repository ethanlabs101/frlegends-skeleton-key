import { decodePd } from "./pd.js";

export async function syncTelemetry(client, activeAccountState) {
    try {
        const files = await client.getFiles();
        if (!files.Metadata?.pd?.DownloadUrl) return;
        const buf = await client.downloadBlob(files.Metadata.pd.DownloadUrl);
        const { json } = await decodePd(buf);

        const decodedCoins = json.mcoins.store.v ^ 340949049;
        const decodedGems = json.mgems.store.v ^ 340949049;

        activeAccountState.balances = {
            totalCars: `${json.cars?.length ?? 0}/${json.carport ?? 0}`,
            playerName: json.playerName ?? "Unknown",
            liveryPass: !!json.liveryCreatorPass,
            playTime: json.totalPlayedTime ?? 0,
            money: decodedCoins,
            gems: decodedGems
        };
    } catch (e) {
        activeAccountState.balances = {
            totalCars: "ERR",
            playerName: "ERR",
            liveryPass: false,
            playTime: "ERR",
            money: 0,
            gems: 0
        };
    }
}
