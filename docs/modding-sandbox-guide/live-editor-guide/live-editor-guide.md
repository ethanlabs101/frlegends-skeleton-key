# Live Car Editor Guide

The **Live Car Editor** creates a modified clone of an existing garage car without directly changing the original.

Open it from:

**Modding Sandbox → Option 11 — Live Car Editor - Modify Cars In Garage**

---

## Selecting a Car

The editor displays every car currently in the garage.

```text
[1] Car Name (ID: ...)
[2] Car Name (ID: ...)
...
[Enter] Back
```

Select the car you want to use as the modification source.

Before editing begins, Skeleton Key automatically creates a **full account pre-edit backup**.

---

## Modification Menu

```text
[1] Modify Wheel Offset (ET) [All 4 rims]
[2] Modify Front Wheel Offset (ET) [FL + FR]
[3] Modify Rear Wheel Offset (ET) [RL + RR]
[4] Rename Car
[5] Modify Tire Health
[6] Remove Body Livery
[7] Remove Window Livery
[8] Remove All Livery

[0] FINISH AND SAVE
```

Changes are made to a temporary draft of the selected car.

---

## Wheel Offset (ET)

Options 1–3 modify wheel offset values.

```text
[1] All 4 rims
[2] Front rims
[3] Rear rims
```

Recommended ET range:

```text
-30 to +30
```

Supported input range:

```text
-1,000,000 to +1,000,000
```

---

## Rename Car

Option **4** allows the cloned car to receive a new name.

The name cannot be empty.

---

## Tire Health

Option **5** sets tire health using a whole number from:

```text
0 - 9,999,999
```

---

## Livery Removal

Options **6–8** remove livery data from the draft:

```text
[6] Body Livery
[7] Window Livery
[8] All Livery
```

Removing all livery clears both body and window livery data.

---

## Finishing the Edit

Press **0 — FINISH AND SAVE** when the draft is ready.

Skeleton Key displays a verification screen showing:

```text
Draft Ready: Modified Car
Original: Original Car
```

You must confirm before the modified car is injected.

---

## Injection

After confirmation:

1. The modified draft is added as a new garage car.
2. The carport is increased by 1.
3. The updated garage is uploaded.
4. Telemetry is synchronized.

The original source car remains in the garage unchanged.

If injection is declined, the draft is discarded and the original car remains untouched.

---

## Automatic Backup

A full account backup is created **before editing begins**.

Backups are stored under:

```text
fr_legends_payloads/backups/<account>/
```

The backup filename begins with:

```text
PRE_EDIT_<CarID>_<timestamp>.json
```

---

## Continue

**[← Modding Sandbox Main Guide](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/modding-sandbox-guide/modding-sandbox-guide.md)**

**[Next: Online Asset Manager Guide →]()**

