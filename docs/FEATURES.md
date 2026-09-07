# FR Legends Skeleton Key Vault — Complete Feature List

This document provides a high-level overview of the currently available capabilities in **FR Legends Skeleton Key Vault**.

For detailed instructions, follow the relevant guides listed in the [Table of Contents](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/TABLE-OF-CONTENTS.md)

The following covers most of the functionality currently included in Skeleton Key.

There are also many underlying architectural features, engineering decisions, and supporting systems that are not immediately visible from the user interface. These components are a major part of what makes Skeleton Key a portable, maintainable, extensible, and feature-rich ecosystem.

Follow along below to view all categorized feature lists.

---

# Account & Identity System

Skeleton Key includes persistent account and identity management features.

### Available Capabilities

- Account authentication
- Persistent local account info management
- Local encrypted account database
- Active account tracking
- Session status display
- Account telemetry
- Player identity display
- Garage telemetry
- Currency telemetry
- Playtime telemetry
- Livery Pass telemetry
- Driver Name telemetry
- Account-specific local data organization
- Account-specific backup storage
- Account recovery authentication
- Password verification before recovery operations
- Account entry maintenance 

---

# Save Management

Skeleton Key provides tools for reading, modifying, storing, rebuilding, and restoring account save data.

### Available Capabilities

- Download account save data
- Decode PD save payloads
- Work with structured save data
- Encode modified save data
- Upload rebuilt save payloads
- Save raw JSON snapshots
- Preserve complete account save states
- Create local account backups
- Store binary save snapshots
- Store JSON save snapshots
- Restore previous account states
- Rebuild save payloads from JSON
- Upload binary save snapshots directly
- Synchronize account telemetry after changes
- Backup capabilities before destructive actions
- Backup capabilities after every log in

---

# Serialization & Save Processing

The Vault includes internal infrastructure for converting account data between usable and stored formats.

### Platform Capabilities

- PD decoding
- PD encoding
- Structured JSON reconstruction
- Binary payload generation
- Binary payload restoration
- Save serialization
- Save deserialization
- Prefix preservation
- Account-specific encoding support
- XOR key handling
- Cloud save reconstruction
- Livery binary codec (understands proprietary binary structure, and compressed livery code formats)

These systems are foundational to many higher-level Skeleton Key features.

---

# Account Modification

Modify supported account-level values directly through the Modding Sandbox.

### Available Features

- Modify in-game currency
- Modify playtime
- Modify driver name
- Modify Livery Pass state
- Modify Carport slots
- Exporting and importing car payloads
- Delete cars from garage
- Car object modification and injection
- Stock car injection
- Synchronize modified account telemetry
- Upload account changes directly

---

# Garage Management

Skeleton Key provides a full set of tools for managing garage content.

### Available Features

- View garage cars
- View car names
- View car synchronization IDs
- Export garage cars
- Import car payloads
- Inject car payloads directly into the active garage
- Remove selected garage cars
- Filter cars before deletion
- View all garage cars
- Maintain garage integrity during cleanup
- Prevent deletion of the final remaining car
- Automatically update the carport after garage changes
- Upload garage changes
- Synchronize telemetry after garage operations

---

# Garage Cleanup

The Garage Cleanup system provides targeted removal of cars from a garage.

### Available Features

- Filter cars by name category
- Browse all garage cars
- View matching cars before deletion
- Select multiple cars
- Delete multiple cars in one operation
- Confirm deletion before changes are made
- Automatically reduce the carport
- Prevent the garage from becoming empty
- Upload cleaned garage state
- Synchronize telemetry after cleanup

---

# Cloning & Vehicle Construction

Skeleton Key includes systems for creating and injecting additional vehicle objects.

### Available Capabilities

- Clone supported car data
- Create modified copies of existing garage cars
- Preserve the original source car
- Stage modifications before injection
- Inject completed vehicle drafts into the garage
- Automatically increase the carport when required
- Upload constructed vehicles directly

---

# Live Car Editor

The Live Car Editor creates a modified clone instead of directly editing the original garage car.

### Available Features

- Select any available garage car
- Create a full pre-edit backup
- Create an isolated editable draft
- Preserve the original garage car
- Review the modified draft
- Confirm injection separately
- Inject the modified clone into the garage

### Wheel Configuration

- Modify all four wheel offsets
- Modify front wheel offsets
- Modify rear wheel offsets
- Modify wheel offsets independently by axle
- Support extended ET values

### Vehicle Identity

- Rename cloned cars
- Preserve the original car name until modified

### Tire Configuration

- Modify tire health
- Set tire health using supported whole-number values

### Livery Controls

- Remove body livery
- Remove window livery
- Remove all livery data
- Clear associated body livery URLs

---

# Livery Management

Skeleton Key includes multiple tools for managing livery data.

### Available Capabilities

- Modify Livery Pass state
- Remove body liveries
- Remove window liveries
- Remove complete livery configurations
- Clear stored livery URLs
- Inject remote livery assets
- Construct vehicles from livery assets
- Apply compatible liveries to stock vehicle objects
- Inject completed livery vehicles directly into the garage
- Livery binary codec

***The livery codec is a core engine behind Skeleton Key's livery ecosystem. It bridges the gap between compact user-facing livery codes, proprietary serialized binary data, and the structured livery fields stored inside complete car objects. By understanding each representation, the codec allows livery data to be interpreted, converted, reconstructed, and used throughout Skeleton Key's asset and garage systems.***

---

# Livery Asset Construction Pipeline

A livery asset does not need to already exist as a complete garage car.

Skeleton Key can construct a complete vehicle object using:

```text
REMOTE LIVERY ASSET
        │
        ▼
IDENTIFY VEHICLE MODEL
        │
        ▼
LOAD COMPATIBLE STOCK CAR
        │
        ▼
APPLY LIVERY DATA
        │
        ▼
CONSTRUCT COMPLETE CAR OBJECT
        │
        ▼
SERIALIZE ACCOUNT DATA
        │
        ▼
INJECT INTO GARAGE
```

### Available Capabilities

- Model-aware livery handling
- Stock vehicle reconstruction
- Full car object construction
- Livery-to-car transformation
- Direct garage injection
- Remote livery installation

---

# Stock Car Library & Injection System

The Unlock Menu provides access to Skeleton Key's local stock car payload library.

### Available Features

- Browse available stock car payloads
- Inject individual stock cars
- Inject the complete stock car set
- Export stock cars to the Exotic Importer
- Automatically update carport capacity
- Upload injected garage state
- Synchronize telemetry after injection

### Bulk Operations

- Export all stock car payloads
- Inject all available stock cars
- Track bulk injection progress
- Track bulk export progress

---

# Exotic Importer

Skeleton Key supports importing locally stored car payloads.

### Available Capabilities

- Store car payload files locally
- Browse available car payloads
- Import compatible car objects
- Inject imported cars into the garage
- Build a reusable local car library

The Unlock Menu can also export the complete stock vehicle library into the Exotic Importer directory.

---

# Online Asset Manager

The Online Asset Manager connects Skeleton Key to the remote asset ecosystem.

### Available Features

- Browse remote assets
- Browse asset categories
- Search available assets
- Discover newly added assets
- View installed assets
- Manage downloaded assets
- Browse available packs
- Open the remote Asset Database
- Download supported assets
- Cache downloaded assets locally
- Track installed assets
- Inject compatible assets directly into the garage

---

# Remote Asset Infrastructure

The Asset Manager is designed as more than a simple file downloader.

### Platform Capabilities

```text
REMOTE ASSET DATABASE
        │
        ▼
ASSET DISCOVERY
        │
        ├── Browse
        ├── Categories
        ├── Search
        └── New Assets
        │
        ▼
DOWNLOAD
        │
        ▼
LOCAL CACHE
        │
        ▼
ASSET REGISTRY
        │
        ▼
ASSET PROCESSING
        │
        ▼
CAR / LIVERY CONSTRUCTION
        │
        ▼
DIRECT GARAGE INJECTION
```

### Asset Types

The remote ecosystem can organize and distribute:

- Car assets
- Livery assets
- Car packs
- Livery packs
- Community uploads
- Exclusive assets
- Future compatible asset categories

---

# Download & Asset Management

Skeleton Key manages downloaded assets as application data rather than requiring users to manually track files.

### Available Features

- Browse downloaded asset categories
- Browse installed assets
- Delete individual downloaded assets
- Remove downloaded asset directories
- Update the local asset registry
- Detect missing registry entries
- Manage the local download cache

---

# Account Backup System

Skeleton Key includes account-specific backup infrastructure.

### Available Features

- Create account backups
- Store backups by account
- Preserve JSON account states
- Preserve binary save states
- Browse accounts with backups
- Browse backup history
- Delete individual backups
- Delete backup directories
- Manage backup storage from the CLI

---

# Snapshot Management

Snapshots provide another layer of local account state management.

### Available Features

- Store account snapshots
- Organize snapshots by account
- Browse accounts with snapshots
- Browse individual snapshots
- Delete individual snapshots
- Remove snapshot directories
- Manage snapshots through the User Data Manager

---

# Account Recovery

The Account Recovery Tool restores previous account save states.

### Available Features

- Recover from JSON backups
- Recover from binary backups
- Browse backups by account
- Select a specific recovery point
- Confirm restoration before upload
- Verify the target account password
- Read the target account's current save configuration
- Obtain current save encoding information
- Rebuild JSON backups into valid save payloads
- Upload binary backups directly
- Finalize cloud save restoration
- Synchronize telemetry when restoring the active account
- Avoid telemetry synchronization when restoring another account

---

# User Data Manager

The User Data Manager provides a centralized interface for managing Skeleton Key's locally generated data.

### Managed Data Types

- Account backups
- Car payloads
- Downloaded assets
- Snapshots

---

# Application-Managed Data

Skeleton Key treats local project data as application-managed state.

The User Data Manager provides structured access to:

```text
fr_legends_payloads/
│
├── backups/
│
├── cars/
│
├── downloads/
│
└── snapshots/
```

Instead of requiring users to manually locate and delete files, the application provides dedicated management interfaces for supported data.

---

# Telemetry System

Skeleton Key maintains session-facing account information after supported operations.

### Available Telemetry

- Session status
- Account identity
- Account user
- Garage state
- Garage capacity
- Livery Pass state
- Money
- Coins
- Playtime
- Player information

### Synchronization

Supported operations can synchronize telemetry after:

- Garage modifications
- Car injection
- Car removal
- Account modification
- Stock car injection
- Asset injection
- Account recovery

---

# Modular CLI Architecture

Skeleton Key is organized as a collection of dedicated systems rather than a single monolithic command script.

### Major System Areas

- Main navigation
- Authentication
- Account management
- Save processing
- Garage management
- Car modification
- Livery management
- Asset management
- Backup management
- Snapshot management
- Account recovery
- User data management
- Utility and interface systems

This modular structure allows individual features to operate as dedicated components while sharing common account, telemetry, serialization, and interface infrastructure.

---

# Interface Infrastructure

Skeleton Key provides a consistent terminal interface across its systems.

### Interface Features

- Persistent interface framing
- Active account information
- Session status display
- Garage telemetry
- Currency telemetry
- Playtime telemetry
- Consistent menu styling
- Structured terminal boxes
- Color-coded output
- Confirmation prompts
- Selection validation
- Error feedback
- Progress feedback
- Return navigation

---

# Data Integrity & Safety Decisions

Several systems include safeguards designed to reduce accidental destructive operations.

### Examples

- Confirmation before deletion
- Confirmation before recovery
- Confirmation before major garage injection
- Full account backup before Live Car Editor modification
- Original car preserved during live editing
- Final-car deletion prevention
- Filename validation
- Duplicate filename prevention
- Input validation
- Account password verification for recovery
- Recovery telemetry isolation for non-active accounts
- Registry cleanup after asset deletion

These protections are part of Skeleton Key's application design rather than separate menu features.

---

# Infrastructure Features

Some of Skeleton Key's most important capabilities operate behind the scenes.

### Core Infrastructure

- Binary deserialization
- Binary serialization
- JSON save reconstruction
- Remote asset discovery
- Local asset caching
- Asset registry tracking
- Stock vehicle dependency library
- Livery-to-car construction
- Account-specific backup storage
- Account-specific snapshot storage
- Cloud payload upload
- Cloud upload finalization
- Telemetry synchronization

These systems allow higher-level features to work together as part of a larger save-management framework.

---

# Extensible Design

Skeleton Key is built around reusable infrastructure that can support additional features and asset types as the project develops.

Existing systems provide foundations for future expansion in areas such as:

- Additional vehicle modification tools
- Additional livery tools
- Additional asset categories
- Additional asset pack formats
- More advanced garage management
- Expanded save analysis
- Additional recovery tools
- New user interfaces
- Future platform support

Even web/app integration which has already been proven by [frlmods.com](https://frlmods.com) which uses a stripped version of Skeleton Key's engine
and money-modification methods packaged into a simple web-based tool. See [frlmods.com money-mod](https://frlmods.com/add-money) ***Requires account***

---

# Summary

FR Legends Skeleton Key Vault is not limited to a single save editor or mod menu.

It combines:

- Account management
- Save processing
- Serialization infrastructure
- Garage management
- Car object construction
- Live vehicle editing
- Livery handling
- Stock vehicle management
- Remote asset distribution
- Local asset caching
- Pack browsing
- Backup management
- Snapshot management
- Account recovery
- User data management
- Telemetry synchronization

into a connected framework for managing compatible FR Legends account and garage data.

For step-by-step usage instructions, return to the [Table of Contents](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/TABLE-OF-CONTENTS.md).

**[← Skeleton Key Main Page](https://github.com/ethanlabs101/frlegends-skeleton-key/tree/main)**
