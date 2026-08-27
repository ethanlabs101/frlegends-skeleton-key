# First Launch

This guide walks you through your first time launching FR Legends Skeleton Key after installation.

It covers:

- Vault initialization
- The first-launch splash screen
- Creating or loading your local Vault
- Adding your first FR Legends account
- Authenticating an existing account
- Creating an account remotely when supported
- Understanding the Main Navigation screen
- Where to go next to learn each feature
- Updating Skeleton Key

If you have not installed Skeleton Key yet, start with the installation guide first.

---

## Before You Begin

You should already have:

- Skeleton Key installed
- Node.js and npm working
- A working internet connection
- The Skeleton Key repository downloaded
- The installation completed for your platform

If you skipped the installer documentation, please read:

Linux:

[← Linux Installation](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/linux-installation/linux-installation.md)

Termux:

[← Termux Installation](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/termux-installation/termux-installation.md)

---

# 1. Launch Skeleton Key

Open a terminal and navigate to the Skeleton Key Vault.

For example:

```bash
cd ~/frlegends-skeleton-key/skeleton-key-vault
```

Then launch Skeleton Key:

```bash
node cli.js
```

The exact location of your Vault may be different depending on how Skeleton Key was installed.

---

# 2. First-Launch Splash Screen

When Skeleton Key starts, you may first see the Skeleton Key splash screen.

Heres what it looks like:

![](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/first-launch/first-launch.png)

The splash screen is the initial startup interface.

It gives Skeleton Key an opportunity to:

- Prepare the local environment
- Check the Vault state
- Load persistent Vault information
- Initialize required local data
- Prepare the application for navigation
- Display startup information

Allow the startup process to finish before attempting to use the Main Navigation menu.

If Skeleton Key reports that Vault initialization is required, follow the initialization prompts.

---

# 3. Vault Initialization

## 3.1 What Is the Vault?

The Skeleton Key Vault is the local data environment used by Skeleton Key.

It is responsible for maintaining persistent information between sessions.

Depending on the version of Skeleton Key you are running, this can include information such as:

```text
.vault.lock
identity_vault.db
fr_legends_payloads/
```

The Vault allows Skeleton Key to maintain local state instead of treating every launch as a completely new session.

---

## 3.2 First-Time Initialization

On a new installation, Skeleton Key may detect that the Vault has not yet been initialized.

If this happens, follow the initialization prompts displayed by Skeleton Key.

Create a Master Key this will be required in the future to log back into your
Skeleton Key Vault, and other destructive/sensitive actions.

The initialization process prepares the local Vault for use.

Allow the initialization process to complete before closing the application.

Do not manually delete Vault files during initialization.

---

## 3.3 Existing Vault

If Skeleton Key detects an existing Vault, it should use the existing persistent Vault state rather than treating the installation as completely new.

This is especially important when:

- Updating Skeleton Key
- Reinstalling application files
- Moving the application
- Launching Skeleton Key from another session

Your Vault should be treated as persistent user data.

Do not delete:

```text
.vault.lock
identity_vault.db
fr_legends_payloads/
```

unless you intentionally want to reset or remove that data.

---

# 4. Understanding the First Main Screen

After startup and Vault initialization, Skeleton Key will eventually bring you to the Main Navigation interface.

Here's what that looks like:

![](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/first-launch/main-screen.png)

This is the primary navigation interface for Skeleton Key.

The menu is divided into two important areas:

1. The Vault status header
2. The Main Navigation menu

---

# 5. Understanding the Status Header

The top section tells you the current state of your Skeleton Key session.

![](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/first-launch/status-header.png)

Let's break this down.

---

## 5.1 Session

```text
[STATUS] Session: [ OFF ]
```

This indicates whether an authenticated Skeleton Key session is currently active.

When you first launch Skeleton Key without authenticating an account, you may see:

```text
Session: [ OFF ]
```

After successfully authenticating, the session state may change to indicate that an authenticated session is active.

The exact status display may vary between Skeleton Key versions.

---

## 5.2 Identity

```text
[IDENTITY] ID: N/A
```

The Identity field represents the local Skeleton Key identity associated with the current Vault/session.

A brand-new or uninitialized account state may display:

```text
ID: N/A
```

Once the Vault has an identity available, Skeleton Key can display the associated identity information here.

This identity is part of the local Vault environment.

---

## 5.3 Account

```text
[ACCOUNT] User: None (Unauthenticated)
```

This tells you which account is currently associated with the active session.

When no account has been authenticated yet, Skeleton Key displays:

```text
User: None (Unauthenticated)
```

This is normal on a first launch.

It does not necessarily mean that the Vault is broken.

It simply means that there is currently no authenticated account session.

---

# 6. Your First Account

The next step for most users is to add or authenticate their first FR Legends account.

From the Main Navigation menu, select:

```text
1) Authenticate
```

Enter:

```text
1
```

at:

```text
[>] Index:
```

and press Enter.

This opens the authentication workflow.

---

# 7. Authentication

The Authentication system is responsible for establishing an authenticated account session.

Depending on the available Skeleton Key version and account state, the authentication workflow may allow you to:

- Authenticate an existing FR Legends account
- Add an account to the local Vault
- Work with an account already stored in the Vault
- Manage and filter accounts alphabetically
- Sign-in instantly next log in
- Establish the active account session

Follow the prompts shown by Skeleton Key.

Do not close the terminal while an authentication operation is actively running.

---

# 8. Adding an Existing Account to the Vault

If you already have an FR Legends account, the normal first step is to authenticate that account through the Authentication workflow.

Skeleton Key can then associate the account with your local Vault.

The general flow is:

```text
Launch Skeleton Key
        ↓
Vault Initialization
        ↓
Main Navigation
        ↓
Authenticate
        ↓
Existing Account
        ↓
Authentication
        ↓
Account Added / Associated With Vault
        ↓
Authenticated Session
```

Once the process completes successfully, return to the Main Navigation screen.

The status header should now reflect the authenticated state.

For example, instead of:

```text
Session: [ OFF ]
User: None (Unauthenticated)
```

you should see the corresponding authenticated session information provided by your Skeleton Key version.

---

# 9. Remote Account Creation

Depending on the current Skeleton Key release and the services available to it, the Authentication or Remote Factory systems may provide workflows for creating a new account remotely.

If the application presents an account-creation workflow, follow the prompts provided by Skeleton Key.

A typical flow may look like:

```text
Main Navigation
        ↓
Remote Factory / Authentication
        ↓
Create Account
        ↓
Remote Account Creation
        ↓
Account Credentials / Identity
        ↓
Add or Link Account to Vault
        ↓
Authenticate
```

Currently, new accounts provisioned also include coins, gems, livery pass, slots and more!

The exact prompts and available options may change as Skeleton Key develops.

Use the workflow provided by the installed Skeleton Key release.

---

# 10. Vault + Account Relationship

It is important to understand that the Vault and the FR Legends account are not the same thing.

Think of the relationship as:

```text
Skeleton Key
      │
      ▼
Local Vault
      │
      ├── Local Identity
      │
      ├── Vault Database
      │
      ├── Persistent Payload Data
      │
      └── Stored Account Information
                │
                ▼
          FR Legends Account
```

The Vault provides the local environment in which Skeleton Key manages its persistent information.

The FR Legends account is the account being authenticated or managed through Skeleton Key.

Skeleton Key acts as a Third-Party Client allowing it to intercept and upload modified player data.

---

# 11. After Authentication

Once your account is successfully authenticated and associated with the Vault, return to the Main Navigation screen.

You should now be able to see that the status header has changed.

Instead of:

```text
[STATUS]     Session: [ OFF ]
[IDENTITY]   ID: N/A
[ACCOUNT]    User: None (Unauthenticated)
```

you should see the current authenticated session and account information provided by Skeleton Key.

The exact values will depend on your account and the current version of Skeleton Key.

---

# 12. Main Navigation Overview

The Main Navigation menu contains the major Skeleton Key subsystems:

```text
1) Authenticate
2) Remote Factory
3) Cloning Matrix
4) Modding Sandbox
5) Account Recovery
6) Documentation / Help
7) Exit
```

Each option represents a different part of the Skeleton Key ecosystem.

You do not need to understand every option immediately.

The recommended learning path is:

```text
First Launch
     ↓
Vault Initialization
     ↓
Authenticate
     ↓
Main Navigation
     ↓
Main Navigation Features
     ↓
Modding Sandbox
     ↓
Individual Sandbox Tools
```

---

# 13. Main Navigation Feature Guide

The complete explanation of each Main Navigation option is covered in the next guide.

Continue here:

[Main Navigation Guide →](./main-navigation.md)

That guide explains each of the following:

```text
1) Authenticate
2) Remote Factory
3) Cloning Matrix
4) Modding Sandbox
5) Account Recovery
6) Documentation / Help
7) Exit
```

It also explains how the different systems connect together.

---

# 14. Modding Sandbox

The Modding Sandbox is a separate subsystem of Skeleton Key.

It contains tools for working with supported FR Legends data and modding workflows.

The Sandbox is intentionally covered separately from the Main Navigation guide because it contains multiple tools and workflows of its own.

After learning the Main Navigation system, continue to:

[Modding Sandbox Guide →](./modding-sandbox.md)

The Sandbox documentation will eventually be divided into individual feature guides where appropriate.

For example:

```text
Modding Sandbox
      │
      ├── Garage Management
      ├── Player Data
      ├── Playtime
      ├── Money
      ├── Livery Tools
      ├── Asset Tools
      └── Other Sandbox Features
```

The exact features available depend on the current Skeleton Key release.

---

# 15. Documentation / Help

The Main Navigation menu includes:

```text
6) Documentation / Help
```

Use this section when you want to access this Skeleton Key repository documentation directly from the application.

The documentation system may evolve as new features are added.

---

# 16. Updating Skeleton Key

Skeleton Key is an actively developed project.

You should not reinstall the entire application every time an update is released.

Instead, use the update procedure provided for your platform.

For Linux:

[Linux Installation →](./linux-installation.md)

[Linux Update Guide →](./linux-update.md)

For Android/Termux:

[Android Installation →](./android-installation.md)

[Android Update Guide →](./android-update.md)

---

# 17. Important: Updates and Your Vault

Updating the Skeleton Key application is different from deleting and recreating your Vault.

Your persistent Vault data should be preserved during normal updates.

Important Vault data includes:

```text
.vault.lock
identity_vault.db
fr_legends_payloads/
```

Do not manually delete these files before an update.

Do not assume that reinstalling application files requires deleting the Vault.

If an update requires a database migration or other Vault migration, follow the instructions for that specific Skeleton Key release.

---

# 18. Exiting Skeleton Key

When you are finished using Skeleton Key, return to the Main Navigation menu.

Select:

```text
7) Exit
```

or enter:

```text
7
```

at:

```text
[>] Index:
```

Skeleton Key will close the application.

If you are using a terminal, you will return to your normal shell prompt.

For example:

![](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/first-launch/exit-screen.png)

---

# 19. Launching Skeleton Key Again

You do not need to repeat the installation process every time you want to use Skeleton Key.

After installation, simply return to the Vault directory.

For example:

```bash
cd ~/frlegends-skeleton-key/skeleton-key-vault
```

Then launch:

```bash
node cli.js
```

Your persistent Vault data can then be loaded again.

The exact startup behavior depends on the current Vault and authentication state.

---

# 20. Recommended First-Launch Path

If you are completely new to Skeleton Key, follow this order:

```text
1. Install Skeleton Key
        ↓
2. Launch Skeleton Key
        ↓
3. Complete Vault Initialization
        ↓
4. Reach Main Navigation
        ↓
5. Select Authenticate
        ↓
6. Authenticate or add your existing account
        ↓
7. Confirm the account/session state
        ↓
8. Return to Main Navigation
        ↓
9. Read the Main Navigation Guide
        ↓
10. Explore the Modding Sandbox
        ↓
11. Read the individual Sandbox feature guides
```

This gives you the basic structure of Skeleton Key before you start using its more advanced tools.

---

# 21. What You Should See When You're Ready

After completing first-launch setup, the important thing is that Skeleton Key can:

- Start successfully
- Load the Vault
- Display Main Navigation
- Recognize the local Vault identity
- Authenticate an account when requested
- Maintain persistent Vault state
- Allow you to navigate between Skeleton Key systems

You are ready to continue when you can reach the Main Navigation interface without errors.

---

# 22. Troubleshooting First Launch

## Vault Initialization Fails

Do not immediately delete the Vault.

First, read the complete error displayed by Skeleton Key.

Check that:

- The Vault directory exists
- The current user can write to the Vault
- Node.js is working
- npm dependencies were installed
- You are launching the correct `cli.js`

---

## Account Authentication Fails

Check your internet connection and read the complete authentication error.

Do not repeatedly delete or recreate your Vault unless the documentation for your specific error tells you to.

---

## Main Navigation Does Not Appear

Verify that you launched Skeleton Key from the correct directory.

For example:

```bash
cd ~/frlegends-skeleton-key/skeleton-key-vault
node cli.js
```

If the application exits with an error, save the complete error message before making changes.

---

## Session Shows OFF

If you see:

```text
Session: [ OFF ]
```

this usually means that there is currently no active authenticated session.

If you have not authenticated yet, this is expected.

Select:

```text
1) Authenticate
```

and follow the authentication workflow.

---

## Account Shows Unauthenticated

If you see:

```text
[ACCOUNT] User: None (Unauthenticated)
```

the current session does not have an authenticated account.

This is normal for a fresh Vault.

Use:

```text
1) Authenticate
```

to begin the account workflow.

---

# 23. Where to Go Next

You have now learned the basic Skeleton Key startup process.

The recommended next step is the Main Navigation guide:

[Main Navigation Guide →](./main-navigation.md)

After that, continue into the Modding Sandbox:

[Modding Sandbox Guide →](./modding-sandbox.md)

For updates and maintenance:

[Linux Update Guide →](./linux-update.md)

[Android Update Guide →](./android-update.md)

To return to the documentation home:

[← Documentation Home](../README.md)

---

# First Launch Complete

You now understand the basic Skeleton Key startup flow:

```text
Skeleton Key Launch
        ↓
Splash Screen
        ↓
Vault Initialization
        ↓
Main Navigation
        ↓
Authentication
        ↓
Account Linked / Added to Vault
        ↓
Authenticated Session
        ↓
Main Navigation Features
        ↓
Modding Sandbox
```

From here, the next guide explains the Main Navigation system in detail.

[Continue to Main Navigation →](./main-navigation.md)
