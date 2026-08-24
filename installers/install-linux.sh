#!/usr/bin/env bash

set -e

INSTALLER_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$INSTALLER_DIR/.." && pwd)"
VAULT_DIR="$PROJECT_ROOT"

printf '\n'
printf '%s\n' '============================================================'
printf '%s\n' '        FR LEGENDS SKELETON KEY VAULT INSTALLER'
printf '%s\n' '                    Linux Installer'
printf '%s\n' '============================================================'
printf '\n'

if [ "$(uname -s)" != "Linux" ]; then
    printf '[!] This installer is intended for Linux.\n'
    exit 1
fi

printf '[*] Checking project structure...\n'

if [ ! -f "$VAULT_DIR/package.json" ]; then
    printf '[!] package.json was not found.\n'
    printf '    Expected: %s/package.json\n' "$VAULT_DIR"
    exit 1
fi

if [ ! -f "$VAULT_DIR/cli.js" ]; then
    printf '[!] cli.js was not found.\n'
    printf '    Expected: %s/cli.js\n' "$VAULT_DIR"
    exit 1
fi

printf '[+] Project structure found.\n'

printf '\n[*] Checking Node.js...\n'

if ! command -v node >/dev/null 2>&1; then
    printf '[!] Node.js is not installed.\n'
    printf '\n'
    printf '    Install Node.js using your distribution package manager,\n'
    printf '    then run this installer again.\n'
    printf '\n'
    exit 1
fi

NODE_VERSION="$(node --version)"
printf '[+] Node.js detected: %s\n' "$NODE_VERSION"

printf '\n[*] Checking npm...\n'

if ! command -v npm >/dev/null 2>&1; then
    printf '[!] npm is not installed.\n'
    printf '\n'
    printf '    Install npm using your distribution package manager,\n'
    printf '    then run this installer again.\n'
    printf '\n'
    exit 1
fi

NPM_VERSION="$(npm --version)"
printf '[+] npm detected: %s\n' "$NPM_VERSION"

printf '\n[*] Preparing application directories...\n'

mkdir -p "$VAULT_DIR/fr_legends_payloads"

printf '[+] Application directories ready.\n'

printf '\n[*] Installing Node.js dependencies...\n'
printf '    This may take a moment.\n'
printf '\n'

cd "$VAULT_DIR"

if [ -f "package-lock.json" ]; then
    npm ci
else
    npm install
fi

printf '\n[+] Dependencies installed successfully.\n'

printf '\n[*] Checking Vault data...\n'

if [ -e "$VAULT_DIR/.vault.lock" ]; then
    printf '[+] Found: .vault.lock\n'
else
    printf '[*] Not present yet: .vault.lock\n'
fi

if [ -e "$VAULT_DIR/identity_vault.db" ]; then
    printf '[+] Found: identity_vault.db\n'
else
    printf '[*] Not present yet: identity_vault.db\n'
fi

if [ -d "$VAULT_DIR/fr_legends_payloads" ]; then
    printf '[+] Found: fr_legends_payloads/\n'
else
    printf '[!] fr_legends_payloads/ could not be created.\n'
    exit 1
fi

printf '\n[*] Checking application permissions...\n'

if [ ! -w "$VAULT_DIR" ]; then
    printf '[!] The Vault directory is not writable by the current user.\n'
    printf '\n'
    printf '    Current directory:\n'
    printf '    %s\n' "$VAULT_DIR"
    printf '\n'
    printf '    You may need to restore ownership with chmod/chown.\n'
    printf '    The installer will not automatically take ownership of\n'
    printf '    files belonging to another user.\n'
    printf '\n'
else
    printf '[+] Vault directory is writable.\n'
fi

printf '\n'
printf '%s\n' '============================================================'
printf '%s\n' '                 INSTALLATION COMPLETE'
printf '%s\n' '============================================================'
printf '\n'
printf 'Vault location:\n'
printf '  %s\n' "$VAULT_DIR"
printf '\n'
printf 'Launch command:\n'
printf '  cd "%s"\n' "$VAULT_DIR"
printf '  node cli.js\n'
printf '\n'
printf 'IMPORTANT:\n'
printf '  Keep .vault.lock, identity_vault.db, and fr_legends_payloads/\n'
printf '  when updating or replacing the application.\n'
printf '\n'
printf '============================================================\n'
printf '\n'
