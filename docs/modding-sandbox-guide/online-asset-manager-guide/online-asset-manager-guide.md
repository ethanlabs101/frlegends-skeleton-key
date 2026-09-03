# Online Asset Manager Guide

## Overview

The **Online Asset Manager** is the central remote-asset subsystem of FR Legends Skeleton Key Vault.

It connects the Vault directly to the **FR Legends Skeleton Key Asset Database**, allowing users to browse, search, download, install, and manage Cars, Liveries, and Packs — capable of being injected directly into the active garage.

This is much more than a conventional file browser.

The Asset Manager acts as a bridge between:

```text
FR Legends Asset Database
          ↓
    Asset Manager
          ↓
 Download / Construct
          ↓
   Install / Register
          ↓
 FR Legends Save Data
          ↓
      Garage
```

---

# Opening the Asset Manager

From the main navigation:

```text
[4] Modding Sandbox
        ↓
[12] Online Asset Manager - Cars/Liveries/Packs
```

---

## Preview

![](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/modding-sandbox-guide/online-asset-manager-guide/online-asset-manager.png)

---

# 1. Browse Assets

**Browse Assets** is the primary entry point for exploring the remote asset library.

From here, users can navigate available content and select individual assets to inspect, download, install, and use.

The browser is designed to work with the Asset Manager's other systems instead of being an isolated file viewer.

```text
Browse
  ↓
Select Asset
  ↓
View Details
  ↓
Download / Install
  ↓
Use Asset
```

### Screenshot — Browse Assets

> **[SCREENSHOT: INSERT BROWSE ASSETS MENU HERE]**

---

# 2. Categories

**Categories** provides a structured way to navigate the asset repository.

Instead of searching through the entire database, users can narrow the available content by asset type.

This is especially useful as the repository grows and contains large numbers of community and curated assets.

### Screenshot — Categories

> **[SCREENSHOT: INSERT CATEGORIES MENU HERE]**

---

# 3. Search

The **Search** system provides direct asset discovery without requiring manual browsing.

Users can search the available asset collection and receive matching results that can then be inspected through the normal Asset Manager workflow.

The important engineering detail is that Search feeds back into the Asset Manager rather than implementing its own completely separate asset interface.
Asset Browser

```text
Search Query
     ↓
Matching Assets
     ↓
Asset Browser
     ↓
Asset Details
     ↓
Download / Install
```

### Screenshot — Search

> **[SCREENSHOT: INSERT SEARCH MENU HERE]**

---

# 4. New Assets

**New Assets** provides a quick way to discover recently added content.

This gives the Asset Database a continuously evolving feel without requiring users to manually search for newly published assets.

It is particularly useful for discovering:

- Recently added cars
- New liveries
- New community uploads
- Newly released packs

### Screenshot — New Assets

> **[SCREENSHOT: INSERT NEW ASSETS MENU HERE]**

---

# 5. Installed Assets

**Installed Assets** manages content that has already been installed into the local Skeleton Key asset library.

This separates assets that merely exist in the download cache from assets that have actually passed through the installation process.

Conceptually:

```text
Remote
  ↓
Downloaded
  ↓
Installed
  ↓
Ready For Use
```

Installed assets can subsequently be used by the appropriate garage, car, livery, or pack systems.

### Screenshot — Installed Assets

> **[SCREENSHOT: INSERT INSTALLED ASSETS MENU HERE]**

---

# 6. Download Cache

The **Download Cache** provides access to assets that have already been downloaded locally.

This is useful because downloading and installing are treated as separate stages.

```text
REMOTE ASSET
     ↓
DOWNLOAD
     ↓
DOWNLOAD CACHE
     ↓
INSTALL
     ↓
INSTALLED ASSET
```

This separation gives the Vault better control over local asset management and allows downloaded content to remain available without automatically treating everything as installed.

### Screenshot — Download Cache

> **[SCREENSHOT: INSERT DOWNLOAD CACHE MENU HERE]**

---

# 7. Pack Browser

The **Pack Browser** is designed for asset collections rather than individual assets.

A pack can contain multiple related pieces of content and can be distributed as a single curated package.

For example:

```text
PACK
 ├── Car
 ├── Livery
 ├── Supporting Data
 └── Additional Assets
```

This makes packs especially useful for complete builds, themed collections, and community releases.

### Screenshot — Pack Browser

> **[SCREENSHOT: INSERT PACK BROWSER MENU HERE]**

---

# 8. Visit Asset Database

This option provides a direct route to the project's remote asset repository.

The Asset Database is the sister repository that acts as the remote content source for the Vault.

```text
FR Legends Skeleton Key Vault
              │
              │ Asset Requests
              ▼
FRLegends-Asset-Database
              │
              ▼
       Cars / Liveries / Packs
```

The important architectural decision is that the Vault application and the asset collection are separated.

The CLI does not need to ship with every asset.

Instead, the repository functions as the remote distribution layer.

### Screenshot — Asset Database

> **[SCREENSHOT: INSERT ASSET DATABASE / REPOSITORY SCREENSHOT HERE]**

---

# The Engineering Behind the Asset Manager

The Online Asset Manager is one of the most technically interesting parts of Skeleton Key because it isn't simply downloading files and dropping them into a folder.

It operates across several layers of the FR Legends save system.

```text
REMOTE ASSET
      ↓
ASSET METADATA
      ↓
DOWNLOAD
      ↓
DESERIALIZATION
      ↓
OBJECT CONSTRUCTION
      ↓
INSTALLATION
      ↓
SERIALIZATION
      ↓
GAME SAVE STRUCTURE
      ↓
GARAGE
```

The user sees a relatively simple menu.

Underneath that menu, the system is handling significantly more complicated data transformations.

---

# Binary Deserialization

FR Legends stores important save information in serialized binary structures.

Skeleton Key is capable of converting that binary representation into structured objects that JavaScript can work with.

Conceptually:

```text
Binary Save Data
       ↓
   Decoder
       ↓
Structured Object
```

Once decoded, the data can be inspected, modified, combined, or reconstructed without requiring the user to manually manipulate raw binary data.

This is one of the fundamental technologies that allows the Vault's higher-level tools to exist.

---

# Binary Serialization

The reverse operation is equally important.

After Skeleton Key constructs or modifies the required game object, it can serialize the structured representation back into the format expected by the game.

```text
Structured Object
       ↓
   Encoder
       ↓
Binary Save Data
```

Together, serialization and deserialization create the foundation for the Asset Manager's ability to move between remote assets and actual FR Legends save data.

---

# Constructing a Full Car Object

One of the coolest parts of the system is the ability to construct a **complete FR Legends car object** from asset data.

The Asset Database acts as the remote source for the necessary information.

Skeleton Key can then assemble the required structure into something that fits the game's expected car representation.

Conceptually:

```text
Remote Car Asset
       ↓
Read Asset Data
       ↓
Resolve Components
       ↓
Construct Car Object
       ↓
Validate Structure
       ↓
Serialize
       ↓
Inject
```

This is fundamentally different from simply downloading a `.json` file and hoping the game understands it.

The Vault is actually working with the game's underlying data model.

---

# Sister Repository / CDN Architecture

The Asset Database operates as the remote content layer for Skeleton Key.

This creates a clean separation:

```text
┌─────────────────────────────┐
│      SKELETON KEY VAULT     │
│                             │
│ CLI / Logic / Serialization │
│ Installation / Injection    │
└──────────────┬──────────────┘
               │
               │ Remote Assets
               ▼
┌─────────────────────────────┐
│   FR LEGENDS ASSET DATABASE │
│                             │
│ Cars                        │
│ Liveries                    │
│ Packs                       │
│ Community Uploads           │
│ Exclusive Assets            │
└─────────────────────────────┘
```

This effectively gives Skeleton Key a remotely maintained asset distribution system without embedding the entire asset library inside the application itself.

New assets can be published to the sister repository while the core Vault application remains unchanged.

That is a major reason the architecture scales well.

---

# Direct Garage Integration

The Asset Manager is also tightly connected to the Vault's garage systems.

The intended workflow can ultimately look like:

```text
Remote Asset
     ↓
Download
     ↓
Install
     ↓
Construct / Deserialize
     ↓
Serialize
     ↓
Garage Injection
     ↓
FR Legends
```

The user doesn't need to manually copy binary data around or construct a car object themselves.

The subsystem handles the difficult parts.

---

# Why Use the Online Asset Manager?

The main advantage is **abstraction**.

Without the Asset Manager, working with remote FR Legends assets could require:

```text
Find Asset
↓
Download Asset
↓
Understand File Structure
↓
Understand Save Structure
↓
Deserialize Data
↓
Construct Game Object
↓
Validate Data
↓
Serialize Data
↓
Install
↓
Inject
```

The Asset Manager turns that into a controlled workflow:

```text
Browse
↓
Select
↓
Download
↓
Install
↓
Use
```

The complicated engineering still happens.

The difference is that **Skeleton Key is doing it for you**.

---

# Asset Lifecycle

The complete asset lifecycle is roughly:

```text
REMOTE
  │
  ▼
BROWSED
  │
  ▼
DOWNLOADED
  │
  ▼
CACHED
  │
  ▼
INSTALLED
  │
  ▼
REGISTERED
  │
  ▼
READY FOR USE
  │
  ▼
GARAGE / LIVERY / PACK SYSTEM
```

This separation between remote, downloaded, installed, and usable content is what allows the Vault to maintain a much cleaner local asset ecosystem.

---

# Why This Architecture Matters

The Online Asset Manager demonstrates the larger design philosophy behind Skeleton Key Vault.

The goal isn't simply:

> "Download a mod."

The goal is:

> **Take a remote asset, understand its structure, translate it into the game's data model, serialize it correctly, and make it usable through the Vault's existing systems.**

That means the Asset Manager sits at the intersection of:

```text
Remote Distribution
        +
Asset Management
        +
Binary Serialization
        +
Object Construction
        +
Local Installation
        +
Garage Integration
```

That is what makes it one of the flagship systems in Skeleton Key.

---

# Quick Reference

| Option | Purpose |
|---|---|
| **1 — Browse Assets** | Explore the available asset library |
| **2 — Categories** | Navigate assets by category |
| **3 — Search** | Find specific assets |
| **4 — New Assets** | Discover recently added content |
| **5 — Installed Assets** | Manage locally installed assets |
| **6 — Download Cache** | Manage previously downloaded content |
| **7 — Pack Browser** | Browse complete asset packs |
| **8 — Visit Asset Database** | Open the remote asset repository |
| **0 — Back** | Return to the previous menu |

---

# Final Takeaway

The Online Asset Manager is effectively the **remote content backbone of Skeleton Key Vault**.

It combines a remote asset repository with local asset management and the Vault's reverse-engineered understanding of FR Legends save structures.

```text
                ASSET DATABASE
                      │
                      ▼
              ONLINE ASSET MANAGER
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
       DOWNLOAD     SEARCH      BROWSE
          │
          ▼
       CACHE
          │
          ▼
      INSTALLER
          │
          ▼
   OBJECT CONSTRUCTION
          │
          ▼
   DESERIALIZE / MODIFY
          │
          ▼
      SERIALIZE
          │
          ▼
     GARAGE / GAME
```

What looks like an asset browser from the outside is actually a complete **remote-to-game asset pipeline** underneath.

That is the real value of the system.




Check it out! -> [FR Legends Asset Database](https://github.com/ethanlabs101/FRLegends-Asset-Database)
