# Barcode Scan

Functions to scan barcodes and QR codes from your website using the device's camera — or a photo
from the gallery. The WebToNative Barcode Scan plugin renders a native scanner UI (with optional
multi-scan sessions, gallery picking, and full styling control) and returns the result to your
website through a JavaScript callback.

> You'll need to import the javascript file in your website before starting from this [link](https://docs.webtonative.com/javascript-apis/getting-started).

> **Platform support:** Android and iOS, kept in close feature parity. A few small differences are
> called out inline below and summarized in [Platform Differences](#platform-differences).

***

## Setting Up Barcode Scan

1. Go to your **WebToNative dashboard** → **Add-ons** → **Barcode Scan** and enable it.
2. Optionally configure default scanner styling (title, colors, animation, border style, etc.) on
   the same add-on page — every one of these can also be overridden per call from JavaScript. See
   [Style Options](#style-options) for the full list and the override priority order.
3. If you want **multi-scan** sessions available at all, configure the Multi-Scan section in the
   dashboard (confirm modal, confirm button text, count badge text). This doesn't turn multi-scan
   *on* by itself — see [Multi-Scan Mode](#multi-scan-mode).

{% hint style="info" %}
**Dashboard settings are defaults, not requirements.** Anything you set in the dashboard is just the
fallback used when a given call doesn't override it — see the priority order in
[Style Options](#style-options).
{% endhint %}

***

## JavaScript API Reference

### BarcodeScan

Opens the native barcode/QR scanner.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
const { Format, BarcodeScan } = WTN.Barcode;

BarcodeScan({
  format: Format.QR_CODE, // optional — omit to scan all supported formats
  onBarcodeSearch: (value) => {
    console.log(value);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { Format, BarcodeScan } from "webtonative/barcode";

BarcodeScan({
  format: Format.QR_CODE,
  onBarcodeSearch: (value) => {
    console.log(value);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `format` | `Format` | No | A single format to restrict scanning to. Omit (or pass no `format`) to scan all supported formats. See [Format Types](#format-types). |
| `onBarcodeSearch` | `Function` | No | Called with just the scanned **string** value. Only fires for a single successful scan — it does not fire for multi-scan results, `SCAN_LIMIT_REACHED`, or errors. Use `callback` for those. |
| `callback` | `Function` | No | Called with the **full response object** for every outcome — single scan, multi-scan, scan-limit-reached, and errors. This is the one to use once you turn on multi-scan. |
| `multiScan` | `Boolean` | No | Opt in to a multi-scan session for this call. Only takes effect if multi-scan is also configured in the dashboard — see [Multi-Scan Mode](#multi-scan-mode). Defaults to `false`. |
| `maxCount` | `Number` | No | Overrides the dashboard's max scan count for this call (single-scan sessions ignore this). |
| `allowDuplicates` | `Boolean` | No | Overrides the dashboard's duplicate-scan setting for this call. |
| `style` | `Object` | No | Per-call overrides for scanner appearance and behavior — see [Style Options](#style-options). |

{% hint style="info" %}
**Use `callback`, not `onBarcodeSearch`, once you turn on multi-scan.** `onBarcodeSearch(value)`
only ever receives a single scanned string and is a no-op for multi-scan results, which arrive as
a `scans` array instead — see [Callback Response Format](#callback-response-format).
{% endhint %}

***

## Format Types

Pass one of these to `format` to restrict scanning to a single symbology. Omit `format` entirely to
scan for all of them at once.

| Constant | Numeric code |
| --- | --- |
| `Format.ALL_FORMATS` | `0` |
| `Format.CODE_128` | `1` |
| `Format.CODE_39` | `2` |
| `Format.CODE_93` | `4` |
| `Format.CODABAR` | `8` |
| `Format.DATA_MATRIX` | `16` |
| `Format.EAN_13` | `32` |
| `Format.EAN_8` | `64` |
| `Format.ITF` | `128` |
| `Format.QR_CODE` | `256` |
| `Format.UPC_A` | `512` |
| `Format.UPC_E` | `1024` |
| `Format.PDF417` | `2048` |
| `Format.AZTEC` | `4096` |

The scanned `format` in a **result** can also be one of these additional names, which aren't
independently selectable via `format` but can come back when scanning all formats:

| Result-only format | Notes |
| --- | --- |
| `MICRO_QR` | |
| `GS1_DATABAR`, `GS1_DATABAR_EXPANDED`, `GS1_DATABAR_LIMITED` | |
| `MICRO_PDF417` | **iOS 17.4+ only** — Android has no equivalent symbology and never returns this. |
| `UNKNOWN` | |

***

## Multi-Scan Mode

By default, `BarcodeScan` closes the scanner immediately after one successful scan. Multi-scan
keeps the scanner open, collecting codes into a session, until the user taps "Done" or the
configured max count is reached.

**Turning it on requires both of these — either alone is not enough:**

1. Multi-Scan is configured in the dashboard (Add-ons → Barcode Scan → Multi-Scan section).
2. The call itself passes `multiScan: true`.

```javascript
BarcodeScan({
  multiScan: true,
  maxCount: 10,
  allowDuplicates: false,
  callback: (response) => {
    if (response.scans) {
      console.log(`Collected ${response.scans.length} codes`, response.scans);
    }
  },
});
```

- The session ends when the user taps "Done", **or** automatically once `maxCount` is reached
  (whichever happens first) — see the two multi-scan response shapes in
  [Callback Response Format](#callback-response-format).
- `maxCount` itself is always capped at 10,000 scans per session regardless of what you configure.
- `allowDuplicates: false` (the default) means the same code scanned twice in one session is only
  counted once.

***

## Style Options

Every field below can be set in three places, in this priority order (highest wins):

1. **This call** — pass it under `style` in `BarcodeScan({ style: { ... } })`.
2. **Dashboard default** — set once in Add-ons → Barcode Scan.
3. **Hard-coded default** — used if neither of the above is set.

```javascript
BarcodeScan({
  style: {
    title: "Scan a product",
    instructionText: "Align the code within the frame",
    scanWindowSize: "medium",
    scanAnimation: "sweep",
    borderStyle: "cornered",
    overlayDarkness: 45,
    flashlightButton: true,
    galleryButton: true,
    successVisualFeedback: true,
    visualFeedbackType: "checkmark",
    beepOnScan: true,
    vibrateOnScan: true,
    multiScanMode: { confirmModal: false, confirmButtonText: "Done", countBadgeText: "{{count}} scanned" },
  },
  callback: (response) => console.log(response),
});
```

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `title` / `subtitle` | `String` | `""` | Header text above the scan window. |
| `instructionText` | `String` | `""` | Guidance text near the scan window. |
| `instructionPosition` | `String` | `"above"` | `"above"` \| `"inside"` \| `"below"` |
| `footerText` | `String` | `""` | Text shown at the bottom of the screen. |
| `discardDialog` | `Object` | `{title:"Discard items?", subtitle:"All scanned results will be lost", primaryButtonText:"Go Back", secondaryButtonText:"Discard"}` | Confirmation dialog shown when the user backs out with unsaved scans. |
| `scanWindowSize` | `String` | `"medium"` | `"small"` \| `"medium"` \| `"large"` |
| `scanAnimation` | `String` | `"sweep"` | `"sweep"` \| `"orbit"` \| `"pulse"` — identical on both platforms. |
| `borderStyle` | `String` | `"cornered"` | `"cornered"` \| `"full"` |
| `cornerRadius` | `Number` | `0` | Corner radius of the scan window border. **Android clamps this to ≥ 0; iOS does not** — a negative value on iOS passes through as-is. |
| `borderThickness` | `String` | `"default"` | `"default"` \| `"thin"` \| `"bold"` (also accepted as `"thick"`) |
| `defaultZoom` | `String` | `"1"` | Initial camera zoom. **Parsing differs by platform** — see the hint below. |
| `overlayDarkness` | `Number` | `45` | `0`–`100`, darkness of the area outside the scan window. |
| `flashlightButton` | `Boolean` | `true` | Show a flashlight toggle. |
| `galleryButton` | `Boolean` | `true` | Show a "scan from gallery photo" button. |
| `successVisualFeedback` | `Boolean` | `true` | Show a visual confirmation on successful scan. |
| `visualFeedbackType` | `String` | `"checkmark"` | `"checkmark"` \| `"flash"` \| `"scannedItem"` |
| `beepOnScan` | `Boolean` | `true` | Play a beep on successful scan. |
| `vibrateOnScan` | `Boolean` | `true` | Vibrate on successful scan. |
| `multiScanMode.confirmModal` | `Boolean` | `false` | Ask for confirmation before finalizing a multi-scan session. |
| `multiScanMode.confirmButtonText` | `String` | `"Done"` | |
| `multiScanMode.countBadgeText` | `String` | `""` | Supports a `{{count}}` template token, e.g. `"{{count}} scanned"`. |

{% hint style="warning" %}
**`defaultZoom` parsing differs by platform.** iOS accepts any numeric string, including ones with a
trailing unit (`"2.5x"` → `2.5`). Android only recognizes the literal strings `"1.5"`, `"2"`, or
`"3"` — any other value, including `"2.5"`, silently falls back to `1.0` on Android. Stick to
`"1"`, `"1.5"`, `"2"`, or `"3"` if you need identical behavior on both platforms.
{% endhint %}

***

## Callback Response Format

All responses are delivered to `callback` (and, for single scans only, the scanned value alone is
also delivered to `onBarcodeSearch`) tagged with `"type": "BARCODE_SCAN"`.

### Single scan

```json
{ "type": "BARCODE_SCAN", "success": true, "value": "1234567890128", "format": "EAN_13" }
```

### Multi-scan — user tapped "Done"

```json
{
  "type": "BARCODE_SCAN",
  "success": true,
  "scans": [
    { "value": "1234567890128", "format": "EAN_13" },
    { "value": "9788809000000", "format": "EAN_13" }
  ]
}
```

### Multi-scan — hit the max count automatically

Same shape as above, plus a `status` field. This is **not an error** — `success` is still `true`.

```json
{
  "type": "BARCODE_SCAN",
  "success": true,
  "status": "SCAN_LIMIT_REACHED",
  "scans": [ { "value": "...", "format": "..." } ]
}
```

### Error

```json
{ "type": "BARCODE_SCAN", "success": false, "error": "CAMERA_PERMISSION_DENIED" }
```

**All possible `error` values:**

| Code | Platform | Fires when |
| --- | --- | --- |
| `CAMERA_PERMISSION_DENIED` | Both | Camera permission denied. |
| `CAMERA_INITIALIZATION_FAILED` | Both | The camera couldn't be started (no back camera, or the capture session failed to initialize). |
| `NO_BARCODE_FOUND` | Both | A gallery photo was picked but no recognizable barcode was found in it. |
| `INVALID_IMAGE` | Both | The picked gallery image couldn't be read/decoded. On iOS, this is also used if the photo picker itself times out or returns nothing. |
| `SCANNER_ERROR` | **iOS only** | The underlying image-recognition request throws while scanning a gallery photo. Android folds this same failure into `INVALID_IMAGE` instead of a separate code. |
| `SCAN_DISCARDED` | Both | The user backed out of the scanner (back press, outside tap, or confirming "Discard" in the dialog) with zero scans collected. |

***

## Platform Differences

- **`defaultZoom` parsing** — see the hint under [Style Options](#style-options).
- **`cornerRadius` clamping** — Android clamps to `≥ 0`; iOS allows negative values through unmodified.
- **`SCANNER_ERROR` vs `INVALID_IMAGE`** — iOS reports gallery-scan image-processing failures as
  `SCANNER_ERROR`; Android reports the same situation as `INVALID_IMAGE`.
- **`MICRO_PDF417` result format** — only ever returned on iOS 17.4+; Android's scanning engine has
  no equivalent symbology.

***

## Frequently Asked Questions

<details>

<summary>Why doesn't `onBarcodeSearch` fire for my multi-scan results?</summary>

`onBarcodeSearch` only ever receives a single scanned string, for single-scan sessions. Use
`callback` instead — it receives the full response object for every outcome, including the
`scans` array for multi-scan.

</details>

<details>

<summary>I set `multiScan: true` but the scanner still closes after one scan — why?</summary>

Multi-scan also requires the Multi-Scan section to be configured in your WebToNative dashboard
(Add-ons → Barcode Scan). Passing `multiScan: true` from JavaScript alone is not enough — see
[Multi-Scan Mode](#multi-scan-mode).

</details>

<details>

<summary>Is `SCAN_LIMIT_REACHED` an error I need to handle differently?</summary>

No — it's delivered with `success: true` and a full `scans` array, exactly like a normal
"Done"-triggered multi-scan completion. Treat it the same way; the only difference is *why* the
session ended.

</details>

<details>

<summary>What format types can I select with `format`, versus what can come back in a result?</summary>

`format` only accepts the fourteen selectable constants in [Format Types](#format-types). A
handful of additional names — `MICRO_QR`, the `GS1_DATABAR` variants, `MICRO_PDF417` (iOS only),
and `UNKNOWN` — can appear in a scan **result** but aren't individually selectable; they only show
up when scanning for all formats.

</details>
