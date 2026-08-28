# Main Navigation

The Main Navigation screen is the central hub of FR Legends Skeleton Key.

After launching Skeleton Key and completing Vault initialization, this is where you choose what you want to do next.

You do not need to learn every feature before using Skeleton Key.

Each menu option leads into a separate system with its own documentation. This guide gives you a quick overview of the available systems so you can choose where to go without being overwhelmed by features you are not currently using.

A fresh or unauthenticated session may look like this:

![](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/main-navigation/main-navigation.png)

The exact information displayed at the top of the screen changes depending on the current Vault, identity, and account session.

---

# Understanding the Main Navigation Screen

The Main Navigation interface has two main sections:

```text
Vault Status
     ↓
Navigation Menu
```

The Vault Status section tells you what Skeleton Key currently has loaded.

The Navigation Menu lets you select the system you want to enter.

Enter the number beside a menu option at:

```text
[>] Index:
```

Then press Enter.

For example, to enter Authentication:

```text
[>] Index: 1
```

---

# Vault Status

The top section displays the current state of your Skeleton Key session:

```text
[STATUS]     Session: [ OFF ]
[IDENTITY]   ID: N/A
[ACCOUNT]    User: None (Unauthenticated)
```

These values are not permanent.

A new Vault or unauthenticated session may show:

```text
Session: [ OFF ]
ID: N/A
User: None (Unauthenticated)
```

After initialization and authentication, the status information can change to reflect the current Vault identity and account session.

The three main fields are:

### Session

Shows whether an authenticated session is currently active.

### Identity

Shows the current local Vault identity information when available.

### Account

Shows the currently active account and its authentication state.

If you have not added or authenticated an account yet, the unauthenticated state is normal.

---

# 1. Authenticate

```text
1) Authenticate
```

The Authentication system is where you work with account authentication.

This is usually the first system you will use after completing your initial Vault setup.

Authentication allows you to work with supported account login and session workflows and establish the active account session used by Skeleton Key.

If you are launching Skeleton Key for the first time and want to begin using an existing account, start here.

[Authentication Guide →](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/authentication-guide/authentication-guide.md)

---

# 2. Remote Factory

```text
2) Remote Factory
```

Remote Factory contains Skeleton Key workflows for supported remote account and online operations.

Depending on the current version of Skeleton Key, this system may include workflows for remotely creating or working with supported accounts and other remote services.

Remote Factory is separate from the basic authentication flow so that users who do not need remote functionality are not forced through those workflows.

[Remote Factory Guide →](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/remote-factory-guide/remote-factory-guide.md)

---

# 3. Cloning Matrix

```text
3) Cloning Matrix
```

Cloning Matrix contains Skeleton Key workflows for supported account cloning and related Vault operations.

This system is intended for users working with the cloning functionality provided by their current Skeleton Key version.

Because cloning workflows can involve multiple account and Vault operations, the full process is documented separately from the Main Navigation guide.

[Cloning Matrix Guide →](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/cloning-matrix-guide/cloning-matrix-guide.md)

---

# 4. Modding Sandbox

```text
4) Modding Sandbox
```

The Modding Sandbox is the primary workspace for Skeleton Key's modding and local data tools.

Depending on the current Skeleton Key version, this can include tools for working with supported player data, garage data, liveries, assets, playtime, money, and other Sandbox functionality.

The Sandbox has its own navigation system and individual feature documentation.

You do not need to learn every Sandbox feature at once.

Enter the Sandbox, choose the feature you need, and follow the documentation for that specific tool.

[Modding Sandbox Guide →](./modding-sandbox.md)

---

# 5. Account Recovery

```text
5) Account Recovery
```

Account Recovery contains workflows for supported account recovery and related Vault operations.

Use this section when you need recovery functionality rather than normal authentication.

The available recovery methods depend on the current Skeleton Key release and the state of the account or Vault involved.

[Account Recovery Guide →](./account-recovery.md)

---

# 6. Documentation / Help

```text
6) Documentation / Help
```

Documentation / Help provides access to Skeleton Key documentation and help resources.

Use this option when you want to learn more about the system you are currently using or need help navigating Skeleton Key.

The online documentation is organized into separate guides so that you can read only the information relevant to your current task.

[Documentation Home →](https://github.com/ethanlabs101/frlegends-skeleton-key/tree/main)

---

# 7. Exit

```text
7) Exit
```

Exit closes the Skeleton Key application.

Select:

```text
7
```

at the Main Navigation prompt:

```text
[>] Index:
```

You will then return to your normal terminal.

For example:

```text
user@computer:~$
```

Your Vault data remains stored locally unless you intentionally remove it.

You do not need to reinstall Skeleton Key every time you close the application.

To launch it again, return to your Vault directory and run:

```bash
node cli.js
```

---

# Where Should I Go First?

If you are new to Skeleton Key, the recommended path is:

```text
First Launch
     ↓
Authenticate
     ↓
Return to Main Navigation
     ↓
Choose the system you need
```

If you want to work with an existing account:

```text
1) Authenticate
```

If you want to use supported remote functionality:

```text
2) Remote Factory
```

If you need supported cloning functionality:

```text
3) Cloning Matrix
```

If you want to use modding tools:

```text
4) Modding Sandbox
```

If you need account recovery:

```text
5) Account Recovery
```

If you need help:

```text
6) Documentation / Help
```

---

# Recommended Learning Path

You do not need to read every guide in order.

Use the feature you need:

```text
Authentication
      ↓
Remote Factory
      ↓
Cloning Matrix
      ↓
Modding Sandbox
      ↓
Account Recovery
```

Each system has its own documentation.

Read the guide for the feature you want to use, then return to Main Navigation when you are finished.

---

# Next Steps

You now understand the purpose of every Main Navigation option.

Continue with the feature you want to use:

[Authenticate →](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/authentication-guide/authentication-guide.md)

[Remote Factory →](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/remote-factory-guide/remote-factory-guide.md)

[Cloning Matrix →](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/cloning-matrix-guide/cloning-matrix-guide.md)

[Modding Sandbox →](./modding-sandbox.md)

[Account Recovery →](./account-recovery.md)

[Documentation Home →](https://github.com/ethanlabs101/frlegends-skeleton-key/tree/main)

If you have not completed the first-launch process:

[← First Launch Guide](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/first-launch/first-launch.md)
