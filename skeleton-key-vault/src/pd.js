import { gunzip, gzip } from "zlib";
import { promisify } from "util";
const gunzipAsync = promisify(gunzip);
const gzipAsync = promisify(gzip);

const xorBuffer = (buf, key) => Buffer.from(buf.map(b => b ^ key));

export async function decodePd(buffer) {
    for (let key = 0; key < 256; key++) {
        const xored = xorBuffer(buffer, key);
        const idx = xored.indexOf(Buffer.from([0x1f, 0x8b]));

        if (idx !== -1) {
            try {
                const inflated = await gunzipAsync(xored.subarray(idx));
                return { 
                    json: JSON.parse(inflated.toString("utf8")), 
                    prefix: xored.subarray(0, idx), 
                    xorKey: key 
                };
            } catch (e) { continue; }
        }
    }
    throw new Error("Could not decrypt: Data is not a standard XOR+Gzip blob.");
}

export async function encodePd(json, prefix, xorKey) {
    const rawData = JSON.stringify(json);
    const compressed = await gzipAsync(Buffer.from(rawData, "utf8"));
    const fullBuffer = Buffer.concat([prefix, compressed]);
    return xorBuffer(fullBuffer, xorKey);
}
