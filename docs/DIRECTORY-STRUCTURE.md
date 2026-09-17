# Directory Structure

This document describes the directory structure of **FR Legends Skeleton Key Vault**, including the repository layout, application directories, core modules, sandbox systems, payload data, and shared utilities.

The repository contains the Skeleton Key Vault application inside the `skeleton-key-vault/` directory.

---

## Repository Structure

```text
frlegends-skeleton-key/
└── skeleton-key-vault/
    ├── cli.js
    ├── assets/
    ├── fr_legends_payloads/
    ├── menu/
    ├── sandbox/
    ├── src/
    └── utils/
```

The repository root is:

```text
frlegends-skeleton-key/
```

The actual Skeleton Key Vault application root is:

```text
frlegends-skeleton-key/skeleton-key-vault/
```

All application paths referenced throughout this document are relative to `skeleton-key-vault/` unless otherwise specified.

---

# `skeleton-key-vault/`

This is the main application directory containing the Skeleton Key Vault CLI and its supporting systems.

```text
skeleton-key-vault/
├── cli.js
├── assets/
├── fr_legends_payloads/
├── menu/
├── sandbox/
├── src/
└── utils/
```

The application is divided into several major areas:

- `cli.js` — application entry point
- `menu/` — main menu and supporting menu modules
- `sandbox/` — save and game-data operations
- `src/` — core application utilities and services
- `utils/` — shared UI and utility modules
- `fr_legends_payloads/` — templates and car payload data
- `assets/` — static CLI assets

---

# `cli.js`

```text
skeleton-key-vault/cli.js
```

The main Skeleton Key Vault entry point.

This is where the application starts and where the primary CLI interface is connected to the project's different systems.

The CLI provides the user-facing interface while the underlying functionality is implemented by the modules contained throughout the project.

---

# `assets/`

```text
assets/
└── goodbye.js
```

Contains static assets used by the Skeleton Key Vault interface.

### `goodbye.js`

Provides the ASCII-art presentation displayed when exiting Skeleton Key Vault.

---

# `fr_legends_payloads/`

```text
fr_legends_payloads/
├── cars/
│   └── stock_cars/
├── templates/
│   └── master.json
└── init/
    └── init_car.json
```

Contains the structured game-data resources used by Skeleton Key Vault.

This directory contains payloads, templates, and initialization data used by the project's save-management and car-management systems.

The application expects this directory to remain in its expected location inside `skeleton-key-vault/`.

---

## `fr_legends_payloads/cars/`

Contains car-related payload data.

### `stock_cars/`

Contains stock-car payloads used by Skeleton Key Vault.

These payloads provide predefined car data for stock-car-related functionality.

---

## `fr_legends_payloads/templates/`

Contains templates used by the project's structured data systems.

### `master.json`

The master data template used by Skeleton Key Vault's structure-validation system.

The validator compares player data against the expected structure defined by this template.

---

## `fr_legends_payloads/init/`

Contains initialization data used by car-related systems.

### `init_car.json`

Contains initial car data used when constructing car objects.

---

# `menu/`

```text
menu/
├── account_cloning.js
├── account_recovery.js
├── calculate_ticks.js
├── error_message.js
├── faq.js
├── format_playtime.js
├── get_creds.js
└── validate_system.js
```

Contains the primary menu-level modules used by Skeleton Key Vault.

These modules handle account functionality, calculations, formatting, project information, credential utilities, error presentation, and system validation.

---

## `menu/account_cloning.js`

Provides account-cloning functionality.

---

## `menu/account_recovery.js`

Provides account-recovery functionality.

---

## `menu/calculate_ticks.js`

Provides .NET tick calculation functionality.

---

## `menu/error_message.js`

Provides standardized formatting for common error messages.

---

## `menu/faq.js`

Provides project information and links to documentation and repository resources through the CLI.

---

## `menu/format_playtime.js`

Provides playtime formatting and conversion functionality.

---

## `menu/get_creds.js`

Provides credential-generation functionality and related credential alerts.

---

## `menu/validate_system.js`

Provides Skeleton Key Vault's system and data-structure validation.

The module verifies that required directories and files exist in their expected locations.

It also contains structured player-data validation that checks for required keys and compares nested data against the master template.

If required components are missing, the validator reports the missing component and expected path before terminating the application.

---

# `sandbox/`

```text
sandbox/
├── add_money.js
├── change_name.js
├── delete_car.js
├── exotic_importer.js
├── garage_manager.js
├── index.js
├── live_editor.js
├── livery_pass.js
├── modify_slots.js
├── playtime_editor.js
├── save_snapshot.js
├── unlock_menu.js
├── user_data_manager.js
├── view_json.js
├── assets/
├── cars/
└── livery/
```

Contains the Skeleton Key Vault sandbox systems.

The sandbox provides the project's save-management and game-data manipulation functionality, including garage operations, car operations, player-data operations, livery processing, asset management, and development tools.

---

## `sandbox/index.js`

The sandbox entry point and menu UI module.

It provides the main interface for navigating sandbox operations.

---

## `sandbox/add_money.js`

Provides coin and gem modification functionality.

---

## `sandbox/change_name.js`

Provides driver-name modification functionality.

---

## `sandbox/delete_car.js`

Provides car-deletion functionality.

---

## `sandbox/exotic_importer.js`

Provides car payload injection and import functionality.

---

## `sandbox/garage_manager.js`

Provides garage viewing and payload-export functionality.

This module works with garage data and provides functionality for inspecting and exporting car payloads.

---

## `sandbox/live_editor.js`

Provides live car-object modification functionality.

This operates on structured car objects rather than being limited to static payload files.

---

## `sandbox/livery_pass.js`

Provides livery-pass toggle functionality.

---

## `sandbox/modify_slots.js`

Provides carport and car-slot modification functionality.

---

## `sandbox/playtime_editor.js`

Provides playtime modification functionality.

---

## `sandbox/save_snapshot.js`

Provides development-oriented save snapshot functionality.

```text
[DEV TOOLS]
```

This module is intended for creating account/save snapshots during development and testing.

---

## `sandbox/unlock_menu.js`

Provides stock-car payload injection functionality.

---

## `sandbox/user_data_manager.js`

Provides user-data management functionality.

---

## `sandbox/view_json.js`

Provides development-oriented JSON inspection functionality.

```text
[DEV TOOLS]
```

---

# `sandbox/assets/`

```text
sandbox/assets/
├── actions.js
├── assetInstaller.js
├── browser.js
├── categories.js
├── details.js
├── downloads.js
├── filter.js
├── filter_menu.js
├── index.js
├── installed.js
├── menu.js
├── new.js
├── open.js
├── packs.js
├── registry.js
├── router.js
├── search.js
├── status.js
└── types.js
```

Contains the Online Asset Manager and its supporting modules.

This subsystem handles asset discovery, browsing, filtering, downloading, installation, inspection, and management.

---

## `sandbox/assets/index.js`

Entry point for the Online Asset Manager.

---

## `sandbox/assets/menu.js`

Provides the main Online Asset Manager menu.

---

## `sandbox/assets/router.js`

Handles routing between Online Asset Manager operations.

---

## `sandbox/assets/actions.js`

Contains asset execution operations.

---

## `sandbox/assets/assetInstaller.js`

Handles asset installation.

---

## `sandbox/assets/browser.js`

Provides asset browsing functionality.

---

## `sandbox/assets/categories.js`

Provides asset-category functionality.

---

## `sandbox/assets/details.js`

Provides asset-detail inspection functionality.

---

## `sandbox/assets/downloads.js`

Handles downloaded-asset functionality.

---

## `sandbox/assets/filter.js`

Contains asset-filtering logic.

---

## `sandbox/assets/filter_menu.js`

Provides the asset-filtering menu interface.

---

## `sandbox/assets/installed.js`

Provides access to installed assets.

---

## `sandbox/assets/new.js`

Provides access to newly available assets.

---

## `sandbox/assets/open.js`

Provides functionality for opening the external asset database.

---

## `sandbox/assets/packs.js`

Provides asset-pack browsing functionality.

---

## `sandbox/assets/registry.js`

Provides asset registry utilities.

---

## `sandbox/assets/search.js`

Provides asset-search functionality.

---

## `sandbox/assets/status.js`

Provides asset-status utilities.

---

## `sandbox/assets/types.js`

Provides asset-type utilities.

---

# `sandbox/cars/`

```text
sandbox/cars/
├── cars.js
└── injector.js
```

Contains car-specific utilities used by the asset and injection systems.

### `cars.js`

Contains stock-car asset names and related car definitions.

### `injector.js`

Provides car injection utilities used by the Online Asset Manager.

---

# `sandbox/livery/`

```text
sandbox/livery/
├── codec.js
├── downloader.js
├── index.js
├── injector.js
└── database/
    ├── api.js
    ├── index.js
    └── inspector.js
```

Contains the livery-processing system and its supporting database functionality.

---

## `sandbox/livery/codec.js`

Provides the proprietary FR Legends livery binary codec.

This module handles conversion between the livery binary representation and the structured representation used by the livery system.

---

## `sandbox/livery/downloader.js`

Provides livery downloading utilities.

---

## `sandbox/livery/index.js`

Entry point for the livery utility system.

---

## `sandbox/livery/injector.js`

Provides livery injection functionality.

---

# `sandbox/livery/database/`

```text
sandbox/livery/database/
├── api.js
├── index.js
└── inspector.js
```

Contains the modules responsible for interacting with and inspecting the Online Asset Database used by the livery system.

### `api.js`

Provides Online Asset Database API communication.

### `index.js`

Entry point for the livery database subsystem.

### `inspector.js`

Provides asset inspection functionality.

---

# `src/`

```text
src/
├── auth.js
├── client.js
├── pd.js
├── security.js
├── splash.js
├── state.js
├── telemetry.js
└── update.js
```

Contains Skeleton Key Vault's core utility and service modules.

These modules provide functionality shared by the wider application rather than belonging exclusively to one sandbox operation.

---

## `src/auth.js`

Provides authentication-related menu and utility functionality.

---

## `src/client.js`

Provides the PlayFab client wrapper used by Skeleton Key Vault.

---

## `src/pd.js`

Provides player-data processing and serialization functionality.

This includes the player's data encoding and decoding pipeline, including XOR processing and gzip compression/decompression.

---

## `src/security.js`

Provides core Skeleton Key Vault security functionality.

This includes the local database encryption and master-key utilization mechanisms used by the project.

---

## `src/splash.js`

Provides the Skeleton Key Vault splash-screen presentation.

---

## `src/state.js`

Provides authentication-state management.

---

## `src/telemetry.js`

Provides telemetry synchronization functionality.

---

## `src/update.js`

Provides update-checking functionality for Skeleton Key Vault.

---

# `utils/`

```text
utils/
├── box.js
├── frame.js
├── jitter.js
└── theme.js
```

Contains shared UI and utility modules.

These modules provide reusable functionality used throughout the application.

---

## `utils/box.js`

Provides the standardized CLI box-drawing interface.

---

## `utils/frame.js`

Provides the telemetry header UI.

---

## `utils/jitter.js`

Provides Gaussian-jitter delay functionality.

---

## `utils/theme.js`

Provides Skeleton Key Vault's custom 24-bit ANSI TrueColor formatting and UI standardization.

This allows the application's different modules to maintain a consistent visual style.

---

# Persistent Vault Files

Skeleton Key Vault also uses persistent local files associated with the account vault.

```text
skeleton-key-vault/
├── identity_vault.db
└── .vault.lock
```

## `identity_vault.db`

The local SQLite identity vault database.

This stores persistent account information managed by Skeleton Key Vault and allows multiple accounts to be retained locally for later selection and use.

---

## `.vault.lock`

The local vault lock file used as part of the protection mechanism surrounding the persistent identity vault.

---

# Complete Application Structure

The current validated application structure can be represented as:

```text
frlegends-skeleton-key/
└── skeleton-key-vault/
    │
    ├── cli.js
    │
    ├── assets/
    │   └── goodbye.js
    │
    ├── fr_legends_payloads/
    │   ├── cars/
    │   │   └── stock_cars/
    │   │
    │   ├── templates/
    │   │   └── master.json
    │   │
    │   └── init/
    │       └── init_car.json
    │
    ├── menu/
    │   ├── account_cloning.js
    │   ├── account_recovery.js
    │   ├── calculate_ticks.js
    │   ├── error_message.js
    │   ├── faq.js
    │   ├── format_playtime.js
    │   ├── get_creds.js
    │   └── validate_system.js
    │
    ├── sandbox/
    │   ├── add_money.js
    │   ├── change_name.js
    │   ├── delete_car.js
    │   ├── exotic_importer.js
    │   ├── garage_manager.js
    │   ├── index.js
    │   ├── live_editor.js
    │   ├── livery_pass.js
    │   ├── modify_slots.js
    │   ├── playtime_editor.js
    │   ├── save_snapshot.js
    │   ├── unlock_menu.js
    │   ├── user_data_manager.js
    │   ├── view_json.js
    │   │
    │   ├── assets/
    │   │   ├── actions.js
    │   │   ├── assetInstaller.js
    │   │   ├── browser.js
    │   │   ├── categories.js
    │   │   ├── details.js
    │   │   ├── downloads.js
    │   │   ├── filter.js
    │   │   ├── filter_menu.js
    │   │   ├── index.js
    │   │   ├── installed.js
    │   │   ├── menu.js
    │   │   ├── new.js
    │   │   ├── open.js
    │   │   ├── packs.js
    │   │   ├── registry.js
    │   │   ├── router.js
    │   │   ├── search.js
    │   │   ├── status.js
    │   │   └── types.js
    │   │
    │   ├── cars/
    │   │   ├── cars.js
    │   │   └── injector.js
    │   │
    │   └── livery/
    │       ├── codec.js
    │       ├── downloader.js
    │       ├── index.js
    │       ├── injector.js
    │       └── database/
    │           ├── api.js
    │           ├── index.js
    │           └── inspector.js
    │
    ├── src/
    │   ├── auth.js
    │   ├── client.js
    │   ├── pd.js
    │   ├── security.js
    │   ├── splash.js
    │   ├── state.js
    │   ├── telemetry.js
    │   └── update.js
    │
    └── utils/
        ├── box.js
        ├── frame.js
        ├── jitter.js
        └── theme.js
```

---

# Structure Validation

Skeleton Key Vault includes an internal structure-validation system in:

```text
menu/validate_system.js
```

This validator checks that required files and directories exist at their expected locations.

The paths are resolved relative to the `skeleton-key-vault/` application directory.

If a required component is missing, the application reports:

```text
FILE STRUCTURE ERROR
```

along with the missing component and its expected path.

The validator also provides guidance for restoring an incorrect installation, including keeping `cli.js` and `fr_legends_payloads/` together and preserving the internal structure of the payload directory.

---

# Maintaining the Structure

The directory structure is part of the application's expected runtime environment.

When manually modifying the project:

- Do not move `cli.js` away from the application root.
- Do not move `fr_legends_payloads/` away from the application root.
- Do not arbitrarily rename internal payload directories or required files.
- Keep modules inside their intended subsystem directories.
- Preserve the expected relationship between `menu/`, `sandbox/`, `src/`, and `utils/`.
- Keep persistent vault files protected and backed up when necessary.
- When distributing or updating the project, ensure the complete `skeleton-key-vault/` application directory is preserved.

The structure may evolve as Skeleton Key Vault develops, but the validated layout documented here represents the current organization of the application.
