# Livery Pass Guide

The **Livery Pass** module controls the `liveryCreatorPass` state on the currently authenticated FR Legends account.

It can be used to toggle the pass between **ACTIVE** and **INACTIVE**.

---

## Preview

![](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/modding-sandbox-guide/livery-pass-guide/livery-pass-guide.png)

---

## Opening the Livery Pass Menu

From the Modding Sandbox, select:

```text
[04] Unlock/Lock Livery Pass
```

Skeleton Key displays the current state:

```text
Livery Pass Status: ACTIVE
```

or:

```text
Livery Pass Status: INACTIVE
```

The available actions are:

```text
[1] Toggle State
[Enter] Back
```

---

## Toggle State

Select:

```text
1
```

Skeleton Key reverses the current state.

For example:

```text
INACTIVE
   ↓
Toggle
   ↓
ACTIVE
```

Or:

```text
ACTIVE
   ↓
Toggle
   ↓
INACTIVE
```

There is no separate unlock and lock option. **Toggle State** simply switches the pass to the opposite state.

---

## Applying the Change

After selecting `1`, Skeleton Key:

1. Changes the `liveryCreatorPass` value.
2. Rebuilds the profile metadata.
3. Uploads the updated profile data.
4. Finalizes the upload.
5. Synchronizes account telemetry.

A successful operation displays:

```text
[+] Livery Pass state toggled successfully.
```

The menu can then be used again or exited.

---

## Returning to the Sandbox

Press **Enter** at:

```text
[>] Selection:
```

to return to the Modding Sandbox.

After a successful toggle, Skeleton Key also provides:

```text
[>] Press [Enter] to continue...
```

Press **Enter** to continue.

---

## Quick Summary

```text
Authenticated Account
        ↓
Modding Sandbox
        ↓
Unlock/Lock Livery Pass
        ↓
View Current Status
        ↓
[1] Toggle State
        ↓
Profile Rebuilt
        ↓
Uploaded
        ↓
Telemetry Synced
        ↓
New Livery Pass State
```

**Tip:** Check the displayed status before toggling so you know whether the operation will activate or deactivate the pass.

---

### Continue

**[Driver Name Guide →](./modding-sandbox-guide.md)**

**[← Modding Sandbox Main Guide](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/modding-sandbox-guide/modding-sandbox-guide.md)**
