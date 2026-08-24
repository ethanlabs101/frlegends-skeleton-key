#!/data/data/com.termux/files/usr/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

GITHUB_REPO="https://github.com/ethanlabs101/frlegends-skeleton-key.git"
DEBIAN_ROOT="/root/frlegends-skeleton-key"
DEBIAN_REPO="$DEBIAN_ROOT/frlegends-skeleton-key"
DEBIAN_VAULT="$DEBIAN_REPO/skeleton-key-vault"

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

if proot-distro list 2>/dev/null | grep -Eq '^[[:space:]]*debian[[:space:]]'; then
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
                printf '[!] WARNING: Fresh installation removes the existing Debian container.\n'
                printf '[!] Everything stored inside that Debian container will be deleted.\n'
                printf '\n'
                printf '[>] Type REINSTALL to continue: '
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

                printf '[+] Fresh Debian environment installed.\n'

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

    printf '[+] Debian is not installed.\n'
    printf '[*] Installing Debian...\n'

    proot-distro install debian

    printf '[+] Debian installed successfully.\n'

fi

printf '\n[*] Preparing Debian environment...\n'

proot-distro login debian -- bash -c '
set -e

printf "\n"
printf "[*] Updating Debian package lists...\n"

apt-get update

printf "\n"
printf "[*] Installing required packages...\n"

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

printf "\n[+] Debian packages installed.\n"

printf "[+] Node.js version: "
node --version

printf "[+] npm version: "
npm --version

printf "[+] Git version: "
git --version
'

printf '\n[+] Debian environment prepared.\n'

printf '\n[*] Checking FR Legends Skeleton Key installation...\n'

if proot-distro login debian -- test -d "$DEBIAN_VAULT"; then

    printf '[+] Existing Vault installation detected.\n'
    printf '\n'

    printf '[!] An existing FR Legends Skeleton Key installation is already present.\n'
    printf '[!] The installer will NOT overwrite it automatically.\n'
    printf '\n'

    printf 'Choose how to continue:\n'
    printf '\n'
    printf '  1) Keep existing installation\n'
    printf '  2) Remove application and perform fresh clone\n'
    printf '  3) Cancel\n'
    printf '\n'

    while true; do
        printf '[>] Select: '
        read -r INSTALL_CHOICE

        case "$INSTALL_CHOICE" in

            1)
                printf '[+] Existing installation will be preserved.\n'
                break
                ;;

            2)
                printf '\n'
                printf '[!] WARNING: This removes the existing application directory.\n'
                printf '[!] Vault data inside that directory may also be removed.\n'
                printf '[!] Back up .vault.lock, identity_vault.db, and fr_legends_payloads/ first.\n'
                printf '\n'

                printf '[>] Type FRESHCLONE to continue: '
                read -r CONFIRM

                if [ "$CONFIRM" != "FRESHCLONE" ]; then
                    printf '[!] Confirmation failed.\n'
                    exit 1
                fi

                printf '\n[*] Removing existing FRL Skeleton Key installation...\n'

                proot-distro login debian -- bash -c "
                    rm -rf '$DEBIAN_REPO'
                    mkdir -p '$DEBIAN_ROOT'
                "

                printf '[+] Existing application removed.\n'

                printf '\n[*] Cloning FR Legends Skeleton Key inside Debian...\n'

                proot-distro login debian -- bash -c "
                    git clone '$GITHUB_REPO' '$DEBIAN_REPO'
                "

                printf '[+] Repository cloned successfully.\n'
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

    printf '[*] No existing Vault installation detected.\n'
    printf '[*] Cloning FR Legends Skeleton Key inside Debian...\n'

    proot-distro login debian -- bash -c "
        mkdir -p '$DEBIAN_ROOT'
        git clone '$GITHUB_REPO' '$DEBIAN_REPO'
    "

    printf '[+] Repository cloned successfully.\n'

fi

printf '\n[*] Locating Vault application...\n'

if ! proot-distro login debian -- test -f "$DEBIAN_VAULT/package.json"; then
    printf '[!] package.json was not found inside the cloned repository.\n'
    printf '    Expected:\n'
    printf '    %s/package.json\n' "$DEBIAN_VAULT"
    exit 1
fi

if ! proot-distro login debian -- test -f "$DEBIAN_VAULT/cli.js"; then
    printf '[!] cli.js was not found inside the cloned repository.\n'
    printf '    Expected:\n'
    printf '    %s/cli.js\n' "$DEBIAN_VAULT"
    exit 1
fi

printf '[+] Vault application found.\n'

printf '\n[*] Installing Node.js dependencies inside Debian...\n'

proot-distro login debian -- bash -c "
set -e

cd '$DEBIAN_VAULT'

if [ -f package-lock.json ]; then
    npm ci
else
    npm install
fi

printf '\n[+] Node.js dependencies installed.\n'
"

printf '\n[*] Testing better-sqlite3...\n'

proot-distro login debian -- bash -c "
set -e

cd '$DEBIAN_VAULT'

node -e '
const Database = require(\"better-sqlite3\");
const db = new Database(\":memory:\");
db.prepare(\"SELECT 1\").get();
db.close();
console.log(\"[+] better-sqlite3 SQLite test passed.\");
'
"

printf '\n[*] Checking Vault data directories...\n'

proot-distro login debian -- bash -c "
set -e

cd '$DEBIAN_VAULT'

mkdir -p fr_legends_payloads

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
    printf '[!] fr_legends_payloads/ could not be created.\n'
    exit 1
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
printf '  %s\n' "$DEBIAN_VAULT"
printf '\n'

printf 'Launch command:\n'
printf '  proot-distro login debian\n'
printf '  cd %s\n' "$DEBIAN_VAULT"
printf '  node cli.js\n'
printf '\n'

printf 'IMPORTANT:\n'
printf '  The Termux repository is only the bootstrap/source copy.\n'
printf '  The active application runs from inside Debian.\n'
printf '\n'

printf 'You may delete the Termux repository later if you want to save space:\n'
printf '  %s\n' "$REPO_ROOT"
printf '\n'

printf 'DO NOT delete the Debian installation:\n'
printf '  %s\n' "$DEBIAN_ROOT"
printf '\n'

printf 'KEEP YOUR VAULT DATA WHEN UPDATING:\n'
printf '  .vault.lock\n'
printf '  identity_vault.db\n'
printf '  fr_legends_payloads/\n'
printf '\n'

printf 'These files contain local Vault state and user-generated data.\n'
printf 'Future architecture-specific updater scripts should preserve them.\n'
printf '\n'

printf '%s\n' '============================================================'
printf '\n'
