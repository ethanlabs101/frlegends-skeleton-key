#!/data/data/com.termux/files/usr/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

GITHUB_REPO="https://github.com/ethanlabs101/frlegends-skeleton-key.git"
DEBIAN_ROOTFS="$PREFIX/var/lib/proot-distro/installed-rootfs/debian"
INSTALL_ROOT="/root/frlegends-skeleton-key"
VAULT_DIR="$INSTALL_ROOT/skeleton-key-vault"

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

if [ -d "$DEBIAN_ROOTFS" ]; then
    DEBIAN_EXISTS=1
else
    DEBIAN_EXISTS=0
fi

if [ "$DEBIAN_EXISTS" -eq 1 ]; then

    printf '[+] Debian container detected.\n'
    printf '    %s\n' "$DEBIAN_ROOTFS"
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
                printf '[!] WARNING: This removes the entire Debian proot environment.\n'
                printf '[!] Anything stored inside Debian will be deleted.\n'
                printf '\n'
                printf '[>] Type REINSTALL to confirm: '
                read -r CONFIRM

                if [ "$CONFIRM" != "REINSTALL" ]; then
                    printf '[!] Confirmation failed.\n'
                    exit 1
                fi

                printf '\n[*] Removing existing Debian environment...\n'

                if ! proot-distro remove debian; then
                    printf '[!] Failed to remove the existing Debian environment.\n'
                    exit 1
                fi

                if [ -d "$DEBIAN_ROOTFS" ]; then
                    printf '[!] Debian container still exists after removal.\n'
                    printf '[!] Installation stopped to prevent a container conflict.\n'
                    exit 1
                fi

                printf '[+] Existing Debian environment removed.\n'

                printf '\n[*] Installing fresh Debian environment...\n'

                if ! proot-distro install debian; then
                    printf '[!] Debian installation failed.\n'
                    exit 1
                fi

                if [ ! -d "$DEBIAN_ROOTFS" ]; then
                    printf '[!] Debian installation reported success, but the container was not found.\n'
                    exit 1
                fi

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

    printf '[*] Debian container not found.\n'
    printf '[*] Installing Debian...\n'

    if ! proot-distro install debian; then
        printf '[!] Debian installation failed.\n'
        exit 1
    fi

    if [ ! -d "$DEBIAN_ROOTFS" ]; then
        printf '[!] Debian installation reported success, but the container was not found.\n'
        exit 1
    fi

    printf '[+] Debian installed successfully.\n'

fi

printf '\n[*] Preparing Debian environment...\n'

proot-distro login debian -- bash -c '
set -e

printf "\n"
printf "[*] Updating Debian package lists...\n"
apt-get update

printf "\n"
printf "[*] Installing required system packages...\n"

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

printf "[+] Debian environment prepared.\n"
'

printf '\n[+] Debian environment prepared.\n'

printf '\n[*] Checking for existing FRL Vault installation...\n'

EXISTING_VAULT=0

if proot-distro login debian -- bash -c "[ -f '$VAULT_DIR/package.json' ] && [ -f '$VAULT_DIR/cli.js' ]"; then
    EXISTING_VAULT=1
fi

if [ "$EXISTING_VAULT" -eq 1 ]; then

    printf '[+] Existing FRL Vault installation detected.\n'
    printf '    %s\n' "$VAULT_DIR"
    printf '\n'

    printf 'Choose how to continue:\n'
    printf '\n'
    printf '  1) Replace application files\n'
    printf '  2) Keep existing installation\n'
    printf '  3) Cancel\n'
    printf '\n'

    while true; do
        printf '[>] Select: '
        read -r VAULT_CHOICE

        case "$VAULT_CHOICE" in

            1)
                printf '\n'
                printf '[!] WARNING: Application files will be replaced.\n'
                printf '[!] User data should be preserved before continuing.\n'
                printf '[!] Keep these files/directories:\n'
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

                printf '\n[*] Removing existing application directory...\n'

                proot-distro login debian -- bash -c "
                    set -e

                    mkdir -p '$INSTALL_ROOT'

                    if [ -d '$VAULT_DIR/fr_legends_payloads' ]; then
                        cp -a '$VAULT_DIR/fr_legends_payloads' /tmp/frl_payloads_backup
                    else
                        rm -rf /tmp/frl_payloads_backup
                    fi

                    if [ -f '$VAULT_DIR/.vault.lock' ]; then
                        cp -a '$VAULT_DIR/.vault.lock' /tmp/frl_vault_lock_backup
                    else
                        rm -f /tmp/frl_vault_lock_backup
                    fi

                    if [ -f '$VAULT_DIR/identity_vault.db' ]; then
                        cp -a '$VAULT_DIR/identity_vault.db' /tmp/frl_identity_vault_backup
                    else
                        rm -f /tmp/frl_identity_vault_backup
                    fi

                    rm -rf '$VAULT_DIR'

                    git clone '$GITHUB_REPO' '$INSTALL_ROOT/frlegends-skeleton-key'

                    if [ -d /tmp/frl_payloads_backup ]; then
                        rm -rf '$VAULT_DIR/fr_legends_payloads'
                        cp -a /tmp/frl_payloads_backup '$VAULT_DIR/fr_legends_payloads'
                    fi

                    if [ -f /tmp/frl_vault_lock_backup ]; then
                        cp -a /tmp/frl_vault_lock_backup '$VAULT_DIR/.vault.lock'
                    fi

                    if [ -f /tmp/frl_identity_vault_backup ]; then
                        cp -a /tmp/frl_identity_vault_backup '$VAULT_DIR/identity_vault.db'
                    fi

                    rm -rf /tmp/frl_payloads_backup
                    rm -f /tmp/frl_vault_lock_backup
                    rm -f /tmp/frl_identity_vault_backup
                "

                printf '[+] Application replaced successfully.\n'
                break
                ;;

            2)
                printf '[+] Existing installation will be used.\n'
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

    printf '[*] No existing FRL Vault installation detected.\n'

    printf '[*] Cloning FR Legends Skeleton Key inside Debian...\n'
    printf '    Repository: %s\n' "$GITHUB_REPO"
    printf '\n'

    proot-distro login debian -- bash -c "
        set -e

        mkdir -p '$INSTALL_ROOT'

        if [ -e '$VAULT_DIR' ]; then
            printf '[!] Target directory already exists.\n'
            printf '    %s\n' '$VAULT_DIR'
            exit 1
        fi

        git clone '$GITHUB_REPO' '$VAULT_DIR'
    "

    printf '[+] Repository cloned successfully.\n'

fi

printf '\n[*] Checking Vault application...\n'

if ! proot-distro login debian -- bash -c "[ -f '$VAULT_DIR/package.json' ] && [ -f '$VAULT_DIR/cli.js' ]"; then
    printf '[!] Vault application files were not found.\n'
    exit 1
fi

printf '[+] Vault application found.\n'

printf '\n[*] Installing Node.js dependencies inside Debian...\n'
printf '    This may take a moment.\n'
printf '\n'

proot-distro login debian -- bash -c "
set -e

cd '$VAULT_DIR'

rm -rf node_modules

npm cache verify || true

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
    printf '[*] Creating fr_legends_payloads/\n'
    mkdir -p fr_legends_payloads
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

printf 'Launch command:\n'
printf '  proot-distro login debian\n'
printf '  cd %s\n' "$VAULT_DIR"
printf '  node cli.js\n'
printf '\n'

printf 'IMPORTANT:\n'
printf '  The Termux repository is only the bootstrap/source copy.\n'
printf '  The actual runtime is inside the Debian proot environment.\n'
printf '\n'

printf 'You may delete the Termux repository later if you want to save space:\n'
printf '  %s\n' "$REPO_ROOT"
printf '\n'

printf 'DO NOT delete the Debian copy:\n'
printf '  %s\n' "$INSTALL_ROOT"
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
