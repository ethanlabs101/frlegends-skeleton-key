#!/data/data/com.termux/files/usr/bin/bash

set -e

REPO_URL="https://github.com/ethanlabs101/frlegends-skeleton-key.git"

TERMUX_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TERMUX_VAULT_DIR="$TERMUX_ROOT/skeleton-key-vault"

DEBIAN_ROOT="/root/frlegends-skeleton-key"
DEBIAN_SOURCE_DIR="$DEBIAN_ROOT/source"
DEBIAN_VAULT_DIR="$DEBIAN_SOURCE_DIR/skeleton-key-vault"

TEMP_DIR="/tmp/frl-skeleton-key-update"

printf '\n'
printf '%s\n' '============================================================'
printf '%s\n' '        FR LEGENDS SKELETON KEY VAULT UPDATER'
printf '%s\n' '                    Termux / Debian'
printf '%s\n' '============================================================'
printf '\n'

if [ -z "$PREFIX" ] || [ ! -d "$PREFIX" ]; then
    printf '[!] This updater must be run inside Termux.\n'
    exit 1
fi

printf '[+] Termux environment detected.\n'

printf '\n[*] Checking proot-distro...\n'

if ! command -v proot-distro >/dev/null 2>&1; then
    printf '[!] proot-distro is not installed.\n'
    printf '[!] Run the Termux installer first.\n'
    exit 1
fi

printf '[+] proot-distro detected.\n'

printf '\n[*] Checking Debian environment...\n'

if ! proot-distro login debian -- bash -c 'exit 0' >/dev/null 2>&1; then
    printf '[!] Debian proot environment was not found.\n'
    printf '[!] Run the Termux installer first.\n'
    exit 1
fi

printf '[+] Debian environment detected.\n'

printf '\n[*] Checking installed FRL Vault...\n'

if ! proot-distro login debian -- bash -c "test -f '$DEBIAN_VAULT_DIR/package.json'"; then
    printf '[!] Installed Vault application was not found.\n'
    printf '[!] Expected:\n'
    printf '    %s/package.json\n' "$DEBIAN_VAULT_DIR"
    printf '\n'
    printf '[!] Run the Termux installer first.\n'
    exit 1
fi

printf '[+] Installed Vault application found.\n'

printf '\n[*] Checking Git...\n'

if ! command -v git >/dev/null 2>&1; then
    printf '[!] Git is not installed in Termux.\n'
    printf '[*] Installing Git...\n'
    pkg update -y
    pkg install -y git
fi

printf '[+] Git detected: '
git --version

printf '\n[*] Checking current installed version...\n'

CURRENT_VERSION="$(
    proot-distro login debian -- bash -c "
        if [ -f '$DEBIAN_VAULT_DIR/version.json' ]; then
            grep -oE '[0-9]{4}\.[0-9]{2}\.[0-9]{2}' '$DEBIAN_VAULT_DIR/version.json' | head -n 1
        fi
    "
)"

if [ -z "$CURRENT_VERSION" ]; then
    CURRENT_VERSION="Unknown"
fi

printf '[+] Current installed version: %s\n' "$CURRENT_VERSION"

printf '\n[*] Downloading latest version information...\n'

rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"

git clone --depth 1 "$REPO_URL" "$TEMP_DIR/source"

LATEST_VERSION=""

if [ -f "$TEMP_DIR/source/skeleton-key-vault/version.json" ]; then
    LATEST_VERSION="$(
        grep -oE '[0-9]{4}\.[0-9]{2}\.[0-9]{2}' \
        "$TEMP_DIR/source/skeleton-key-vault/version.json" | head -n 1
    )"
fi

if [ -z "$LATEST_VERSION" ]; then
    LATEST_VERSION="Unknown"
fi

printf '[+] Latest available version: %s\n' "$LATEST_VERSION"

printf '\n'

if [ "$CURRENT_VERSION" = "$LATEST_VERSION" ] && [ "$CURRENT_VERSION" != "Unknown" ]; then
    printf '[+] FRL Skeleton Key is already up to date.\n'
    rm -rf "$TEMP_DIR"
    exit 0
fi

printf '[!] An update is available.\n'
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

printf '\n[*] Backing up persistent Vault data...\n'

mkdir -p "$TEMP_DIR/backup"

proot-distro login debian -- bash -c "
set -e

BACKUP_DIR='/tmp/frl-skeleton-key-persistent-backup'
rm -rf \"\$BACKUP_DIR\"
mkdir -p \"\$BACKUP_DIR\"

if [ -f '$DEBIAN_VAULT_DIR/.vault.lock' ]; then
    cp -a '$DEBIAN_VAULT_DIR/.vault.lock' \"\$BACKUP_DIR/.vault.lock\"
fi

if [ -f '$DEBIAN_VAULT_DIR/identity_vault.db' ]; then
    cp -a '$DEBIAN_VAULT_DIR/identity_vault.db' \"\$BACKUP_DIR/identity_vault.db\"
fi

if [ -d '$DEBIAN_VAULT_DIR/fr_legends_payloads' ]; then
    cp -a '$DEBIAN_VAULT_DIR/fr_legends_payloads' \"\$BACKUP_DIR/fr_legends_payloads\"
fi
"

proot-distro copy \
    --recursive \
    debian:/tmp/frl-skeleton-key-persistent-backup \
    "$TEMP_DIR/backup/debian-backup"

proot-distro login debian -- bash -c '
rm -rf /tmp/frl-skeleton-key-persistent-backup
'

printf '[+] Persistent Vault data backed up.\n'

printf '\n[*] Preparing updated application...\n'

proot-distro login debian -- bash -c "
set -e

rm -rf '$DEBIAN_SOURCE_DIR'
mkdir -p '$DEBIAN_ROOT'
"

proot-distro copy \
    --recursive \
    "$TEMP_DIR/source" \
    debian:"$DEBIAN_SOURCE_DIR"

printf '[+] Updated application copied into Debian.\n'

printf '\n[*] Restoring persistent Vault data...\n'

proot-distro login debian -- bash -c "
set -e

BACKUP_DIR='/tmp/frl-skeleton-key-restore'

rm -rf \"\$BACKUP_DIR\"
mkdir -p \"\$BACKUP_DIR\"
"

proot-distro copy \
    --recursive \
    "$TEMP_DIR/backup/debian-backup" \
    debian:/tmp/frl-skeleton-key-restore

proot-distro login debian -- bash -c "
set -e

RESTORE_DIR='/tmp/frl-skeleton-key-restore/frl-skeleton-key-persistent-backup'

if [ -f \"\$RESTORE_DIR/.vault.lock\" ]; then
    cp -a \"\$RESTORE_DIR/.vault.lock\" '$DEBIAN_VAULT_DIR/.vault.lock'
fi

if [ -f \"\$RESTORE_DIR/identity_vault.db\" ]; then
    cp -a \"\$RESTORE_DIR/identity_vault.db\" '$DEBIAN_VAULT_DIR/identity_vault.db'
fi

if [ -d \"\$RESTORE_DIR/fr_legends_payloads\" ]; then
    rm -rf '$DEBIAN_VAULT_DIR/fr_legends_payloads'
    cp -a \"\$RESTORE_DIR/fr_legends_payloads\" '$DEBIAN_VAULT_DIR/fr_legends_payloads'
fi

rm -rf /tmp/frl-skeleton-key-restore
"

printf '[+] Persistent Vault data restored.\n'

printf '\n[*] Installing updated Node.js dependencies...\n'

proot-distro login debian -- bash -c "
set -e

cd '$DEBIAN_VAULT_DIR'

rm -rf node_modules

npm cache clean --force

if [ -f package-lock.json ]; then
    npm install --cache /tmp/frl-npm-cache
else
    npm install --cache /tmp/frl-npm-cache
fi

rm -rf /tmp/frl-npm-cache
"

printf '[+] Node.js dependencies updated.\n'

printf '\n[*] Testing better-sqlite3...\n'

proot-distro login debian -- bash -c "
set -e

cd '$DEBIAN_VAULT_DIR'

node -e \"
const Database = require('better-sqlite3');
const db = new Database(':memory:');
db.prepare('SELECT 1').get();
db.close();
console.log('[+] better-sqlite3 SQLite test passed.');
\"
"

printf '\n[*] Checking persistent Vault data...\n'

proot-distro login debian -- bash -c "
set -e

if [ -f '$DEBIAN_VAULT_DIR/.vault.lock' ]; then
    printf '[+] Found: .vault.lock\n'
else
    printf '[*] Not present: .vault.lock\n'
fi

if [ -f '$DEBIAN_VAULT_DIR/identity_vault.db' ]; then
    printf '[+] Found: identity_vault.db\n'
else
    printf '[*] Not present: identity_vault.db\n'
fi

if [ -d '$DEBIAN_VAULT_DIR/fr_legends_payloads' ]; then
    printf '[+] Found: fr_legends_payloads/\n'
else
    printf '[!] fr_legends_payloads/ was not restored.\n'
    exit 1
fi
"

rm -rf "$TEMP_DIR"

printf '\n'
printf '%s\n' '============================================================'
printf '%s\n' '                    UPDATE COMPLETE'
printf '%s\n' '============================================================'
printf '\n'

printf 'Previous version: %s\n' "$CURRENT_VERSION"
printf 'Updated version:  %s\n' "$LATEST_VERSION"
printf '\n'

printf 'Vault location inside Debian:\n'
printf '  %s\n' "$DEBIAN_VAULT_DIR"
printf '\n'

printf 'Launch command:\n'
printf '  proot-distro login debian\n'
printf '  cd %s\n' "$DEBIAN_VAULT_DIR"
printf '  node cli.js\n'
printf '\n'

printf 'Preserved Vault data:\n'
printf '  .vault.lock\n'
printf '  identity_vault.db\n'
printf '  fr_legends_payloads/\n'
printf '\n'

printf '%s\n' '============================================================'
printf '\n'
