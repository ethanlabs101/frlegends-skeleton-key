#!/usr/bin/env bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
VAULT_DIR="$REPO_ROOT/skeleton-key-vault"

BACKUP_DIR="$REPO_ROOT/.vault-update-backup"
TEMP_DIR="$REPO_ROOT/.vault-update-temp"

printf '\n'
printf '%s\n' '============================================================'
printf '%s\n' '        FR LEGENDS SKELETON KEY VAULT UPDATER'
printf '%s\n' '                    Linux Updater'
printf '%s\n' '============================================================'
printf '\n'

if [ "$(uname -s)" != "Linux" ]; then
    printf '[!] This updater is intended for Linux.\n'
    exit 1
fi

printf '[+] Linux environment detected.\n'

printf '\n[*] Checking current Vault installation...\n'

if [ ! -f "$VAULT_DIR/package.json" ]; then
    printf '[!] Vault installation was not found.\n'
    printf '    Expected:\n'
    printf '    %s/package.json\n' "$VAULT_DIR"
    exit 1
fi

if [ ! -f "$VAULT_DIR/cli.js" ]; then
    printf '[!] cli.js was not found.\n'
    exit 1
fi

printf '[+] Vault installation found.\n'

printf '\n[*] Checking Git...\n'

if ! command -v git >/dev/null 2>&1; then
    printf '[!] Git is not installed.\n'
    printf '    Install Git with your distribution package manager.\n'
    exit 1
fi

printf '[+] Git detected: %s\n' "$(git --version)"

printf '\n'
printf '%s\n' '============================================================'
printf '%s\n' '                    UPDATE WARNING'
printf '%s\n' '============================================================'
printf '\n'
printf 'The application code will be replaced with the latest version.\n'
printf '\n'
printf 'The following local data WILL be preserved:\n'
printf '  .vault.lock\n'
printf '  identity_vault.db\n'
printf '  fr_legends_payloads/\n'
printf '\n'
printf 'The entire fr_legends_payloads/ directory is preserved,\n'
printf 'including local stock cars, init data, and templates.\n'
printf '\n'
printf '[>] Type UPDATE to continue: '
read -r CONFIRM

if [ "$CONFIRM" != "UPDATE" ]; then
    printf '[!] Update cancelled.\n'
    exit 0
fi

printf '\n[*] Cleaning previous updater temporary data...\n'

rm -rf "$BACKUP_DIR"
rm -rf "$TEMP_DIR"

mkdir -p "$BACKUP_DIR"
mkdir -p "$TEMP_DIR"

printf '[+] Temporary directories prepared.\n'

printf '\n[*] Backing up local Vault data...\n'

if [ -e "$VAULT_DIR/.vault.lock" ]; then
    cp -a "$VAULT_DIR/.vault.lock" "$BACKUP_DIR/.vault.lock"
    printf '[+] Preserved: .vault.lock\n'
else
    printf '[*] .vault.lock not present.\n'
fi

if [ -e "$VAULT_DIR/identity_vault.db" ]; then
    cp -a "$VAULT_DIR/identity_vault.db" "$BACKUP_DIR/identity_vault.db"
    printf '[+] Preserved: identity_vault.db\n'
else
    printf '[*] identity_vault.db not present.\n'
fi

if [ -d "$VAULT_DIR/fr_legends_payloads" ]; then
    cp -a "$VAULT_DIR/fr_legends_payloads" "$BACKUP_DIR/fr_legends_payloads"
    printf '[+] Preserved: fr_legends_payloads/\n'
else
    printf '[*] fr_legends_payloads/ not present.\n'
fi

printf '\n[+] Local Vault data backed up successfully.\n'

printf '\n[*] Downloading latest repository...\n'

git clone --depth 1 \
    https://github.com/ethanlabs101/frlegends-skeleton-key.git \
    "$TEMP_DIR/repository"

printf '[+] Latest repository downloaded.\n'

if [ ! -f "$TEMP_DIR/repository/skeleton-key-vault/package.json" ]; then
    printf '[!] Updated repository does not contain skeleton-key-vault/package.json.\n'
    rm -rf "$TEMP_DIR"
    exit 1
fi

if [ ! -f "$TEMP_DIR/repository/skeleton-key-vault/cli.js" ]; then
    printf '[!] Updated repository does not contain skeleton-key-vault/cli.js.\n'
    rm -rf "$TEMP_DIR"
    exit 1
fi

printf '[+] Updated Vault application verified.\n'

printf '\n[*] Preparing updated Vault...\n'

NEW_VAULT_DIR="$TEMP_DIR/repository/skeleton-key-vault"

if [ -e "$BACKUP_DIR/.vault.lock" ]; then
    cp -a "$BACKUP_DIR/.vault.lock" "$NEW_VAULT_DIR/.vault.lock"
    printf '[+] Restored: .vault.lock\n'
fi

if [ -e "$BACKUP_DIR/identity_vault.db" ]; then
    cp -a "$BACKUP_DIR/identity_vault.db" "$NEW_VAULT_DIR/identity_vault.db"
    printf '[+] Restored: identity_vault.db\n'
fi

rm -rf "$NEW_VAULT_DIR/fr_legends_payloads"

if [ -d "$BACKUP_DIR/fr_legends_payloads" ]; then
    cp -a "$BACKUP_DIR/fr_legends_payloads" "$NEW_VAULT_DIR/fr_legends_payloads"
    printf '[+] Restored: fr_legends_payloads/\n'
else
    mkdir -p "$NEW_VAULT_DIR/fr_legends_payloads"
    printf '[+] Created: fr_legends_payloads/\n'
fi

printf '\n[*] Installing updated Vault...\n'

OLD_VAULT_DIR="$REPO_ROOT/.vault-old"

rm -rf "$OLD_VAULT_DIR"

mv "$VAULT_DIR" "$OLD_VAULT_DIR"
mv "$NEW_VAULT_DIR" "$VAULT_DIR"

printf '[+] Updated Vault installed.\n'

printf '\n[*] Installing Node.js dependencies...\n'

cd "$VAULT_DIR"

if [ -f "package-lock.json" ]; then
    npm ci
else
    npm install
fi

printf '[+] Node.js dependencies installed.\n'

printf '\n[*] Testing better-sqlite3...\n'

node -e '
const Database = require("better-sqlite3");
const db = new Database(":memory:");
db.prepare("SELECT 1").get();
db.close();
console.log("[+] better-sqlite3 SQLite test passed.");
'

printf '\n[*] Verifying preserved Vault data...\n'

if [ -e "$VAULT_DIR/.vault.lock" ]; then
    printf '[+] Verified: .vault.lock\n'
else
    printf '[!] WARNING: .vault.lock was not restored.\n'
fi

if [ -e "$VAULT_DIR/identity_vault.db" ]; then
    printf '[+] Verified: identity_vault.db\n'
else
    printf '[!] WARNING: identity_vault.db was not restored.\n'
fi

if [ -d "$VAULT_DIR/fr_legends_payloads" ]; then
    printf '[+] Verified: fr_legends_payloads/\n'
else
    printf '[!] WARNING: fr_legends_payloads/ was not restored.\n'
fi

printf '\n[*] Cleaning temporary update files...\n'

rm -rf "$TEMP_DIR"
rm -rf "$BACKUP_DIR"
rm -rf "$OLD_VAULT_DIR"

printf '[+] Cleanup complete.\n'

printf '\n'
printf '%s\n' '============================================================'
printf '%s\n' '                    UPDATE COMPLETE'
printf '%s\n' '============================================================'
printf '\n'

printf 'FRL Skeleton Key has been updated successfully.\n'
printf '\n'

printf 'Vault location:\n'
printf '  %s\n' "$VAULT_DIR"
printf '\n'

printf 'Launch command:\n'
printf '  cd "%s"\n' "$VAULT_DIR"
printf '  node cli.js\n'
printf '\n'

printf 'PRESERVED DATA:\n'
printf '  .vault.lock\n'
printf '  identity_vault.db\n'
printf '  fr_legends_payloads/\n'
printf '\n'

printf 'The complete fr_legends_payloads/ directory was preserved.\n'
printf '\n'

printf '%s\n' '============================================================'
printf '\n'
