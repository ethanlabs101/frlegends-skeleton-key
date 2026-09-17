# Troubleshooting

This document covers common issues that may occur while installing, running, moving, or updating FR Legends Skeleton Key Vault.

Some problems are environment-specific, particularly when running Skeleton Key on Android through Termux.

---

# Skeleton Key Says Files Are Missing

If Skeleton Key reports:

```text
FILE STRUCTURE ERROR
```

the application is missing a file or directory that it expects to exist.

Make sure you are running the application from the correct location:

```text
frlegends-skeleton-key/
└── skeleton-key-vault/
    ├── cli.js
    ├── fr_legends_payloads/
    ├── menu/
    ├── sandbox/
    ├── src/
    └── utils/
```

`cli.js` and `fr_legends_payloads/` must remain inside the same `skeleton-key-vault/` directory.

If the installation has been heavily modified, deleted, or partially copied, restoring a fresh copy of the project is usually safer than manually reconstructing missing internal files.

---

# Permission or Read-Only Database Errors

A common issue can occur after copying or moving Skeleton Key between systems.

If the project was copied or extracted as `root`, files can become owned by `root` instead of the normal user.

This can cause the local SQLite database to become effectively read-only for the user running Skeleton Key.

The problem may appear as:

```text
SQLITE_READONLY
```

or another database write/permission error.

## Fixing Ownership

From inside the `skeleton-key-vault/` directory:

```bash
sudo chown -R $USER:$USER -n .
```

This restores ownership of the project files to the current user.

The `-n` option prevents `chown` from following symbolic links.

After fixing ownership, run Skeleton Key normally as your regular user.

Avoid running the entire application as `root` simply to work around a permissions problem.

The important rule is:

> Skeleton Key should normally be run by the same user who owns its local database and writable application data.

---

# Termux / Android Issues

Skeleton Key can run in Termux, but the Termux environment is fundamentally different from a normal Linux desktop.

The application depends on multiple pieces of infrastructure, including Node.js, npm packages, filesystem access, local database functionality, and other components of the surrounding environment.

Because of this, Termux compatibility can vary depending on the device, Android version, Termux installation, package state, and installation method.

A feature working correctly on a normal Linux installation does not automatically guarantee that the same feature will behave correctly on Android.

---

## If Installation Fails

Make sure Termux itself is up to date and that its basic packages are available.

A typical setup includes:

```bash
pkg update
pkg upgrade
pkg install nodejs git
```

Then verify:

```bash
node --version
npm --version
git --version
```

If npm reports package, cache, native-module, or filesystem errors, the problem may be specific to the Termux environment rather than Skeleton Key itself.

---

## If Termux Works Sometimes and Then Stops Working

Termux compatibility can be sensitive to changes in the surrounding environment.

Things such as:

- Android updates
- Termux package updates
- Node.js version changes
- npm changes
- filesystem permissions
- storage access
- native Node.js dependencies
- partially completed installations
- copied project directories
- corrupted npm caches

can affect whether Skeleton Key installs or runs correctly.

If Skeleton Key suddenly stops working after a Termux or package update, verify the environment before assuming the project itself changed.

---

## Termux Storage Access

If Skeleton Key cannot access files outside the normal Termux home directory, make sure Termux has storage access configured.

A typical command is:

```bash
termux-setup-storage
```

Android should then request storage permission.

The exact behavior of filesystem access can vary between Android versions and Termux environments.

---

## Termux Native Dependency Problems

Some npm packages may depend on native components.

If npm fails while compiling or installing a dependency, the error may come from the Android/Termux build environment rather than JavaScript itself.

Read the first meaningful error in the npm output instead of focusing only on the final:

```text
npm ERR!
```

message.

Native compilation errors may require Termux-specific packages or may indicate that a dependency does not currently support the installed environment.

---

# Node.js or npm Problems

If Skeleton Key fails immediately after installation, verify the runtime:

```bash
node --version
npm --version
```

Then make sure dependencies have been installed from the `skeleton-key-vault/` directory:

```bash
npm install
```

If npm reports dependency-resolution or cache problems, retrying with a clean dependency installation may help.

Do not immediately delete project files or the identity vault when troubleshooting npm.

The local account database is separate from the Node.js dependency installation.

---

# Authentication Problems

If Skeleton Key launches normally but authentication fails, verify that:

- your credentials are correct
- the account can authenticate normally
- the network connection is working
- the required PlayFab services are reachable
- the local authentication state is not stale

Authentication problems are different from local file-structure problems.

If the CLI itself launches correctly but login fails, there is usually no reason to rebuild the entire installation immediately.

---

# Save Structure Mismatch

Skeleton Key performs structure validation before working with expected player-data structures.

If the application reports:

```text
STRUCTURE MISMATCH DETECTED
```

the player data does not match the structure Skeleton Key expects.

The validator checks mandatory fields and compares nested structures against:

```text
fr_legends_payloads/templates/master.json
```

Do not ignore structure warnings blindly.

The application specifically warns that pushing an invalid save structure can potentially result in server-side problems or account-data corruption.

If you are unsure why a structure mismatch occurred, abort the operation and inspect the relevant data/template before proceeding.

---

# Corrupted or Invalid Save Data

If player data cannot be decoded, parsed, or reconstructed correctly, do not continue repeatedly modifying the same data.

First determine whether the original data is still available.

If a backup or snapshot exists, preserve it before attempting further repairs.

A failed modification should not become the reason the only known copy of a save is overwritten.

---

# Vault or Account Data Problems

If the identity vault behaves unexpectedly, first verify that:

```text
identity_vault.db
```

exists and is writable by the current user.

Also check:

```text
.vault.lock
```

if the application reports a vault-related locking or access issue.

Do not delete the database as a first troubleshooting step.

The identity vault contains persistent account information, so deleting it can remove locally stored account data.

---

# Moving Skeleton Key Between Computers

When copying Skeleton Key to another machine, filesystem ownership and permissions may not transfer in the way you expect.

This is especially important when:

- copying as `root`
- extracting archives as `root`
- using `sudo cp`
- moving files between Linux users
- copying files from another machine
- restoring a backup

After moving the project, verify that the user running Skeleton Key can read and write the required local files.

If the project was accidentally copied as `root`, run this from inside `skeleton-key-vault/`:

```bash
sudo chown -R $USER:$USER -n .
```

Then run Skeleton Key normally as your regular user.

---

# When in Doubt: Fresh Copy

If the installation has been heavily modified and the cause of the problem is unclear, compare it against a fresh copy of Skeleton Key before manually changing multiple files.

This is particularly useful when:

- internal files were renamed
- directories were moved
- dependencies were partially installed
- installation scripts were interrupted
- Termux packages changed
- the project was copied between users
- the filesystem structure was manually edited

Do not overwrite important local account data without making a backup first.

---

# Basic Troubleshooting Checklist

When something goes wrong, check these in order:

```text
1. Is the project structure intact?
        ↓
2. Is Node.js/npm working?
        ↓
3. Are dependencies installed?
        ↓
4. Does the current user own the local writable files?
        ↓
5. Is the network/authentication working?
        ↓
6. Is the save data structurally valid?
        ↓
7. Is the problem specific to Termux/Android?
        ↓
8. Do you have a backup or snapshot to recover from?
```

The most important rule is simple:

> **Do not delete the vault or overwrite save data just because something stopped working. Preserve the data first, then troubleshoot the problem.**

**[← Skeleton Key Main Page](https://github.com/ethanlabs101/frlegends-skeleton-key/tree/main)**
