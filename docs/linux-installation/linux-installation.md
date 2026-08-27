# Linux Installation

This guide will walk you through installing FR Legends Skeleton Key on a Linux computer.

No previous Linux, terminal, or command-line experience is required.

Follow the steps in order. Once you reach the end, Skeleton Key should be installed and ready to launch.

---

## What You'll Need

Before beginning, make sure you have:

- A Linux computer
- A Terminal
- A working internet connection
- Enough free storage for Skeleton Key and its dependencies

You do not need root access to run Skeleton Key itself.

This guide assumes you are using a Debian/Ubuntu-based or Arch-based Linux distribution such as:

- Ubuntu
- Linux Mint
- Debian
- Pop!_OS
- Zorin OS
- Arch Linux
- CachyOS
- Other Debian/Ubuntu/Arch-based distributions

If you are using a different Linux distribution, the Skeleton Key application may still work, but the package installation commands may be different.

---

# 1. Prepare Linux

## 1.1 Open a Terminal

Skeleton Key is installed and launched through the Linux terminal.

Open your terminal application.

Depending on your Linux distribution, you can usually find it by searching for:

Terminal

You can also commonly open a terminal with:

Ctrl + Alt + T or Win + Enter

You should now see a window containing a command prompt.

It may look similar to:

```text
user@computer:~$
```

Your username and computer name will be different.

---

## 1.2 Update Your System

Before installing Skeleton Key, update your package information.

### Debian/Ubuntu-based systems

Run:

```bash
sudo apt update
```

Then upgrade installed packages:

```bash
sudo apt upgrade
```

If Linux asks you to confirm the upgrade, enter:

```text
Y
```

and press Enter.

### Arch-based systems

Run:

```bash
sudo pacman -Syu
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

The Skeleton Key Linux installer handles the application's Node.js dependencies.

You do **not** need to manually install `build-essential`, `g++`, SQLite development libraries, or other application build dependencies just to run the installer.

The Linux installer performs the following checks itself:

- Node.js
- npm
- Application structure
- Application directories
- Node.js dependencies
- Vault data
- Vault directory permissions

You only need to make sure the basic tools required to obtain and run the repository are available.

The primary requirement that this guide installs before cloning the repository is Git.

---

## 2.1 Install Git

### Debian/Ubuntu-based systems

Run:

```bash
sudo apt install git
```

### Arch-based systems

Run:

```bash
sudo pacman -S git
```

If prompted to continue, enter:

```text
Y
```

and press Enter.

Allow the installation to finish.

---

# 3. Verify the Requirements

Before downloading Skeleton Key, verify that Git is available.

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

## 3.2 Check Node.js

The Linux installer requires Node.js.

Run:

```bash
node --version
```

You should see a Node.js version number.

For example:

```text
v20.x.x
```

If Node.js is not installed, the Skeleton Key installer will stop and tell you that Node.js needs to be installed.

---

## 3.3 Check npm

Run:

```bash
npm --version
```

You should see an npm version number.

For example:

```text
10.x.x
```

If npm is not installed, the Skeleton Key installer will stop and tell you that npm needs to be installed.

> IMPORTANT:
> The supported Node.js version may change as Skeleton Key develops.
> If the installer reports that your installed Node.js version is unsupported, follow the current Skeleton Key documentation for the required version.

---

# 4. Install Node.js

Skeleton Key is a Node.js application.

If Node.js and npm are already installed and both commands from Section 3 return version numbers, you can continue to Section 5.

If Node.js is not installed, install it using your distribution's package manager.

## 4.1 Debian/Ubuntu-based Systems

You can install the distribution-provided Node.js and npm packages with:

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

Both commands should return version numbers.

> IMPORTANT:
> Do not install additional development packages such as `build-essential` or `g++` unless the installer or a dependency error specifically requires them.
>
> The Skeleton Key installer runs `npm ci` when a `package-lock.json` exists, or `npm install` otherwise. Native dependencies are handled through the Node.js dependency installation process.

---

## 4.2 Arch-based Systems

On Arch-based systems, Node.js and npm can be installed with:

```bash
sudo pacman -S nodejs npm
```

Then verify:

```bash
node --version
```

and:

```bash
npm --version
```

Both commands should return version numbers.

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

Verify that the installer directory exists:

```bash
ls installers
```

You should see the available installation scripts.

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

The Skeleton Key Linux installer will now begin preparing the application.

The installer checks that:

- The operating system is Linux
- The Skeleton Key project structure exists
- `package.json` exists
- `cli.js` exists
- Node.js is installed
- npm is installed
- The Vault directories can be prepared
- Node.js dependencies can be installed
- Persistent Vault data can be detected
- The Vault directory is writable

From this point forward, the installer handles the Skeleton Key application installation process.

> IMPORTANT:
> You do not need to manually install `build-essential`, `g++`, SQLite development libraries, or other Skeleton Key application dependencies before running this installer unless a specific dependency failure tells you that they are required.

---

# 7. Understanding the Linux Installer

## 7.1 Project Structure Check

The installer first determines the location of the repository and the Skeleton Key Vault.

The application is expected to contain:

```text
skeleton-key-vault/package.json
skeleton-key-vault/cli.js
```

If either file is missing, the installer stops.

This prevents the installer from attempting to install into an incomplete or incorrect repository.

---

## 7.2 Node.js Check

The installer checks whether the `node` command is available.

If Node.js is missing, the installer displays:

```text
[!] Node.js is not installed.
```

The installer does not automatically install Node.js.

Install Node.js using your distribution's package manager, then run the installer again.

---

## 7.3 npm Check

The installer also checks whether npm is available.

If npm is missing, the installer displays:

```text
[!] npm is not installed.
```

Install npm using your distribution's package manager, then run the installer again.

---

# 8. Application Directories

The installer prepares the required payload directory automatically.

It creates:

```text
fr_legends_payloads/
```

inside the Skeleton Key Vault.

You do not need to manually create this directory.

If the directory cannot be created, the installation will stop.

---

# 9. Install Node.js Dependencies

## 9.1 Installing Dependencies

The installer enters the Skeleton Key Vault directory and installs the Node.js dependencies.

If the repository contains:

```text
package-lock.json
```

the installer uses:

```bash
npm ci
```

If no `package-lock.json` exists, the installer uses:

```bash
npm install
```

This is important because the installer determines the correct installation method automatically.

You do not need to manually run `npm install` before running the installer.

---

## 9.2 npm Messages

During installation, npm may display warnings such as:

```text
npm WARN deprecated ...
```

A warning does not automatically mean the installation failed.

The important part is whether npm finishes successfully.

A successful installation will be followed by:

```text
[+] Dependencies installed successfully.
```

---

## 9.3 Native Node.js Dependencies

Some Node.js packages may contain native components.

If npm successfully installs the dependencies, no additional manual build-tool installation is necessary.

If npm fails with an error specifically stating that a compiler, `make`, `g++`, Python, or another build tool is missing, install the required package using your Linux distribution's package manager and then run the installer again.

For example, on Debian/Ubuntu:

```bash
sudo apt install build-essential
```

Do not install these packages preemptively unless they are actually required by your dependency installation.

---

# 10. Vault Data

## 10.1 What Is the Vault?

The Skeleton Key Vault is the local environment used to store persistent Skeleton Key data.

The Vault exists inside the Skeleton Key application directory.

The installer checks for existing Vault data instead of assuming that every installation is completely new.

---

## 10.2 Persistent Vault Data

The installer checks for:

```text
.vault.lock
identity_vault.db
fr_legends_payloads/
```

These are important persistent files and directories.

### .vault.lock

Persistent local Vault and identity information used by Skeleton Key.

### identity_vault.db

The local Vault database.

### fr_legends_payloads/

Persistent FR Legends payload data used by Skeleton Key.

> IMPORTANT:
> Do not manually delete these files or directories unless you intentionally want to remove or reset your local Vault data.

---

# 11. Vault Permissions

The installer checks whether the current Linux user can write to the Vault directory.

A successful permission check displays:

```text
[+] Vault directory is writable.
```

If the directory is not writable, the installer reports:

```text
[!] The Vault directory is not writable by the current user.
```

The installer does not automatically take ownership of files belonging to another Linux user.

> IMPORTANT:
> Do not solve permission problems by running Skeleton Key itself as root.
>
> Avoid launching the CLI with:
>
> ```bash
> sudo node cli.js
> ```
>
> Running the application as root can create root-owned files and cause additional permission problems later.

---

# 12. Installation Complete

When the installer finishes successfully, it displays:

```text
============================================================
                 INSTALLATION COMPLETE
============================================================
```

It will also display the actual Vault location detected by the installer.

For example:

```text
Vault location:
  /home/user/frlegends-skeleton-key/skeleton-key-vault
```

The exact location depends on where you cloned the repository.

Always use the location printed by the installer rather than assuming a fixed path.

---

# 13. Launch Skeleton Key

## 13.1 Enter the Vault Directory

Use the Vault location displayed by the installer.

For example:

```bash
cd ~/frlegends-skeleton-key/skeleton-key-vault
```

The exact path may be different on your system.

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

The CLI provides the interface for interacting with the Skeleton Key ecosystem.

---

# 15. Updating Skeleton Key

## 15.1 Do I Need to Reinstall Skeleton Key for Every Update?

No.

Once Skeleton Key is installed, use the updater when a new version becomes available.

The available updater scripts can be viewed with:

```bash
ls updaters
```

If the repository contains a Linux updater, it may be named:

```text
update-linux.sh
```

Always use the updater included with the current Skeleton Key repository.

---

## 15.2 Run the Linux Updater

If `update-linux.sh` exists, make it executable:

```bash
chmod +x updaters/update-linux.sh
```

Then run:

```bash
./updaters/update-linux.sh
```

Follow the instructions displayed by the updater.

> IMPORTANT:
> The updater filename and behavior may change between Skeleton Key releases.
> Always follow the updater included with your current repository version.

---

# 16. Persistent Vault Data During Updates

When updating Skeleton Key, persistent Vault data should be preserved.

Important data includes:

```text
.vault.lock
identity_vault.db
fr_legends_payloads/
```

Do not manually delete these files before updating.

If a future Skeleton Key version requires a database migration or other data migration, follow the migration instructions provided by that version.

---

# 17. Protecting Your Vault

## 17.1 Do Not Delete Persistent Data

Your persistent Vault data should be treated as important user data.

Before manually replacing, moving, or deleting a Skeleton Key installation, make sure you know where your Vault data is stored.

At minimum, pay attention to:

```text
.vault.lock
identity_vault.db
fr_legends_payloads/
```

---

## 17.2 Back Up Your Vault

Before performing destructive maintenance, create a backup of your persistent Vault data.

A basic backup can be created from the parent directory of your Vault.

For example:

```bash
cp -a skeleton-key-vault skeleton-key-vault-backup
```

Only perform this type of backup while you understand which directory contains your actual Vault.

For important data, verify that the backup exists before deleting or replacing anything.

---

# 18. Linux Permissions

## 18.1 Do Not Run Skeleton Key as Root

You normally do not need to launch Skeleton Key with:

```bash
sudo node cli.js
```

Run Skeleton Key as your normal Linux user.

Prefer:

```bash
node cli.js
```

instead of:

```bash
sudo node cli.js
```

Use `sudo` for system package installation when required, not for normal Skeleton Key operation.

---

# 19. File Permissions

If Linux reports:

```text
Permission denied
```

when attempting to run an installer or updater, make sure the script is executable.

For example:

```bash
chmod +x installers/install-linux.sh
```

For an updater:

```bash
chmod +x updaters/update-linux.sh
```

Then run the appropriate script again.

---

# 20. Troubleshooting

## 20.1 Git Is Missing

If Linux reports:

```text
git: command not found
```

install Git.

### Debian/Ubuntu:

```bash
sudo apt install git
```

### Arch:

```bash
sudo pacman -S git
```

Then verify:

```bash
git --version
```

---

## 20.2 Node.js Is Missing

If Linux reports:

```text
node: command not found
```

install Node.js and npm.

### Debian/Ubuntu:

```bash
sudo apt install nodejs npm
```

### Arch:

```bash
sudo pacman -S nodejs npm
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

## 20.3 npm Is Missing

If Linux reports:

```text
npm: command not found
```

install npm.

### Debian/Ubuntu:

```bash
sudo apt install npm
```

### Arch:

```bash
sudo pacman -S npm
```

Then verify:

```bash
npm --version
```

---

## 20.4 npm Installation Failed

If npm reports an error while installing packages:

1. Check your internet connection.
2. Read the final npm error.
3. Check whether the error identifies a missing system dependency.
4. Install only the dependency specifically required by the error.
5. Run the Skeleton Key installer again.
6. Do not immediately delete your Vault.

For example, if npm explicitly reports that `make` or `g++` is missing on Debian/Ubuntu, install:

```bash
sudo apt install build-essential
```

Then run the installer again.

---

## 20.5 Native Module Compilation Failed

If a Node.js native dependency fails to compile, read the npm error carefully.

The error may identify a missing compiler or development tool.

On Debian/Ubuntu, a common set of build tools is:

```bash
sudo apt install build-essential
```

Only install these tools if the dependency error actually requires them.

After installation, return to the Skeleton Key repository and run:

```bash
./installers/install-linux.sh
```

---

## 20.6 Skeleton Key Will Not Launch

First, make sure you are inside the actual Skeleton Key Vault directory.

For example:

```bash
cd ~/frlegends-skeleton-key/skeleton-key-vault
```

Then run:

```bash
node cli.js
```

If the command still fails, copy the complete error message.

Do not delete your Vault simply because the application fails to start.

---

## 20.7 Permission Denied

If you receive:

```text
Permission denied
```

when executing the installer:

```bash
chmod +x installers/install-linux.sh
```

Then:

```bash
./installers/install-linux.sh
```

For the updater:

```bash
chmod +x updaters/update-linux.sh
```

Then:

```bash
./updaters/update-linux.sh
```

Do not automatically use `sudo` to bypass the problem.

---

## 20.8 Installation Was Interrupted

If installation was interrupted by:

- Network loss
- Computer shutdown
- Terminal closure
- Manual interruption
- Package installation failure
- npm failure

do not immediately delete the installation.

Open a new terminal and return to the Skeleton Key repository:

```bash
cd ~/frlegends-skeleton-key
```

Then run:

```bash
./installers/install-linux.sh
```

The installer will check the project structure and existing Vault data again.

If the problem persists, copy the complete error message.

---

# 21. Moving or Reinstalling Skeleton Key

If you need to move or reinstall Skeleton Key, do not immediately delete the existing installation.

First identify the location of your Vault.

The installer displays the Vault location when installation completes.

Back up important persistent data before performing destructive changes.

Pay particular attention to:

```text
.vault.lock
identity_vault.db
fr_legends_payloads/
```

Once your persistent data is safely backed up, proceed with the appropriate reinstall procedure.

---

# 22. Internet Connection Requirements

Skeleton Key may require an internet connection for operations such as:

- Cloning the Skeleton Key repository
- Installing Node.js dependencies
- Updating Skeleton Key
- Accessing online assets
- Downloading supported asset payloads
- Other online Skeleton Key functionality

If an operation fails while downloading data, first verify that your Linux computer has a working internet connection.

---

# 23. Security and Downloads

Only download FR Legends Skeleton Key from the official repository.

Official Skeleton Key repository:

https://github.com/ethanlabs101/frlegends-skeleton-key

Do not download modified Skeleton Key packages from random websites or file-sharing services.

If someone provides a modified executable, script, archive, or installer claiming to be Skeleton Key, treat it as untrusted unless you can verify where it came from.

---

# 24. Linux Distribution Compatibility

Skeleton Key is designed to run in a standard Linux userspace with the required Node.js environment and dependencies.

Debian/Ubuntu-based distributions are straightforward to support because they use the `apt` package manager.

Examples include:

- Ubuntu
- Debian
- Linux Mint
- Pop!_OS
- Zorin OS

Arch-based distributions use `pacman`.

Examples include:

- Arch Linux
- CachyOS
- Manjaro
- EndeavourOS

Other Linux distributions may also work.

However, package names and installation commands can differ.

For example:

- Debian/Ubuntu → `apt`
- Arch → `pacman`
- Fedora → `dnf`

If you are using a distribution not covered by this guide, do not blindly run the `apt` or `pacman` commands.

Install the equivalent packages using your distribution's package manager.

---

# 25. Reaching the Skeleton Key Repository Again

If you close your terminal and later want to launch Skeleton Key again, you do not need to reinstall it.

Open a terminal and navigate back to the Vault directory.

For example:

```bash
cd ~/frlegends-skeleton-key/skeleton-key-vault
```

Then launch:

```bash
node cli.js
```

If your installation uses a different Vault location, use the location displayed by the installer.

---

# 26. Basic Linux Terminal Commands

If you are completely new to Linux, the following commands are useful when working with Skeleton Key.

## 26.1 Show Your Current Directory

```bash
pwd
```

This tells you where you currently are.

---

## 26.2 List Files

```bash
ls
```

This shows the files and directories in your current location.

---

## 26.3 Enter a Directory

```bash
cd directory-name
```

For example:

```bash
cd frlegends-skeleton-key
```

---

## 26.4 Go Back One Directory

```bash
cd ..
```

---

## 26.5 Return Home

```bash
cd ~
```

This returns you to your Linux user's home directory.

---

# 27. Understanding the Installation

Your Linux Skeleton Key installation can be thought of as:

```text
Linux
   ↓
Git
   ↓
Node.js + npm
   ↓
Skeleton Key Repository
   ↓
Skeleton Key Vault
   ↓
Node.js Dependencies
   ↓
FR Legends Skeleton Key CLI
```

Unlike the Android installation, there is no Termux layer and no Debian proot layer.

The Linux operating system provides the environment directly.

The Skeleton Key Linux installer handles the application dependency installation after Node.js and npm are available.

---

# 28. Installation Complete

If Skeleton Key launches successfully, your Linux computer is now ready to use the FR Legends Skeleton Key ecosystem.

You have completed:

```text
Linux
   ↓
System Preparation
   ↓
Git
   ↓
Node.js + npm
   ↓
Skeleton Key Repository
   ↓
Skeleton Key Installer
   ↓
Node.js Dependencies
   ↓
Skeleton Key Vault
   ↓
FR Legends Skeleton Key CLI
```

From here, you can begin exploring Skeleton Key.

---

# Continue Learning

[First Launch Guide →]()

[→ Return to main menu](https://github.com/ethanlabs101/frlegends-skeleton-key)
