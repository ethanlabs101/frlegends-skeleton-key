import axios from "axios";

export const LOCAL_VERSION = "2026.08.24";

const UPDATE_URL = "https://raw.githubusercontent.com/ethanlabs101/frlegends-skeleton-key/main/skeleton-key-vault/version.json";

function versionParts(version) {
    return String(version)
        .split(".")
        .map(
            part =>
                Number(part) || 0
        );
}

export function compareVersions(localVersion, remoteVersion) {
    const local = versionParts(localVersion);
    const remote = versionParts(remoteVersion);
    const length = Math.max(local.length, remote.length);

    for(
        let i = 0;
        i < length;
        i++
    ) {
        const localPart = local[i] || 0;
        const remotePart = remote[i] || 0;

        if(remotePart > localPart) {
            return 1;
        }
        if(remotePart < localPart) {
            return -1;
        }
    }
    return 0;
}

export async function checkForUpdates() {
    try {
        const response = await axios.get(UPDATE_URL, { timeout: 5000 });
        const remote = response.data;

        if(!remote || !remote.version) {
            return { available: false, checked: false };
        }
        const comparison = compareVersions(LOCAL_VERSION, remote.version);

        return {
            checked: true,
            available:
                comparison === 1,
            localVersion:
                LOCAL_VERSION,
            remoteVersion:
                remote.version,
            message:
                remote.message ||
                "",
            releaseUrl:
                remote.releaseUrl ||
                "https://github.com/ethanlabs101/frlegends-skeleton-key"
        };
    }
    catch {
        return {
            checked: false,
            available: false
        };
    }
}
