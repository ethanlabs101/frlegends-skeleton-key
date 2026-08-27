# Remote Factory Guide

The **Remote Factory** is the FR Legends Skeleton Key account provisioning system.

It allows you to create one or more new FR Legends accounts remotely and initialize them with a predefined starting configuration.

The Remote Factory is intended for creating fresh accounts through the Skeleton Key environment.

After an account is successfully provisioned, it can be added to your local Vault and managed through the **Authentication** and **Account Recovery** systems.

---

# Before You Begin

The Remote Factory is a powerful feature.

Before creating accounts, understand that accounts are created externally and may be associated with information such as your device and network environment.

The provisioning menu displays the following warning:

```text
WARNING: Creating accounts in rapid succession can flag
your device ID or IP. For optimal security, limit
provisioning to 5 accounts per 24hrs. Exceeding 5-10+
may result in automated bans.
```

For normal use, it is recommended that you create only the number of accounts you actually need.

A batch size of **one to five accounts** is available.

Do not repeatedly provision large numbers of accounts simply because the option is available.

---

# Entering the Remote Factory

From the Main Navigation menu, select:

```text
2
```

The Remote Factory menu will appear:

![](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/remote-factory-guide/remote-factory.png)

---

# Choosing a Batch Size

The Remote Factory allows you to choose how many accounts you want to provision during the current operation.

Enter one of the following:

```text
1
```

to create one account.

```text
2
```

to create two accounts.

```text
3
```

to create three accounts.

```text
4
```

to create four accounts.

```text
5
```

to create five accounts.

Each selected batch begins its own provisioning workflow.

For example, selecting:

```text
3
```

tells Skeleton Key that you want to complete the provisioning flow for three accounts.

---

# What Each Provisioned Account Includes

The Remote Factory initializes accounts with the standard Skeleton Key provisioning configuration.

The menu displays:

```text
INFO: All accounts come with 500k money and coins,
livery pass unlocked, and a modded
Kirby Silvia S15 with 999999% tire health.
```

Each successfully provisioned account therefore includes:

- 500,000 money
- 500,000 coins
- Livery Pass unlocked
- A configured Kirby Silvia S15
- 999999% tire health

These values are part of the Remote Factory's current provisioning configuration.

If the project changes these values in a future release, the provisioning behavior may also change.

---

# Provisioning Warnings and Help

The Remote Factory includes an information screen.

From the provisioning menu, select:

```text
X
```

The following warning and information screen will appear:

![](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/remote-factory-guide/help-screen.png)

Press:

```text
Enter
```

to return to the Remote Factory.

---

# Choosing Account Credentials

During the provisioning process, Skeleton Key allows you to choose how account credentials are created.

You can choose between:

- Manual account information
- Automatically generated credentials

This allows you to either completely control the account identity yourself or automate the process.

---

# Manual Credentials

Manual entry allows you to provide the credentials for the account yourself.

This may include:

- Email address
- Username
- Password

Manual credentials are useful when you want complete control over the account identity.

For example, you may want an account with a specific username or an email address you personally control.

When provisioning multiple accounts manually, you may need to provide unique account information for each account in the batch.

---

# Automatic Credential Generation

The Remote Factory can also generate or randomize account credentials automatically.

This is useful when you are provisioning multiple accounts and do not want to manually create every username and credential yourself.

Automatic generation can create unique account information for the current provisioning operation.

When using automatic generation, make sure the generated credentials are stored safely.

A generated account is still an account that may require future access, recovery, or maintenance.

The easiest way to manage provisioned accounts is to ensure that each account is properly added to your Vault.

---

# Email Address Security

The email address used during provisioning is important.

The safest option is to use an unused email address that you personally control.

This gives you the strongest recovery position if the account ever requires:

- Password recovery
- Ownership verification
- Future account maintenance
- Recovery notifications
- Long-term account access

Avoid using:

- Another person's email address
- An email address belonging to someone else
- An email address you cannot access
- An email address that could later be controlled by another person

---

# Account Takeover Risk

Using an email address that you do not control can create an account security problem.

If another person controls the email address associated with an account, they may potentially be able to use legitimate account recovery processes available to that email owner.

This can result in loss of access to the account.

For that reason, even if a provisioning workflow accepts an email address you do not actively use, it is strongly recommended that you use an email address you personally control.

The best long-term account setup is one where the associated email address remains under your control.

Treat account credentials as important information.

The fact that an account was created automatically does not make it disposable from a security perspective.

---

# Provisioning One Account

To provision one account, enter:

```text
1
```

The Remote Factory will begin the account creation workflow.

You will be guided through the available credential options.

Depending on the current provisioning workflow, you may be able to:

- Enter credentials manually
- Provide your own email address
- Provide your own username
- Provide your own password
- Generate or randomize account information automatically

Once the account is created, the configured provisioning package is applied.

The account can then be used through the supported Skeleton Key authentication workflow.

---

# Provisioning Multiple Accounts

You can also select a batch size of two through five.

For example:

```text
5
```

starts a five-account provisioning batch.

Each account is provisioned through the configured Remote Factory workflow.

If you choose manual credentials, make sure you understand whether you are entering credentials for each account individually.

If you choose automatic credential generation, ensure that the generated credentials are recorded securely and that the accounts are added to your Vault where applicable.

Remember the Remote Factory warning:

```text
For optimal security, limit provisioning to 5 accounts per 24hrs.
```

The batch limit is intended to encourage controlled account creation.

Avoid repeatedly creating additional batches immediately after finishing a previous batch.

---

# How Provisioned Accounts Are Stored

After a successful provisioning process, account information is incorporated into the Skeleton Key Vault.

The Vault provides persistent local account management.

Once an account is available in the Vault, the account can be managed through the appropriate Skeleton Key tools.

This can include:

- Authentication
- Credential storage
- Account maintenance
- Backups
- Recovery

For information about logging into and managing stored accounts, see:

[Authentication Guide →](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/authentication-guide/authentication-guide.md)

---

# First Login After Provisioning

After an account has been successfully created, you can authenticate using the account credentials.

Return to the Main Navigation menu and select:

```text
1
```

for:

```text
Authenticate
```

From there, you can use the appropriate authentication option.

After a successful login, the account can be stored and managed by the local Vault.

For a complete explanation of Quick Entry, manual login, account storage, and credential maintenance, see:

[Authentication Guide →](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/authentication-guide/authentication-guide.md)

---

# Creating an Account Remotely

The Remote Factory is different from the Authentication menu.

The **Authentication** menu is primarily used to access an existing account.

The **Remote Factory** is used to provision a new account through the Skeleton Key workflow.

The basic process is:

```text
Remote Factory
        ↓
Choose Batch Size
        ↓
Choose Manual or Automatic Credentials
        ↓
Create Account
        ↓
Provision Starting Configuration
        ↓
Add / Store Account in Vault
        ↓
Authenticate and Use Account
```

This allows a new account to move from initial provisioning into normal Vault management.

---

# Tampered Data Warnings

The Remote Factory information screen explains that FR Legends may check account data.

The current information screen states:

```text
FR Legends checks cheating based on money/coin values.

This causes a 'tampered data' window pop-up to appear
occasionally which can be bypassed
by closing and re-opening game.
```

Account values are initialized according to the current Remote Factory configuration.

However, modifying account values outside the supported configuration can increase the risk of data problems.

If you encounter unexpected warnings:

1. Stop making additional changes.
2. Preserve your current account information.
3. Create a backup if possible.
4. Close and reopen the game.
5. Review the warning or error.
6. Use the appropriate recovery tools if necessary.

Do not continue repeatedly modifying account data when a warning appears.

---

# The 500,000 Value

The current Remote Factory information screen states:

```text
This tool generates account safetly by keeping amounts at
500k which is near the MAX 'safe' amount.
```

The current provisioning configuration uses:

```text
500,000 money
500,000 coins
```

These values are part of the current provisioning design.

This does not mean that every possible account modification is safe or supported.

If you manually modify account values after provisioning, make backups first.

---

# Back Up Your Account

The Remote Factory information screen recommends making backups often.

This is especially important before:

- Modifying account data
- Changing account values
- Importing custom data
- Performing experimental changes
- Replacing save information
- Performing destructive maintenance

A backup gives you a known recovery point.

If something goes wrong after modifying an account, a valid backup can help restore your previous state.

See the relevant Vault and recovery documentation for more information.

[Account Recovery Guide →](account-recovery-guide.md)

---

# Account Recovery

Skeleton Key includes an Account Recovery feature for supported recovery operations.

The Remote Factory information screen notes:

```text
Worse-case scenario you can recover your account
using the Account Recovery tool.
```

The Account Recovery system should not replace good backup practices.

Recovery should be treated as a recovery mechanism, not a reason to skip backups.

The safest workflow is:

```text
Create Account
        ↓
Store Credentials Securely
        ↓
Add Account to Vault
        ↓
Create Backup
        ↓
Modify Carefully
        ↓
Create Additional Backups
        ↓
Use Recovery Only When Needed
```

For a complete explanation of the recovery system, see:

[Account Recovery Guide →](account-recovery-guide.md)

---

# Recommended Provisioning Workflow

For most users, the recommended Remote Factory workflow is:

```text
1. Open Remote Factory
        ↓
2. Review the Provisioning Warning
        ↓
3. Choose a Batch Size
        ↓
4. Choose Manual or Automatic Credentials
        ↓
5. Use an Email Address You Control
        ↓
6. Complete Provisioning
        ↓
7. Store the Account in the Vault
        ↓
8. Authenticate to the Account
        ↓
9. Create a Backup
        ↓
10. Begin Using Skeleton Key
```

This keeps account creation, account ownership, authentication, and recovery organized.

---

# Returning to the Main Menu

To leave the Remote Factory without provisioning an account, press:

```text
Enter
```

when the menu displays:

```text
[Enter] Back
```

You will return to the Main Navigation menu.

You can return to the Remote Factory later.

---

# Troubleshooting

## Account Provisioning Failed

If provisioning fails:

1. Do not immediately retry multiple times.
2. Read the complete error message.
3. Check your internet connection.
4. Verify whether the account may have already been partially created.
5. Avoid using the same credentials repeatedly without checking their status.
6. If the error identifies a specific issue, resolve that issue before retrying.

Repeated provisioning attempts may create additional account or rate-limit problems.

---

## Credentials Already Exist

If a selected username or email address is already in use, choose a different credential.

When using manual entry, ensure that the account information is unique where uniqueness is required.

When using automatic generation, allow the Remote Factory to generate a new identity if the workflow supports it.

---

## I Used an Email I Do Not Control

If you have provisioned an account using an email address you do not control, consider updating the account information through supported account maintenance options as soon as possible.

Do not wait until the account requires recovery.

The safest long-term account setup is one where the associated email address is controlled by you.

---

## I Forgot the Credentials

If the account was added to your Vault, check the stored account information through the Authentication system.

Depending on the configured Vault workflow, stored credentials may be available through the account maintenance functions.

For more information, see:

[Authentication Guide →](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/authentication-guide/authentication-guide.md)

---

# Next Steps

Continue with the feature you need:

[Cloning Matrix Guide →](./cloning-matrix.md)

[Modding Sandbox Guide →](./modding-sandbox.md)

[Account Recovery Guide →](./account-recovery.md)

[← Authentication Guide](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/authentication-guide/authentication-guide.md)

[← Main Navigation Guide](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/main-navigation/main-navigation.md)

[← First Launch Guide](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/first-launch/first-launch.md)
