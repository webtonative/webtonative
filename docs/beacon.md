# Beacon

Functions to monitor nearby iBeacons from your website. The WebToNative Beacon plugin watches for
one or more beacons by UUID (optionally scoped to a major/minor pair), and notifies your backend
over a webhook — plus, optionally, shows a local push notification — whenever a user's device
enters or exits range.

> You'll need to import the javascript file in your website before starting from this [link](https://docs.webtonative.com/javascript-apis/getting-started).

> **Platform support:** Android and iOS. iOS requires the user to grant **"Always Allow"** location
> access — background/region monitoring is not possible with "While Using the App" only. Android
> only needs foreground location access, since monitoring runs inside a foreground service.

***

## Setting Up Beacon

1. Go to your **WebToNative dashboard** → **Add-ons** → **Beacon** and enable it.
2. That's the only dashboard step — unlike Auth0 or Meta Ads, Beacon has no credentials to enter.
   The beacon(s) to watch, the webhook URL, and the notification content are all supplied at
   runtime from JavaScript via `initBeaconData` (below), not from the dashboard.

{% hint style="warning" %}
**Calling `initBeaconData` before the add-on is enabled in the dashboard does nothing — no callback fires.** Enable the Beacon add-on first, then call `initBeaconData` once your page knows which beacon(s) to watch.
{% endhint %}

***

## JavaScript API Reference

### initBeaconData

Starts (or restarts) beacon monitoring with the given list of beacons. Calling this again while
monitoring is already active replaces the previous beacon list — there's no separate "add a
beacon" call.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.Beacon.initBeaconData({
  beaconData: {
    beaconConfig: [
      {
        uuid: "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0",
        major: 1,
        minor: 1,
        webhookUrl: "https://your-backend.example.com/beacon-webhook",
        settings: {
          showNotificationOnEntry: true,
          showNotificationOnExit: true,
          notificationInterval: 5,
          notificationContentSource: "PRE_DEFINED",
          defaultNotificationEnterData: {
            title: "Welcome!",
            body: "You're near our store.",
            image: "",
            deepLink: "https://example.com/promo",
          },
          defaultNotificationExitData: {
            title: "See you soon!",
            body: "",
            image: "",
            deepLink: "",
          },
        },
      },
    ],
    userInfo: { userId: "u_123", userName: "Jane", userEmail: "jane@example.com" },
  },
  callback: function (response) {
    console.log(response.isSuccess, response.response);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { initBeaconData } from "webtonative/Beacon";

initBeaconData({
  beaconData: {
    beaconConfig: [
      {
        uuid: "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0",
        major: 1,
        minor: 1,
        webhookUrl: "https://your-backend.example.com/beacon-webhook",
        settings: { showNotificationOnEntry: true, showNotificationOnExit: true },
      },
    ],
    userInfo: { userId: "u_123", userName: "Jane", userEmail: "jane@example.com" },
  },
  callback: (response) => console.log(response),
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `beaconData.beaconConfig` | `Array` | Yes | List of beacons to monitor. See the table below for each entry's fields. |
| `beaconData.userInfo` | `Object` | No | Arbitrary identifying info (`userId`, `userName`, `userEmail`, or any keys you want) included in the webhook payload on enter/exit. |
| `callback` | `Function` | No | Called once, immediately, with the result of the permission/setup check — not called again per enter/exit event (those go to `webhookUrl`, not JavaScript). |

**`beaconConfig[]` entry fields:**

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `uuid` | `String` | Yes | The beacon's proximity UUID. |
| `major` | `Number` | **Android: No · iOS: Yes** | Beacon major value. On Android, omit it (or the whole beacon entry loses major/minor scoping) to match **any** major for this UUID — iOS has no such wildcard and requires an explicit value. |
| `minor` | `Number` | **Android: No · iOS: Yes** | Beacon minor value. Same wildcard behavior as `major` — Android-only. |
| `webhookUrl` | `String` | No | Your server endpoint. WebToNative POSTs a JSON payload here on every enter/exit — see [Webhook Payload](#webhook-payload-not-a-javascript-callback). Defaults to not sending a webhook if omitted. |
| `settings.showNotificationOnEntry` / `showNotificationOnExit` | `Boolean` | No | Show a local push notification when the device enters/exits range. Both default to `false`. |
| `settings.notificationInterval` | `Number` | No | Minutes to wait before showing the same enter/exit notification again, to avoid spamming the user as they linger near a beacon's edge. Defaults to `0` (no throttling). |
| `settings.notificationContentSource` | `String` | No | `"PRE_DEFINED"` (use `defaultNotificationEnterData`/`ExitData` below) or `"API_FETCHED"` (your own backend decides the content via the webhook). Defaults to `"PRE_DEFINED"`. |
| `settings.defaultNotificationEnterData` / `ExitData` | `Object` | No | `{ title, body, image, deepLink }` shown in the local notification. If omitted, Android still shows a blank notification; iOS shows none at all — see the note below. |

{% hint style="warning" %}
**A single malformed beacon entry can silently disable monitoring for every other entry in the array on iOS.** If any entry in `beaconConfig[]` is missing `uuid`, `major`, or `minor`, iOS aborts parsing the whole array — none of your beacons get monitored, not just the bad one. Android skips only the malformed entry and keeps monitoring the rest. Always send complete entries (with explicit `major`/`minor` on iOS) to avoid this.
{% endhint %}

**Callback Response:**

| Key | Type | Description |
| --- | --- | --- |
| `type` | `String` | Always `"initBeaconData"`. |
| `isSuccess` | `Boolean` | `true` if monitoring started. `false` if a permission or hardware check failed — see `response`. |
| `response` | `String` | `"BEACON_INITIALIZED"` on success. On failure, one of the status codes below — **Android may return several joined with `" \| "`** if multiple things are blocking at once (e.g. `"LOCATION_NOT_ALWAYS_ALLOWED \| BLUETOOTH_NOT_ENABLED"`); **iOS always returns exactly one.** |

**Possible failure `response` values:**

| Value | Platform | Meaning |
| --- | --- | --- |
| `NOTIFICATION_NOT_ALLOWED` | Android | Notification permission not granted yet. |
| `NOTIFICATION_PERMANENTLY_BLOCKED` | Android | Notification permission permanently denied. |
| `LOCATION_NOT_ALWAYS_ALLOWED` | Both | Location isn't granted at all (Android), or only "While Using the App" is granted instead of "Always" (iOS). |
| `LOCATION_PERMANENTLY_BLOCKED` | Both | Location permission permanently denied. |
| `BLUETOOTH_PERMISSION_NOT_ALLOWED` | Android | Bluetooth permission not granted. |
| `BLUETOOTH_PERMISSION_PERMANENTLY_BLOCKED` | Android | Bluetooth permission permanently denied. |
| `BLUETOOTH_NOT_ENABLED` | Android | Bluetooth is turned off on the device. |
| `LOCATION_NOT_SUPPORTED` | iOS | Beacon monitoring is disabled for this build. |
| `NOTIFICATION_PERMISSION_DENIED` | iOS | User denied the notification permission prompt. |

Any denied-but-not-yet-permanent permission is automatically re-prompted by the native app; you
don't need to request it yourself before calling `initBeaconData`.

***

## Webhook Payload (not a JavaScript callback)

Region enter/exit events are **not** delivered back to your JavaScript — they're POSTed directly
from the native app to the `webhookUrl` you supplied for that beacon:

```json
{
  "status": "CONNECTED",
  "beaconInfo": { "beaconUUID": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0", "beaconMajor": 1, "beaconMinor": 1 },
  "userInfo": { "userId": "u_123", "userName": "Jane", "userEmail": "jane@example.com" },
  "FCMToken": "...",
  "OneSignalPlayerId": "...",
  "deviceInfo": { "platform": "ANDROID_APP", "...": "..." }
}
```

`status` is `"CONNECTED"` on region entry and `"DISCONNECTED"` on region exit.

{% hint style="info" %}
**`userInfo` is a JSON object in the webhook body on Android, but a JSON-encoded *string* on iOS.** If your backend parses `userInfo` as an object, add a check for the iOS case (`typeof body.userInfo === "string"`) and `JSON.parse` it before use.
{% endhint %}

***

## Foreground Notifications (iOS only)

If a beacon notification would fire while your app is in the foreground, and the app has
"disable notifications in foreground" turned on, iOS forwards the notification's data to
JavaScript instead of showing a system banner, by calling a global function you can define:

```javascript
window.wtnGetForegroundNotificationData = function (data) {
  console.log(data.title, data.body, data.userInfo.deepLink, data.type); // data.type === "beacon"
};
```

Android has no equivalent — beacon notifications on Android always show as a normal system
notification regardless of whether the app is foregrounded.

***

## Frequently Asked Questions

<details>

<summary>How do I stop monitoring a beacon?</summary>

There's no dedicated "stop" function on either platform today. Calling `initBeaconData` again
replaces the previous beacon list, but to fully stop monitoring you'd currently need to reinstall
or restart the relevant native flow — this is a known gap, not a configuration option.

</details>

<details>

<summary>Why does `initBeaconData` fail with `LOCATION_NOT_ALWAYS_ALLOWED` even though the user granted location access?</summary>

On iOS, beacon monitoring is a background capability and specifically requires the **"Always"**
location authorization level — "While Using the App" is not enough and will produce this exact
status. On Android, this status instead means foreground location wasn't granted at all.

</details>

<details>

<summary>Can I scope monitoring to a specific major/minor on both platforms?</summary>

Yes, but the "match any" wildcard only exists on Android — omit `major`/`minor` there to match any
value for that UUID. iOS requires both fields on every entry; there is no wildcard equivalent.

</details>
