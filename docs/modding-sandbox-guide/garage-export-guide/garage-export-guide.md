# Garage Export Guide

The **Garage Exporter** lets you turn cars from the active garage into reusable JSON car payloads.

Open it from:

**Modding Sandbox → Option 08 — Check Garage - Export Car Payloads**

---

## Preview

![](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/modding-sandbox-guide/garage-export-guide/garage-export-guide.png)

---

## Garage Exporter

The menu displays the current garage count and up to the first 9 cars for quick access.

```text
[1-9] Quick-Access
[A]   Export ALL Cars
[X]   View Garage
[Enter] Back
```

---

## Quick-Access

Select a numbered car to immediately export its payload.

The exported JSON is saved under:

```text
fr_legends_payloads/cars/
```

Each file receives the car name and a timestamp to prevent filename collisions.

---

## Export ALL Cars

Press **A** to export every car currently in the garage.

Skeleton Key asks for confirmation before exporting the full garage.

```text
Are you sure you want to export X cars? (y/n):
```

---

## View Garage

Press **X** to open the **Garage Database**.

Cars can be filtered alphabetically by the first character of their name.

```text
[A]  Cars beginning with A
[B]  Cars beginning with B
...
[$]  View ALL
[Enter] Return
```

Select a car from the filtered list to export its payload.

---

## Car Payloads

Exported cars can be reused with the **Exotic Importer** to inject a car payload into another account.

The original garage remains unchanged when exporting.

---

## Continue

**[← Modding Sandbox Main Guide](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/modding-sandbox-guide/modding-sandbox-guide.md)**

**[Next: Exotic Importer Guide →]()**
