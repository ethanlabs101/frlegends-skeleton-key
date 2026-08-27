# Authentication Guide

The Authentication system is where you connect accounts to FR Legends Skeleton Key.

From the Main Navigation screen, select:

```text
1) Authenticate
```

The Authentication system provides several ways to access and manage supported accounts.

Here is a preview of how a fresh non-populated system looks:

![](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/authentication-guide/main-screen.png)

The exact menu layout may change between Skeleton Key releases.

This guide explains what each system does and how to use it.

---

# Authentication Flow

A typical authentication workflow looks like:

```text
Main Navigation
      ↓
Authenticate
      ↓
Choose an account method
      ↓
Authenticate
      ↓
Account is added to the Vault
      ↓
Session becomes active
      ↓
Return to Main Navigation
```

After an account has been successfully authenticated, Skeleton Key can store local account information inside the Vault.

This means that, after your initial login, you normally do not need to repeatedly enter the same email address and password every time you launch Skeleton Key.

---

# Quick Entry

Quick Entry is designed to make it faster to begin working with an account.

Instead of manually entering the same information through multiple authentication steps, Quick Entry allows you to populate the required account information in one workflow.

Quick Entry is intended for users who want to:

- Quickly authenticate an account
- Begin a new account session
- Use account information without repeatedly navigating through the full authentication workflow

The exact fields required by Quick Entry depend on the current Skeleton Key version and account state.

---

## Using Quick Entry

Enter the Authentication system from Main Navigation:

```text
1) Authenticate
```

Then select a Quick Entry account. Enter 1-9 (Depending on index).

Skeleton Key will request the information required to begin authentication.

Accounts recently created, or authenticated will begin to populate Quick Entry. 

This feature is designed to give quick easy access to recently authenticated accounts.

---

# Returning to a Previously Added Account

One of the benefits of the local Vault is that you normally do not need to repeatedly enter the same credentials.

After an account has been successfully added and stored:

```text
First Login
     ↓
Enter Email
     ↓
Enter Password
     ↓
Authenticate
     ↓
Account Stored in Vault
```

Future access can become:

```text
Launch Skeleton Key
     ↓
Authenticate
     ↓
Select Stored Account
     ↓
Session Restored
```

This means you normally do not need to:

```text
Retype your email
```

or:

```text
Retype your password
```

every time you launch Skeleton Key.

Your Vault stores the information required by the local account management system so supported accounts can be accessed through the Authentication system.

If account credentials change or the account requires new authentication, you may need to update the stored account information.

---

# Manual Login

Manual Login is the standard direct authentication workflow.

Use Manual Login when you want to manually enter the credentials for an account.

This is useful when:

- You are adding an account for the first time
- You want to log into an account that is not already stored
- You need to manually provide updated credentials
- Quick Entry is not the workflow you want to use

Select:

```text
Manual Login
```

Skeleton Key will request the required authentication information.

Enter the requested information exactly as required.

For example:

![](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/authentication-guide/quick-entry.png)

After you submit the credentials, Skeleton Key attempts to authenticate the account.

If authentication succeeds, the account can be added to the local Vault and become available through the Account Database.

---

# Optional Account Backups

During or after authentication, Skeleton Key may offer account backup functionality.

Backups are optional, but they can be useful when you want to preserve a local recovery point for account-related data.

A backup may be useful before:

- Performing major account changes
- Updating account credentials
- Performing supported recovery operations
- Making significant changes through Skeleton Key
- Deleting or replacing local account information

The exact backup contents and behavior depend on the current Skeleton Key version.

A backup should not be treated as a replacement for account security.

Always protect your account credentials and keep important recovery information secure.

---

# Recovery Capabilities

The authentication and backup systems can work alongside Skeleton Key's recovery capabilities.

If a supported recovery workflow is required, preserved local account information and backups may help Skeleton Key identify and work with the relevant Vault data.

The exact recovery capabilities depend on the account state, available Vault information, and current Skeleton Key release.

For dedicated recovery workflows, use:

```text
5) Account Recovery
```

from Main Navigation.

See:

[Account Recovery Guide →](./account-recovery.md)

---

# Account Database

The Account Database is the local system used to organize accounts that have been added to the Vault.

As accounts are successfully authenticated and registered, they can populate the local Account Database.

Conceptually, the process works like:

```text
Account Login
      ↓
Successful Authentication
      ↓
Account Information Registered
      ↓
Stored in Local Vault
      ↓
Available in Account Database
```

The Account Database allows you to view and work with accounts that have already been added to Skeleton Key.

This makes switching between supported accounts easier because previously added accounts do not need to be manually entered from scratch every time.

---

# Using the Account Database

Enter the Authentication system:

```text
1) Authenticate
```

Then select:

```text
Account Database
```

The database displays available accounts stored inside the local Vault.

Select the account you want to work with.

After selecting an account, Skeleton Key can use the locally stored account entry to begin the supported authentication or session workflow.

This reduces the amount of information you need to repeatedly enter.

A typical workflow looks like:

```text
Authentication
      ↓
Account Database
      ↓
Choose Stored Account
      ↓
Authenticate / Restore Session
      ↓
Return to Skeleton Key
```

---

# Alphabetical Account Filtering

The Account Database includes an alphabetical filtering system to help organize large collections of stored accounts.

Instead of manually scrolling through every account, you can filter the database by the first letter of an account entry.

For example:

```text
A
B
C
D
E
```

Selecting a letter filters the account list to entries associated with that alphabetical group.

Conceptually:

```text
Account Database
      ↓
Choose Letter
      ↓
Filter Accounts
      ↓
Select Account
```

For example:

```text
Select Filter: A
```

would display accounts associated with the `A` category.

This is especially useful when the Vault contains multiple stored accounts.

The filtering system keeps the Account Database easier to navigate without forcing you to search through the complete account list manually.

---

# Stored Credentials

After an account has been successfully added to the local Vault, Skeleton Key can use the stored account entry during future authentication workflows.

This means your normal experience can become:

```text
First Time:

Enter Email
Enter Password
Authenticate
Store Account
```

Then later:

```text
Select Stored Account
Authenticate
Continue
```

You normally do not need to manually re-enter the email address and password each time.

However, this does not mean the account will never require new authentication.

You may need to manually authenticate again if:

- The account password changes
- The stored account information is changed
- Authentication expires or becomes invalid
- The local account entry is removed
- The account requires additional authentication

If you need to change stored account information, use Account Maintenance.

---

# Account Maintenance

Account Maintenance is used to manage information associated with accounts stored inside the local Vault.

To enter Account Maintenance:

```text
Main Navigation
      ↓
1) Authenticate
      ↓
Account Maintenance
```

The maintenance menu provides tools for working with stored account credentials.

The available maintenance functions are:

```text
1) Update Password
2) View Password
3) Delete
```

These actions modify or display information associated with the selected local account entry.

Be careful when using destructive maintenance actions.

---

# 1. Update Password

Use Update Password when the password for a stored account has changed.

Select the account you want to maintain.

Then select:

```text
Update Password
```

Skeleton Key will request the new password.

After entering the new password, the local account entry is updated.

A typical workflow is:

```text
Account Maintenance
      ↓
Select Account
      ↓
Update Password
      ↓
Enter New Password
      ↓
Confirm Update
```

This keeps the local account information synchronized with the credentials you currently use.

Updating the password is useful after:

- Changing the account password
- Resetting the account password
- Correcting an incorrect stored password

After updating the stored information, use the account normally through the Authentication system.

---

# 2. View Password

The View Password function displays the password associated with the selected local account entry.

To use it:

```text
Account Maintenance
      ↓
Select Account
      ↓
View Password
```

Because passwords are sensitive information, only use this feature when you are in a private and secure environment.

Do not display stored credentials:

- In public places
- During screen recordings
- During livestreams
- In screenshots
- On a shared computer
- In front of people you do not trust

If you are recording a Skeleton Key demonstration, avoid opening the password display screen.

---

# 3. Delete

The Delete function removes the selected account entry from the local Account Database.

To use it:

```text
Account Maintenance
      ↓
Select Account
      ↓
Delete
      ↓
Confirm
```

Deleting an account entry removes the local Vault entry associated with that account.

This does not automatically mean that the remote account itself is deleted.

Think of the process as:

```text
Remote Account
       ↓
Local Vault Entry
       ↓
Delete Local Entry
```

The remote account remains separate from the local Skeleton Key account entry unless a specific operation explicitly states otherwise.

After deleting a local account entry, you may need to authenticate manually again if you want to add it back to the Vault.

Before deleting important local account information, consider creating an optional backup.

---

# Account Management Safety

Your Account Database may contain sensitive information.

Treat your Vault as private data.

Do not:

- Share your Vault database
- Upload Vault files to public websites
- Send `.vault.lock` files to strangers
- Share account passwords
- Show stored credentials during recordings
- Give other people access to your Linux user account

If you are demonstrating Skeleton Key publicly, use a test account or make sure sensitive account information is hidden.

---

# Recommended Authentication Workflow

For a new account:

```text
Authenticate
     ↓
Manual Login
     ↓
Enter Required Credentials
     ↓
Authenticate
     ↓
Optional Backup
     ↓
Account Added to Vault
     ↓
Session Active
```

For an existing stored account:

```text
Authenticate
     ↓
Account Database
     ↓
Alphabetical Filter
     ↓
Select Account
     ↓
Authenticate
     ↓
Optional Backup
     ↓
Session Active
```

For Quick-Entry:

```text
Select Quick-Entry Index
     ↓
Authenticate
     ↓
Optional Backup
     ↓
Session Active
```

For account maintenance:

```text
Authenticate
     ↓
Account Maintenance
     ↓
Select Account
     ↓
Update Password
View Password
Delete
```

---

# Troubleshooting

## I Have to Enter My Credentials Again

Check whether the account was successfully added to the local Account Database.

If the account is missing, authenticate using Quick Entry or Manual Login.

If the password has changed, use Account Maintenance to update the stored password.

---

## My Account Does Not Appear in the Database

Use the alphabetical filtering system to check the appropriate account category.

If the account still does not appear, authenticate with Quick Entry or Manual Login and verify that the authentication workflow completes successfully.

---

## I Forgot My Account Password

Use:

```text
View Password
```

only if you are working with a locally stored account entry and you are in a private environment.

If the stored password is unavailable or incorrect, use the appropriate account password reset or recovery process.

FR Legends has a password recovery option through email verification. Please utilize that feature in case of
password loss.

---

## I Changed My Password

Open:

```text
Account Maintenance
```

Then:

```text
Update Password
```

Select the appropriate account and enter the new password.

This updates the local stored account information.

---

## I Want to Remove an Account From Skeleton Key

Open:

```text
Account Maintenance
```

Then:

```text
Delete
```

Confirm the deletion carefully.

Deleting the local Vault entry does not automatically delete the remote account itself.

---

# Next Steps

You now understand the Authentication system and how Skeleton Key manages stored accounts.

Continue with the feature you need:

[Remote Factory Guide →](./remote-factory.md)

[Cloning Matrix Guide →](./cloning-matrix.md)

[Modding Sandbox Guide →](./modding-sandbox.md)

[Account Recovery Guide →](./account-recovery.md)

[← Main Navigation Guide](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/main-navigation/main-navigation.md)

[← First Launch Guide](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/first-launch/first-launch.md)
