# Changelog

All notable changes to **FR Legends Skeleton Key Vault** are documented in this file.

This project follows a release-based changelog format. Version numbers represent milestones in the development of the Skeleton Key framework.

---

# [1.0.0](https://github.com/ethanlabs101/frlegends-skeleton-key/releases/tag/v1.0.0) — Initial Public Release

## Overview

**FR Legends Skeleton Key Vault v1.0.0** marks the first public release of the project as a structured **Save Management Interoperability Framework** for FR Legends.

What began as experimentation with player data, save structures, and game assets evolved into a reusable Node.js framework for working with FR Legends accounts, saves, cars, liveries, assets, backups, and related data systems.

This release establishes the first complete public version of the Skeleton Key architecture.

---

## Account & Vault System

* Added persistent local account management.
* Added local identity vault database using SQLite.
* Added support for storing and selecting multiple FR Legends accounts.
* Added account credential viewing and management workflows.
* Added automatic account state handling.
* Added `.vault.lock` local vault state protection.
* Added account provisioning and recovery workflows.
* Added account cloning functionality.
* Added account synchronization through the PlayFab client layer.

---

## Player Data & Save Management

* Added player-data decoding and encoding pipeline.
* Added support for processing encoded player-data payloads.
* Refactored the original player-data processing logic into reusable framework components.
* Added structured JSON representation for decoded player data.
* Added encoded save output generation.
* Added save validation and structure checking.
* Added support for preserving player-data structure during modifications.
* Added save snapshots and backup workflows.
* Added identity-specific backup directories.
* Added support for preserving both structured and encoded representations of save data.

---

## Garage & Car Systems

* Added garage management functionality.
* Added car deletion tools.
* Added car slot modification.
* Added car construction and injection workflows.
* Added stock car injection functionality.
* Added exotic car importing functionality.
* Added car cloning workflows.
* Added live editing functionality.
* Added support for managing cars as structured game objects rather than treating saves as unstructured files.

---

## Livery System

* Added a dedicated livery management subsystem.
* Added proprietary FR Legends livery binary decoding.
* Added proprietary livery binary encoding.
* Added recursive livery node parsing.
* Added livery node inspection.
* Added livery injection workflows.
* Added livery downloading functionality.
* Added livery database/API integration.
* Added support for reconstructing livery structures from binary data.
* Added support for preserving livery node hierarchy and properties during processing.

The livery codec was independently reverse engineered during development and became one of the major technical components of the project.

---

## Asset Management

* Added Online Asset Manager.
* Added asset browsing.
* Added asset searching.
* Added asset filtering.
* Added asset categories.
* Added asset details and metadata views.
* Added asset installation workflows.
* Added installed asset management.
* Added downloadable car assets.
* Added downloadable livery assets.
* Added car + livery pack support.
* Added asset registry functionality.
* Added asset routing and action handling.
* Added support for community-provided assets.

---

## Save Operations & Sandbox

* Added modular sandbox operation system.
* Added money modification tools.
* Added playtime editing.
* Added player-name editing.
* Added livery-pass management.
* Added unlock functionality.
* Added user-data management.
* Added JSON inspection tools.
* Added save snapshot functionality.
* Added garage modification tools.
* Added modular operation routing through the CLI.

---

## Reverse Engineering & Data Processing

* Refactored XOR-based data processing into reusable logic.
* Added generalized XOR value discovery functionality.
* Improved validation when processing encoded values.
* Improved handling of binary and structured representations.
* Added reusable abstractions around data transformation.
* Established separation between data representation, processing logic, and CLI interaction.

The project evolved from locating and modifying individual values toward understanding how FR Legends data is represented and then building reusable systems around that understanding.

---

## CLI Architecture

* Added modular command-line interface.
* Added structured menu system.
* Added reusable interface utilities.
* Added themed terminal rendering.
* Added framed interface components.
* Added account status display.
* Added player/account information display.
* Added modular menu routing.
* Added centralized sandbox operation handling.
* Added validation utilities.
* Added error-handling and recovery workflows.
* Added splash/startup interface.
* Added FAQ and system validation menus.

The CLI functions as the interface layer while the underlying systems remain modular enough to be reused by future interfaces.

---

## Backup & Recovery

* Added automatic save backup workflows.
* Added identity-specific backup storage.
* Added structured and encoded backup preservation.
* Added save snapshots before significant operations.
* Added account recovery tooling.
* Added validation before and after destructive operations.
* Added recovery-oriented workflows for local vault data.

---

## Security & Local State

* Added local vault locking through `.vault.lock`.
* Added centralized security utilities.
* Added credential/key derivation utilities.
* Added local account state management.
* Added separation between account state and application modules.
* Added filesystem validation and required-structure checks.

Security-related systems are designed around local data handling and application integrity rather than presenting the project as a security product.

---

## Linux Support

* Added Linux installation workflow.

* Added Linux update workflow.

* Added Linux dependency validation.

* Added automated dependency installation.

* Added update-time preservation of:

  * `.vault.lock`
  * `identity_vault.db`
  * `fr_legends_payloads/`

* Added update verification.

* Added dependency installation through `npm ci` / `npm install`.

* Added post-update validation.

* Added recovery handling for failed updates.

---

## Android / Termux Support

* Added Android support through Termux and Debian/PRoot environments.
* Added Termux installation workflow.
* Added Termux-specific dependency setup.
* Added persistent npm cache handling.
* Updated the Termux installer to use a compatible npm release for the supported Node.js environment.
* Added dependency installation retries.
* Added native dependency verification.
* Added `better-sqlite3` verification.
* Added Termux-specific troubleshooting documentation.

The Termux installation process was tested in a fresh Debian/PRoot environment and verified through a complete dependency installation and CLI startup.

---

## Update System

* Added dedicated Linux updater.
* Added dedicated Termux updater.
* Added update-time backup and preservation of user data.
* Added repository refresh workflow.
* Added dependency reinstallation.
* Added post-update verification.
* Added protection against overwriting persistent vault data during updates.

---

## Documentation

Added the initial public documentation set, including:

* `README.md`
* `TABLE-OF-CONTENTS.md`
* `FEATURES.md`
* `FUTURE-ROADMAP.md`
* `TECHNICAL-BREAKDOWNS.md`
* `DIRECTORY-STRUCTURE.md`
* `TROUBLESHOOTING.md`
* `CONTRIBUTING.md`
* `HOW-TO-UPDATE.md`

Documentation covers installation, architecture, features, technical systems, directory structure, troubleshooting, contribution guidelines, and update procedures.

---

## Project Infrastructure

* Added Apache License 2.0.
* Added structured repository documentation.
* Added Linux and Termux installation infrastructure.
* Added Linux and Termux update infrastructure.
* Added release documentation.
* Added demonstration GIF showcasing the Skeleton Key workflow.
* Added dedicated asset database infrastructure.
* Established the project as a modular framework rather than a collection of standalone scripts.

---

## Architecture Milestone

Version 1.0.0 represents the transition from a collection of experimental scripts into a reusable framework.

The development progression can be summarized as:

```text
Experiments
    ↓
Individual Scripts
    ↓
Reusable Logic
    ↓
Modular Systems
    ↓
CLI Framework
    ↓
FR Legends Skeleton Key Vault
```

The framework now separates:

* Interface logic
* Authentication
* Account state
* Save processing
* Data codecs
* Garage operations
* Livery operations
* Asset management
* Backup systems
* Update infrastructure
* Validation
* Security utilities

This separation provides the foundation for future interfaces and additional FR Legends data systems.

---

## Platform Compatibility

### Linux

Supported through the dedicated Linux installation and update workflows.

### Android

Supported through Termux using a Debian/PRoot environment.

### Node.js

The project uses Node.js and npm as its primary runtime and package-management environment.

---

## Known Limitations

* FR Legends internal formats and online services may change independently of Skeleton Key.
* Some functionality depends on the current structure of FR Legends data.
* Platform-specific environments may introduce dependency differences.
* Termux/PRoot environments can behave differently from native Linux installations.
* Community assets may vary in quality, structure, or compatibility.
* Future FR Legends updates may require changes to data-processing systems.

---

## Release Status

**Version:** `1.0.0`

**Release Type:** Initial Public Release

**Project:** FR Legends Skeleton Key Vault

**Repository:** `ethanlabs101/frlegends-skeleton-key`

**License:** Apache License 2.0

---

## What's Next

Future development will continue through the project's roadmap, with potential work including additional data systems, expanded asset functionality, interface improvements, compatibility updates, and further tooling around FR Legends save management.

---

[1.0.0](https://github.com/ethanlabs101/frlegends-skeleton-key/releases/tag/v1.0.0)


[→ Return to main menu](https://github.com/ethanlabs101/frlegends-skeleton-key)

