# Save Snapshot Guide

The **Save Snapshot** tool creates a complete JSON snapshot of the currently loaded account data and saves it to disk.

Unlike **View JSON**, this module preserves the snapshot as an actual file that can be referenced later.

---

## Opening Save Snapshot

From the Modding Sandbox, select:

```text
[02] [DEV TOOLS] Save Complete Raw JSON Snapshot
```

Skeleton Key will begin capturing the current account data.

The process will display status messages while it:

```text
Initiates Snapshot
        ↓
Creates Snapshot Directory
        ↓
Generates Unique Filename
        ↓
Writes JSON to Disk
        ↓
Displays Snapshot Location
```

---

# Snapshot Storage

Snapshots are stored inside:

```text
fr_legends_payloads/
└── snapshots/
    └── <account>/
        └── <snapshot files>
```

Each account gets its own snapshot directory.

The account identity is converted into a filesystem-safe name before the directory is created.

For example, an identity such as:

```text
example@email.com
```

would be represented as:

```text
example_email_com
```

---

# Snapshot Filename

Each snapshot receives a unique timestamp-based filename.

The format is:

```text
<account>_snapshot_<timestamp>.json
```

For example:

```text
example_email_com_snapshot_2026-08-28T18-42-10-123Z.json
```

This allows multiple snapshots to exist without overwriting previous ones.

---

# What Gets Saved?

The module writes the complete JSON object currently supplied to it.

The JSON is formatted with indentation so the resulting file is human-readable.

Unlike **View JSON**, the snapshot is **not limited to the first 2,000 characters** displayed by the viewer.

The saved file is the persistent snapshot.

---

# Snapshot Summary

After successfully saving, Skeleton Key displays:

```text
[+] SUCCESS: Snapshot captured.
```

It then shows:

```text
Snapshot Summary:

[>] File: <snapshot filename>
[>] Path: <snapshot directory>
```

This tells you exactly where the snapshot was created.

---

# Why Use Snapshots?

Snapshots are useful when you want to preserve the current state before making changes.

A common workflow is:

```text
Authenticate
      ↓
Open Modding Sandbox
      ↓
Save Snapshot
      ↓
Make Changes
      ↓
Continue Working
```

This gives you a point-in-time record of the account data before modifications.

It is especially useful when experimenting with Sandbox features or troubleshooting unexpected changes.

---

# Important

A snapshot is a **saved copy of the JSON data**.

Creating a snapshot does not itself modify the active account.

It also does not automatically restore anything.

Think of it as:

```text
SAVE SNAPSHOT = Create a point-in-time copy
```

If you need to restore or recover account data, use the appropriate recovery or backup functionality rather than assuming a snapshot automatically performs a restore.

---

# Returning to the Sandbox

After the snapshot is successfully written, Skeleton Key waits for:

```text
[>] Press [Enter] to return...
```

Press **Enter** to return to the Modding Sandbox.

---

## Continue

**[← View JSON Guide](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/modding-sandbox-guide/view-json-guide/view-json.md)**

**[← Modding Sandbox Guide](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/modding-sandbox-guide/modding-sandbox-guide.md)**


**[Next: Carport Slots Guide →](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/modding-sandbox-guide/modify-carport-guide/modify-carport-guide.md)**
