# Driver Name Guide

The **Change Driver Name** module lets you modify the driver's `playerName` value and immediately push the updated save data.

Open it from:

**Modding Sandbox → Option 05 — Change Driver Name**

---

## Preview

![](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/modding-sandbox-guide/driver-name-guide/driver-name-guide.png)

## Menu

```text
[1] ethanlabs101 Name Spam
[2] Custom Name Spam
[3] Change Name
[4] Empty Name
[Enter] Back
```

### 1. ethanlabs101 Name Spam

Generates a repeated `ETHANLABS101` name pattern and applies it as the driver name.

### 2. Custom Name Spam

Enter a **single word** to generate a repeated name pattern.

Spaces are not allowed.

Example:

```text
Enter one word: SKELETON
```

The generated name is then uploaded to the account.

### 3. Change Name

Enter any custom driver name.

Example:

```text
Enter new name: SkeletonKey
```

The name cannot be empty.

### 4. Empty Name

Sets the driver name to a single blank space.

---

## Applying Changes

After selecting a name, Skeleton Key:

1. Updates `playerName` in the loaded payload.
2. Rebuilds the PD data.
3. Uploads the updated payload.
4. Finalizes the upload.
5. Syncs telemetry.
6. Returns to the Driver Name menu.

The current driver name is displayed at the top of the menu.

---

## Continue

**[← Modding Sandbox Main Guide](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/modding-sandbox-guide/modding-sandbox-guide.md)**

**[Next: Playtime Manager Guide →]()**

