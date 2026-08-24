#!/data/data/com.termux/files/usr/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

REPO_URL="https://github.com/ethanlabs101/frlegends-skeleton-key.git"
DEBIAN_INSTALL_DIR="/root/frlegends-skeleton-key"
VAULT_DIR="$DEBIAN_INSTALL_DIR/skeleton-key-vault"

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

    pkg update -y
    pkg install -y proot-distro

    printf '[+] proot-distro installed.\n'
else
    printf '[+] proot-distro detected.\n'
fi

printf '\n[*] Checking Debian environment...\n'

DEBIAN_EXISTS=0

if proot-distro list 2>/dev/null | grep -Eq '^[[:space:]]*(\[[* ]\][[:space:]]*)?debian([[:space:]]|$)'; then
    DEBIAN_EXISTS=1
fi

if [ "$DEBIAN_EXISTS" -eq 1 ]; then
    printf '[+] Debian is already installed.\n'
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
                printf '[!] This will remove the existing Debian proot environment.\n'
                printf '[!] Anything stored inside that Debian environment will be lost.\n'
                printf '\n'
                printf '[>] Type REINSTALL to confirm: '
                read -r CONFIRM

                if [ "$CONFIRM" != "REINSTALL" ]; then
                    printf '[!] Confirmation failed.\n'
                    exit 1
                fi

                printf '\n[*] Removing existing Debian environment...\n'
                proot-distro remove debian

                printf '[+] Existing Debian environment removed.\n'

                printf '\n[*] Installing fresh Debian environment...\n'
                proot-distro install debian

                printf '[+] Debian installed successfully.\n'
                break
                ;;

            2)
                printf '[+] Existing Debian environment will be used.\n'
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
    printf '[*] Debian is not installed.\n'
    printf '[*] Installing Debian...\n'

    proot-distro install debian

    printf '[+] Debian installed successfully.\n'
fi

printf '\n[*] Preparing Debian runtime...\n'

proot-distro login debian -- bash -c '
set -e

printf "\n"
printf "[*] Updating Debian package lists...\n"
apt-get update

printf "\n"
printf "[*] Installing required system packages...\n"

apt-get install -y \
    git \
    curl \
    ca-certificates \
    build-essential \
    python3 \
    make \
    g++ \
    pkg-config \
    libsqlite3-dev \
    nodejs \
    npm

printf "\n[+] Debian system dependencies installed.\n"

printf "[+] Node.js version: "
node --version

printf "[+] npm version: "
npm --version

printf "[+] Git version: "
git --version

printf "\n[+] Debian environment prepared.\n"
'

printf '\n[+] Debian runtime prepared.\n'

printf '\n[*] Checking for existing FRL Vault installation...\n'

EXISTING_INSTALLATION=0

if proot-distro login debian -- bash -c "[ -d '$VAULT_DIR' ]" >/dev/null 2>&1; then
    EXISTING_INSTALLATION=1
fi

if [ "$EXISTING_INSTALLATION" -eq 1 ]; then
    printf '[!] An FRL Skeleton Key installation already exists inside Debian.\n'
    printf '\n'
    printf 'Location:\n'
    printf '  %s\n' "$VAULT_DIR"
    printf '\n'
    printf 'Choose how to continue:\n'
    printf '\n'
    printf '  1) Replace existing installation\n'
    printf '  2) Keep existing installation and cancel\n'
    printf '\n'

    while true; do
        printf '[>] Select: '
        read -r INSTALL_CHOICE

        case "$INSTALL_CHOICE" in
            1)
                printf '\n'
                printf '[!] WARNING: Replacing the application directory can remove\n'
                printf '[!] local Vault data stored inside the Debian installation.\n'
                printf '\n'
                printf 'IMPORTANT DATA TO PRESERVE:\n'
                printf '  .vault.lock\n'
                printf '  identity_vault.db\n'
                printf '  fr_legends_payloads/\n'
                printf '\n'
                printf '[>] Type REPLACE to confirm: '
                read -r REPLACE_CONFIRM

                if [ "$REPLACE_CONFIRM" != "REPLACE" ]; then
                    printf '[!] Confirmation failed.\n'
                    exit 1
                fi

                printf '\n[*] Removing existing FRL installation...\n'

                proot-distro login debian -- bash -c "
                    set -e
                    rm -rf '$DEBIAN_INSTALL_DIR'
                "

                printf '[+] Existing installation removed.\n'
                break
                ;;

            2)
                printf '[!] Installation cancelled.\n'
                exit 0
                ;;

            *)
                printf '[!] Invalid selection.\n'
                ;;
        esac
    done
else
    printf '[+] No existing FRL Vault installation detected.\n'
fi

printf '\n[*] Cloning FR Legends Skeleton Key inside Debian...\n'
printf '    Repository: %s\n' "$REPO_URL"
printf '    Destination: %s\n' "$DEBIAN_INSTALL_DIR"
printf '\n'

proot-distro login debian -- bash -c "
set -e

mkdir -p /root

git clone '$REPO_URL' '$DEBIAN_INSTALL_DIR'
"

printf '\n[+] Repository cloned successfully.\n'

printf '\n[*] Checking Vault application...\n'

if ! proot-distro login debian -- bash -c "
    test -f '$VAULT_DIR/package.json' &&
    test -f '$VAULT_DIR/cli.js'
" >/dev/null 2>&1; then
    printf '[!] Vault application files were not found.\n'
    printf '    Expected:\n'
    printf '    %s/package.json\n' "$VAULT_DIR"
    printf '    %s/cli.js\n' "$VAULT_DIR"
    exit 1
fi

printf '[+] Vault application found.\n'

printf '\n[*] Installing Node.js dependencies inside Debian...\n'
printf '    This may take a moment.\n'
printf '\n'

if ! proot-distro login debian -- bash -c "
    set -e

    cd '$VAULT_DIR'

    if [ -f package-lock.json ]; then
        npm ci
    else
        npm install
    fi
"; then

    printf '\n[!] npm dependency installation failed.\n'
    printf '[*] Cleaning npm cache and retrying...\n'
    printf '\n'

    proot-distro login debian -- bash -c "
        set -e

        npm cache clean --force || true
        rm -rf /root/.npm/_cacache

        cd '$VAULT_DIR'

        if [ -f package-lock.json ]; then
            npm ci
        else
            npm install
        fi
    "
fi

printf '\n[+] Node.js dependencies installed.\n'

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

printf 'Launch command:\n'
printf '  proot-distro login debian\n'
printf '  cd %s\n' "$VAULT_DIR"
printf '  node cli.js\n'
printf '\n'

printf 'IMPORTANT:\n'
printf '  The Termux repository is only the bootstrap/installer copy.\n'
printf '  The actual runtime is inside the Debian proot environment.\n'
printf '\n'

printf 'The Termux bootstrap can be deleted later if you want to save space:\n'
printf '  %s\n' "$REPO_ROOT"
printf '\n'

printf 'DO NOT delete the Debian installation:\n'
printf '  %s\n' "$DEBIAN_INSTALL_DIR"
printf '\n'

printf 'KEEP YOUR LOCAL VAULT DATA WHEN UPDATING:\n'
printf '  .vault.lock\n'
printf '  identity_vault.db\n'
printf '  fr_legends_payloads/\n'
printf '\n'

printf 'When updating or replacing the application, preserve those files.\n'
printf '\n'

printf '%s\n' '============================================================'
printf '\n'
