# Account Cloning Matrix Guide

The **Account Cloning Matrix** allows you to copy the data from one account to one or more other accounts.

The account you copy from is called the **Donor Account**.

The accounts receiving the copied data are called **Receiver Accounts**.

The basic workflow is:

```text
Donor Account
      ↓
Select Receiver Accounts
      ↓
Existing Receiver Data Is Replaced
      ↓
Donor Data Is Applied
```

The Cloning Matrix supports cloning to:

- 1 existing account
- 2 existing accounts
- 3 existing accounts
- 4 existing accounts
- 5 existing accounts

It also includes **Crazy Mode**, which creates five new accounts before applying the donor account data to them.

---

# Before You Begin

The Account Cloning Matrix is a destructive account operation.

This means the existing data on every selected Receiver Account is replaced by the donor data.

The Cloning Matrix displays the following warning:

```text
WARNING: All accounts receiving cloned data are wiped.
Backup important data before proceeding.
```

Before cloning, make sure you understand which account is the:

```text
DONOR
```

and which accounts are the:

```text
RECEIVERS
```

The Donor Account is the account you are copying.

The Receiver Accounts are the accounts that will be overwritten.

---

# Entering the Account Cloning Matrix

From the Main Navigation menu, select:

```text
3
```

This opens:

```text
Cloning Matrix
```

The Account Cloning Matrix will display:

![](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/cloning-matrix-guide/cloning-matrix-guide.png)

---

# Understanding the Status Panel

The status panel at the top displays the current Vault session state.

For example:

```text
[STATUS]     Session: [ OFF ]
[IDENTITY]   ID: N/A
[ACCOUNT]    User: None (Unauthenticated)
```

This indicates that no account is currently authenticated in the active session.

The Cloning Matrix uses the accounts selected during the cloning workflow.

The account shown as the active session is not automatically assumed to be the Donor Account.

You will select the Donor Account as part of the cloning operation.

---

# Understanding Donor and Receiver Accounts

Every standard cloning operation has two roles.

## Donor Account

The Donor Account is the source.

This is the account containing the data you want to copy.

```text
DONOR
  ↓
SOURCE DATA
```

For example:

```text
Account A
```

If Account A is selected as the Donor, its selected account data becomes the source for the cloning operation.

---

## Receiver Accounts

Receiver Accounts are the destination.

These are existing accounts that receive the cloned data.

```text
DONOR
  ↓
RECEIVER
```

The Receiver's previous data is replaced during the cloning operation.

For example:

```text
Account A = DONOR

Account B = RECEIVER
Account C = RECEIVER
Account D = RECEIVER
```

After the operation:

```text
Account B
Account C
Account D
```

receive the donor data according to the cloning workflow.

---

# Important: Receiver Accounts Are Replaced

The most important thing to remember is:

```text
Receiver Account Data Is Overwritten
```

The Receiver Account's previous data should be considered replaced by the cloning operation.

For this reason, do not select an account as a Receiver if it contains data you want to preserve.

Before continuing, make sure you have selected the accounts in the correct direction.

Ask yourself:

```text
Am I copying FROM the correct account?
```

Then ask:

```text
Am I okay with replacing the data on every selected Receiver?
```

If the answer to the second question is no, stop and back up the Receiver Account first.

---

# Recommended Backup Workflow

Before cloning, the recommended workflow is:

```text
Identify Donor
      ↓
Identify Receivers
      ↓
Back Up Important Receiver Data
      ↓
Verify Selections
      ↓
Start Cloning Operation
```

The Cloning Matrix warning exists because the operation can replace data.

The safest approach is simply to create a backup before performing a destructive operation.

This is especially useful when:

- Testing the Cloning Matrix
- Cloning for the first time
- Working with an important account
- Using multiple Receiver Accounts
- Using Crazy Mode

---

# Clone to One Account

To clone a Donor Account to one existing account, enter:

```text
1
```

The general workflow is:

```text
Select Donor Account
        ↓
Select 1 Existing Receiver Account
        ↓
Confirm Receiver Selection
        ↓
Receiver Data Is Replaced
        ↓
Donor Data Is Cloned
```

This creates a one-to-one cloning operation.

Example:

```text
DONOR
Account A

        ↓

RECEIVER
Account B
```

The data from Account A is cloned to Account B.

---

# Clone to Two Accounts

To clone a Donor Account to two existing accounts, enter:

```text
2
```

The workflow is:

```text
Select Donor Account
        ↓
Select 2 Existing Receiver Accounts
        ↓
Confirm Selections
        ↓
Receiver Data Is Replaced
        ↓
Donor Data Is Applied
```

Example:

```text
              Account B
             ↗
Account A
DONOR
             ↘
              Account C
```

Account A is the source.

Account B and Account C receive the cloned data.

---

# Clone to Three Accounts

To clone to three existing accounts, enter:

```text
3
```

The workflow is:

```text
Select Donor Account
        ↓
Select 3 Existing Receiver Accounts
        ↓
Confirm Selections
        ↓
Receiver Data Is Replaced
        ↓
Donor Data Is Applied
```

Example:

```text
                 Account B
               ↗

Account A      → Account C
DONOR
               ↘

                 Account D
```

The three Receiver Accounts receive data from the same Donor Account.

---

# Clone to Four Accounts

To clone to four existing accounts, enter:

```text
4
```

The workflow is:

```text
Select Donor Account
        ↓
Select 4 Existing Receiver Accounts
        ↓
Confirm Selections
        ↓
Receiver Data Is Replaced
        ↓
Donor Data Is Applied
```

The selected Donor Account becomes the source for all four Receiver Accounts.

Before confirming, carefully verify all four Receiver selections.

---

# Clone to Five Accounts

To clone to five existing accounts, enter:

```text
5
```

The workflow is:

```text
Select Donor Account
        ↓
Select 5 Existing Receiver Accounts
        ↓
Confirm Selections
        ↓
Receiver Data Is Replaced
        ↓
Donor Data Is Applied
```

Example:

```text
                   Account B
                  ↗

                   Account C
                  ↗

Account A         → Account D
DONOR
                  ↘

                   Account E
                  ↘

                   Account F
```

Account A is the Donor.

Accounts B through F are Receiver Accounts.

All selected Receivers have their previous data replaced by the donor data.

---

# The Standard Cloning Flow

All normal batch sizes from one through five follow the same general process.

```text
1. Select Batch Size
          ↓
2. Select Donor Account
          ↓
3. Select Existing Receiver Accounts
          ↓
4. Verify Donor and Receiver Roles
          ↓
5. Begin Cloning
          ↓
6. Receiver Data Is Replaced
          ↓
7. Donor Data Is Applied
          ↓
8. Operation Completes
```

The only difference between the options is the number of Receiver Accounts selected.

---

# Example Cloning Operation

Suppose your Vault contains:

```text
Account A
Account B
Account C
Account D
```

You select:

```text
3
```

Then select:

```text
Account A = DONOR
```

You select:

```text
Account B = RECEIVER
Account C = RECEIVER
Account D = RECEIVER
```

The cloning direction is:

```text
Account A
DONOR
   │
   ├────────→ Account B
   │
   ├────────→ Account C
   │
   └────────→ Account D
```

Account A is not the account being overwritten.

Accounts B, C, and D are the accounts receiving the donor data.

---

# Rapid Cloning

The Cloning Matrix displays the following information:

```text
INFO: Rapid cloning can flag device IDs & IPs.
Limit to 5-10 operations per 24hrs.
```

This is not intended to make normal use feel dangerous.

It is simply a reminder that repeatedly performing automated account operations in rapid succession may attract additional automated scrutiny.

For normal use:

- Clone only when you need to
- Avoid repeatedly running the same operation
- Avoid unnecessary back-to-back batches
- Verify results before starting another operation

The recommended limit is:

```text
5-10 operations per 24 hours
```

One operation is different from one account.

For example, cloning to five Receiver Accounts is a larger batch operation than cloning to one Receiver Account.

Give the system time between repeated operations.

---

# Why Operation Limits Matter

The Cloning Matrix is designed for controlled account management.

The goal is not to create an unlimited automated cloning system that is run continuously.

Repeated or abusive account operations may potentially cause:

- Device-based automated scrutiny
- Network-based automated scrutiny
- Rate limiting
- Temporary access issues
- Additional account verification or review

Most users will never need to repeatedly clone accounts all day.

If you are using the Cloning Matrix for normal account management and keeping your operations controlled, simply follow the displayed guidance.

---

# Crazy Mode

Crazy Mode is the fastest and largest cloning operation available in the Cloning Matrix.

Select:

```text
C
```

to enter:

```text
Crazy Mode
```

Crazy Mode combines account provisioning with account cloning.

Instead of requiring you to select five existing Receiver Accounts, Crazy Mode creates five new accounts first.

The general workflow is:

```text
Select Donor Account
        ↓
Create 5 Fresh Accounts
        ↓
Generate Randomized Credentials
        ↓
Provision New Accounts
        ↓
Replace Provisioned Data
        ↓
Apply Donor Account Data
        ↓
Complete Cloning
```

---

# How Crazy Mode Works

Crazy Mode begins with one Donor Account.

You select the account containing the data you want to clone.

Then the Cloning Matrix creates:

```text
5 Fresh Accounts
```

These accounts are provisioned with randomized credentials.

Each newly created account initially receives the standard provisioning data.

After the provisioning step, the Donor Account data is applied to the new accounts.

The flow looks like this:

```text
                                  DONOR
                                Account A
                                    │
                                    ▼
        ┌───────────────────────────┼──────────────────────────┐
        │             │             │             │            │
        ▼             ▼             ▼             ▼            ▼

     Create 1      Create 2      Create 3      Create 4     Create 5
     New Account   New Account   New Account   New Account  New Account

        │             │             │             │            │
        ▼             ▼             ▼             ▼            ▼

     Apply Donor    Apply Donor   Apply Donor   Apply Donor  Apply Donor
        Data           Data          Data          Data         Data
```

At the end of the operation:

```text
1 Donor Account
```

has been used as the source for:

```text
5 Freshly Created Receiver Accounts
```

---

# Crazy Mode Is Different

The standard cloning modes require you to select existing accounts as Receivers.

For example:

```text
[5]
```

means:

```text
Select 1 Donor
        +
Select 5 Existing Receivers
```

Crazy Mode means:

```text
Select 1 Donor
        +
Create 5 New Receivers
```

The five Receiver Accounts do not need to already exist before Crazy Mode begins.

Crazy Mode handles the account creation step as part of the workflow.

---

# Crazy Mode Credentials

The accounts created by Crazy Mode are provisioned with randomized account credentials.

These credentials are generated for the newly created accounts.

Because these are real accounts, you should make sure that the generated account information is preserved.

After the operation, the newly created accounts should be handled like any other account in your Skeleton Key environment.

The recommended workflow is:

```text
Complete Crazy Mode
        ↓
Verify Account Creation
        ↓
Store Account Information
        ↓
Add Accounts to Vault
        ↓
Create Backups
```

Do not create accounts and then immediately forget which credentials belong to which account.

***Freshly provisioned accounts automatically get stored in the account vault. Always double check the vault
for account entries there you can derive the password via the maintenance menu.***

---

# What Happens to Provisioned Data in Crazy Mode?

Crazy Mode creates fresh accounts first.

Those accounts receive the normal initial provisioning data.

The Cloning Matrix then uses the selected Donor Account as the source.

The provisioned data on each newly created Receiver Account is replaced by the cloned Donor Account data.

The flow is:

```text
Create Fresh Account
        ↓
Apply Initial Provisioning
        ↓
Replace Provisioned Data
        ↓
Apply Donor Data
```

The newly created account is therefore used as the destination for the Donor Account's cloned data.

---

# Recommended Crazy Mode Workflow

Before starting Crazy Mode:

```text
1. Select a Verified Donor Account
        ↓
2. Back Up Important Data
        ↓
3. Confirm the Donor Is Correct
        ↓
4. Start Crazy Mode
        ↓
5. Allow 5 New Accounts to Be Created
        ↓
6. Allow Donor Data to Be Applied
        ↓
7. Verify the Result
        ↓
8. Store Account Credentials
        ↓
9. Add Accounts to Your Vault
        ↓
10. Avoid Immediately Repeating the Operation
```

Crazy Mode is useful when you need multiple fresh Receiver Accounts and want to apply the same donor data to all of them.

It should be used intentionally rather than repeatedly.

---

# Before You Clone

Use this checklist:

```text
[ ] I know which account is the Donor.
[ ] I know which accounts are the Receivers.
[ ] I understand Receiver data will be replaced.
[ ] I backed up important Receiver data.
[ ] I selected the correct batch size.
[ ] I am not repeatedly performing unnecessary operations.
```

If all of these are true, you are ready to continue.

---

# After Cloning

After a cloning operation completes:

1. Verify the affected accounts.
2. Confirm that the expected data was applied.
3. Make sure the account information is available in your Vault.
4. Create backups of important results.
5. Avoid immediately repeating the same operation unless necessary.

Verification is especially important when working with multiple Receiver Accounts.

---

# If Something Goes Wrong

Do not panic.

The first step is to stop performing additional operations.

If you have a backup, preserve it.

The recommended response is:

```text
Stop
  ↓
Do Not Repeat the Operation
  ↓
Review the Result
  ↓
Check Account Status
  ↓
Locate Your Backup
  ↓
Use Recovery Tools If Needed
```

Do not repeatedly retry a failed operation without understanding what happened.

Repeated operations may make troubleshooting more difficult.

---

# Account Recovery

If an account experiences a problem after a cloning operation, Skeleton Key's recovery capabilities may be able to assist with supported recovery operations.

Recovery should not replace backups.

The safest workflow remains:

```text
Backup
   ↓
Clone
   ↓
Verify
   ↓
Back Up Again
```

For more information, see:

[Account Recovery Guide →](account-recovery-guide.md)

---

# Returning to the Main Menu

To leave the Cloning Matrix without starting an operation, press:

```text
Enter
```

when the menu displays:

```text
[Enter] Back
```

You will return to the Main Navigation menu.

---

# Recommended Use

The Account Cloning Matrix is best used for controlled account operations.

For example:

```text
One Verified Donor
        ↓
One Small Batch
        ↓
Verify Results
        ↓
Create Backup
        ↓
Stop Until Needed Again
```

There is usually no reason to continuously repeat cloning operations.

The batch system exists to allow you to choose the number of Receiver Accounts needed for the current task.

Choose the smallest batch that accomplishes what you need.

---

# Next Steps

After learning the Cloning Matrix, you can continue to the **Modding Sandbox**.

The Modding Sandbox provides a separate environment for supported account and save-data modification features.

[Modding Sandbox Guide →](modding-sandbox-guide.md)

[Account Recovery Guide →](account-recovery-guide.md)
