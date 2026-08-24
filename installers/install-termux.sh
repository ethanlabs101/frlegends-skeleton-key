#!/data/data/com.termux/files/usr/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
VAULT_DIR="$REPO_ROOT/skeleton-key-vault"

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

if proot-distro list 2>/dev/null | grep -q '^debian'; then
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

printf '\n[*] Checking Vault source...\n'

if [ ! -f "$VAULT_DIR/package.json" ]; then
    printf '[!] package.json was not found.\n'
    printf '    Expected:\n'
    printf '    %s/package.json\n' "$VAULT_DIR"
    exit 1
fi

if [ ! -f "$VAULT_DIR/cli.js" ]; then
    printf '[!] cli.js was not found.\n'
    printf '    Expected:\n'
    printf '    %s/cli.js\n' "$VAULT_DIR"
    exit 1
fi

printf '[+] Vault source found.\n'

printf '\n[*] Preparing Debian runtime...\n'

proot-distro login debian -- bash -c '
set -e

printf "\n"
printf "[*] Updating Debian package lists...\n"
apt-get update

printf "\n"
printf "[*] Installing required system packages...\n"

apt-get install -y \
    curl \
    ca-certificates \
    build-essential \
    python3 \
    make \
    g++ \
    pkg-config \
    libsqlite3-dev

printf "\n[+] Debian system dependencies installed.\n"

if ! command -v node >/dev/null 2>&1; then
    printf "\n[*] Node.js is not installed. Installing Node.js...\n"
    apt-get install -y nodejs npm
else
    printf "\n[+] Node.js already installed: "
    node --version
fi

if ! command -v npm >/dev/null 2>&1; then
    printf "[!] npm is not installed.\n"
    exit 1
fi

printf "[+] npm detected: "
npm --version
'

printf '\n[+] Debian runtime prepared.\n'

printf '\n[*] Preparing Debian application directory...\n'

proot-distro login debian -- bash -c '
set -e

mkdir -p /root/frlegends-skeleton-key/skeleton-key-vault
'

printf '[+] Debian application directory ready.\n'

printf '\n[*] Copying FR Legends Skeleton Key into Debian...\n'

proot-distro copy \
    "$VAULT_DIR" \
    debian:/root/frlegends-skeleton-key/skeleton-key-vault

printf '[+] Vault source copied into Debian.\n'

printf '\n[*] Installing Node.js dependencies inside Debian...\n'

proot-distro login debian -- bash -c '
set -e

cd /root/frlegends-skeleton-key/skeleton-key-vault

if [ -f package-lock.json ]; then
    npm ci
else
    npm install
fi

printf "\n[+] Node.js dependencies installed.\n"
'

printf '\n[*] Testing better-sqlite3...\n'

proot-distro login debian -- bash -c '
set -e

cd /root/frlegends-skeleton-key/skeleton-key-vault

node -e "
const Database = require(\"better-sqlite3\");
const db = new Database(\":memory:\");
db.prepare(\"SELECT 1\").get();
db.close();
console.log(\"[+] better-sqlite3 SQLite test passed.\");
"
'

printf '\n'
printf '%s\n' '============================================================'
printf '%s\n' '                 INSTALLATION COMPLETE'
printf '%s\n' '============================================================'
printf '\n'

printf 'FRL Skeleton Key is installed inside Debian proot.\n'
printf '\n'

printf 'Vault location inside Debian:\n'
printf '  /root/frlegends-skeleton-key/skeleton-key-vault\n'
printf '\n'

printf 'Launch command:\n'
printf '  proot-distro login debian\n'
printf '  cd /root/frlegends-skeleton-key/skeleton-key-vault\n'
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
printf '  /root/frlegends-skeleton-key/\n'
printf '\n'

printf 'KEEP YOUR LOCAL VAULT DATA:\n'
printf '  .vault.lock\n'
printf '  identity_vault.db\n'
printf '  fr_legends_payloads/\n'
printf '\n'

printf 'When updating or replacing the application, preserve those files.\n'
printf '\n'

printf '%s\n' '============================================================'
printf '\n'
