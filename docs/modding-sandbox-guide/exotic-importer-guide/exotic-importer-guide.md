# Exotic Importer Guide

The **Exotic Importer** lets you inject compatible car payloads into the active account's garage.

Open it from:

**Modding Sandbox → Option 09 — Exotic Importer - Inject Car Payloads**

---

## Preview

![](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/modding-sandbox-guide/exotic-importer-guide/exotic-importer-guide.png)

---

## Asset Sources

The importer can discover car assets from:

```text
fr_legends_payloads/cars/
```

It recognizes:

- **[PAYLOAD]** — Cars exported from the Garage Exporter.
- **[DOWNLOADED]** — Cars downloaded through the Online Asset Manager.
- **[INSTALLED]** — Full-car assets installed by the Asset Manager.

---

## Browsing Assets

The importer organizes assets by the first character of their filename.

```text
[A]  Asset group
[B]  Asset group
...
[$]  View All
[?]  Asset Types
[Enter] Exit
```

Select a category to browse the available cars.

---

## Injecting Cars

Select one or more assets using their displayed numbers.

Multiple assets can be injected at once by separating selections with commas:

```text
1,3,5
```

Each selected car is added to the active garage.

If the resulting garage exceeds the current carport size, the importer automatically increases the carport value to match.

Changes are then uploaded and telemetry is synchronized.

---

## Car Name Compatibility

For reliable importing, car payload names should use simple characters.

Recommended:

```text
E36
S15
RX7_FD
BMW_E36
AE86_2026
```

**Avoid spaces and unusual/special characters in car names.**

For example:

```text
My Custom Car
```

may fail to inject correctly.

Letters, numbers, underscores, and other standard filename-safe characters are recommended.

---

## Deleting Payloads

Negative selections can be used to delete locally generated payload files.

Example:

```text
-1
```

Only **[PAYLOAD]** assets can be deleted from the Exotic Importer.

Downloaded and installed assets are managed by the **Online Asset Manager** and must be removed there.

Batch deletion is also supported:

```text
-1,-2,-3
```

---

## Asset Type Info

Press **?** to view the difference between downloaded, installed, and generated payload assets.

Press **Enter** to return.

---

## Continue

**[← Modding Sandbox Main Guide](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/modding-sandbox-guide/modding-sandbox-guide.md)**

**[Next: Exotic Importer Guide →]()**
