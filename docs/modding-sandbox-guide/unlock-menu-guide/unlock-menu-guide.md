# Unlock Menu Guide

## Overview

The **Unlock Menu** provides direct access to Skeleton Key's protected stock-car payload library.

It allows you to inject individual stock vehicles into the active garage, export the complete stock-car library for use with the Exotic Importer, or inject the entire stock-car set at once.

Access it from:

```text
Main Navigation
└── 4) Modding Sandbox
    └── 13) Unlock Menu - Inject Stock Cars
```

---

## Preview

![](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/modding-sandbox-guide/unlock-menu-guide/unlock-menu-guide.png)

---

# Stock Car Library

Skeleton Key ships with a collection of stock FR Legends car payloads stored in a protected directory:

```text
fr_legends_payloads/
└── cars/
    └── stock_cars/
        ├── S15.json
        ├── R32-2D.json
        ├── MIATA.json
        └── ...
```

These payloads represent complete stock car objects that Skeleton Key can load directly into the active save structure.

The Unlock Menu automatically scans this directory and builds the available-car list from the `.json` payloads it finds.

This means the menu does not need a hard-coded list of every stock vehicle.

---

# Unlock Menu

The main menu provides three different ways to work with the stock library.

```text
[01] Stock Car
[02] Stock Car
[03] Stock Car
...
[X] Export ALL Stock Cars to Exotic Importer
[Z] Inject COMPLETE Stock Car Set
[Enter] Back
```

### Individual Selection

Enter the index of a stock car to inject only that vehicle.

### X — Export ALL

Copies every protected stock-car payload into the normal Exotic Importer directory.

### Z — Inject COMPLETE Stock Car Set

Loads every stock-car payload and injects the entire stock collection into the active garage.

---

# Individual Stock Car Injection

Selecting a numbered vehicle performs the following workflow:

```text
Select Stock Car
      ↓
Read Payload
      ↓
Parse Car Object
      ↓
Add To Garage
      ↓
Update Carport
      ↓
Upload Save
      ↓
Sync Telemetry
```

The original stock payload remains in the protected stock-car directory.

The selected car is added to the active garage as a new car object.

If the resulting garage size exceeds the current `carport` value, Skeleton Key automatically raises the carport value to match.

---

# X — Export ALL Stock Cars

The **X** option exports every stock-car payload into:

```text
fr_legends_payloads/cars/
```

This makes the stock vehicles available to the **Exotic Importer** alongside other car payloads.

The operation does not modify the active garage.

```text
Protected Stock Cars
        │
        │ Copy
        ▼
Exotic Importer Directory
```

This is useful when you want to treat the stock vehicles like normal car payloads and access them through the Exotic Importer workflow.

---

# Z — Inject COMPLETE Stock Car Set

The **Z** option is the bulk-injection operation.

Skeleton Key asks for confirmation before proceeding:

```text
Inject all stock cars into your garage? (y/n):
```

After confirmation, every stock-car payload is loaded and added to the active garage.

The interface displays progress as each vehicle is processed:

```text
[1/XX] Injected: ...
[2/XX] Injected: ...
[3/XX] Injected: ...
...
[XX/XX] Injected: ...
```

Once complete:

```text
Complete Stock Car Set
        ↓
Garage Updated
        ↓
Carport Updated
        ↓
Save Uploaded
        ↓
Telemetry Synced
```

The entire operation is performed automatically.

---

# Why the Protected Stock Library Matters

The stock-car directory is more than a collection of convenience files.

These payloads provide Skeleton Key with known-good, complete vehicle objects that can be reused by other systems.

This is especially important for the **Online Asset Manager**, where a livery-only asset can be applied to the appropriate stock vehicle to construct a complete car.

```text
Livery Asset
     │
     │ Model: S15
     ▼
Protected Stock S15
     │
     │ Apply Livery
     ▼
Complete S15 + Livery
     │
     ▼
Garage
```

The same stock payload library can therefore support multiple features throughout Skeleton Key.

---

# Quick Reference

| Option | Action |
|---|---|
| **1–N** | Inject selected stock car |
| **X** | Export all stock cars to Exotic Importer |
| **Z** | Inject complete stock-car set |
| **Enter** | Return to Modding Sandbox |

---

# Summary

The Unlock Menu provides a simple interface over Skeleton Key's stock-car payload system.

It can:

- Inject individual stock vehicles
- Export the complete stock library
- Inject the complete stock-car set
- Automatically update `carport`
- Upload modified save data
- Synchronize account telemetry
- Provide stock vehicle objects for other Skeleton Key systems

The important part is that these aren't temporary menu entries or placeholder vehicles.

Skeleton Key ships with the underlying stock payloads and uses them as reusable building blocks throughout the Vault's asset and garage systems.

---

## Continue

**[← Modding Sandbox Main Guide](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/modding-sandbox-guide/modding-sandbox-guide.md)**

**[Next: User Data Manager Guide →]()**
