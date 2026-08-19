# Geofencing

Functions to monitor circular geographic zones from your website. Once a zone is registered, the
native app keeps watching it in the background — even when your site isn't open — and fires the
configured webhook when the user enters, leaves, or dwells inside it.

> You'll need to import the javascript file in your website before starting from this [link](https://docs.webtonative.com/javascript-apis/getting-started).

> **Platform support:** Android and iOS. `openLocationSettings` is **iOS only**.

***

## Setting Up Geofencing

1. Go to your **WebToNative dashboard** → **Add-ons** → **Geofencing** and enable it.
2. Pick the zone source:

| Mode | Where zones come from |
| --- | --- |
| `dashboard` | Zones you define in the dashboard. `refreshZones` re-applies them. |
| `api` | Zones fetched from your API endpoint. `refreshZones` refetches. |
| `js_bridge` | Zones you add at runtime with [`addZone`](#addzone). `refreshZones` just re-asserts what is already registered. |

3. Rebuild and reinstall the app.

{% hint style="warning" %}
**Geofencing needs background location permission.** [`start`](#start) does *not* prompt on Android
— it only registers zones if permission was already granted. Call
[`requestPermission`](#requestpermission) to trigger the OS prompt.
{% endhint %}

{% hint style="info" %}
Both platforms cap how many zones can be monitored at once (100 per app on Android, 20 on iOS), so
register only the zones that are relevant to the user right now rather than your whole catalogue.
{% endhint %}

***

## JavaScript API Reference

### start

Starts monitoring. Registers the zones from the active source, and on iOS also requests "Always"
location authorization. On Android it checks the existing permission and re-runs zone registration
if it is already granted — it never shows a permission prompt itself.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.Geofencing.start({
  callback: function (response) {
    console.log(response);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { start } from "webtonative/Geofencing";

start({
  callback: (response) => {
    console.log(response);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `callback` | `Function` | No | Callback function invoked with the result of the start attempt. |

**Callback Response:**

| Key | Type | Description |
| --- | --- | --- |
| `type` | `String` | Always `"startGeofencing"`. |
| `success` | `Boolean` | `true` when monitoring is active. |
| `status` | `String` | Current location permission status — see [`getPermissionStatus`](#getpermissionstatus). |

***

### requestPermission

Triggers the real OS permission flow. On Android that is foreground location, then background
location, followed by a battery-optimization exemption request; on grant, zones are registered
again. On iOS it requests "Always" location authorization.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.Geofencing.requestPermission({
  callback: function (response) {
    console.log(response.status);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { requestPermission } from "webtonative/Geofencing";

requestPermission({
  callback: (response) => {
    console.log(response.status);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `callback` | `Function` | No | Callback function invoked once the user has answered the prompts. |

**Callback Response:**

| Key | Type | Description |
| --- | --- | --- |
| `type` | `String` | Always `"requestGeofenceLocationPermission"`. |
| `status` | `String` | Permission status after the prompt. |

{% hint style="warning" %}
**Android asks twice.** Foreground location is requested first, then background ("Allow all the
time") in a second prompt — the user can grant the first and deny the second, which leaves
geofencing inactive. Check `status` rather than assuming a grant.
{% endhint %}

***

### getPermissionStatus

Reads the current location permission status without prompting. Use it on page load to decide
whether to show your own explainer before calling `requestPermission`.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.Geofencing.getPermissionStatus({
  callback: function (response) {
    console.log(response.status);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { getPermissionStatus } from "webtonative/Geofencing";

getPermissionStatus({
  callback: (response) => {
    console.log(response.status);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `callback` | `Function` | No | Callback function invoked with the permission status. |

**Callback Response:**

| Key | Type | Description |
| --- | --- | --- |
| `type` | `String` | Always `"getGeofencePermissionStatus"`. |
| `status` | `String` | One of `"ALLOWED"`, `"NOT_ALLOWED"`, `"PERMANENTLY_BLOCKED"`, `"RESTRICTED"`, `"UNKNOWN_STATUS"`. |

***

### openLocationSettings

Opens the app's Settings page so the user can change the location permission by hand — the only
route left once the status is `PERMANENTLY_BLOCKED`. **iOS only**; this call has no callback.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.Geofencing.openLocationSettings();
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { openLocationSettings } from "webtonative/Geofencing";

openLocationSettings();
```

{% endtab %}
{% endtabs %}

{% hint style="info" %}
On Android use the general permission API for the same effect:
`window.WTN.Permission.open({ permission: "location_always" })`.
{% endhint %}

***

### addZone

Registers a zone, or updates the existing zone with the same `id`, then re-syncs monitoring with
the OS.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.Geofencing.addZone({
  zone: {
    id: "store-1",
    name: "Downtown store",
    lat: 28.6139,
    lng: 77.209,
    radius: 150,
    triggers: ["enter", "exit"],
  },
  callback: function (response) {
    console.log(response);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { addZone } from "webtonative/Geofencing";

addZone({
  zone: {
    id: "store-1",
    name: "Downtown store",
    lat: 28.6139,
    lng: 77.209,
    radius: 150,
    triggers: ["enter", "exit"],
  },
  callback: (response) => {
    console.log(response);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `zone` | `Object` | Yes | The zone to add or update. The call is ignored if missing. |
| `callback` | `Function` | No | Callback function invoked with the result. |

**Zone object:**

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `String` | Yes | Unique id. Adding a zone with an id that already exists updates that zone instead of creating a second one. |
| `name` | `String` | No | Human-readable label, returned again by `getActiveZones` and sent with the webhook. |
| `lat` | `Number` | Yes | Latitude of the zone centre. |
| `lng` | `Number` | Yes | Longitude of the zone centre. |
| `radius` | `Number` | Yes | Radius in metres. Very small radii are unreliable in practice — 100 m or more is a safe floor. |
| `triggers` | `String[]` | No | Which events fire: `"enter"`, `"exit"`, `"dwell"`. Defaults to the native default when omitted. |

**Callback Response:**

| Key | Type | Description |
| --- | --- | --- |
| `type` | `String` | Always `"addGeofenceZone"`. |
| `success` | `Boolean` | `true` when the zone is being monitored. |

***

### removeZone

Stops monitoring one zone and removes its stored metadata.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.Geofencing.removeZone({
  id: "store-1",
  callback: function (response) {
    console.log(response);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { removeZone } from "webtonative/Geofencing";

removeZone({
  id: "store-1",
  callback: (response) => {
    console.log(response);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `String` | Yes | Id of the zone to remove. |
| `callback` | `Function` | No | Callback function invoked with the result. |

**Callback Response:**

| Key | Type | Description |
| --- | --- | --- |
| `type` | `String` | Always `"removeGeofenceZone"`. |
| `success` | `Boolean` | `true` when the zone was removed. |

***

### getActiveZones

Returns every zone currently registered for monitoring, with full metadata.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.Geofencing.getActiveZones({
  callback: function (response) {
    console.log(response.zones);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { getActiveZones } from "webtonative/Geofencing";

getActiveZones({
  callback: (response) => {
    console.log(response.zones);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `callback` | `Function` | No | Callback function invoked with the active zones. |

**Callback Response:**

| Key | Type | Description |
| --- | --- | --- |
| `type` | `String` | Always `"getActiveGeofenceZones"`. |
| `zones` | `Object[]` | The monitored zones, each in the same shape as the zone object passed to `addZone`. |

***

### clearAllZones

Stops monitoring everything and clears all stored zone data. Zones from the dashboard or your API
come back on the next [`refreshZones`](#refreshzones) or app start; zones added over the JS bridge
have to be re-added.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.Geofencing.clearAllZones({
  callback: function (response) {
    console.log(response);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { clearAllZones } from "webtonative/Geofencing";

clearAllZones({
  callback: (response) => {
    console.log(response);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `callback` | `Function` | No | Callback function invoked with the result. |

**Callback Response:**

| Key | Type | Description |
| --- | --- | --- |
| `type` | `String` | Always `"clearAllGeofenceZones"`. |
| `success` | `Boolean` | `true` when all zones were cleared. |

***

### refreshZones

Re-syncs zones from whichever source the add-on is configured for — refetches from your API (`api`
mode), re-applies the dashboard zones (`dashboard` mode), or re-asserts the existing registrations
(`js_bridge` mode). Useful after the user signs in or their saved locations change server-side.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.Geofencing.refreshZones({
  callback: function (response) {
    console.log(response);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { refreshZones } from "webtonative/Geofencing";

refreshZones({
  callback: (response) => {
    console.log(response);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `callback` | `Function` | No | Callback function invoked with the result. |

**Callback Response:**

| Key | Type | Description |
| --- | --- | --- |
| `type` | `String` | Always `"refreshGeofenceZones"`. |
| `success` | `Boolean` | `true` when the sync finished. In `js_bridge` mode this is a success no-op. |

***

### setWebhook

Sets — or merges into — the webhook config the app calls when a zone triggers. This is how your
backend learns about entries and exits that happen while your site is closed.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.Geofencing.setWebhook({
  url: "https://example.com/geofence-events",
  headers: { Authorization: "Bearer token" },
  userContext: { userId: "123" },
  callback: function (response) {
    console.log(response);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { setWebhook } from "webtonative/Geofencing";

setWebhook({
  url: "https://example.com/geofence-events",
  headers: { Authorization: "Bearer token" },
  userContext: { userId: "123" },
  callback: (response) => {
    console.log(response);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | `String` | Yes | Endpoint called when a trigger fires. |
| `headers` | `Object` | No | Headers sent with the request — typically an auth token. **Android stores a single custom header**, so pass only one there if you need identical behavior on both platforms. |
| `userContext` | `Object` | No | **Android only.** Extra data sent along with the trigger payload, e.g. the signed-in user's id. |
| `callback` | `Function` | No | Callback function invoked with the result. |

**Callback Response:**

| Key | Type | Description |
| --- | --- | --- |
| `type` | `String` | Always `"setGeofenceWebhook"`. |
| `success` | `Boolean` | `true` when the config was stored. |

{% hint style="warning" %}
The webhook config is merged, not replaced — calling `setWebhook` again with only a `url` keeps the
previously stored headers. Use [`removeWebhook`](#removewebhook) when you want a clean slate.
{% endhint %}

***

### removeWebhook

Clears the webhook config set from the JS bridge.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.Geofencing.removeWebhook({
  callback: function (response) {
    console.log(response);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { removeWebhook } from "webtonative/Geofencing";

removeWebhook({
  callback: (response) => {
    console.log(response);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `callback` | `Function` | No | Callback function invoked with the result. |

**Callback Response:**

| Key | Type | Description |
| --- | --- | --- |
| `type` | `String` | Always `"removeGeofenceWebhook"`. |
| `success` | `Boolean` | `true` when the config was cleared. |

***

## Putting It Together

Check the permission, ask for it if needed, then register the zones this user cares about.

```javascript
window.WTN.Geofencing.getPermissionStatus({
  callback: function (response) {
    if (response.status === "ALLOWED") {
      registerZones();
      return;
    }

    if (response.status === "PERMANENTLY_BLOCKED") {
      // iOS: only Settings can undo this. On Android use WTN.Permission.open.
      window.WTN.Geofencing.openLocationSettings();
      return;
    }

    window.WTN.Geofencing.requestPermission({
      callback: function (result) {
        if (result.status === "ALLOWED") registerZones();
      },
    });
  },
});

function registerZones() {
  window.WTN.Geofencing.setWebhook({
    url: "https://example.com/geofence-events",
    headers: { Authorization: "Bearer token" },
  });

  window.WTN.Geofencing.addZone({
    zone: {
      id: "store-1",
      name: "Downtown store",
      lat: 28.6139,
      lng: 77.209,
      radius: 150,
      triggers: ["enter", "exit"],
    },
    callback: function (response) {
      console.log(response);
    },
  });

  window.WTN.Geofencing.start();
}
```
