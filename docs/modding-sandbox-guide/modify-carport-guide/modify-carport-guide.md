# Modify Carport Slots

The **Modify Carport Slots** module allows you to change the maximum number of vehicle slots available in your FR Legends profile.

Your current slot count is displayed before making any changes.

---

## Slot Options

The module provides several preset values:

```text
[1] Set 1M Carport
[2] Set 100K Carport
[3] Set 10K Carport
[4] Set 5K Carport
[5] Set 2.5K Carport
[6] Set 1K Carport
[7] Set 500 Carport
[8] Set 250 Carport
[9] Set 100 Carport
[C] Set Custom Amount
```

Select the option corresponding to the amount you want.

You can also choose **C** to enter a custom slot amount manually.

Press **Enter** without entering a selection to return to the Modding Sandbox.

---

## Important: Slot Amounts

The new slot value should be **greater than or equal to your current slot amount**.

For example, if your current carport is:

```text
Current Slot Amount: 250
```

you should not reduce it to:

```text
100
```

Instead, choose `250` or a larger value.

Reducing the slot count below the amount currently being used can cause problems with the profile.

---

## Buying New Cars

Modified carport values can cause issues when purchasing new cars through the normal in-game purchasing system.

If you are working with a heavily modified carport, the **Exotic Importer** is the safer method for adding vehicle payloads.

See:

**[Exotic Importer Guide →](exotic-importer-guide.md)**

---

## Applying the Change

After selecting a preset or entering a custom amount, Skeleton Key:

1. Updates the carport value.
2. Rebuilds the profile data.
3. Uploads the modified profile data.
4. Finalizes the upload.
5. Synchronizes the account telemetry.
6. Reports whether the injection succeeded.

A successful operation will display:

```text
[+] Injection successful.
```

The updated slot amount will then be reflected the next time the account telemetry is displayed.

---

## Custom Amount

Selecting:

```text
[C] Set Custom Amount
```

opens a prompt:

```text
[>] Enter custom amount:
```

Enter the desired numeric value and press **Enter**.

The value must be a valid number.

If an invalid value is entered, Skeleton Key will reject it and return you to the slot selection menu.

---

## Returning to the Sandbox

Press **Enter** at the main slot-selection prompt:

```text
[>] Selection:
```

to return to the **Modding Sandbox** menu.

---

### Related Modules

- **[Exotic Importer Guide →](exotic-importer-guide.md)**
- **[Garage Cleanup Guide →](garage-cleanup-guide.md)**
- **[Live Car Editor Guide →](live-car-editor-guide.md)**
- **[Online Asset Manager Guide →](online-asset-manager-guide.md)**
