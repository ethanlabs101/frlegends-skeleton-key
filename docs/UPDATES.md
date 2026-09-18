# How To Update

This guide explains how to update **FR Legends Skeleton Key Vault** on Linux and Android/Termux.

Skeleton Key uses separate update workflows for standard Linux and Termux/Debian environments.

The update system is designed to replace the application code while preserving important local Vault data.

---

## Table of Contents

* [Before Updating](#before-updating)
* [What the Updater Preserves](#what-the-updater-preserves)
* [What Gets Updated](#what-gets-updated)
* [Linux](#linux)

  * [Linux Requirements](#linux-requirements)
  * [Linux Update Process](#linux-update-process)
  * [Linux Update Verification](#linux-update-verification)
* [Android / Termux](#android--termux)

  * [How Termux Is Structured](#how-termux-is-structured)
  * [Termux Requirements](#termux-requirements)
  * [Entering Debian](#entering-debian)
  * [Termux Update Process](#termux-update-process)
  * [Termux Update Verification](#termux-update-verification)
* [Installer vs Updater](#installer-vs-updater)
* [What Happens During an Update](#what-happens-during-an-update)
* [Troubleshooting](#troubleshooting)
* [Manual Recovery](#manual-recovery)
* [Important Data Safety Notes](#important-data-safety-notes)

---

# Before Updating

Before updating Skeleton Key:

1. Exit the Skeleton Key CLI.
2. Make sure no Skeleton Key process is currently running.
3. Make sure you have enough disk space for the temporary repository download and dependency installation.
4. Do not manually delete your Vault data before running the updater.
5. If your installation contains important account or save data, make an additional manual backup before performing major updates.

The updater already creates a temporary backup of important local Vault data before replacing the application.

---

# What the Updater Preserves

The updater specifically preserves:

```text
.vault.lock
identity_vault.db
fr_legends_payloads/
```

These are treated as local Vault data rather than replaceable application source code.

## `.vault.lock`

The local Vault lock file is preserved during an update.

This prevents the updater from replacing the local lock state with the copy from the downloaded repository.

## `identity_vault.db`

The local SQLite identity database is preserved.

This is important because the database contains locally stored Skeleton Key account/identity information.

The updater does not replace this database with a fresh repository copy.

## `fr_legends_payloads/`

The entire payload directory is preserved.

This includes locally maintained data such as:

```text
fr_legends_payloads/
├── backups/
├── init/
├── templates/
└── other local payload data
```

The updater preserves the directory as a complete unit rather than selectively copying individual files.

This is intentional.

---

# What Gets Updated

The updater downloads the latest repository version and replaces the application source under:

```text
skeleton-key-vault/
```

The following are therefore refreshed from the repository:

```text
cli.js
src/
sandbox/
menu/
utils/
assets/
package.json
package-lock.json
and other tracked application files
```

After the new application files are installed, Node.js dependencies are installed again.

If a `package-lock.json` exists, the updater uses:

```bash
npm ci
```

Otherwise it falls back to:

```bash
npm install
```

The updater also performs a `better-sqlite3` SQLite test before considering the update complete.

---

# Linux

The Linux updater is intended for standard Linux installations.

It is separate from the Termux/Debian updater.

## Linux Requirements

The Linux updater expects:

* Linux
* Git
* An existing Skeleton Key installation
* A working Node.js/npm environment
* Access to the Skeleton Key repository

The updater verifies that the existing installation contains:

```text
skeleton-key-vault/package.json
skeleton-key-vault/cli.js
```

If either file is missing, the updater stops instead of attempting to replace the installation.

---

# Linux Update Process

Navigate to the Skeleton Key repository/application directory.

The Linux repository structure should look approximately like:

```text
frlegends-skeleton-key/
├── installers/
├── updaters/
│   ├── update-linux.sh
│   └── update-termux.sh
└── skeleton-key-vault/
```

Run the Linux updater:

```bash
bash updaters/update-linux.sh
```

If the script is executable, you can also run:

```bash
./updaters/update-linux.sh
```

The updater checks that it is running on Linux.

It then verifies the current Skeleton Key installation.

---

## Linux Update Confirmation

The updater displays a warning explaining that the application code will be replaced.

It also lists the data that will be preserved:

```text
.vault.lock
identity_vault.db
fr_legends_payloads/
```

To continue, enter:

```text
UPDATE
```

If anything other than `UPDATE` is entered, the updater cancels without replacing the application.

---

## Linux Update Process

Once confirmed, the updater performs the following operations:

### 1. Prepare temporary directories

The updater creates temporary working directories used during the update.

### 2. Back up local Vault data

It copies:

```text
.vault.lock
identity_vault.db
fr_legends_payloads/
```

into the temporary update backup.

### 3. Download the latest repository

The updater performs a shallow Git clone of the latest repository.

Only the latest repository state is required for the update.

### 4. Verify the downloaded application

The updater checks that the downloaded repository contains:

```text
skeleton-key-vault/package.json
skeleton-key-vault/cli.js
```

If these files are missing, the update stops before installing the new Vault.

### 5. Restore local data into the new Vault

The preserved local data is copied into the newly downloaded Vault.

### 6. Replace the existing application

The previous application directory is temporarily moved aside.

The newly downloaded Vault is then moved into its place.

### 7. Install dependencies

The updater runs:

```bash
npm ci
```

when `package-lock.json` is present.

Otherwise it runs:

```bash
npm install
```

### 8. Test SQLite

The updater loads:

```text
better-sqlite3
```

and performs a simple SQLite query.

A successful result looks like:

```text
[+] better-sqlite3 SQLite test passed.
```

### 9. Verify preserved data

The updater checks that the preserved Vault data still exists.

### 10. Clean temporary files

Temporary update, backup, and old application directories are removed after successful completion.

---

# Linux Update Verification

After the updater reports:

```text
UPDATE COMPLETE
```

enter the Vault:

```bash
cd skeleton-key-vault
```

You can verify the important local data:

```bash
ls -la .vault.lock identity_vault.db
```

and:

```bash
ls -ld fr_legends_payloads
```

Test the SQLite dependency:

```bash
node -e "require('better-sqlite3'); console.log('better-sqlite3 OK')"
```

Finally launch Skeleton Key:

```bash
node cli.js
```

If the CLI starts normally and your local Vault data remains available, the update completed successfully.

---

# Android / Termux

Termux installations use a different architecture.

Skeleton Key does **not** run directly inside the normal Termux shell.

Instead, the supported setup is:

```text
Android
└── Termux
    └── proot-distro
        └── Debian
            └── FR Legends Skeleton Key
```

The Termux updater therefore runs **inside the Debian environment**.

---

# How Termux Is Structured

A typical Termux installation looks approximately like:

```text
Termux
└── Debian
    └── /root/frlegends-skeleton-key/
        └── source/
            ├── installers/
            ├── updaters/
            │   ├── update-linux.sh
            │   └── update-termux.sh
            └── skeleton-key-vault/
```

The actual Vault application is located inside:

```text
/root/frlegends-skeleton-key/source/skeleton-key-vault
```

The Termux updater operates on that Vault.

---

# Termux Requirements

The Termux updater expects:

* Termux
* proot-distro
* Debian
* Git
* An existing Skeleton Key installation
* Node.js
* npm

The updater automatically checks whether it is running inside Debian.

If it is launched directly from the normal Termux shell, it stops and tells you to enter Debian first.

---

# Entering Debian

From the normal Termux shell:

```bash
proot-distro login debian
```

You should then see a Debian shell similar to:

```text
root@localhost:~#
```

Navigate to the Skeleton Key installation:

```bash
cd /root/frlegends-skeleton-key/source
```

---

# Termux Update Process

From inside Debian, run:

```bash
bash updaters/update-termux.sh
```

If the script is executable:

```bash
./updaters/update-termux.sh
```

Do not run the Termux updater directly from the normal Termux shell.

---

# Termux Version Check

The Termux updater checks for a local:

```text
version.json
```

when available.

It reads the current version from the installed Vault and then downloads the latest repository.

The downloaded repository is checked for its own `version.json`.

If the installed version matches the downloaded version, the updater reports that Skeleton Key is already up to date and exits without replacing the application.

If a different version is detected, the updater asks for confirmation.

---

# Termux Update Confirmation

When an update is available, the updater displays the current and latest versions.

To continue, enter:

```text
UPDATE
```

If you enter anything else, the update is cancelled.

---

# Termux Update Process

The Termux updater performs the following operations:

### 1. Verify Debian

The updater confirms that it is running inside the Debian proot environment.

### 2. Check Git

If Git is missing, the updater installs it through Debian's package manager.

### 3. Verify the current Vault

The updater checks for:

```text
skeleton-key-vault/package.json
skeleton-key-vault/cli.js
```

If the Vault is missing, the updater stops and instructs you to run the installer first.

### 4. Read the current version

The updater checks the installed `version.json` when available.

### 5. Download the latest repository

The updater creates a temporary directory and performs a shallow Git clone.

### 6. Verify the downloaded Vault

The downloaded repository must contain:

```text
skeleton-key-vault/package.json
skeleton-key-vault/cli.js
```

### 7. Compare versions

The updater compares the current and downloaded versions.

If they match, no update is performed.

### 8. Back up persistent data

The updater temporarily preserves:

```text
.vault.lock
identity_vault.db
fr_legends_payloads/
```

### 9. Replace application files

The downloaded Vault replaces the existing application files.

### 10. Restore persistent data

The updater copies the preserved local Vault data back into the new installation.

### 11. Install dependencies

The updater runs:

```bash
npm ci
```

when a lockfile is available.

Otherwise it uses:

```bash
npm install
```

### 12. Test `better-sqlite3`

The updater performs a SQLite test using:

```text
better-sqlite3
```

### 13. Verify persistent data

The updater checks that the preserved Vault data exists.

### 14. Clean temporary files

Temporary update and backup directories are removed after a successful update.

---

# Termux Update Verification

After the updater reports:

```text
UPDATE COMPLETE
```

verify the Vault:

```bash
cd /root/frlegends-skeleton-key/source/skeleton-key-vault
```

Check Node.js:

```bash
node --version
```

Check npm:

```bash
npm --version
```

Check the preserved data:

```bash
ls -la .vault.lock identity_vault.db
```

and:

```bash
ls -ld fr_legends_payloads
```

Test SQLite:

```bash
node -e "require('better-sqlite3'); console.log('better-sqlite3 OK')"
```

Then launch Skeleton Key:

```bash
node cli.js
```

---

# Installer vs Updater

The installer and updater are different tools.

## Installer

The installer is for setting up Skeleton Key on a machine or device that does not already have a working installation.

For Termux, the installer also creates/configures the Debian environment and installs the required system dependencies.

Use the installer when:

* Installing Skeleton Key for the first time
* Rebuilding a fresh Termux environment
* Setting up a new device
* Recovering from a completely removed installation

Do not use the installer simply because a new Skeleton Key version has been released.

---

## Updater

The updater is for an existing installation.

Use the updater when:

* A new Skeleton Key version is available
* You want to pull the latest application code
* You want to update without manually replacing the Vault
* You need the updater to preserve local Vault data automatically

The updater is specifically designed to separate:

```text
Application code
```

from:

```text
Persistent local Vault data
```

---

# What Happens During an Update

The general update flow is:

```text
Existing Vault
      │
      ▼
Verify installation
      │
      ▼
Confirm update
      │
      ▼
Back up persistent data
      │
      ├── .vault.lock
      ├── identity_vault.db
      └── fr_legends_payloads/
      │
      ▼
Download latest repository
      │
      ▼
Verify new Vault
      │
      ▼
Replace application code
      │
      ▼
Restore persistent data
      │
      ▼
Install npm dependencies
      │
      ▼
Test better-sqlite3
      │
      ▼
Verify preserved data
      │
      ▼
Remove temporary files
      │
      ▼
UPDATE COMPLETE
```

The important concept is that an update is **not** simply:

```text
git pull
```

The updater intentionally performs a controlled replacement so local Vault data can survive application updates.

---

# Troubleshooting

## "Vault installation was not found"

If the updater reports that it cannot find:

```text
skeleton-key-vault/package.json
```

or:

```text
skeleton-key-vault/cli.js
```

make sure you are running the correct updater from the correct installation.

The updater is designed for an existing Skeleton Key installation.

If Skeleton Key has never been installed on the device, use the installer instead.

---

## "This updater must be run inside the Debian proot environment"

This message applies to the Termux updater.

You are probably still in the normal Termux shell.

Run:

```bash
proot-distro login debian
```

Then navigate back to the Skeleton Key repository:

```bash
cd /root/frlegends-skeleton-key/source
```

and run:

```bash
bash updaters/update-termux.sh
```

---

## Git is missing

The Linux updater expects Git to already be installed.

On Linux, install Git using your distribution's package manager.

For Debian/Ubuntu-based systems:

```bash
sudo apt update
sudo apt install git
```

The Termux/Debian updater can install Git automatically if it is missing.

---

## npm dependency installation fails

If the updater fails during:

```text
npm ci
```

do not immediately delete:

```text
identity_vault.db
.vault.lock
fr_legends_payloads/
```

Those files are persistent local data.

First record the complete npm error output.

Check:

```bash
node --version
npm --version
```

and verify network access.

On Termux, also verify that you are using the current supported installation environment created by the Termux installer.

---

## `better-sqlite3` test fails

The updater explicitly tests:

```text
better-sqlite3
```

because Skeleton Key depends on SQLite functionality.

If the test fails after dependencies are installed, do not assume the Vault itself is corrupted.

Check:

```bash
node --version
npm --version
```

and capture the complete error.

The problem may involve Node.js, native module compilation, architecture compatibility, or the local dependency installation.

---

## Update was cancelled

If you do not enter:

```text
UPDATE
```

the updater intentionally exits without replacing the application.

This is normal behavior.

Simply run the updater again when you are ready.

---

## Skeleton Key starts but local data appears missing

First verify:

```bash
ls -la .vault.lock identity_vault.db
```

and:

```bash
ls -ld fr_legends_payloads
```

The updater is specifically designed to preserve these items.

If they are missing after an update, stop making additional changes to the installation and preserve the current state before attempting recovery.

---

# Manual Recovery

If an update fails after application files have been replaced, do not immediately delete the installation.

The updater is designed to validate the downloaded Vault before replacing the existing application.

For Linux, the updater also uses temporary backup and old-installation directories during the replacement process.

For Termux/Debian, the updater similarly creates temporary backup data before replacing the Vault.

If an unexpected failure occurs:

1. Stop the application.
2. Save the complete terminal output.
3. Do not delete `identity_vault.db`.
4. Do not delete `.vault.lock`.
5. Do not delete `fr_legends_payloads/`.
6. Do not repeatedly run different installers over the same installation.
7. Keep the current directory intact until the problem is understood.

If necessary, consult the project's troubleshooting documentation before performing additional recovery steps.

---

# Important Data Safety Notes

Skeleton Key's updater is designed to preserve local Vault data, but users should still maintain independent backups of important data.

In particular, keep backups of:

```text
identity_vault.db
.vault.lock
fr_legends_payloads/
```

The updater's backup process is intended to protect local data during the update operation.

It should not be treated as a replacement for an independent backup strategy.

---

# Recommended Update Workflow

For normal updates, use this workflow:

## Linux

```bash
cd /path/to/frlegends-skeleton-key
bash updaters/update-linux.sh
```

Confirm:

```text
UPDATE
```

Then verify:

```bash
cd skeleton-key-vault
node cli.js
```

---

## Termux

Enter Debian:

```bash
proot-distro login debian
```

Navigate to Skeleton Key:

```bash
cd /root/frlegends-skeleton-key/source
```

Run:

```bash
bash updaters/update-termux.sh
```

Confirm:

```text
UPDATE
```

Then verify:

```bash
cd skeleton-key-vault
node cli.js
```

---

# Final Notes

The Skeleton Key update system is designed around one core principle:

> Update the framework without destroying the user's local Vault.

Application code can change.

Dependencies can change.

Menus and modules can change.

The local Vault data should remain separate from those changes.

For that reason, both update paths explicitly preserve:

```text
.vault.lock
identity_vault.db
fr_legends_payloads/
```

while replacing the application source with the latest repository version.

Always exit Skeleton Key before updating, keep independent backups of important data, and allow the updater to complete its validation and cleanup process before launching the application again.
