#!/data/data/com.termux/files/usr/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

REPO_URL="https://github.com/ethanlabs101/frlegends-skeleton-key.git"
DEBIAN_NAME="debian"
DEBIAN_ROOT="/root/frlegends-skeleton-key"
VAULT_DIR="$DEBIAN_ROOT/skeleton-key-vault"

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

printf '\n[*] Checking Git...\n'

if ! command -v git >/dev/null 2>&1; then
    printf '[*] Git is not installed in Termux.\n'
    printf '[*] Installing Git...\n'

    pkg install -y git

    printf '[+] Git installed.\n'
else
    printf '[+] Git detected: '
    git --version
fi

printf '\n'
printf '%s\n' '============================================================'
printf '%s\n' '                    DEBIAN ENVIRONMENT'
printf '%s\n' '============================================================'
printf '\n'

DEBIAN_EXISTS=0

if proot-distro list 2>/dev/null | grep -Eq '^[[:space:]]*debian[[:space:]]'; then
    DEBIAN_EXISTS=1
fi

if [ "$DEBIAN_EXISTS" -eq 1 ]; then

    printf '[+] Debian already exists.\n'
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
                printf '[!] WARNING: This removes the entire Debian environment.\n'
                printf '[!] Anything stored inside Debian will be deleted.\n'
                printf '[!] Make sure you have backups before continuing.\n'
                printf '\n'
                printf '[>] Type REINSTALL to continue: '
                read -r CONFIRM

                if [ "$CONFIRM" != "REINSTALL" ]; then
                    printf '[!] Confirmation failed.\n'
                    exit 1
                fi

                printf '\n[*] Removing existing Debian environment...\n'

                proot-distro remove "$DEBIAN_NAME"

                printf '[+] Remove command completed.\n'

                printf '[*] Verifying Debian was removed...\n'

                DEBIAN_STILL_EXISTS=0

                if proot-distro list 2>/dev/null | grep -Eq '^[[:space:]]*debian[[:space:]]'; then
                    DEBIAN_STILL_EXISTS=1
                fi

                if [ "$DEBIAN_STILL_EXISTS" -eq 1 ]; then
                    printf '[!] Debian still appears to exist.\n'
                    printf '[!] The installer will not attempt to install over it.\n'
                    printf '[!] Please run:\n'
                    printf '    proot-distro remove debian\n'
                    printf '[!] Then run this installer again.\n'
                    exit 1
                fi

                printf '[+] Debian successfully removed.\n'

                printf '\n[*] Installing fresh Debian environment...\n'

                proot-distro install "$DEBIAN_NAME"

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

    printf '[*] Debian is not installed.\n'
    printf '[*] Installing Debian...\n'

    proot-distro install "$DEBIAN_NAME"

    printf '[+] Debian installed successfully.\n'

fi

printf '\n'
printf '%s\n' '============================================================'
printf '%s\n' '                 PREPARING DEBIAN'
printf '%s\n' '============================================================'
printf '\n'

proot-distro login "$DEBIAN_NAME" -- bash -c '
set -e

printf "\n"
printf "[*] Updating Debian package lists...\n"

apt-get update

printf "\n"
printf "[*] Installing required packages...\n"

DEBIAN_FRONTEND=noninteractive apt-get install -y \
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

printf "\n[+] Debian system dependencies installed.\n"

printf "[+] Node.js version: "
node --version

printf "[+] npm version: "
npm --version

printf "[+] Git version: "
git --version
'

printf '\n[+] Debian environment prepared.\n'

printf '\n'
printf '%s\n' '============================================================'
printf '%s\n' '                 INSTALLING FRL SKELETON KEY'
printf '%s\n' '============================================================'
printf '\n'

printf '[*] Checking for existing FRL Vault installation...\n'

INSTALL_EXISTS=0

if proot-distro login "$DEBIAN_NAME" -- bash -c \
    "[ -f '$VAULT_DIR/package.json' ] && [ -f '$VAULT_DIR/cli.js' ]" \
    >/dev/null 2>&1; then

    INSTALL_EXISTS=1

fi

if [ "$INSTALL_EXISTS" -eq 1 ]; then

    printf '[+] Existing FRL Vault installation detected.\n'
    printf '\n'
    printf 'The Debian installation already contains:\n'
    printf '  %s\n' "$VAULT_DIR"
    printf '\n'
    printf 'Choose how to continue:\n'
    printf '\n'
    printf '  1) Keep existing installation\n'
    printf '  2) Replace application with fresh Git clone\n'
    printf '  3) Cancel\n'
    printf '\n'

    while true; do
        printf '[>] Select: '
        read -r INSTALL_CHOICE

        case "$INSTALL_CHOICE" in

            1)
                printf '[+] Existing FRL Vault installation will be kept.\n'
                break
                ;;

            2)
                printf '\n'
                printf '[!] WARNING: Replacing the application directory can remove\n'
                printf '[!] application files inside the Debian environment.\n'
                printf '[!] Your vault data must be preserved separately.\n'
                printf '\n'
                printf '[>] Type REPLACE to continue: '
                read -r CONFIRM

                if [ "$CONFIRM" != "REPLACE" ]; then
                    printf '[!] Confirmation failed.\n'
                    exit 1
                fi

                printf '\n[*] Removing existing application directory...\n'

                proot-distro login "$DEBIAN_NAME" -- bash -c "
                    rm -rf '$DEBIAN_ROOT'
                "

                printf '[+] Existing application directory removed.\n'
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

fi

INSTALL_EXISTS_AFTER_CHECK=0

if proot-distro login "$DEBIAN_NAME" -- bash -c \
    "[ -f '$VAULT_DIR/package.json' ] && [ -f '$VAULT_DIR/cli.js' ]" \
    >/dev/null 2>&1; then

    INSTALL_EXISTS_AFTER_CHECK=1

fi

if [ "$INSTALL_EXISTS_AFTER_CHECK" -eq 0 ]; then

    printf '\n[*] Cloning FR Legends Skeleton Key inside Debian...\n'
    printf '[*] Repository:\n'
    printf '    %s\n' "$REPO_URL"
    printf '\n'

    proot-distro login "$DEBIAN_NAME" -- bash -c "
        set -e

        rm -rf '$DEBIAN_ROOT'

        git clone '$REPO_URL' '$DEBIAN_ROOT'

        printf '\n[+] Repository cloned successfully.\n'
    "

else

    printf '\n[+] Existing FRL Vault installation retained.\n'

fi

printf '\n[*] Checking Vault application...\n'

if ! proot-distro login "$DEBIAN_NAME" -- bash -c \
    "[ -f '$VAULT_DIR/package.json' ] && [ -f '$VAULT_DIR/cli.js' ]"; then

    printf '[!] Vault application files were not found.\n'
    printf '    Expected:\n'
    printf '    %s/package.json\n' "$VAULT_DIR"
    printf '    %s/cli.js\n' "$VAULT_DIR"
    exit 1
fi

printf '[+] Vault application found.\n'

printf '\n'
printf '%s\n' '============================================================'
printf '%s\n' '              INSTALLING NODE DEPENDENCIES'
printf '%s\n' '============================================================'
printf '\n'

proot-distro login "$DEBIAN_NAME" -- bash -c "
    set -e

    cd '$VAULT_DIR'

    printf '[*] Cleaning npm cache...\n'
    npm cache clean --force || true

    printf '[*] Installing dependencies...\n'

    if [ -f package-lock.json ]; then
        npm ci --prefer-online
    else
        npm install --prefer-online
    fi

    printf '\n[+] Node.js dependencies installed.\n'
"

printf '\n'
printf '[*] Testing better-sqlite3...\n'

proot-distro login "$DEBIAN_NAME" -- bash -c "
    set -e

    cd '$VAULT_DIR'

    node -e '
        const Database = require(\"better-sqlite3\");
        const db = new Database(\":memory:\");
        const result = db.prepare(\"SELECT 1 AS test\").get();

        if (result.test !== 1) {
            throw new Error(\"SQLite test returned an unexpected result.\");
        }

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
printf '  The Termux repository is only the bootstrap/source copy.\n'
printf '  The actual runtime is inside the Debian proot environment.\n'
printf '\n'

printf 'LOCAL VAULT DATA:\n'
printf '  Preserve these files/directories when updating:\n'
printf '  .vault_lock\n'
printf '  identity_vault.db\n'
printf '  fr_legends_payloads/\n'
printf '\n'

printf 'The Debian application is located at:\n'
printf '  %s\n' "$VAULT_DIR"
printf '\n'

printf 'The original Termux repository can be removed later if desired:\n'
printf '  rm -rf \"%s\"\n' "$REPO_ROOT"
printf '\n'

printf 'DO NOT remove the Debian installation if you want to keep the\n'
printf 'installed FRL Skeleton Key runtime and its local data.\n'
printf '\n'

printf '%s\n' '============================================================'
printf '\n'
