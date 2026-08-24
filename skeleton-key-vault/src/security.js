import crypto from 'crypto';
import fs from 'fs';

const HASH_FILE = '.vault.lock';

export const deriveKey = (password) => {
    return crypto.scryptSync(password, 'FR_LEGENDS_STATIC_SALT', 32);
};

export const initializeVault = (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    fs.writeFileSync(HASH_FILE, `${salt}:${hash}`);
};

export const verifyPassword = (password) => {
    if (!fs.existsSync(HASH_FILE)) return false;
    const [salt, storedHash] = fs.readFileSync(HASH_FILE, 'utf8').split(':');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === storedHash;
};

export const encrypt = (text, key) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
};

export const decrypt = (text, key) => {
    try {
        const [ivHex, encrypted] = text.split(':');
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(ivHex, 'hex'));
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (e) {
        return null;
    }
};
