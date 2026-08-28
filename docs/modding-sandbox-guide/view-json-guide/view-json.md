# View JSON Guide

The **View JSON** tool is a read-only inspection tool for the current account data.

It does not modify, save, export, or inject anything.

Its purpose is simply to give you a quick look at the JSON payload Skeleton Key currently has loaded.

---

## Opening View JSON

From the Modding Sandbox, select:

```text
[01] [DEV TOOLS] View Raw JSON Snapshot
```

Skeleton Key will generate a formatted JSON representation of the current player data and display it inside a terminal box.

The output will look similar to:

```text
╔════════════════════════════════════════════════════════════╗
║ JSON PAYLOAD DUMP                                          ║
╠════════════════════════════════════════════════════════════╣
║ {                                                          ║
║   "someField": "someValue",                                ║
║   "anotherField": 123,                                     ║
║   "player": {                                              ║
║     ...                                                    ║
║   }                                                        ║
║ }                                                          ║
╚════════════════════════════════════════════════════════════╝

[>] Press [Enter] to continue...
```

The exact contents depend on the currently authenticated account.

---

# What You're Looking At

The displayed information is a formatted representation of the account data Skeleton Key currently has available.

JSON uses a structure of:

```text
{
  "key": "value",
  "anotherKey": 123,
  "object": {
    "nestedKey": true
  }
}
```

You may encounter:

- Strings
- Numbers
- Boolean values
- Objects
- Arrays
- Nested objects
- Other serialized player information

You do not need to understand every field to use the Sandbox.

This tool is primarily useful when you want to **see what data exists before working with another module**.

---

# Display Limit

The View JSON module intentionally limits the displayed output.

Only the first **2,000 characters** of the formatted JSON payload are shown.

This keeps the terminal interface manageable instead of dumping potentially thousands of lines of account data into the console.

Therefore:

```text
Displayed JSON ≠ Entire JSON Payload
```

If the payload is larger than the display limit, the remaining data is simply not shown in this view.

The underlying account data is not being truncated just because the viewer is.

---

# Read-Only

View JSON does not modify the account.

It performs a formatted inspection of the currently loaded data and then waits for you to press Enter.

The basic flow is:

```text
Current Account Data
        ↓
JSON Formatting
        ↓
First 2,000 Characters
        ↓
Terminal Display
        ↓
Press Enter
        ↓
Return to Sandbox
```

---

# When Should I Use It?

A good time to use View JSON is **before making a modification**.

For example:

```text
Authenticate
     ↓
Open Modding Sandbox
     ↓
View JSON
     ↓
Understand Current State
     ↓
Use Desired Module
```

It can also be useful when troubleshooting an unexpected account state or simply learning how Skeleton Key represents player data.

---

# View JSON vs. Save JSON Snapshot

These two developer tools serve different purposes.

### View JSON

```text
[01] View Raw JSON Snapshot
```

Displays a limited portion of the current JSON in the terminal.

### Save Complete Raw JSON Snapshot

```text
[02] Save Complete Raw JSON Snapshot
```

Creates a persistent snapshot for later reference.

In short:

```text
VIEW  = Inspect
SAVE  = Preserve
```

If you want to keep a complete copy of the current state, use the **Save Complete Raw JSON Snapshot** tool instead.

---

# Returning to the Sandbox

After the JSON is displayed, Skeleton Key waits for:

```text
[>] Press [Enter] to continue...
```

Press **Enter** to return to the Modding Sandbox.

That's it.

**View JSON is intentionally simple: it gives you a quick, read-only window into the data Skeleton Key is currently working with.**

---

**[← Modding Sandbox Guide](./modding-sandbox-guide.md)**

**[Next: Raw JSON Snapshot Guide →](./save-json-guide.md)**
