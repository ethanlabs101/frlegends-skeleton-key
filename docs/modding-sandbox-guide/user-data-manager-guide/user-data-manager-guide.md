# User Data Manager Guide

## Overview

The **User Data Manager** is Skeleton Key Vault's local data-management subsystem.

While most Vault modules perform operations on game data, the User Data Manager is focused on managing the **data those modules create and maintain**.

It provides dedicated management interfaces for:

- Account Backups
- Car Payloads
- Downloaded Assets
- Account Snapshots

Instead of requiring users to manually navigate the filesystem, Skeleton Key provides an interactive interface for browsing, renaming, and deleting generated data.

This is one of the modules that demonstrates the larger design philosophy behind Skeleton Key:

> **The filesystem is treated as application data, not as something the user should have to manually manage.**

---

# Opening the User Data Manager

From the Modding Sandbox:

```text
[14] User Data Manager - Manage Downloaded Content
```

The main menu provides four management categories

Each section has its own dedicated management interface.

### Preview

![](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/modding-sandbox-guide/user-data-manager-guide/user-data-manager-guide.png)

---

# 1. Account Backups

The **Account Backups** manager provides access to saved account backup history.

Backups are organized by account, allowing multiple accounts to maintain separate backup histories.

```text
Account Backups
      ↓
Accounts With Backups
      ↓
Select Account
      ↓
Backup History
      ↓
Select Backup
      ↓
Confirm Deletion
```

The account-level organization prevents backups from different accounts from becoming mixed together.

### Backup Entries

After selecting an account, the manager displays the backup entries associated with that account.

Individual entries can be deleted after confirmation.

```text
[01] Backup_...
[02] Backup_...
[03] Backup_...

[Enter] Back
```

Deletion requires explicit confirmation before the filesystem entry is removed.

### Screenshot — Account Backups

![](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/modding-sandbox-guide/user-data-manager-guide/manage-backups.png)

### Screenshot — Backup History

![](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/modding-sandbox-guide/user-data-manager-guide/backup-history.png)

---

# 2. Car Payloads

The **Car Payloads** manager handles generated car payload files stored in:

```text
fr_legends_payloads/cars/
```

These are the payloads used by systems such as the Garage Exporter and Exotic Importer.

The manager provides two operations:

```text
[R] Rename Payload
[D] Delete Payload
```

---

## Rename Payload

Payloads can be renamed directly from the interface.

Skeleton Key sanitizes the supplied filename by removing invalid filesystem characters and automatically maintains the `.json` extension.

It also prevents overwriting another payload with the same name.

```text
Existing Payload
      ↓
Enter New Name
      ↓
Sanitize Filename
      ↓
Check For Collision
      ↓
Rename
```

This allows the local payload library to stay organized without requiring manual filesystem operations.

---

## Delete Payload

Individual payloads can be permanently deleted after confirmation.

```text
Select Payload
      ↓
Confirm Deletion
      ↓
Delete File
```

Deleting a payload does not automatically modify cars already injected into a garage. It removes the local payload file itself.

### Screenshot — Car Payload Manager

![](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/modding-sandbox-guide/user-data-manager-guide/manage-payloads.png)

---

# 3. Downloaded Assets

The **Downloaded Assets** manager handles content downloaded through the Online Asset Manager.

Downloaded assets are organized by category:

```text
fr_legends_payloads/
└── downloads/
    ├── cars/
    ├── liveries/
    └── ...
```

The manager first displays the available asset categories.

```text
Downloaded Asset Categories
          ↓
      Select Category
          ↓
     Browse Assets
          ↓
     Select Asset
          ↓
   Confirm Deletion
```

---

## Deleting Downloaded Assets

Individual downloaded assets can be permanently removed.

When an asset is deleted, Skeleton Key also checks the local asset registry for matching entries.

If matching registry records exist, they are removed as well.

```text
Delete Asset
     │
     ├── Remove Local Files
     │
     └── Remove Registry Entry
```

This is important because simply deleting the filesystem directory could leave stale registry information behind.

The User Data Manager therefore helps keep both the physical asset files and the application's asset registry synchronized.

If no matching registry entry exists, the manager reports that rather than silently assuming the registry was updated.

### Screenshot — Download Categories

> **[SCREENSHOT: INSERT DOWNLOADED ASSET CATEGORIES HERE]**

### Screenshot — Downloaded Asset Management

> **[SCREENSHOT: INSERT INDIVIDUAL DOWNLOADED ASSET LIST HERE]**

---

# 4. Snapshots

The **Snapshots** manager provides access to account snapshot history.

Like backups, snapshots are organized by account.

```text
Snapshots
    ↓
Accounts With Snapshots
    ↓
Select Account
    ↓
Snapshot History
    ↓
Select Snapshot
    ↓
Confirm Deletion
```

This keeps snapshot history isolated per account and makes it easy to clean up older snapshot data.

Individual snapshots can be deleted after confirmation.

### Screenshot — Snapshot Accounts

> **[SCREENSHOT: INSERT SNAPSHOT ACCOUNT LIST HERE]**

### Screenshot — Snapshot History

> **[SCREENSHOT: INSERT SNAPSHOT HISTORY HERE]**

---

# Confirmation & Safe Deletion

The User Data Manager treats destructive operations differently from normal navigation.

Before deleting an entry, Skeleton Key asks for confirmation:

```text
Delete <entry>? (y/n):
```

Only an explicit `y` confirmation performs the deletion.

This applies to:

- Account backups
- Car payloads
- Downloaded assets
- Snapshots

This small detail is important because the module deals with files that may not be recoverable after deletion.

---

# Why This Module Is Different

The User Data Manager is a good example of why Skeleton Key is more than a collection of CLI commands.

A basic CLI might simply tell the user:

```text
Your files are located in:
./fr_legends_payloads/
```

and leave the rest to them.

Skeleton Key instead exposes those files through an application-level interface:

```text
Application Data
      ↓
User Data Manager
      ↓
Browse
Rename
Delete
Organize
Synchronize Registry
```

The user interacts with **data concepts**, not raw filesystem paths.

That is much closer to how a dedicated desktop application or GUI would handle its internal storage.

---

# Data Ownership

The User Data Manager primarily manages data generated or maintained by Skeleton Key itself.

Important directories include:

```text
fr_legends_payloads/
├── backups/
├── cars/
├── downloads/
└── snapshots/
```

Each subsystem has a defined location instead of scattering generated files throughout the project.

This gives the Vault a predictable local data architecture and makes the User Data Manager possible.

---

# The GUI Philosophy

This module is arguably one of the strongest examples of Skeleton Key's attempt to overcome the limitations of traditional CLI software.

Even though the Vault runs in a terminal, the User Data Manager provides concepts normally associated with a GUI:

```text
Application
    ↓
Data Library
    ↓
Categories
    ↓
Nested Views
    ↓
Individual Entries
    ↓
Actions
    ↓
Confirmation
```

There is persistent local state.

There are organized data collections.

There are nested management screens.

There are destructive-action confirmations.

There is registry synchronization.

And all of it is presented through a consistent interface.

The terminal is simply the rendering layer.

---

# Quick Reference

| Option | Purpose |
|---|---|
| **1 — Account Backups** | Browse and delete account backup history |
| **2 — Car Payloads** | Rename or delete local car payloads |
| **3 — Downloaded Assets** | Browse and delete downloaded assets and clean registry entries |
| **4 — Snapshots** | Browse and delete account snapshot history |
| **Enter** | Return to Modding Sandbox |

---

# Summary

The User Data Manager provides a centralized interface for managing Skeleton Key's locally generated data.

```text
             USER DATA MANAGER
                     │
       ┌─────────────┼─────────────┐
       ▼             ▼             ▼
   BACKUPS        PAYLOADS      DOWNLOADS
       │             │             │
       └─────────────┼─────────────┘
                     ▼
                 SNAPSHOTS
```

Instead of making users manually search through `fr_legends_payloads`, Skeleton Key turns its internal data structure into an interactive management system.

That is what makes this module feel less like a traditional stateless CLI utility and more like a **real application with a persistent local data layer**.
