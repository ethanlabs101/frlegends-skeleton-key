import got from "got";
import http from "node:http";
import https from "node:https";
import dns from "node:dns";

const SDK_IDENTIFIER = "UnitySDK-2.221.250912";
const ENGINE_VERSION = "2022.3.62f2";

export class PlayFabClient {
    constructor(config = {}) {
        this.titleId = config.titleId || "65C6";
        this.sessionTicket = null;
        this.entityToken = null;
        this.entityId = null;
        this.playFabId = null;

        const agentOptions = { keepAlive: true, lookup: dns.lookup };
        this.http = got.extend({
            prefixUrl: `https://${this.titleId}.playfabapi.com`,
            http2: true,
            responseType: "json",
            agent: {
                http: new http.Agent(agentOptions),
                https: new https.Agent(agentOptions)
            },
            headers: {
                "content-type": "application/json",
                "x-playfabsdk": SDK_IDENTIFIER,
                "x-unity-version": ENGINE_VERSION,
                "accept-encoding": "identity"
            }
        });
    }

    async loginWithEmail(email, password) {
        const response = await this.http.post("Client/LoginWithEmailAddress", {
            json: {
                TitleId: this.titleId,
                Email: email,
                Password: password,
                InfoRequestParameters: { GetUserAccountInfo: true }
            }
        });

        const body = response.body;
        if (body?.error || !body?.data?.SessionTicket) {
            throw new Error(body?.errorMessage || "Authentication failed.");
        }

        this.sessionTicket = body.data.SessionTicket;
        this.entityToken = body.data.EntityToken.EntityToken;
        this.entityId = body.data.EntityToken.Entity?.Id;
        this.playFabId = body.data.InfoResultPayload?.AccountInfo?.PlayFabId;
        return body.data;
    }

    async loginWithDevice(deviceId, createAccount = false) {
        const response = await this.http.post("Client/LoginWithIOSDeviceID", {
            searchParams: { sdk: SDK_IDENTIFIER, engine: ENGINE_VERSION, platform: "iOS" },
            json: {
                TitleId: this.titleId,
                DeviceId: deviceId,
                CreateAccount: createAccount,
                InfoRequestParameters: { GetUserAccountInfo: true }
            }
        });

        const body = response.body;
        if (body?.error || !body?.data?.SessionTicket) {
            throw new Error(body?.errorMessage || "Device login rejected.");
        }

        this.sessionTicket = body.data.SessionTicket;
        this.entityToken = body.data.EntityToken.EntityToken;
        this.entityId = body.data.EntityToken.Entity?.Id;
        this.playFabId = body.data.InfoResultPayload?.AccountInfo?.PlayFabId;
        return body.data;
    }

    async linkEmailCredentials(email, username, password) {
        const response = await this.http.post("Client/AddUsernamePassword", {
            headers: { "x-authorization": this.sessionTicket },
            json: { Email: email, Username: username, Password: password }
        });
        return response.body.data;
    }

    async getFiles() {
        const response = await this.http.post("File/GetFiles", {
            headers: { "x-entitytoken": this.entityToken },
            json: { Entity: { Id: this.entityId, Type: "title_player_account" } }
        });
        return response.body?.data;
    }

    async downloadBlob(url) {
        const response = await got.get(url, { responseType: "buffer" });
        return response.body;
    }

    async initiateFileUploads(fileNames) {
        const response = await this.http.post("File/InitiateFileUploads", {
            headers: { "x-entitytoken": this.entityToken },
            json: { Entity: { Id: this.entityId, Type: "title_player_account" }, FileNames: fileNames }
        });
        return response.body?.data;
    }

    async uploadBlockBlob(url, buffer) {
        await got.put(url, {
            body: buffer,
            headers: { "content-length": buffer.length, "x-ms-blob-type": "BlockBlob" }
        });
    }

    async finalizeFileUploads(fileNames, profileVersion = 0) {
        const response = await this.http.post("File/FinalizeFileUploads", {
            headers: { "x-entitytoken": this.entityToken },
            json: { Entity: { Id: this.entityId, Type: "title_player_account" }, FileNames: fileNames, ProfileVersion: profileVersion }
        });
        return response.body?.data;
    }
    
    logout() {
        this.sessionTicket = null;
        this.entityToken = null;
        this.entityId = null;
        this.playFabId = null;
    }
}
