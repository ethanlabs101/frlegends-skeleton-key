#!/data/data/com.termux/files/usr/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

GITHUB_REPO="https://github.com/ethanlabs101/frlegends-skeleton-key.git"

DEBIAN_APP_DIR="/root/frlegends-skeleton-key"
SOURCE_DIR="$DEBIAN_APP_DIR/source"
VAULT_DIR="$SOURCE_DIR/skeleton-key-vault"

printf '\n'
printf '%s\n' '============================================================'
printf '%s\n' '        FR LEGENDS SKELETON KEY VAULT INSTALLER'
printf '%s\n' '                    Termux Installer'
printf '%s\n' '============================================================'
printf '\n'

if [ -z "$PREFIX" ] || [ ! -d "$PREFIX" ]; then
    printf '[!] This installer must be run inside Termux.\n'
    exit 1
fi

printf '[+] Termux environment detected.\n'

printf '\n[*] Checking proot-distro...\n'

if ! command -v proot-distro >/dev/null 2>&1; then
    printf '[!] proot-distro is not installed.\n'
    printf '[*] Installing proot-distro...\n'
    printf '\n'

    pkg update -y
    pkg install -y proot-distro git

    printf '\n[+] proot-distro installed.\n'
else
    printf '[+] proot-distro detected.\n'
fi

printf '\n[*] Checking Git in Termux...\n'

if ! command -v git >/dev/null 2>&1; then
    printf '[*] Installing Git...\n'
    pkg install -y git
fi

printf '[+] Git detected: '
git --version

printf '\n[*] Checking Debian environment...\n'

DEBIAN_EXISTS=0

if proot-distro list --quiet 2>/dev/null | grep -Fxq "debian"; then
    DEBIAN_EXISTS=1
fi

if [ "$DEBIAN_EXISTS" -eq 1 ]; then

    printf '[+] Debian container detected.\n'
    printf '\n'
    printf 'Choose how to continue:\n'
    printf '\n'
    printf '  1) Fresh Debian installation\n'
    printf '  2) Use existing Debian installation\n'
    printf '  3) Cancel\n'
    printf '\n'

    while true; do
        printf '[>] Select: '
        read -r DEBIAN_CHOICE

        case "$DEBIAN_CHOICE" in
            1)
                printf '\n'
                printf '[!] WARNING: This will completely delete the existing Debian container.\n'
                printf '[!] Anything stored inside that Debian container will be lost.\n'
                printf '\n'
                printf '[!] Your Termux repository is outside Debian and will NOT be deleted.\n'
                printf '\n'
                printf '[>] Type REINSTALL to confirm: '
                read -r CONFIRM

                if [ "$CONFIRM" != "REINSTALL" ]; then
                    printf '[!] Confirmation failed.\n'
                    exit 1
                fi

                printf '\n[*] Reinstalling Debian from scratch...\n'

                proot-distro reset debian

                printf '\n[+] Fresh Debian installation completed.\n'
                break
                ;;

            2)
                printf '[+] Existing Debian installation will be used.\n'
                break
                ;;

            3)
                printf '[!] Installation cancelled.\n'
                exit 0
                ;;

            *)
                printf '[!] Invalid selection.\n'
                ;;
        esac
    done

else

    printf '[*] Debian container was not found.\n'
    printf '[*] Installing Debian...\n'
    printf '\n'

    proot-distro install debian

    printf '\n[+] Debian installed successfully.\n'

fi

printf '\n[*] Preparing Debian environment...\n'

proot-distro login debian -- bash -c '
set -e

printf "\n"
printf "[*] Updating Debian package lists...\n"
apt-get update

printf "\n"
printf "[*] Installing required Debian packages...\n"

apt-get install -y \
    ca-certificates \
    curl \
    git \
    build-essential \
    python3 \
    make \
    g++ \
    pkg-config \
    libsqlite3-dev \
    nodejs \
    npm

printf "\n"
printf "[+] Debian system dependencies installed.\n"

printf "[+] Node.js version: "
node --version

printf "[+] npm version: "
npm --version

printf "[+] Git version: "
git --version
'

printf '\n[+] Debian environment prepared.\n'

printf '\n[*] Checking for existing FRL Vault installation...\n'

EXISTING_VAULT=0

if proot-distro login debian -- bash -c "[ -f '$VAULT_DIR/package.json' ]" >/dev/null 2>&1; then
    EXISTING_VAULT=1
fi

if [ "$EXISTING_VAULT" -eq 1 ]; then

    printf '[+] Existing FRL Vault installation detected.\n'
    printf '\n'
    printf 'Vault location:\n'
    printf '  %s\n' "$VAULT_DIR"
    printf '\n'
    printf 'Choose how to continue:\n'
    printf '\n'
    printf '  1) Replace application with fresh Git clone\n'
    printf '  2) Keep existing application\n'
    printf '  3) Cancel\n'
    printf '\n'

    while true; do
        printf '[>] Select: '
        read -r VAULT_CHOICE

        case "$VAULT_CHOICE" in
            1)
                printf '\n'
                printf '[!] WARNING: This replaces the existing FRL source directory.\n'
                printf '[!] Local Vault data may be deleted.\n'
                printf '\n'
                printf '[!] Preserve these files before continuing:\n'
                printf '    .vault.lock\n'
                printf '    identity_vault.db\n'
                printf '    fr_legends_payloads/\n'
                printf '\n'
                printf '[>] Type REPLACE to confirm: '
                read -r CONFIRM

                if [ "$CONFIRM" != "REPLACE" ]; then
                    printf '[!] Confirmation failed.\n'
                    exit 1
                fi

                printf '\n[*] Removing existing FRL source...\n'

                proot-distro login debian -- bash -c "
                    rm -rf '$SOURCE_DIR'
                    mkdir -p '$DEBIAN_APP_DIR'
                "

                printf '[+] Existing FRL source removed.\n'
                break
                ;;

            2)
                printf '[+] Existing FRL Vault will be kept.\n'
                printf '\n'

                proot-distro login debian -- bash -c "
                    set -e

                    cd '$VAULT_DIR'

                    printf '[+] package.json found.\n'
                    printf '[+] cli.js found.\n'
                "

                printf '\n'
                printf '%s\n' '============================================================'
                printf '%s\n' '                 INSTALLATION COMPLETE'
                printf '%s\n' '============================================================'
                printf '\n'

                printf 'Existing FRL Skeleton Key installation preserved.\n'
                printf '\n'

                printf 'Enter Debian:\n'
                printf '  proot-distro login debian\n'
                printf '\n'

                printf 'Launch:\n'
                printf '  cd %s\n' "$VAULT_DIR"
                printf '  node cli.js\n'
                printf '\n'

                printf '%s\n' '============================================================'
                printf '\n'

                exit 0
                ;;

            3)
                printf '[!] Installation cancelled.\n'
                exit 0
                ;;

            *)
                printf '[!] Invalid selection.\n'
                ;;
        esac
    done

else

    printf '[*] No existing FRL Vault installation detected.\n'

fi

printf '\n[*] Cloning FR Legends Skeleton Key inside Debian...\n'
printf '[*] Repository: %s\n' "$GITHUB_REPO"
printf '[*] Destination: %s\n' "$SOURCE_DIR"
printf '\n'

proot-distro login debian -- bash -c "
set -e

mkdir -p '$DEBIAN_APP_DIR'

rm -rf '$SOURCE_DIR'

git clone '$GITHUB_REPO' '$SOURCE_DIR'

if [ ! -d '$VAULT_DIR' ]; then
    printf '[!] Git clone completed but skeleton-key-vault was not found.\n'
    exit 1
fi

printf '[+] Repository cloned successfully.\n'
"

printf '\n[*] Checking Vault application...\n'

proot-distro login debian -- bash -c "
set -e

if [ ! -f '$VAULT_DIR/package.json' ]; then
    printf '[!] package.json was not found.\n'
    exit 1
fi

if [ ! -f '$VAULT_DIR/cli.js' ]; then
    printf '[!] cli.js was not found.\n'
    exit 1
fi

printf '[+] Vault application found.\n'
"

printf '\n[*] Installing Node.js dependencies inside Debian...\n'
printf '    This may take a moment.\n'
printf '\n'

proot-distro login debian -- bash -c "
set -e

cd '$VAULT_DIR'

printf '[*] Preparing a fresh npm cache...\n'

rm -rf /tmp/frl-npm-cache
mkdir -p /tmp/frl-npm-cache

rm -rf node_modules

printf '[*] Installing dependencies from the npm registry...\n'

if [ -f package-lock.json ]; then
    npm ci \
        --cache /tmp/frl-npm-cache \
        --prefer-online \
        --fetch-retries=5 \
        --fetch-retry-factor=2 \
        --fetch-retry-mintimeout=1000 \
        --fetch-retry-maxtimeout=30000
else
    npm install \
        --cache /tmp/frl-npm-cache \
        --prefer-online \
        --fetch-retries=5 \
        --fetch-retry-factor=2 \
        --fetch-retry-mintimeout=1000 \
        --fetch-retry-maxtimeout=30000
fi

printf '\n[+] Node.js dependencies installed.\n'
"

printf '\n[*] Testing better-sqlite3...\n'

proot-distro login debian -- bash -c "
set -e

cd '$VAULT_DIR'

node -e '
const Database = require(\"better-sqlite3\");
const db = new Database(\":memory:\");
db.prepare(\"SELECT 1\").get();
db.close();
console.log(\"[+] better-sqlite3 SQLite test passed.\");
'
"

printf '\n[*] Checking Vault data...\n'

proot-distro login debian -- bash -c "
set -e

cd '$VAULT_DIR'

if [ -e .vault.lock ]; then
    printf '[+] Found: .vault.lock\n'
else
    printf '[*] Not present yet: .vault.lock\n'
fi

if [ -e identity_vault.db ]; then
    printf '[+] Found: identity_vault.db\n'
else
    printf '[*] Not present yet: identity_vault.db\n'
fi

if [ -d fr_legends_payloads ]; then
    printf '[+] Found: fr_legends_payloads/\n'
else
    printf '[*] fr_legends_payloads/ will be created by the application when needed.\n'
fi
"

printf '\n'
printf '%s\n' '============================================================'
printf '%s\n' '                 INSTALLATION COMPLETE'
printf '%s\n' '============================================================'
printf '\n'

printf 'FRL Skeleton Key is installed inside Debian proot.\n'
printf '\n'

printf 'Vault location inside Debian:\n'
printf '  %s\n' "$VAULT_DIR"
printf '\n'

printf 'Launch commands:\n'
printf '1.  proot-distro login debian\n'
printf '2.  cd %s\n' "$VAULT_DIR"
printf '3.  node cli.js\n'
printf '\n'

printf 'IMPORTANT:\n'
printf '  The Termux repository is only the bootstrap/source copy.\n'
printf '  The actual runtime is inside the Debian proot environment.\n'
printf '\n'

printf 'You may delete the Termux repository later to save space:\n'
printf '  %s\n' "$REPO_ROOT"
printf '\n'

printf 'DO NOT delete the Debian installation or Vault:\n'
printf '  %s\n' "$VAULT_DIR"
printf '\n'

printf 'KEEP YOUR LOCAL VAULT DATA WHEN UPDATING:\n'
printf '  .vault.lock\n'
printf '  identity_vault.db\n'
printf '  fr_legends_payloads/\n'
printf '\n'

printf '%s\n' '============================================================'
printf '\n'
