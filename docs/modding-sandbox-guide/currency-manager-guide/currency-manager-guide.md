# Currency Manager Guide

The **Currency Editor** lets you set the account's Money and Coins values using presets or a custom amount.

Open it from:

**Modding Sandbox → Option 07 — Currency Menu - Add Money / Coins**

---

## Preview

![](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/modding-sandbox-guide/currency-manager-guide/currency-manager-guide.png)

---

## Currency Menu

The current Money and Coins balances are displayed at the top.

```text
[1] 1B
[2] 500M
[3] 50M
[4] 5M
[5] 1M
[6] 500K
[7] 250K
[8] 100K
[9] 50K
[C] Custom Amount
[Enter] Back
```

---

## Presets

Select a numbered preset to set the currency amount.

The selected value is applied to **both Money and Coins**.

---

## Custom Amount

Press **C** and enter the desired amount.

The value must be:

- A valid number
- `0` or greater
- No higher than `2,147,483,647`

---

## Warning

Values above **1,000,000** may flag the account for cheating.

It is recommended to create an account backup before using larger values.

---

## Applying Changes

After selecting an amount, Skeleton Key:

1. Updates the Money and Coins values.
2. Encodes the new currency data.
3. Uploads the changes to the cloud.
4. Syncs telemetry.
5. Displays the updated currency amount.

---

## Continue

**[← Modding Sandbox Main Guide](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/modding-sandbox-guide/modding-sandbox-guide.md)**

**[Next: Garage Export Guide →](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/modding-sandbox-guide/garage-export-guide/garage-export-guide.md)**
