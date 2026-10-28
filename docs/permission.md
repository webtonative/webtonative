# Permission

Functions to manage device permissions and hardware/service states from your website. You can check the current status of one or more permissions without prompting, request a single permission (showing the native system dialog when needed), and open the system settings screen so the user can re-enable a permission manually.

> You'll need to import the javascript file in your website before starting from this [link](https://docs.webtonative.com/javascript-apis/getting-started).

> **Platform support:** Android and iOS. All three functions work identically on both platforms unless a platform note states otherwise.

***

## Status Values

Every permission-related callback returns one of the following status strings.

| Status | Description |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ALLOWED` | Permission is granted. The feature can be used. |
| `NOT_ALLOWED` | Permission is not granted but a dialog can still be shown — it has never been asked, was denied once (and can be asked again), or the device service is off. |
| `PERMANENTLY_BLOCKED` | The user selected "Don't ask again" (Android) or denied the permission from Settings (iOS). No dialog can be shown — the user must open Settings manually. |
| `RESTRICTED` | A system-level policy (parental controls, MDM) prevents the permission. The user cannot change it. iOS only. |
| `UNKNOWN_STATUS` | The status cannot be determined on this platform or device. |

***

## Supported Permissions

These values are accepted by both `request` and `check`.

| Value | Description | iOS | Android |
| -------------------- | --------------------------------------------------- | --- | ------- |
| `camera` | Camera access | ✅ | ✅ |
| `location` | Location access (while using the app) | ✅ | ✅ |
| `location_always` | Location access at all times, including background | ✅ | ✅ |
| `notification` | Push notification delivery | ✅ | ✅ |
| `record_audio` | Microphone access | ✅ | ✅ |
| `contact` | Read device contacts | ✅ | ✅ |
| `bluetooth` | Bluetooth access | ✅ | ✅ |
| `speech_recognition` | On-device speech recognition | ✅ | ✅ |

> **Contact** and **Bluetooth** are only active when the corresponding native module is enabled in your app configuration. If the module is disabled, the callback returns `NOT_ALLOWED` immediately without showing a dialog.

***

## Supported Device States

These values represent hardware or service toggles, not grantable permissions. They are accepted **only by `check`** (and by `open`) — they **cannot** be passed to `request`.

| Value | Description | iOS | Android |
| ----------------- | ----------------------------------------------------- | ------ | ------- |
| `enableBluetooth` | Whether the Bluetooth radio is currently on | ✅ ¹ | ✅ |
| `enableNfc` | Whether NFC is currently enabled | ✅ | ✅ |
| `enableLocation` | Whether Location Services are enabled system-wide | ✅ | ✅ |

> ¹ iOS cannot check the Bluetooth power state synchronously — `enableBluetooth` returns `UNKNOWN_STATUS` on iOS.

***

## Check

Checks the current status of one or more permissions or device states **without showing any dialog**. Results for all requested items are returned together in a single callback.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.Permission.check({
  permissions: ["camera", "notification", "enableLocation"],
  callback: function (response) {
    console.log(response.permissionStatus);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { check } from "webtonative/Permission";

check({
  permissions: ["camera", "notification", "enableLocation"],
  callback: (response) => {
    console.log(response.permissionStatus);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key | Type | Required | Description |
| ------------- | ---------- | -------- | --------------------------------------------------------------------------------- |
| `permissions` | `String[]` | Yes | One or more permission or device-state values to check. |
| `callback` | `Function` | No | Callback function invoked with the status of all requested items. |

**Callback Response:**

| Key | Type | Description |
| ------------------ | -------- | ---------------------------------------------------------------------------------------------------------- |
| `type` | `String` | Always `"checkPermission"`. |
| `permissionStatus` | `Object` | A key-value map where each key is a permission value you passed in and each value is one of the status strings above. |

**Example response:**

```json
{
  "type": "checkPermission",
  "permissionStatus": {
    "camera": "ALLOWED",
    "notification": "PERMANENTLY_BLOCKED",
    "enableLocation": "NOT_ALLOWED"
  }
}
```

**Notes:**

- The callback arrives with a short delay (approximately one second) to allow asynchronous system checks to complete.
- Checking multiple permissions in one call is more efficient than making separate calls.
- Passing an unrecognised value returns `null` for that key on Android and an empty string on iOS. Always use the supported values listed above.
- On Android, a permission that has never been requested returns `NOT_ALLOWED` (not `PERMANENTLY_BLOCKED`). `PERMANENTLY_BLOCKED` is only returned once the user has been shown a dialog at least once and selected "Don't ask again".

***

## Request

Requests a **single** permission from the user. Shows the native system dialog if the permission has not been granted yet. If it is already granted the callback fires immediately with `ALLOWED`; if it is permanently blocked the callback fires immediately with `PERMANENTLY_BLOCKED` — no dialog is shown.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.Permission.request({
  permission: "camera",
  callback: function (response) {
    console.log(response.status);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { request } from "webtonative/Permission";

request({
  permission: "camera",
  callback: (response) => {
    console.log(response.status);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key | Type | Required | Description |
| ------------ | ---------- | -------- | --------------------------------------------------------------------------------------------------- |
| `permission` | `String` | Yes | A single permission value to request. Device-state values (`enableBluetooth`, etc.) are not accepted. |
| `callback` | `Function` | No | Callback function invoked with the outcome of the request. |

**Callback Response:**

| Key | Type | Description |
| -------- | -------- | --------------------------------------------------------------- |
| `type` | `String` | Always `"requestPermission"`. |
| `status` | `String` | One of the status strings above, reflecting the request outcome. |

**Example response:**

```json
{
  "type": "requestPermission",
  "status": "ALLOWED"
}
```

**Notes:**

- Only one permission can be requested per call.
- Device-state values are silently ignored — use `check` to read device states and `open` to direct the user to the relevant settings screen.
- On iOS, `notification` permission can only be requested once. After it is denied, subsequent calls return `PERMANENTLY_BLOCKED` immediately.

***

## Open

Opens the system settings screen for a specific permission or device state. Use this when `check` or `request` returns `PERMANENTLY_BLOCKED` and you want to guide the user to re-enable the permission manually. Optionally show a native confirmation dialog before navigating to Settings.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
// Open settings directly
window.WTN.Permission.open({
  permission: "camera",
});

// Show a confirmation dialog first
window.WTN.Permission.open({
  permission: "camera",
  alertDialogStyle: {
    title: "Camera Permission Required",
    message: "Please enable camera access in Settings to continue.",
    positiveText: "Open Settings",
    negativeText: "Cancel",
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { open } from "webtonative/Permission";

// Open settings directly
open({
  permission: "camera",
});

// Show a confirmation dialog first
open({
  permission: "camera",
  alertDialogStyle: {
    title: "Camera Permission Required",
    message: "Please enable camera access in Settings to continue.",
    positiveText: "Open Settings",
    negativeText: "Cancel",
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key | Type | Required | Description |
| ------------------------------ | -------- | -------- | ---------------------------------------------------------------------------------------------------------------- |
| `permission` | `String` | Yes | The permission or device-state value whose settings screen to open. Accepts all permission and device-state values. |
| `alertDialogStyle` | `Object` | No | When provided, a native confirmation dialog is shown before navigating to Settings. If omitted, Settings opens immediately. |
| `alertDialogStyle.title` | `String` | No | Dialog title. Defaults to a permission-name-based title if omitted. |
| `alertDialogStyle.message` | `String` | No | Dialog body text. A generic message is used if omitted. |
| `alertDialogStyle.positiveText` | `String` | No | Text for the confirm button. Defaults to `"Settings"`. |
| `alertDialogStyle.negativeText` | `String` | No | Text for the cancel button. Defaults to `"Cancel"`. |

**Notes:**

- This function is fire-and-forget — there is no meaningful callback. If you need the permission status after the user returns from Settings, call `check` again when your page regains focus.
- For device states (`enableBluetooth`, `enableNfc`, `enableLocation`), this opens the relevant system toggle screen rather than the app's permission page.
- On iOS, `enableBluetooth` opens general app Settings (there is no direct deep link to the Bluetooth system toggle available to third-party apps).

***

**Notes:**

- Call `check` on page load (or focus) to decide what to render — request the permission inline when it is `NOT_ALLOWED`, and guide the user to Settings via `open` when it is `PERMANENTLY_BLOCKED`.
- Device-state values (`enableBluetooth`, `enableNfc`, `enableLocation`) work with `check` and `open` only — never with `request`.
