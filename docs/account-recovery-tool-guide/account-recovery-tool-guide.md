# Account Recovery Tool Guide

The **Account Recovery Tool** restores a previous FR Legends account save from a Skeleton Key backup.

It is designed for situations where an account needs to be rolled back to a previously saved state using either a raw binary snapshot or a JSON backup.

---

## Opening Account Recovery

From the **Main Navigation Menu**, select:

```text
[5] Account Recovery
```

The recovery interface will ask for the email address of the account whose backups you want to restore.

Entering an empty value returns to the Main Navigation Menu.

### Preview

![](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/account-recovery-tool-guide/account-recovery-tool-guide.png)

---

# Backup Selection

After entering the account email, Skeleton Key searches:

```text
fr_legends_payloads/backups/<account>/
```

Both supported backup formats are displayed:

```text
1) PRE_EDIT_car123_20260824_120000.json
2) snapshot_20260824_130000.json
3) snapshot_20260824_140000.bin
```

Select the backup you want to restore.

If no backup directory or backup files exist for the supplied account, recovery stops without modifying the account.

---

# Restore Confirmation

Before performing the restore, Skeleton Key asks for confirmation:

```text
[!] Restore snapshot_20260824_140000.bin ? (y/n):
```

Only confirming with `y` continues the recovery process.

---

# Account Verification

The recovery tool requires the password for the target account before touching its cloud save.

```text
[>] Verify Account Password:
```

Skeleton Key then:

1. Logs into the target account.
2. Reads the account's current encryption profile.
3. Downloads the current PD save.
4. Extracts the required encryption information.
5. Prepares the selected backup.
6. Uploads the restored PD payload.
7. Finalizes the cloud file upload.

This allows JSON backups to be rebuilt using the target account's current PD encoding information rather than treating the JSON as a ready-to-upload save file.

---

# JSON vs Binary Backups

Skeleton Key supports two recovery paths.

### `.bin`

Binary backups are uploaded directly as the saved PD payload.

```text
BACKUP .BIN
     │
     ▼
READ BINARY
     │
     ▼
UPLOAD PD
     │
     ▼
ACCOUNT RESTORED
```

### `.json`

JSON backups are reconstructed into a valid PD payload using the encryption profile obtained from the target account.

```text
BACKUP .JSON
     │
     ▼
READ JSON
     │
     ▼
REBUILD PD
     │
     ▼
UPLOAD PD
     │
     ▼
ACCOUNT RESTORED
```

---

# Telemetry Synchronization

After a successful restore, Skeleton Key checks whether the recovered account matches the account currently active in the CLI session.

If it does, telemetry is synchronized automatically:

```text
[+] ACCOUNT RESTORED SUCCESSFULLY
[*] Syncing Telemetry. May Take Awhile...
[+] Telemetry Synced.
```

If the recovered account is different from the active account, telemetry synchronization is skipped.

This prevents recovery of another account from unexpectedly replacing the CLI's active account state.

---

# Recovery Safety

Account Recovery does **not** blindly overwrite a save based only on an email address.

The workflow requires:

- A matching local backup
- Explicit restore confirmation
- The target account password
- A valid cloud PD save
- Successful payload reconstruction or binary loading
- Successful cloud upload and finalization

If any part of the process fails, the error is reported and the original recovery attempt is not treated as successful.

---

# Quick Reference

| Step | Action |
|---|---|
| 1 | Select **Account Recovery** |
| 2 | Enter target account email |
| 3 | Select a local backup |
| 4 | Confirm restoration |
| 5 | Enter account password |
| 6 | Read current encryption profile |
| 7 | Rebuild JSON or load binary backup |
| 8 | Upload restored PD |
| 9 | Finalize upload |
| 10 | Sync telemetry if recovering the active account |

---

# Summary

The **Account Recovery Tool** turns Skeleton Key's local backup system into an actual account restoration pipeline.

Instead of simply storing snapshots, the Vault can take a previous save state, authenticate against the target account, reconstruct the required PD payload, and restore that state directly to the account's cloud save.

It is the final recovery layer connecting Skeleton Key's **backup infrastructure** to the actual FR Legends account.

---

# Continue

**[← Modding Sandbox Main Guide](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/modding-sandbox-guide/modding-sandbox-guide.md)**

**[← Main Navigation Guide](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/main-navigation/main-navigation.md)**

**[← First Launch Guide](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/first-launch/first-launch.md)**

**[← Skeleton Key Main Page](https://github.com/ethanlabs101/frlegends-skeleton-key/tree/main)**
