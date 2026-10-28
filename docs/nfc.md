# NFC

Functions to interact with NFC (Near Field Communication) tags from your website. You can check whether NFC is available on the device, scan an NFC tag to read its contents (and optionally open the encoded URL in the app), and write data to an NFC tag.

> You'll need to import the javascript file in your website before starting from this [link](https://docs.webtonative.com/javascript-apis/getting-started).

> **Platform support:** Android and iOS. iOS requires devices with NFC reading capability (iPhone 7 and later) and the appropriate entitlements configured on the app.

***

## Status

Checks the current NFC capability and state of the device — whether NFC hardware is present, whether it is enabled, and whether the app is permitted to use it.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.NFC.status({
  callback: function (response) {
    console.log(response.status);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { status } from "webtonative/NFC";

status({
  callback: (response) => {
    console.log(response.status);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key        | Type       | Required | Description                                            |
| ---------- | ---------- | -------- | ------------------------------------------------------ |
| `callback` | `Function` | No       | Callback function invoked with the NFC status response. |

**Callback Response:**

| Key      | Type      | Description                                                                     |
| -------- | --------- | ------------------------------------------------------------------------------- |
| `type`   | `String`  | Always `"nfcGetStatus"`.                                                        |
| `status` | `String`  | Current NFC state. One of `"ENABLED"`, `"DISABLED"`, or `"NOT_SUPPORTED"`.      |

**Status values:**

| Value           | Description                                                                |
| --------------- | -------------------------------------------------------------------------- |
| `ENABLED`       | The device has NFC hardware and it is turned on. Ready for scan/write.     |
| `DISABLED`      | The device has NFC hardware but it is currently turned off in settings.    |
| `NOT_SUPPORTED` | The device does not have NFC hardware.                                     |

***

## Read

Starts an NFC scan session. The device waits for an NFC tag to be tapped and returns the tag's contents through the callback. On Android, a system scan dialog is shown (with the configurable `message`); on iOS, the system NFC scan sheet is presented.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.NFC.read({
  message: "Hold your device near the NFC tag",
  openUrl: false,
  continuous: false,
  callback: function (response) {
    console.log(response.content);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { read } from "webtonative/NFC";

read({
  message: "Hold your device near the NFC tag",
  openUrl: false,
  continuous: false,
  callback: (response) => {
    console.log(response.content);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key          | Type       | Required | Description                                                                                                                                          |
| ------------ | ---------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `message`    | `String`   | No       | The instruction text shown to the user in the system NFC scan dialog.                                                                                |
| `openUrl`    | `Boolean`  | No       | If `true` and the scanned tag contains an `http`/`https` URL, the app automatically loads it in the WebView. Defaults to `false`.                    |
| `continuous` | `Boolean`  | No       | If `true`, the callback is kept registered after the first scan so subsequent scans also fire the callback. Defaults to `false` (single-shot scan).  |
| `callback`   | `Function` | No       | Callback function invoked with the scan response.                                                                                                    |

**Callback Response:**

| Key       | Type      | Description                                                                                                                  |
| --------- | --------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `type`    | `String`  | Always `"nfcScanTag"`.                                                                                                       |
| `success` | `Boolean` | `true` if the tag was read successfully, `false` if the scan was cancelled or failed.                                        |
| `content` | `String`  | The payload read from the tag (URL string, plain text, or other NDEF record content).                                        |
| `opened`  | `Boolean` | Present and `true` only when `openUrl` was requested, the scan succeeded, and the URL was loaded into the WebView.           |
| `error`   | `String`  | Present when `success` is `false`. A short code describing why the scan failed (e.g., user cancellation, unsupported tag).   |

**Example:**

```javascript
window.WTN.NFC.read({
  message: "Scan a product tag",
  openUrl: true,
  callback: function (response) {
    if (response.success) {
      console.log("Tag content:", response.content);
      if (response.opened) {
        console.log("URL was auto-opened in the WebView.");
      }
    } else {
      console.error("NFC scan failed:", response.error);
    }
  },
});
```

***

## Write

Writes an NDEF message to an NFC tag. The device starts a write session and waits for the user to tap a writable tag against it. Use this to encode a URL, plain text, or a custom MIME payload onto an empty/rewritable NFC tag.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.NFC.write({
  type: "url",
  content: "https://example.com",
  message: "Hold your device near a writable NFC tag",
  callback: function (response) {
    console.log(response.success);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { write } from "webtonative/NFC";

write({
  type: "url",
  content: "https://example.com",
  message: "Hold your device near a writable NFC tag",
  callback: (response) => {
    console.log(response.success);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key       | Type       | Required | Description                                                                                                                                                            |
| --------- | ---------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`    | `String`   | Yes      | The type of NDEF record to write. One of `"url"` or `"string"`.                                                                                                        |
| `content` | `String`   | Yes      | The value to write onto the tag. For `type: "url"`, any valid URI scheme is accepted (`http`, `https`, `tel`, `sms`, `mailto`, `geo`, etc.). For `type: "string"`, any text. |
| `message` | `String`   | No       | The instruction text shown to the user in the system NFC write dialog.                                                                                                 |
| `callback`| `Function` | No       | Callback function invoked with the write response.                                                                                                                     |

**Supported `type` values:**

| Value    | Description                                                                                  |
| -------- | -------------------------------------------------------------------------------------------- |
| `url`    | Writes an NDEF URI record. `content` should be a valid URI (any scheme).                     |
| `string` | Writes an NDEF text record. `content` is plain text.                                         |

**Callback Response:**

| Key       | Type      | Description                                                                                              |
| --------- | --------- | -------------------------------------------------------------------------------------------------------- |
| `type`    | `String`  | Always `"nfcWriteTag"`.                                                                                  |
| `success` | `Boolean` | `true` if the tag was written successfully, `false` otherwise.                                           |
| `cancel`  | `Boolean` | `true` if the user cancelled the write session before a tag was tapped. `false` otherwise.               |
| `error`   | `String`  | Present when `success` is `false`. A short error code describing the failure (see the table below).      |

**Possible `error` values:**

| Code                | Description                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------ |
| `INVALID_URL`       | `type` was `url` but `content` was blank or did not contain a valid URI scheme.                        |
| `INVALID_MIME_TYPE` | A MIME-type write was requested but no `mimeType` was provided.                                        |
| `WRITE_FAILED`      | The tag could not be written — e.g., the tag is read-only, locked, or the NDEF payload could not be built. |

**Example:**

```javascript
window.WTN.NFC.write({
  type: "url",
  content: "https://example.com/product/42",
  message: "Tap a blank NFC tag to encode the product link",
  callback: function (response) {
    if (response.success) {
      console.log("Tag written successfully");
    } else if (response.cancel) {
      console.log("User cancelled the write");
    } else {
      console.error("Write failed:", response.error);
    }
  },
});
```

***

**Notes:**

- Always call `status` before attempting to `read` or `write` so you can show a meaningful message to the user when NFC is `DISABLED` or `NOT_SUPPORTED`.
- On iOS, NFC sessions are time-limited by the system; if no tag is tapped within the timeout, the session will end and the callback will fire with `success: false`.
- `openUrl` in `read` only auto-loads `http` and `https` URLs into the WebView. Other schemes (e.g., `tel:`, `mailto:`) are returned in `content` but are not opened automatically.
- For `write`, the tag must be writable and have enough capacity for the NDEF payload. Locked or read-only tags will fail with `WRITE_FAILED`.
