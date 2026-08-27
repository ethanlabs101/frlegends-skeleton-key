# Termux Installation

This guide will walk you through installing FR Legends Skeleton Key on an Android device using Termux and Debian.

No previous Linux, terminal, or Termux experience is required.

Follow the steps in order. Once you reach the end, Skeleton Key should be installed and ready to launch.

---

## What You'll Need

Before beginning, make sure you have:

- An Android device
- Android 7 or newer
- An active internet connection
- Enough free storage for Termux, Debian, Skeleton Key, and its dependencies

You do not need root access.

---

# 1. Install Termux

## 1.1 Download Termux

Termux is the Android application that provides the terminal environment used by FR Legends Skeleton Key.

For this guide, we recommend downloading Termux directly from the official Termux GitHub repository.

Official Termux releases:

https://github.com/termux/termux-app/releases

> IMPORTANT:
> Only download Termux from an official distribution source.
> Do not download modified or unofficial Termux APKs.

---

## 1.2 Choose the Correct APK

Open the latest **stable Termux release** (not a beta or other pre-release) and scroll down to the **Assets** section.

You will see several APK files for different Android versions and CPU architectures.

For most modern Android devices running **Android 7 or newer**, use one of the **Android 7+** builds.

#### If your device uses ARM64

Most modern Android phones use ARM64. If you know your device is ARM64, download:

`termux-app_...+apt-android-7-github-debug_arm64-v8a.apk`

#### If you are unsure

If you do not know your device's CPU architecture, use the **Universal Android 7+ APK**:

`termux-app_...+apt-android-7-github-debug_universal.apk`

The Universal APK is larger because it contains support for multiple CPU architectures, but it is the easiest option when you are unsure.

> **When in doubt:** Use the **Android 7+ Universal APK**.

### Important

Do **not** download a beta or pre-release version unless you specifically know that you need it.

Also, do not mix APK variants intended for different Android versions. For example, the `apt-android-7` builds are intended for **Android 7 and newer**, while `apt-android-5` builds are intended for **Android 5 and 6**.

For the most current information about Termux APK variants, Android versions, and installation options, see the official Termux installation documentation:

https://github.com/termux/termux-app#installation

---

## 1.3 Install Termux

After downloading the APK:

1. Open the downloaded APK.
2. Android may display a security warning because the APK was downloaded outside of Google Play.
3. If Android asks you to allow installation from this source, allow it.
4. Return to the APK and install Termux.
5. Open Termux.

You should now see a terminal window.

It will look similar to:

![](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/termux-installation/termux-1.jpg)

---

# 2. Understand Termux

## 2.1 What Is Termux?

If you have never used Termux before, the interface may look unusual.

Termux provides a Linux-style command-line environment directly on your Android device.

Instead of pressing buttons to perform every operation, you enter commands into the terminal.

For example:

echo Hello

would display:

Hello

Skeleton Key uses Termux as the foundation for running its Android installation environment.

You do not need to become a Linux expert to use Skeleton Key.

The installer handles the complicated environment setup for you.

---

# 3. Prepare Termux

## 3.1 Update Termux

Before installing Skeleton Key, update Termux's package information.

Enter:
````md
pkg update && pkg upgrade
````
Then press Enter.

If Termux asks you to confirm an installation or upgrade, enter:

y

and press Enter.

Allow the process to finish.

This may take several minutes depending on your device and internet connection.

---

## 3.2 Install Git

Skeleton Key uses Git to download and manage its repository.

Install Git with:
````md
pkg install git
````
If Termux asks for confirmation, enter:

y

and press Enter.

When the installation finishes, verify Git:
````md
git --version
````
You should see a Git version number.

For example:

git version 2.x.x

If you see a version number, Git is ready.

---

# 4. Download FR Legends Skeleton Key

## 4.1 Clone the Repository

Download the official FR Legends Skeleton Key repository with:
````md
git clone https://github.com/ethanlabs101/frlegends-skeleton-key.git
````
Git will download the Skeleton Key source files to your Termux home directory.

When the download finishes, enter the repository:
````md
cd frlegends-skeleton-key
````
You are now inside the Skeleton Key repository.

---

## 4.2 Verify the Repository

You can verify your current location with:
````md
pwd
````
You should see a path ending in:

/frlegends-skeleton-key

---

# 5. Start the Installer

## 5.1 Make the Installer Executable

Skeleton Key includes a dedicated Termux installer.

Make the installer executable:
````md
chmod +x installers/install-termux.sh
````
This only needs to be done so Termux can execute the installer script.

---

## 5.2 Run the Installer

Start the installer:
````md
./installers/install-termux.sh
````
The Skeleton Key installer will now begin preparing your environment.

From this point forward, the installer handles the majority of the installation process for you.

---

# 6. Debian Environment

## 6.1 Why Does Skeleton Key Use Debian?

Skeleton Key runs inside a Debian environment provided through proot-distro.

This allows Skeleton Key to use a full Linux userspace while still running on an unrooted Android device.

You do not need root access.

You also do not need to manually configure Debian.

The Skeleton Key installer handles the Debian setup.

---

## 6.2 Debian Detection

When the installer starts, it checks whether Debian is already installed.

If Debian is not detected, the installer can install it for you.

If Debian is already installed, you may see:

Choose how to continue:

1) Fresh Debian installation
2) Use existing Debian installation
3) Cancel

### First Installation

If this is your first Skeleton Key installation and Debian does not already exist, allow the installer to perform the fresh installation.

### Existing Installation

If Debian is already installed, select:

2

to use the existing Debian environment.

> IMPORTANT:
> Do not manually create another Debian environment just because one already exists.
> Skeleton Key is designed to detect and reuse the existing environment.

---

# 7. Prepare Debian

## 7.1 Debian System Dependencies

The installer prepares the Debian environment and installs the system dependencies required by Skeleton Key.

Depending on the current version, this may include:

- ca-certificates
- curl
- Git
- build-essential
- Python
- make
- g++
- pkg-config
- SQLite development libraries
- Node.js
- npm
- Other required Debian packages

You do not need to install these manually.

The installer handles this process.

A successful environment preparation will display information similar to:

````md
[+] Debian system dependencies installed.
[+] Node.js version: v20.x.x
[+] npm version: x.x.x
[+] Git version: git version x.x.x
[+] Debian environment prepared.

````

---

# 8. Skeleton Key Application Installation

## 8.1 Repository Setup

After preparing Debian, the installer checks for an existing Skeleton Key installation.

If no installation exists, it downloads the Skeleton Key repository inside Debian.

The runtime is typically placed under:

/root/frlegends-skeleton-key/source/

The actual Vault application is located inside:

/root/frlegends-skeleton-key/source/skeleton-key-vault

The exact location displayed by the installer should always be treated as authoritative.

---

## 8.2 Existing Skeleton Key Installation

If the installer detects an existing Vault installation, it will ask how you want to continue.

Depending on the installer version, you may see options similar to:

1) Replace application with fresh Git clone
2) Keep existing application
3) Cancel

### Keep Existing Application

Choose this option if you want to leave your current installation untouched.

### Replace Application

Choose this option when you intentionally want to replace the current application source with a fresh copy.

If you choose to replace the application, the installer will warn you before continuing.

Always make sure your persistent Vault data is preserved before confirming a replacement.

---

# 9. Install Node.js Dependencies

## 9.1 Installing Dependencies

Skeleton Key is a Node.js application.

The installer automatically installs the Node.js dependencies required by the Vault.

This may take several minutes.

You may see npm messages such as:

npm WARN deprecated ...

A warning does not automatically mean the installation failed.

The important thing is whether npm successfully completes the installation.

A successful installation will report something similar to:

[+] Node.js dependencies installed.

---

## 9.2 npm Errors

If npm encounters a temporary network, registry, or cache problem, the installer may fail during dependency installation.

Do not immediately delete your entire Skeleton Key installation.

First, read the final error message.

If the problem appears to be a temporary download or registry issue:

1. Check your internet connection.
2. Wait a moment.
3. Run the installer again.

For persistent problems, see the troubleshooting documentation.

---

# 10. SQLite Verification

## 10.1 Testing SQLite

Skeleton Key uses SQLite for persistent Vault data.

The installer automatically tests the required better-sqlite3 dependency.

A successful test will display:

[+] better-sqlite3 SQLite test passed.

This confirms that the native SQLite dependency is functioning inside the Debian environment.

---

# 11. Your Vault

## 11.1 What Is the Vault?

The Skeleton Key Vault is the local environment used to store your persistent Skeleton Key data.

Your application source and your persistent Vault data are treated separately.

This allows the application to be updated without intentionally destroying your local Vault.

---

## 11.2 Persistent Vault Data

The primary persistent Vault data includes:

.vault.lock

identity_vault.db

fr_legends_payloads/

### .vault.lock

Stores persistent local Vault and identity information used by Skeleton Key.

### identity_vault.db

The local Vault database.

### fr_legends_payloads/

Contains your FR Legends payload data and related persistent assets.

> IMPORTANT:
> Do not manually delete these files unless you intentionally want to remove or reset your local Vault data.

---

# 12. Installation Complete

## 12.1 Verify the Installation

When the installation finishes, the installer will display an installation summary.

A successful installation will look similar to:
````md
================================================
INSTALLATION COMPLETE
================================================

FRL Skeleton Key is installed inside Debian proot.

Vault location:

/root/frlegends-skeleton-key/source/skeleton-key-vault

Launch command:

cd "/root/frlegends-skeleton-key/source/skeleton-key-vault"
node cli.js
````

If you see the installation completion message, Skeleton Key is ready to launch.

---

# 13. Launch Skeleton Key

## 13.1 Enter the Vault Directory

Use the Vault location displayed by the installer.

For example:
````md
cd "/root/frlegends-skeleton-key/source/skeleton-key-vault"
````
---

## 13.2 Launch the CLI

Run:
````md
node cli.js
````
The FR Legends Skeleton Key CLI should now appear.

Congratulations.

Your Android device is now running the FR Legends Skeleton Key environment.

---

# 14. Your First Launch

## 14.1 Exploring the CLI

Once Skeleton Key launches, you can explore the available tools.

Skeleton Key provides features including:

- Account Management
- Vault Management
- Online Asset Manager
- Asset Installation
- Garage Management
- Player Data Management
- Playtime Management
- Money Management
- Backup and recovery tools
- Other Skeleton Key utilities

You do not need to understand Linux or Node.js to use these features.

The CLI provides the interface for interacting with the Skeleton Key ecosystem.

---

# 15. Updating Skeleton Key

## 15.1 Do I Need to Reinstall Skeleton Key for Every Update?

No.

Once Skeleton Key is installed, use the updater when a new version becomes available.

The Termux/Debian installation includes:

updaters/update-termux.sh

First, make sure you are in debian proot and
in the ~/frlegends-skeleton-key/source/ directory.

Use:
````md
proot-distro login debian
````
(if not in proot) then,
````md
cd ~/frlegends-skeleton-key/source
````
to enter the correct directory.

Second, make the updater executable. Run:
````md
chmod +x updaters/update-termux.sh
````

Run it from the Skeleton Key repository:
````md
./updaters/update-termux.sh
````
The updater checks your current version against the latest version available from the official repository.

---

## 15.2 What Does the Updater Do?

The updater is designed to update the application while preserving your persistent Vault data.

The update process can:

1. Check the current installation.
2. Read the current Skeleton Key version.
3. Download the latest repository.
4. Check the downloaded application.
5. Determine whether an update is available.
6. Create a backup of persistent Vault data.
7. Replace the application files.
8. Restore persistent Vault data.
9. Install updated Node.js dependencies.
10. Test better-sqlite3.
11. Verify preserved Vault data.
12. Remove temporary update files.
13. Display the previous and installed versions.

Persistent data such as:
````md
.vault.lock
identity_vault.db
fr_legends_payloads/
````
is intended to survive normal application updates.

---

## 15.3 Important Update Warning

When replacing an existing application installation, always pay attention to the files the updater identifies as persistent data.

Do not manually delete your Vault before updating.

If a future Skeleton Key version requires a migration of existing data, the updater will handle that through the appropriate migration process.

---

# 16. Important Termux Information

## 16.1 Do Not Mix Termux Distribution Sources

Termux is distributed through multiple channels.

For this guide, GitHub is the recommended source.

Official Termux releases:

https://github.com/termux/termux-app/releases

Do not mix the main Termux application or Termux add-ons from different distribution sources.

For example, avoid installing the main Termux application from one source and then installing an add-on signed by a different source.

This can cause signature and compatibility problems.

If you choose to use a different official Termux distribution source, keep your Termux installation and its add-ons consistent with that source.

---

# 17. Important Debian Information

## 17.1 Do Not Create Duplicate Debian Containers

Skeleton Key uses the Debian environment managed by proot-distro.

If the installer reports that Debian already exists, use the existing Debian environment instead of attempting to create another container with the same name.

An error such as:

Error: container 'debian' already exists.

means a Debian container with that name already exists.

This is not necessarily a broken installation.

The correct action is normally to use the existing Debian environment.

---

## 17.2 Do Not Delete the Debian Environment

The actual Skeleton Key runtime is installed inside Debian.

Your Termux repository and Debian runtime are separate environments.

The Termux repository contains the installer and source used to bootstrap the installation.

The actual runtime is located inside Debian.

Do not delete the Debian environment unless you intentionally want to remove the Skeleton Key runtime.

---

# 18. Protecting Your Vault

## 18.1 Do Not Delete Your Persistent Data

Your persistent Vault data should be treated as important user data.

The primary persistent locations are:

.vault.lock

identity_vault.db

fr_legends_payloads/

Keep these files if you want to preserve your local Vault.

Before manually deleting, replacing, or moving a Skeleton Key installation, make sure you understand what will happen to these files.

---

## 18.2 Payload Data

The fr_legends_payloads/ directory contains persistent FR Legends payload data.

This includes the data used by Skeleton Key for its asset and save-management functionality.

Some payload directories or files may be updated as the FR Legends game itself changes.

Do not assume that replacing the application requires deleting your payload database.

---

# 19. Troubleshooting

## 19.1 Git Is Missing

If Termux reports:

git: command not found

install Git:
````md
pkg install git
````
Then verify it:
````md
git --version
````
---

## 19.2 proot-distro Is Missing

If the installer cannot find proot-distro, install it with:
````md
pkg install proot-distro
````
Then run the Skeleton Key installer again.

---

## 19.3 Debian Already Exists

If you see:

Error: container 'debian' already exists.

do not attempt to create another Debian container with the same name.

Run the Skeleton Key installer again and choose:

Use existing Debian installation

when prompted.

---

## 19.4 npm Installation Failed

If npm reports an error while downloading packages:

1. Check your internet connection.
2. Wait a moment and retry.
3. Read the final npm error.
4. Do not immediately delete your Vault.
5. If the error persists, consult the troubleshooting documentation.

---

## 19.5 Skeleton Key Will Not Launch

First, make sure you are inside the actual Vault directory.

For example (in proot):
````md
cd "/root/frlegends-skeleton-key/source/skeleton-key-vault"
````
Then run:
````md
node cli.js
````
If the command still fails, copy the complete error message and consult the troubleshooting documentation.

---

## 19.6 Installation Was Interrupted

If the installation was interrupted by:

- Network loss
- Android closing Termux
- Battery shutdown
- Manual interruption
- Package installation failure

do not immediately start deleting directories.

Restart Termux and run the installer again.

The installer will check the environment and existing installation before continuing.

If the problem persists, consult the troubleshooting documentation.

---

# You're Done

If Skeleton Key launches successfully, your Android device is now ready to use the FR Legends Skeleton Key ecosystem.

You have completed:
````md
Android
   ↓
Termux
   ↓
Git
   ↓
Skeleton Key Repository
   ↓
Debian / proot-distro
   ↓
Node.js + Dependencies
   ↓
Skeleton Key Vault
   ↓
FR Legends Skeleton Key CLI
````
From here, you can begin exploring Skeleton Key.

---

# Continue Learning

[First Launch Guide →]()

[→ Return to main menu](https://github.com/ethanlabs101/frlegends-skeleton-key)

---
