# Modding Sandbox Guide

Welcome to the **FR Legends Skeleton Key Modding Sandbox**.

The Modding Sandbox is the main workspace for inspecting, modifying, exporting, importing, and managing FR Legends player and garage data.

This page is intentionally kept as an **overview and navigation hub**. Each feature has its own dedicated guide so users can learn only the tools they actually need without having to read through one massive document.

---

# Modding Sandbox Overview

When you enter the Modding Sandbox, Skeleton Key displays your current session and account state followed by the available Sandbox tools.

A typical screen looks similar to:

![](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/modding-sandbox-guide/modding-sandbox-guide.png)

The information at the top represents the current state of the authenticated Skeleton Key environment.

The numbered menu underneath provides access to the individual Sandbox modules.

---

# Understanding the Status Panel

## Session

```text
[STATUS] Session: [ ON ]
```

This indicates whether an authenticated Skeleton Key session is currently active.

Most Sandbox operations require an active authenticated session because they operate on account data.

---

## Identity

```text
[IDENTITY] ID: XXXXXXXXXXXXXXXX
```

This represents the local Skeleton Key identity associated with the current Vault environment.

Your actual identity value will be different.

You normally do not need to manually enter or modify this value.

---

## Account

```text
[ACCOUNT] User: example@email.com
```

This displays the account currently associated with the active session.

If no account is authenticated, the account section will indicate that the session is unauthenticated.

---

## Telemetry

```text
[TELEMETRY] Garage: 1/1 Livery Pass: UNLOCKED
```

This provides a quick overview of important player-state information.

Depending on the current Skeleton Key implementation, this may include:

- Garage occupancy
- Garage capacity
- Livery Pass status
- Other account telemetry

The telemetry panel is primarily informational.

---

## Currency

```text
[CURRENCY] Money: 500000 Coins: 500000
```

This displays the currently detected money and coin values associated with the active account.

Currency modifications are handled through:

**[07] Currency Menu**

See:

**[Currency Manager Guide →]()**

---

## Playtime

```text
[PLAYTIME] Playtime: 0h 0m 0s
```

This displays the currently detected recorded playtime.

Playtime modifications are handled through:

**[06] Modify Played Time**

See:

**[Playtime Manager Guide →]()**

---

## Player

```text
[PLAYER] Welcome Back: Player
```

This displays the current driver/player name.

Driver-name modifications are handled through:

**[05] Change Driver Name**

See:

**[Driver Name Guide →]()**

---

# Sandbox Feature Map

The Sandbox is divided into several logical groups:

```text
MODDING SANDBOX
│
├── Developer Tools
│   ├── Raw JSON Viewer
│   └── Raw JSON Snapshot
│
├── Player Configuration
│   ├── Livery Pass
│   ├── Driver Name
│   └── Played Time
│
├── Currency
│   └── Money / Coins
│
├── Garage Management
│   ├── Carport Slots
│   ├── Export Cars
│   ├── Import Cars
│   ├── Delete Cars
│   └── Live Car Editor
│
├── Online Assets
│   └── Cars / Liveries / Packs
│
├── Unlocks
│   └── Stock Car Injection
│
└── User Data
    └── Downloaded Content
```

Each section below provides a short explanation and points to its dedicated module documentation.

---

# [01] DEV TOOLS — View Raw JSON Snapshot

The Raw JSON Viewer allows you to inspect the player data currently represented by Skeleton Key.

This is primarily an **inspection tool**.

It can be useful for understanding what Skeleton Key is currently detecting before making modifications.

Depending on the account data, you may see information relating to:

- Player information
- Garage information
- Currency
- Playtime
- Unlock information
- Other serialized player data

This feature is particularly useful for users who want to understand the underlying structure of their account data.

**[Raw JSON Viewer Guide →]()**

---

# [02] DEV TOOLS — Save Complete Raw JSON Snapshot

The Complete Raw JSON Snapshot tool saves a persistent snapshot of the currently detected player data.

Unlike the viewer, which is primarily for inspection, this option creates a saved representation that can be referenced later and used for recovery.

Snapshots are useful before making substantial changes.

A recommended workflow is:

```text
Inspect
   ↓
Save Snapshot
   ↓
Make Changes
   ↓
Verify Results
```

Creating a snapshot before experimentation gives you an additional reference point if you need to investigate an unexpected result.

**[Raw JSON Snapshot Guide →]()**

---

# [03] Modify Carport Slots

The Carport Slot Manager controls the available garage/carport capacity represented by the account data.

This allows you to adjust the available slot count without manually editing the underlying serialized data.

Before changing the value, consider how many slots you actually need.

Extreme values may behave differently depending on the game version and account state.

**[Carport Slots Guide →]()**

---

# [04] Unlock/Lock Livery Pass

The Livery Pass manager controls the account's Livery Pass state.

This module provides the available controls for changing the detected Livery Pass state.

The feature can be useful when managing an account where livery functionality needs to be enabled or restored.

Always verify the resulting state after making a change.

**[Livery Pass Guide →]()**

---

# [05] Change Driver Name

The Driver Name tool allows you to modify the name associated with the current player profile.

The general workflow is:

```text
Open Driver Name
      ↓
Enter New Name
      ↓
Review
      ↓
Confirm
      ↓
Save
```

The tool handles the relevant player-name data so you do not need to manually locate the corresponding value inside the serialized account data.

**[Driver Name Guide →]()**

---

# [06] Modify Played Time

The Played Time tool allows you to modify the recorded playtime associated with the current account.

This can be useful for save management, testing, or restoring a desired player-state value.

Because playtime is stored as account data, use reasonable values and verify the resulting account state after applying a modification.

**[Playtime Manager Guide →]()**

---

# [07] Currency Menu — Add Money / Coins

The Currency Menu provides tools for working with the account's money and coin values.

This section is separated from the other player-state tools because currency values can have an important relationship with game-side validation.

The currency menu provides access to:

- Money
- Coins
- Current balances
- New values
- Verification

Always review the resulting values after applying a modification.

**[Currency Manager Guide →]()**

---

# [08] Check Garage — Export Car Payloads

The Garage Exporter allows you to inspect vehicles currently present in the garage and export their serialized payload data.

This can be useful for:

- Preserving a vehicle
- Creating a vehicle backup
- Inspecting vehicle data
- Moving compatible vehicle data
- Preparing a payload for later use

A typical workflow is:

```text
Open Garage
      ↓
Select Car
      ↓
Inspect Payload
      ↓
Export
      ↓
Save Payload
```

Exported payloads should be treated as valuable data.

**[Garage Export Guide →]()**

---

# [09] Exotic Importer — Inject Car Payloads

The Exotic Importer performs the reverse operation of the Garage Exporter.

Instead of extracting a vehicle from the garage, it takes a compatible payload and imports it into the current account.

A simplified workflow is:

```text
Payload
   ↓
Validate
   ↓
Select Destination
   ↓
Import
   ↓
Verify Garage
```

Because importing can modify garage data, create a backup before performing an operation that could overwrite existing information.

**[Exotic Importer Guide →]()**

---

# [10] Garage Cleanup — Delete Cars

Garage Cleanup provides a controlled way to remove vehicles from the current garage.

This is useful when:

- Removing unwanted cars
- Cleaning up a large garage
- Making room for other vehicles
- Preparing an account for new content

Deletion is a destructive operation.

If you think you may want a vehicle later, export or back it up before deleting it.

A simple rule is:

```text
If you might want it later:
EXPORT IT FIRST.
```

**[Garage Cleanup Guide →]()**

---

# [11] Live Car Editor — Modify Cars In Garage

The Live Car Editor is one of the more advanced Sandbox modules.

Instead of working with the entire account, the editor focuses on individual vehicles currently present in the garage.

Depending on the current Skeleton Key implementation, the editor may provide access to vehicle properties such as:

- Vehicle configuration
- Appearance
- Livery data
- Parts
- Other serialized vehicle properties

The Live Car Editor is intended for users who want more direct control over individual vehicle data.

Because vehicle payloads can be complex, create a backup before experimenting with unfamiliar properties.

**[Live Car Editor Guide →]()**

---

# [12] Online Asset Manager — Cars / Liveries / Packs

The Online Asset Manager provides access to supported online assets.

This section is intended for users who want to discover and work with available:

- Cars
- Liveries
- Asset packs
- Other supported content

The Online Asset Manager is separate from the local garage tools because it deals with content available through the Skeleton Key asset ecosystem.

The exact available content may change over time.

**[Online Asset Manager Guide →]()**

---

# [13] Unlock Menu — Inject Stock Cars

The Unlock Menu provides tools for adding supported stock vehicle content to the current account.

This is different from importing an individual exported vehicle payload.

The Unlock Menu works with supported stock content and can be useful when restoring or populating an account's garage.

**[Unlock Menu Guide →]()**

---

# [14] User Data Manager — Manage Downloaded Content

The User Data Manager provides tools for managing downloaded Skeleton Key content and related local user data.

This section helps organize locally stored content such as:

- Account Backups/Snapshots
- Exported Car Payloads
- Downloaded cars
- Downloaded liveries
- Asset packs
- Local content metadata
- Other supported user content

The exact functionality may expand as the Skeleton Key asset ecosystem develops.

**[User Data Manager Guide →]()**

---

# [15] Back to Main Routing Menu

Selecting:

```text
[15] Back to Main Routing Menu
```

returns you to the Skeleton Key Main Navigation menu.

You do not need to close the application to move between the Sandbox and the Main Navigation.

The general navigation flow is:

```text
Main Navigation
      ↓
Modding Sandbox
      ↓
Sandbox Feature
      ↓
Complete Operation
      ↓
Return
      ↓
Modding Sandbox
      ↓
Main Navigation
```

---

# Recommended Sandbox Workflow

If you are new to Skeleton Key, there is no need to immediately explore every feature.

A good introduction is:

```text
1. Authenticate
        ↓
2. Open Modding Sandbox
        ↓
3. View Raw JSON
        ↓
4. Save a Snapshot
        ↓
5. Choose One Feature
        ↓
6. Make a Small Change
        ↓
7. Verify the Result
```

This lets you become familiar with the account structure before making larger modifications.

---

# Backups Before Major Changes

The Sandbox can interact with important account and garage data.

Before performing operations that could overwrite or delete information, consider creating a backup or raw JSON snapshot.

Backups are especially useful before:

- Garage imports
- Garage deletion
- Large-scale vehicle modifications
- Account-data changes
- Experimental modifications
- Operations you have not used before

The basic philosophy is:

```text
BACKUP
  ↓
MODIFY
  ↓
VERIFY
```

rather than:

```text
MODIFY
  ↓
Something went wrong
  ↓
No backup
```

---

# Understanding the Feature Hierarchy

The Modding Sandbox is intentionally structured as a **hub**.

You do not need to understand every tool to use Skeleton Key.

Think of this page as the map:

```text
                    MODDING SANDBOX
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   DEV TOOLS          PLAYER DATA       GARAGE TOOLS
        │                  │                  │
    JSON VIEWER        Carport Slots       Export
    JSON SNAPSHOT      Livery Pass         Import
                       Driver Name         Cleanup
                       Playtime            Live Editor
                       Currency
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                    OTHER FEATURES
                           │
              ┌────────────┼────────────┐
              │            │            │
         ONLINE ASSETS   UNLOCKS    USER DATA
```

Each branch has its own documentation.

This keeps the main Sandbox guide short enough to function as an onboarding page while allowing individual modules to provide much deeper explanations.

---

# Where To Go Next

Choose the feature you want to learn more about:

- **[Raw JSON Viewer Guide →]()**
- **[Raw JSON Snapshot Guide →]()**
- **[Carport Slots Guide →]()**
- **[Livery Pass Guide →]()**
- **[Driver Name Guide →]()**
- **[Playtime Manager Guide →]()**
- **[Currency Manager Guide →]()**
- **[Garage Export Guide →]()**
- **[Exotic Importer Guide →]()**
- **[Garage Cleanup Guide →]()**
- **[Live Car Editor Guide →]()**
- **[Online Asset Manager Guide →]()**
- **[Unlock Menu Guide →]()**
- **[User Data Manager Guide →]()**

---

# Related Documentation

**[← Main Navigation Guide](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/main-navigation/main-navigation.md)**

**[← First Launch Guide](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/first-launch/first-launch.md)**

**[← Skeleton Key Main Page](https://github.com/ethanlabs101/frlegends-skeleton-key/tree/main)**


---

# Final Note

The Modding Sandbox is designed to make advanced account and garage operations accessible through dedicated tools rather than requiring users to manually edit raw save data.

If you are unsure what a particular option does, open its dedicated guide before using it.

You should never need to understand the entire Sandbox to use one feature.

**Pick the tool you need, read its module guide, make a backup when appropriate, and work from there.**
