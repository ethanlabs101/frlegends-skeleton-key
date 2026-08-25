#!/usr/bin/env bash

set -e

REPO_URL="https://github.com/ethanlabs101/frlegends-skeleton-key.git"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INSTALL_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

VAULT_DIR="$INSTALL_ROOT/skeleton-key-vault"
TEMP_DIR="/tmp/frl-skeleton-key-update"

printf '\n'
printf '%s\n' '============================================================'
printf '%s\n' '        FR LEGENDS SKELETON KEY VAULT UPDATER'
printf '%s\n' '                    Termux / Debian'
printf '%s\n' '============================================================'
printf '\n'

printf '[*] Checking runtime environment...\n'

if [ ! -f /etc/debian_version ]; then
    printf '[!] This updater must be run inside the Debian proot environment.\n'
    printf '\n'
    printf '    Enter Debian first, then run:\n'
    printf '    ./updaters/update-termux.sh\n'
    printf '\n'
    exit 1
fi

printf '[+] Debian environment detected.\n'

printf '\n[*] Checking Git...\n'

if ! command -v git >/dev/null 2>&1; then
    printf '[!] Git is not installed.\n'
    printf '[*] Installing Git...\n'

    apt-get update
    apt-get install -y git

    printf '[+] Git installed.\n'
else
    printf '[+] Git detected: '
    git --version
fi

printf '\n[*] Checking current Vault installation...\n'

if [ ! -f "$VAULT_DIR/package.json" ]; then
    printf '[!] FRL Skeleton Key installation was not found.\n'
    printf '\n'
    printf '    Expected:\n'
    printf '    %s\n' "$VAULT_DIR"
    printf '\n'
    printf '[!] Run the installer first.\n'
    exit 1
fi

if [ ! -f "$VAULT_DIR/cli.js" ]; then
    printf '[!] cli.js was not found.\n'
    printf '    Expected: %s/cli.js\n' "$VAULT_DIR"
    exit 1
fi

printf '[+] Existing Vault installation found.\n'

printf 'Vault location:\n'
printf '  %s\n' "$VAULT_DIR"

printf '\n[*] Reading current version...\n'

CURRENT_VERSION="Unknown"

if [ -f "$VAULT_DIR/version.json" ]; then
    CURRENT_VERSION="$(
        grep -oE '[0-9]{4}\.[0-9]{2}\.[0-9]{2}' \
        "$VAULT_DIR/version.json" | head -n 1
    )"

    if [ -z "$CURRENT_VERSION" ]; then
        CURRENT_VERSION="Unknown"
    fi
fi

printf '[+] Current version: %s\n' "$CURRENT_VERSION"

printf '\n[*] Downloading latest repository...\n'

rm -rf "$TEMP_DIR"

mkdir -p "$TEMP_DIR"

printf '[*] Repository: %s\n' "$REPO_URL"
printf '[*] Temporary location: %s\n' "$TEMP_DIR/repository"
printf '\n'

git clone --depth 1 "$REPO_URL" "$TEMP_DIR/repository"

printf '\n[+] Repository downloaded successfully.\n'

LATEST_VAULT_DIR="$TEMP_DIR/repository/skeleton-key-vault"

printf '\n[*] Checking downloaded Vault...\n'

if [ ! -f "$LATEST_VAULT_DIR/package.json" ]; then
    printf '[!] Downloaded repository does not contain:\n'
    printf '    skeleton-key-vault/package.json\n'

    rm -rf "$TEMP_DIR"
    exit 1
fi

if [ ! -f "$LATEST_VAULT_DIR/cli.js" ]; then
    printf '[!] Downloaded repository does not contain:\n'
    printf '    skeleton-key-vault/cli.js\n'

    rm -rf "$TEMP_DIR"
    exit 1
fi

printf '[+] Downloaded Vault application found.\n'

LATEST_VERSION="Unknown"

if [ -f "$LATEST_VAULT_DIR/version.json" ]; then
    LATEST_VERSION="$(
        grep -oE '[0-9]{4}\.[0-9]{2}\.[0-9]{2}' \
        "$LATEST_VAULT_DIR/version.json" | head -n 1
    )"

    if [ -z "$LATEST_VERSION" ]; then
        LATEST_VERSION="Unknown"
    fi
fi

printf '[+] Latest version: %s\n' "$LATEST_VERSION"

if [ "$CURRENT_VERSION" = "$LATEST_VERSION" ] &&
   [ "$CURRENT_VERSION" != "Unknown" ]; then

    printf '\n'
    printf '[+] FRL Skeleton Key is already up to date.\n'
    printf '\n'

    rm -rf "$TEMP_DIR"
    exit 0
fi

printf '\n'
printf '[!] Update available.\n'
printf '\n'
printf 'Current version: %s\n' "$CURRENT_VERSION"
printf 'Latest version:  %s\n' "$LATEST_VERSION"
printf '\n'

printf '[>] Type UPDATE to continue: '
read -r CONFIRM

if [ "$CONFIRM" != "UPDATE" ]; then
    printf '[!] Update cancelled.\n'

    rm -rf "$TEMP_DIR"
    exit 0
fi

printf '\n'
printf '[*] Creating persistent data backup...\n'

BACKUP_DIR="/tmp/frl-vault-backup"

rm -rf "$BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

if [ -f "$VAULT_DIR/.vault.lock" ]; then
    cp -a "$VAULT_DIR/.vault.lock" "$BACKUP_DIR/"
    printf '[+] Preserved: .vault.lock\n'
else
    printf '[*] Not present: .vault.lock\n'
fi

if [ -f "$VAULT_DIR/identity_vault.db" ]; then
    cp -a "$VAULT_DIR/identity_vault.db" "$BACKUP_DIR/"
    printf '[+] Preserved: identity_vault.db\n'
else
    printf '[*] Not present: identity_vault.db\n'
fi

if [ -d "$VAULT_DIR/fr_legends_payloads" ]; then
    cp -a "$VAULT_DIR/fr_legends_payloads" "$BACKUP_DIR/"
    printf '[+] Preserved: fr_legends_payloads/\n'
else
    printf '[*] Not present: fr_legends_payloads/\n'
fi

printf '[+] Persistent data backup complete.\n'

printf '\n[*] Replacing application files...\n'

cd "$INSTALL_ROOT"

TEMP_VAULT="$TEMP_DIR/new-vault"

cp -a "$LATEST_VAULT_DIR" "$TEMP_VAULT"

rm -rf "$VAULT_DIR"

mv "$TEMP_VAULT" "$VAULT_DIR"

printf '[+] Application files replaced.\n'

printf '\n[*] Restoring persistent Vault data...\n'

if [ -f "$BACKUP_DIR/.vault.lock" ]; then
    cp -a "$BACKUP_DIR/.vault.lock" "$VAULT_DIR/"
    printf '[+] Restored: .vault.lock\n'
fi

if [ -f "$BACKUP_DIR/identity_vault.db" ]; then
    cp -a "$BACKUP_DIR/identity_vault.db" "$VAULT_DIR/"
    printf '[+] Restored: identity_vault.db\n'
fi

if [ -d "$BACKUP_DIR/fr_legends_payloads" ]; then
    rm -rf "$VAULT_DIR/fr_legends_payloads"

    cp -a \
        "$BACKUP_DIR/fr_legends_payloads" \
        "$VAULT_DIR/"

    printf '[+] Restored: fr_legends_payloads/\n'
fi

printf '[+] Persistent Vault data restored.\n'

printf '\n[*] Installing updated Node.js dependencies...\n'

cd "$VAULT_DIR"

if [ -f package-lock.json ]; then
    npm ci
else
    npm install
fi

printf '\n[+] Node.js dependencies installed.\n'

printf '\n[*] Testing better-sqlite3...\n'

node - <<'NODE'
const Database = require("better-sqlite3");

const db = new Database(":memory:");

db.prepare("SELECT 1").get();

db.close();

console.log("[+] better-sqlite3 SQLite test passed.");
NODE

printf '\n[*] Verifying preserved Vault data...\n'

if [ -f "$VAULT_DIR/.vault.lock" ]; then
    printf '[+] Verified: .vault.lock\n'
else
    printf '[*] Not present: .vault.lock\n'
fi

if [ -f "$VAULT_DIR/identity_vault.db" ]; then
    printf '[+] Verified: identity_vault.db\n'
else
    printf '[*] Not present: identity_vault.db\n'
fi

if [ -d "$VAULT_DIR/fr_legends_payloads" ]; then
    printf '[+] Verified: fr_legends_payloads/\n'
else
    printf '[!] fr_legends_payloads/ is missing.\n'
    exit 1
fi

printf '\n[*] Cleaning temporary update files...\n'

rm -rf "$TEMP_DIR"
rm -rf "$BACKUP_DIR"

printf '[+] Temporary files removed.\n'

printf '\n'
printf '%s\n' '============================================================'
printf '%s\n' '                    UPDATE COMPLETE'
printf '%s\n' '============================================================'
printf '\n'

printf 'Previous version:\n'
printf '  %s\n' "$CURRENT_VERSION"

printf '\n'

printf 'Installed version:\n'
printf '  %s\n' "$LATEST_VERSION"

printf '\n'

printf 'Vault location:\n'
printf '  %s\n' "$VAULT_DIR"

printf '\n'

printf 'Launch command:\n'
printf '  cd "%s"\n' "$VAULT_DIR"
printf '  node cli.js\n'

printf '\n'

printf 'Preserved:\n'
printf '  .vault.lock\n'
printf '  identity_vault.db\n'
printf '  fr_legends_payloads/\n'

printf '\n'

printf '%s\n' '============================================================'
printf '\n'
