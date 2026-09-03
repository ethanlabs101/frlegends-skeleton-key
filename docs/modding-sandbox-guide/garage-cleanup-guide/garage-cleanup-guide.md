# Garage Cleanup Guide

The **Garage Cleanup** module lets you remove cars from the active garage and automatically synchronize the reduced garage and carport.

Open it from:

**Modding Sandbox → Option 10 — Garage Cleanup - Delete Cars**

---

## Filtering

Cars are grouped by the first character of their name.

```text
[A]  Cars beginning with A
[B]  Cars beginning with B
...
[$]  View All
[Enter] Exit
```

Select a category to browse the cars available for deletion.

---

## Deleting Cars

Select one or more cars using their displayed numbers.

Multiple cars can be selected with commas:

```text
1, 2, 5
```

Before deletion, Skeleton Key displays the selected cars and asks for confirmation:

```text
Proceed with deletion? (y/n):
```

Only confirmed deletions are applied.

---

## Important Limitation

The garage must contain **at least one car**.

You cannot delete the final remaining car.

If a deletion would leave the garage empty, the operation is rejected.

---

## Carport Synchronization

After successful deletion:

```text
carport = remaining garage size
```

Skeleton Key then uploads the updated garage and synchronizes telemetry.

---

## Returning

Press **Enter** from the filtering menu to return to the Modding Sandbox.

## Quick Summary

**Option 10 → Garage Cleanup**

- Filter cars alphabetically
- View all cars
- Delete one or multiple cars
- Confirm deletions before applying
- Automatically reduce carport to match
- Garage must always retain at least one car
- Upload and sync changes
