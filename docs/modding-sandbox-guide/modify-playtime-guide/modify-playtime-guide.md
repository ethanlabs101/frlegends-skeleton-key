# Modify Playtime Guide

The **Playtime Editor** lets you change the account's total recorded playtime using presets or custom values.

Open it from:

**Modding Sandbox → Option 06 — Modify Played Time**

---

## Preview

![](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/modding-sandbox-guide/modify-playtime-guide/modify-playtime-guide.png)

---

## Playtime Menu

```text
Select a preset or [C] for custom

[1] 987,654,321h 0m 0s
[2] 123,456,789h 0m 0s
[3] 9,999,999h 0m 0s
[4] 500,000h 0m 0s
[5] 250,000h 0m 0s
[6] 100,000h 0m 0s
[7] 50,000h 0m 0s
[8] 25,000h 0m 0s
[9] 0h 0m 0s
[C] Custom Input
[Enter] Back to menu
```

The current playtime is displayed at the top of the menu.

---

## Presets

Select any numbered preset to immediately set the corresponding playtime.

The available presets range from **0 hours** up to **987,654,321 hours**.

---

## Custom Input

Press **C** to manually enter:

```text
Hours:
Minutes:
Seconds:
```

Each value must be a valid non-negative number.

The editor converts the values into total seconds and updates `totalPlayedTime`.

---

## Applying Changes

After selecting a preset or entering custom values, Skeleton Key:

1. Updates `totalPlayedTime`.
2. Rebuilds and uploads the save data.
3. Syncs telemetry.
4. Displays the updated playtime.

---

## Continue

**[← Modding Sandbox Main Guide](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/modding-sandbox-guide/modding-sandbox-guide.md)**

**[Next: Currency Manager Guide →](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/modding-sandbox-guide/currency-manager-guide/currency-manager-guide.md)**
