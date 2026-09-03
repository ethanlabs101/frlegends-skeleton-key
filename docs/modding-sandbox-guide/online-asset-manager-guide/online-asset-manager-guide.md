# Online Asset Manager Guide

## Overview

The **Online Asset Manager** is the Skeleton Key Vault's central system for discovering, downloading, inspecting, and installing FR Legends assets from the remote asset ecosystem.

It is accessed from:

```text
Main Navigation
└── 4) Modding Sandbox
    └── 12) Online Asset Manager - Cars/Liveries/Packs
```

Unlike a simple file downloader, the Online Asset Manager understands the structure of Skeleton Key assets and can turn remote asset data into **game-ready content**.

The system currently supports:

- 🚗 Cars
- 🎨 Liveries
- 📦 Full asset packs
- 🔎 Asset searching and browsing
- ⬇️ Remote downloads
- 📥 Local installation
- 🗂️ Installed/downloaded asset management
- 📋 Asset inspection and metadata
- 🧩 Construction of complete FR Legends car objects
- 🔐 Binary save deserialization and serialization
- ☁️ Remote asset delivery through the Skeleton Key asset repository

---

## Entering the Online Asset Manager

From the Modding Sandbox, select:

```text
[12] Online Asset Manager - Cars/Liveries/Packs
```

The Asset Manager opens its own navigation system rather than mixing online asset operations into the rest of the Sandbox.

The primary sections are built around the type of content being managed.

---

## The Asset Manager Architecture

The Online Asset Manager is intentionally designed as a **multi-stage asset pipeline** rather than a single download function.

At a high level:

```text
Remote Asset Database
        │
        ▼
   Asset Browser
        │
        ▼
    Search / Filter
        │
        ▼
   Asset Details
        │
        ▼
      Download
        │
        ▼
 Local Asset Storage
        │
        ▼
      Installer
        │
        ▼
 Game-Ready Asset
        │
        ▼
 Garage / Livery Injection
```

This separation is important.

The browser does not need to know how an asset is injected.

The downloader does not need to know how the garage is structured.

The installer does not need to implement the online search system.

Each part of the subsystem has a specific responsibility, allowing the Asset Manager to operate as a complete asset-management layer.

---

## Why This Is More Than an Asset Browser

The most important engineering feature of the Online Asset Manager is that it understands the **actual FR Legends save structure**.

A downloaded car is not simply treated as a picture, ZIP file, or arbitrary JSON document.

Skeleton Key can work with the underlying save representation and perform the required transformation between:

```text
FR Legends Binary Data
        ↕
Decoded JSON/Object Structure
        ↕
Skeleton Key Asset Representation
        ↕
Game-Ready Serialized Data
```

This allows the Vault to work at the same level as the game's save system instead of treating cars as superficial files.

That is what makes features such as remote car installation possible.

---

# Binary Serialization & Deserialization

One of the strongest parts of Skeleton Key is its ability to work with the game's binary save representation.

The Vault can:

```text
Deserialize
Binary Save Data
      ↓
Structured FR Legends Objects
      ↓
Modify / Construct / Merge
      ↓
Serialize
Structured Objects
      ↓
Binary Save Data
```

This means the Asset Manager can obtain structured game data, work with it as normal JavaScript objects, and then produce data that can be placed back into the game's save structure.

The user does not have to manually understand the binary representation.

Skeleton Key handles that layer internally.

---

# The Car Construction Pipeline

The remote car system is especially powerful because the Asset Manager can construct a **complete car object** rather than simply downloading a collection of loose files.

The general process is:

```text
Remote Car Asset
      │
      ▼
Asset Metadata
      │
      ▼
Car Components
      │
      ├── Vehicle configuration
      ├── Appearance data
      ├── Livery information
      ├── Wheels / tires
      ├── Performance data
      └── Other required fields
      │
      ▼
Full FR Legends Car Object
      │
      ▼
Serialization / Injection
      │
      ▼
Playable Garage Car
```

This is possible because the Vault's asset ecosystem provides the information necessary to construct the game's expected object structure.

---

# Sister Repository as the Asset CDN

The Online Asset Manager is also connected to the project's sister GitHub asset repository.

The repository acts as the remote distribution layer for Skeleton Key assets.

Conceptually:

```text
Skeleton Key Vault
       │
       │ HTTPS
       ▼
FR Legends Asset Repository
       │
       ├── Cars
       ├── Liveries
       ├── Packs
       └── Community Assets
```

This gives the Vault a centralized source for remotely distributed content without requiring the CLI itself to contain every asset.

New assets can be added to the asset repository independently of the core Vault application.

The CLI can then discover and retrieve those assets through the Asset Manager.

This separation is one of the reasons the system can scale much better than hard-coding assets directly into the application.

---

# Cars

The Cars section is responsible for discovering and managing complete vehicle assets.

A typical workflow is:

```text
Browse Cars
    ↓
Select Car
    ↓
Inspect Details
    ↓
Download
    ↓
Install
    ↓
Available to Exotic Importer / Garage Systems
```

Installed cars become part of the local Skeleton Key asset ecosystem and can subsequently be used by the appropriate garage-management tools.

---

## Screenshot — Car Browser

> **[SCREENSHOT: INSERT CAR BROWSER MENU HERE]**

Recommended screenshot:

- Car browsing menu
- Asset names
- Navigation controls
- Any category/filter information

---

## Screenshot — Car Details

> **[SCREENSHOT: INSERT CAR DETAILS PAGE HERE]**

Recommended screenshot:

- Selected car
- Metadata
- Asset status
- Download/install options

---

# Liveries

The Livery section provides the same general remote-to-local pipeline for livery assets.

A livery can be:

```text
Discovered
   ↓
Inspected
   ↓
Downloaded
   ↓
Installed Locally
   ↓
Injected onto the appropriate vehicle
```

The Asset Manager handles the remote asset lifecycle while the dedicated Livery Workshop and injector systems handle local livery operations.

This separation keeps the online subsystem from becoming tangled with the actual injection logic.

---

## Screenshot — Livery Browser

> **[SCREENSHOT: INSERT LIVERY BROWSER MENU HERE]**

---

## Screenshot — Livery Details

> **[SCREENSHOT: INSERT LIVERY DETAILS MENU HERE]**

---

# Asset Packs

Packs allow multiple related assets to be distributed together.

Instead of requiring users to locate every individual component, a pack can represent a complete collection.

Conceptually:

```text
Asset Pack
   │
   ├── Car
   ├── Livery
   ├── Supporting Assets
   └── Additional Content
```

The Asset Manager can present the pack as a single downloadable unit while preserving the individual assets once installed.

This is particularly useful for curated builds, themed collections, and community releases.

---

## Screenshot — Packs

> **[SCREENSHOT: INSERT PACK BROWSER MENU HERE]**

---

# Search

The search system exists separately from the main browser.

This is intentional.

Instead of forcing the browser to understand every possible search operation, the search layer produces a filtered set of assets that can then be handed back to the normal browsing interface.

Conceptually:

```text
Search Query
     ↓
Remote / Local Asset Dataset
     ↓
Filtered Results
     ↓
Normal Asset Browser
```

This keeps searching and browsing modular while allowing both systems to share the same asset-detail and installation pipeline.

---

## Screenshot — Search

> **[SCREENSHOT: INSERT SEARCH MENU HERE]**

---

# Asset Status

The Asset Manager also distinguishes between different states of an asset.

An asset may be:

```text
REMOTE
  ↓
DOWNLOADED
  ↓
INSTALLED
  ↓
AVAILABLE FOR USE
```

This distinction matters because downloading an asset does not necessarily mean that it has been installed into the active Skeleton Key asset library.

The Asset Manager tracks these stages so the user can understand what is actually available locally.

---

# Downloads vs Installed Assets

Skeleton Key intentionally keeps downloaded content separate from installed content.

### Downloaded

The asset exists locally but has not necessarily been registered as an installed game-ready asset.

### Installed

The asset has passed through the appropriate installation process and is registered with the local asset system.

This distinction makes it possible to:

- Keep downloaded assets for later
- Reinstall assets
- Inspect downloaded content
- Remove installed content
- Maintain a cleaner local asset library

---

# User Data Manager

The Online Asset Manager also connects to the **User Data Manager**.

The User Data Manager provides the local management layer for content obtained through the Asset Manager.

This is where users can manage downloaded and installed content without having to manually navigate the filesystem.

The result is essentially a small local asset-management ecosystem inside Skeleton Key:

```text
ONLINE ASSET MANAGER
        │
        ├── Browse
        ├── Search
        ├── Download
        ├── Inspect
        └── Install
                 │
                 ▼
          LOCAL ASSET LIBRARY
                 │
                 ├── Downloaded
                 ├── Installed
                 └── Registered
```

---

# Why the Online Asset Manager Is So Useful

The biggest advantage is that it removes the need for users to manually handle the complicated parts of FR Legends save manipulation.

Without the Asset Manager, a user could potentially have to deal with:

```text
Find Asset
    ↓
Download Files
    ↓
Understand Asset Structure
    ↓
Understand FR Legends Save Format
    ↓
Decode Binary Data
    ↓
Construct Missing Objects
    ↓
Serialize Data
    ↓
Place It Correctly
    ↓
Repair References
    ↓
Inject Into Garage
```

The Asset Manager compresses that entire workflow into a controlled pipeline:

```text
Find Asset
    ↓
Download
    ↓
Install
    ↓
Use
```

The complicated work still happens.

It is simply happening **underneath the interface**.

---

# The Engineering Behind It

The Online Asset Manager is effectively a bridge between three worlds:

```text
        REMOTE ASSET ECOSYSTEM
                 │
                 ▼
        SKELETON KEY ASSET LAYER
                 │
                 ▼
          FR LEGENDS SAVE DATA
```

The remote repository provides the content.

The Asset Manager understands how that content should be organized.

The serialization layer understands how FR Legends represents the data.

The installer turns the resulting structures into locally usable assets.

The injection systems then place those assets into the user's game data.

That combination is what makes the Online Asset Manager one of the more advanced subsystems in Skeleton Key.

---

# Typical Workflow

For a normal remote car:

```text
1. Open Modding Sandbox

2. Select:
   [12] Online Asset Manager

3. Open Cars

4. Browse or Search

5. Select a vehicle

6. Inspect the asset

7. Download

8. Install

9. Return to the Sandbox

10. Use Exotic Importer or the appropriate asset tool
```

For a livery:

```text
1. Open Online Asset Manager

2. Open Liveries

3. Browse or Search

4. Select a livery

5. Download

6. Install

7. Use the Livery Workshop / Injector
```

For a pack:

```text
1. Open Online Asset Manager

2. Open Packs

3. Select a pack

4. Inspect contents

5. Download

6. Install

7. Use the resulting assets
```

---

# Screenshot — Main Asset Manager

> **[SCREENSHOT: INSERT MAIN ONLINE ASSET MANAGER MENU HERE]**

This is the most important screenshot for this guide.

It should show the main Asset Manager navigation and establish that this is a full subsystem rather than a single download command.

---

# Screenshot — Asset Installation

> **[SCREENSHOT: INSERT INSTALLATION / DOWNLOAD CONFIRMATION HERE]**

A good installation screenshot helps demonstrate the transition from remote content into the local asset library.

---

# Screenshot — Local Asset Management

> **[SCREENSHOT: INSERT USER DATA MANAGER / LOCAL ASSET VIEW HERE]**

This is useful for showing that downloaded assets remain manageable after leaving the online browser.

---

# Summary

The Online Asset Manager is the **distribution and asset-management layer of Skeleton Key Vault**.

It combines:

- Remote asset discovery
- Search and filtering
- Asset metadata
- Downloads
- Local storage
- Installation
- Asset registration
- Binary deserialization
- Binary serialization
- Complete FR Legends object construction
- Garage integration
- Livery integration
- Pack distribution
- Local user-data management

The important part is that the user does not need to manually perform the complicated serialization, object construction, or filesystem work.

Skeleton Key handles the pipeline:

```text
REMOTE ASSET
     ↓
DISCOVER
     ↓
DOWNLOAD
     ↓
DESERIALIZE / CONSTRUCT
     ↓
INSTALL
     ↓
REGISTER
     ↓
SERIALIZE / INJECT
     ↓
FR LEGENDS
```

That is ultimately what makes the Online Asset Manager so powerful:

**it turns a remote asset repository into a usable extension of the Skeleton Key Vault itself.**

---

## Continue

