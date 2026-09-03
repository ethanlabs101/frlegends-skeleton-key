# Garage Cleanup Guide

The **Garage Cleanup** module lets you remove cars from the active garage and automatically synchronize the reduced garage and carport.

Open it from:

**Modding Sandbox → Option 10 — Garage Cleanup - Delete Cars**

---

## Preview

![](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/modding-sandbox-guide/garage-cleanup-guide/garage-cleanup-guide.png)

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

---

## Continue

**[← Modding Sandbox Main Guide](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/modding-sandbox-guide/modding-sandbox-guide.md)**

**[Next: Live Editor Guide →](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/modding-sandbox-guide/live-editor-guide/live-editor-guide.md)**
