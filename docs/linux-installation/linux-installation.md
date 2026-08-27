# Linux Installation

This guide will walk you through installing FR Legends Skeleton Key on a Linux computer.

No previous Linux, terminal, or command-line experience is required.

Follow the steps in order. Once you reach the end, Skeleton Key should be installed and ready to launch.

---

## What You'll Need

Before beginning, make sure you have:

- A Linux computer
- A working internet connection
- Enough free storage for Skeleton Key and its dependencies
- A user account with permission to install software and packages

You do not need root access to run Skeleton Key itself.

This guide assumes you are using a Debian-based Linux distribution such as:

- Ubuntu
- Linux Mint
- Debian
- Pop!_OS
- Zorin OS
- Other Debian/Ubuntu-based distributions

If you are using a different Linux distribution, the Skeleton Key application may still work, but the package installation commands may be different.

---

# 1. Prepare Linux

## 1.1 Open a Terminal

Skeleton Key is installed and launched through the Linux terminal.

Open your terminal application.

Depending on your Linux distribution, you can usually find it by searching for:

Terminal

You can also commonly open a terminal with:

Ctrl + Alt + T

You should now see a window containing a command prompt.

It may look similar to:

```text
user@computer:~$
```

Your username and computer name will be different.

---

## 1.2 Update Your System

Before installing Skeleton Key, update your package information.

Run:

```bash
sudo apt update
```

Enter your Linux password if requested.

The password will normally not appear on screen while you type it.

Press Enter after entering your password.

Then upgrade installed packages:

```bash
sudo apt upgrade
```

If Linux asks you to confirm the upgrade, enter:

```text
Y
```

and press Enter.

Allow the process to finish.

This may take several minutes depending on your internet connection and how many packages need to be updated.

---

# 2. Install Required Software

Skeleton Key requires several standard Linux development and runtime tools.

The easiest way to install the basic requirements on Debian-based distributions is:

```bash
sudo apt install git curl ca-certificates build-essential python3 make g++ pkg-config sqlite3
```

If prompted to continue, enter:

```text
Y
```

and press Enter.

Allow the installation to finish.

---

# 3. Verify the Requirements

Before downloading Skeleton Key, verify that the required tools are available.

## 3.1 Check Git

Run:

```bash
git --version
```

You should see a Git version number.

For example:

```text
git version 2.x.x
```

If you see a version number, Git is ready.

---

## 3.2 Check Python

Run:

```bash
python3 --version
```

You should see a Python version number.

For example:

```text
Python 3.x.x
```

---

## 3.3 Check SQLite

Run:

```bash
sqlite3 --version
```

You should see a SQLite version number.

---

# 4. Install Node.js

Skeleton Key is a Node.js application.

The recommended Node.js version may change as Skeleton Key develops.

The Skeleton Key installer will verify the Node.js environment required by the current version.

If Node.js is already installed, first check it:

```bash
node --version
```

Then check npm:

```bash
npm --version
```

If both commands return version numbers, Node.js and npm are already available.

If Node.js is not installed, continue with the installation method below.

---

## 4.1 Install Node.js

On Debian-based systems, you can install the distribution-provided Node.js and npm packages with:

```bash
sudo apt install nodejs npm
```

If prompted to continue, enter:

```text
Y
```

and press Enter.

After installation, verify Node.js:

```bash
node --version
```

Then verify npm:

```bash
npm --version
```

You should see version numbers for both.

> IMPORTANT:
> Skeleton Key's supported Node.js version can change between releases.
> If the Skeleton Key installer reports that your Node.js version is unsupported, follow the installer message and the current Skeleton Key documentation rather than forcing an incompatible version.

---

# 5. Download FR Legends Skeleton Key

## 5.1 Clone the Repository

Download the official FR Legends Skeleton Key repository with:

```bash
git clone https://github.com/ethanlabs101/frlegends-skeleton-key.git
```

Git will download the Skeleton Key source files to your Linux home directory.

When the download finishes, enter the repository:

```bash
cd frlegends-skeleton-key
```

You are now inside the Skeleton Key repository.

---

## 5.2 Verify the Repository

Verify your current location:

```bash
pwd
```

You should see a path ending in:

```text
/frlegends-skeleton-key
```

You can also view the repository contents:

```bash
ls
```

You should see the Skeleton Key repository files and directories.

---

# 6. Start the Linux Installer

## 6.1 Locate the Installer

Skeleton Key includes a dedicated Linux installer.

Verify that the installer exists:

```bash
ls installers
```

You should see the installation scripts available for the repository.

The Linux installer is:

```text
install-linux.sh
```

---

## 6.2 Make the Installer Executable

Make the installer executable:

```bash
chmod +x installers/install-linux.sh
```

This allows Linux to execute the installer script.

---

## 6.3 Run the Installer

Start the installer:

```bash
./installers/install-linux.sh
```

The Skeleton Key installer will now begin preparing your Linux environment.

From this point forward, the installer handles the majority of the Skeleton Key installation process.

Follow the instructions displayed by the installer.

---

# 7. Debian Environment

## 7.1 Linux Does Not Require a Debian Container

Unlike the Android Termux installation, the normal Linux installation does not need to create a Debian environment through proot-distro.

You are already running Linux.

The Skeleton Key Linux installer can prepare and run the application directly within your Linux environment.

You therefore do not need to:

- Install Termux
- Install proot-distro
- Create a Debian container
- Enter a Debian proot environment

Those steps are specific to the Android/Termux installation.

---

# 8. Skeleton Key Application Installation

## 8.1 Repository Setup

The Linux installer checks the current Skeleton Key installation and prepares the application.

If no existing installation is detected, the installer can create the required application environment.

The installer will display the locations it uses.

Always treat the paths displayed by the installer as authoritative.

Do not assume that a future version of Skeleton Key will use exactly the same directory structure.

---

## 8.2 Existing Skeleton Key Installation

If the installer detects an existing Skeleton Key installation, it may ask how you want to continue.

Depending on the current installer version, you may see options similar to:

```text
1) Replace application with fresh Git clone
2) Keep existing application
3) Cancel
```

### Keep Existing Application

Choose this option if you want to leave your current application installation untouched.

### Replace Application

Choose this option when you intentionally want to replace the current application source with a fresh copy.

If you choose to replace the application, pay close attention to any warning displayed by the installer.

Always make sure your persistent Vault data is preserved before confirming a replacement.

---

# 9. Install Node.js Dependencies

## 9.1 Installing Dependencies

Skeleton Key uses Node.js packages for its application functionality.

The installer automatically installs the Node.js dependencies required by the current Vault version.

This may take several minutes.

You may see npm messages such as:

```text
npm WARN deprecated ...
```

A warning does not automatically mean that the installation failed.

The important thing is whether npm successfully completes the installation.

A successful installation should report that the Node.js dependencies were installed successfully.

---

## 9.2 npm Errors

If npm encounters a temporary network, registry, or cache problem, the installation may fail during dependency installation.

Do not immediately delete your entire Skeleton Key installation.

First, read the final error message.

If the problem appears to be a temporary download or registry issue:

1. Check your internet connection.
2. Wait a moment.
3. Run the installer again.
4. Review the final error if the problem continues.

For persistent problems, see the troubleshooting documentation.

---

# 10. SQLite Verification

## 10.1 Testing SQLite

Skeleton Key uses SQLite for persistent Vault data.

The installer automatically tests the required SQLite functionality.

A successful installation should report that the SQLite dependency test passed.

This confirms that the required native SQLite dependency is functioning in your Linux environment.

If the SQLite test fails, do not delete your Vault.

See the troubleshooting section before making changes to your installation.

---

# 11. Your Vault

## 11.1 What Is the Vault?

The Skeleton Key Vault is the local environment used to store your persistent Skeleton Key data.

Your application source and your persistent Vault data are treated separately.

This allows the application to be updated without intentionally destroying your local Vault.

---

## 11.2 Persistent Vault Data

The primary persistent Vault data includes:

```text
.vault.lock
identity_vault.db
fr_legends_payloads/
```

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

A successful installation should display an installation completion message and the location of the installed Skeleton Key application.

The exact output may change between versions.

If the installer reports that the installation completed successfully, Skeleton Key is ready to launch.

---

# 13. Launch Skeleton Key

## 13.1 Enter the Vault Directory

The installer should display the directory containing the Skeleton Key Vault.

Use the path shown by the installer.

For example, if the Vault is located at:

```text
~/frlegends-skeleton-key/source/skeleton-key-vault
```

enter:

```bash
cd ~/frlegends-skeleton-key/source/skeleton-key-vault
```

---

## 13.2 Launch the CLI

Run:

```bash
node cli.js
```

The FR Legends Skeleton Key CLI should now appear.

Congratulations.

Your Linux computer is now running the FR Legends Skeleton Key environment.

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

The Linux installation includes the appropriate update script.

The exact updater location may depend on the current Skeleton Key version.

From the Skeleton Key repository, you can inspect the available updater scripts with:

```bash
ls updaters
```

If the Linux updater is present, make it executable:

```bash
chmod +x updaters/update-linux.sh
```

Then run:

```bash
./updaters/update-linux.sh
```

Follow the instructions displayed by the updater.

> IMPORTANT:
> Always use the updater included with the version of Skeleton Key you have installed.
> Do not assume that the updater filename or location will remain identical across future releases.

---

# 16. What Does the Updater Do?

The updater is designed to update the application while preserving persistent Vault data.

Depending on the current Skeleton Key version, the update process can:

1. Check the current installation.
2. Read the current Skeleton Key version.
3. Download the latest repository.
4. Check the downloaded application.
5. Determine whether an update is available.
6. Create a backup of persistent Vault data.
7. Replace application files.
8. Restore persistent Vault data.
9. Install updated Node.js dependencies.
10. Test better-sqlite3.
11. Verify preserved Vault data.
12. Remove temporary update files.
13. Display the previous and installed versions.

Persistent data such as:

```text
.vault.lock
identity_vault.db
fr_legends_payloads/
```

is intended to survive normal application updates.

---

# 17. Important Update Warning

When replacing an existing application installation, always pay attention to the files the updater identifies as persistent data.

Do not manually delete your Vault before updating.

If a future Skeleton Key version requires a migration of existing data, follow the migration instructions provided by that version of Skeleton Key.

---

# 18. Protecting Your Vault

## 18.1 Do Not Delete Your Persistent Data

Your persistent Vault data should be treated as important user data.

The primary persistent locations are:

```text
.vault.lock
identity_vault.db
fr_legends_payloads/
```

Keep these files if you want to preserve your local Vault.

Before manually deleting, replacing, or moving a Skeleton Key installation, make sure you understand what will happen to these files.

---

## 18.2 Payload Data

The:

```text
fr_legends_payloads/
```

directory contains persistent FR Legends payload data.

This includes data used by Skeleton Key for its asset and save-management functionality.

Some payload directories or files may be updated as the FR Legends game itself changes.

Do not assume that replacing the application requires deleting your payload data.

---

# 19. Troubleshooting

## 19.1 Git Is Missing

If Linux reports:

```text
git: command not found
```

install Git:

```bash
sudo apt install git
```

Then verify it:

```bash
git --version
```

---

## 19.2 Node.js Is Missing

If Linux reports:

```text
node: command not found
```

install Node.js and npm:

```bash
sudo apt install nodejs npm
```

Then verify:

```bash
node --version
```

and:

```bash
npm --version
```

If Skeleton Key reports that your Node.js version is unsupported, follow the version requirements reported by the installer or current Skeleton Key documentation.

---

## 19.3 npm Is Missing

If Linux reports:

```text
npm: command not found
```

install npm:

```bash
sudo apt install npm
```

Then verify:

```bash
npm --version
```

---

## 19.4 build-essential Is Missing

If a native Node.js dependency fails to compile and the error indicates that tools such as `make` or `g++` are missing, install the standard build tools:

```bash
sudo apt install build-essential
```

Then run the Skeleton Key installer again.

---

## 19.5 SQLite Dependencies Are Missing

If the installer reports a SQLite-related dependency failure, make sure SQLite and the required development libraries are installed:

```bash
sudo apt install sqlite3 libsqlite3-dev
```

Then run the installer again.

---

## 19.6 npm Installation Failed

If npm reports an error while downloading packages:

1. Check your internet connection.
2. Wait a moment and retry.
3. Read the final npm error.
4. Do not immediately delete your Vault.
5. If the error persists, consult the troubleshooting documentation.

---

## 19.7 Skeleton Key Will Not Launch

First, make sure you are inside the actual Vault directory.

For example:

```bash
cd ~/frlegends-skeleton-key/source/skeleton-key-vault
```

Then run:

```bash
node cli.js
```

If the command still fails, copy the complete error message and consult the troubleshooting documentation.

Do not remove your Vault simply because the application fails to start.

---

## 19.8 Installation Was Interrupted

If the installation was interrupted by:

- Network loss
- Computer shutdown
- Terminal closure
- Manual interruption
- Package installation failure
- npm failure

do not immediately start deleting directories.

Open a new terminal and return to the Skeleton Key repository:

```bash
cd ~/frlegends-skeleton-key
```

Then run the installer again:

```bash
./installers/install-linux.sh
```

The installer will check the environment and existing installation before continuing.

If the problem persists, copy the complete error message and consult the troubleshooting documentation.

---

# 20. Moving or Reinstalling Skeleton Key

If you need to reinstall Skeleton Key, do not immediately delete the existing installation.

First identify where your persistent Vault data is stored.

Check the application documentation and installer output for the current Vault location.

Back up important persistent data before performing destructive changes.

At minimum, pay attention to:

```text
.vault.lock
identity_vault.db
fr_legends_payloads/
```

Once your persistent data is safely backed up, you can proceed with the appropriate reinstall procedure.

---

# 21. Linux Permissions

## 21.1 Do Not Run Skeleton Key as Root

You normally do not need to launch Skeleton Key with:

```bash
sudo node cli.js
```

Run Skeleton Key as your normal Linux user.

Using `sudo` unnecessarily can create files owned by root and cause permission problems later.

For example, prefer:

```bash
node cli.js
```

instead of:

```bash
sudo node cli.js
```

Use `sudo` only when installing system packages or when the installation instructions specifically require it.

---

# 22. File Permissions

If Linux reports:

```text
Permission denied
```

when attempting to run an installer or updater, make sure the script is executable.

For example:

```bash
chmod +x installers/install-linux.sh
```

or:

```bash
chmod +x updaters/update-linux.sh
```

Then run the script again.

---

# 23. Internet Connection Requirements

Skeleton Key requires an internet connection for operations such as:

- Downloading the Skeleton Key repository
- Installing packages
- Installing Node.js dependencies
- Updating Skeleton Key
- Accessing online assets
- Downloading supported asset payloads

If an operation fails while downloading data, first verify that your Linux computer has a working internet connection.

---

# 24. Security and Downloads

Only download FR Legends Skeleton Key from the official repository.

Official Skeleton Key repository:

https://github.com/ethanlabs101/frlegends-skeleton-key

Do not download modified Skeleton Key packages from random websites or file-sharing services.

If someone provides a modified executable, script, archive, or installer claiming to be Skeleton Key, treat it as untrusted unless you can verify where it came from.

---

# 25. Linux Distribution Compatibility

Skeleton Key is primarily designed to run in a standard Linux userspace with the required Node.js environment and dependencies.

Debian-based distributions are the easiest to support because they use the `apt` package manager.

Examples include:

- Ubuntu
- Debian
- Linux Mint
- Pop!_OS
- Zorin OS

Other distributions may also work.

However, package names and installation commands can differ.

For example, Arch Linux uses `pacman` rather than `apt`.

Fedora uses `dnf`.

If you are using a non-Debian-based distribution, do not blindly run the `apt` commands from this guide.

Instead, install the equivalent dependencies using your distribution's package manager.

---

# 26. Reaching the Skeleton Key Repository Again

If you close your terminal and later want to launch Skeleton Key again, you do not need to reinstall it.

Open a terminal and navigate back to the Vault directory.

For example:

```bash
cd ~/frlegends-skeleton-key/source/skeleton-key-vault
```

Then launch:

```bash
node cli.js
```

If your installation uses a different Vault location, use the location displayed by your installer.

---

# 27. Basic Linux Terminal Commands

If you are completely new to Linux, the following commands are useful when working with Skeleton Key.

## 27.1 Show Your Current Directory

```bash
pwd
```

This tells you where you currently are.

---

## 27.2 List Files

```bash
ls
```

This shows the files and directories in your current location.

---

## 27.3 Enter a Directory

```bash
cd directory-name
```

For example:

```bash
cd frlegends-skeleton-key
```

---

## 27.4 Go Back One Directory

```bash
cd ..
```

---

## 27.5 Return Home

```bash
cd ~
```

This returns you to your Linux user's home directory.

---

# 28. Understanding the Installation

Your Linux Skeleton Key installation can be thought of as:

```text
Linux
   ↓
System Dependencies
   ↓
Git
   ↓
Node.js + npm
   ↓
Skeleton Key Repository
   ↓
Skeleton Key Vault
   ↓
FR Legends Skeleton Key CLI
```

Unlike the Android installation, there is no Termux layer and no Debian proot layer.

The Linux operating system provides the environment directly.

---

# 29. Installation Complete

If Skeleton Key launches successfully, your Linux computer is now ready to use the FR Legends Skeleton Key ecosystem.

You have completed:

```text
Linux
   ↓
System Preparation
   ↓
Required Dependencies
   ↓
Git
   ↓
Node.js
   ↓
Skeleton Key Repository
   ↓
Skeleton Key Vault
   ↓
FR Legends Skeleton Key CLI
```

From here, you can begin exploring Skeleton Key.

---

# Continue Learning

[First Launch Guide →]()

[Online Asset Manager Guide →]()

[Troubleshooting Guide →]()

[→ Return to main menu](https://github.com/ethanlabs101/frlegends-skeleton-key)

----
