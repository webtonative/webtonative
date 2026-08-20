# Health Bridge

Functions to read and write the user's health and fitness data from your website. Health Bridge
talks to the platform's own health store — **Health Connect** on Android and **HealthKit** on iOS —
so the data your site reads is the same data the user sees in their health app, and anything you
write shows up there too.

> You'll need to import the javascript file in your website before starting from this [link](https://docs.webtonative.com/javascript-apis/getting-started).

> **Platform support:** Android and iOS. `openProvider` and `openProviderSettings` are **Android only**.

***

## Setting Up Health Bridge

1. Go to your **WebToNative dashboard** → **Add-ons** → **Health Bridge** and enable it.
2. Select the data types your app needs to read and/or write. Both platforms only grant access to
   the types declared by the app, so a type that is not enabled in the dashboard will never return
   data — even if you pass it to `read`.
3. Rebuild and reinstall the app.

{% hint style="info" %}
**Android** requires the Health Connect app to be installed (it ships with Android 14+, and is a
Play Store download on older versions). Call [`isAvailable`](#isavailable) first, and send the user
to [`openProvider`](#openprovider) when it is missing.
{% endhint %}

{% hint style="warning" %}
The user grants permission per data type on the platform's own permission screen. A read for a type
the user has denied returns no data for that type rather than failing the whole call, so always
check what actually came back instead of assuming every requested type is present.
{% endhint %}

***

## Data Types

The same identifiers are used for `read`, `write`, and `deleteRecords` on both platforms.

| Group | Data types |
| --- | --- |
| Activity | `steps`, `distance`, `activeEnergy`, `totalEnergy`, `floorsClimbed`, `exerciseTime` |
| Body | `height`, `weight`, `bodyFat`, `leanBodyMass` |
| Vitals | `heartRate`, `restingHeartRate`, `hrv`, `bloodPressure`, `bloodGlucose`, `oxygenSaturation`, `bodyTemperature`, `respiratoryRate`, `vo2Max` |
| Lifestyle | `sleep`, `waterIntake`, `calorieIntake`, `menstruation` |

***

## JavaScript API Reference

### isAvailable

Checks whether the health provider is available on this device and usable by the app. Use this as a
gate before showing any health UI on your site.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.HealthBridge.isAvailable({
  callback: function (response) {
    console.log(response);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { isAvailable } from "webtonative/HealthBridge";

isAvailable({
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
| `callback` | `Function` | No | Callback function invoked with the availability response. |

**Callback Response:**

| Key | Type | Description |
| --- | --- | --- |
| `type` | `String` | Always `"isHealthBridgeAvailable"`. |
| `isAvailable` | `Boolean` | `true` when the health store can be used. On Android this is `false` when Health Connect is not installed or not supported by the OS version. |

***

### openProvider

Opens the Health Connect app, so the user can install it or review which apps have access.
**Android only** — on iOS the call does nothing (HealthKit has no separate provider app).

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.HealthBridge.openProvider();
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { openProvider } from "webtonative/HealthBridge";

openProvider();
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `callback` | `Function` | No | Callback function invoked once the native call has been handled. |

***

### openProviderSettings

Opens the Health Connect permission screen for your app, where the user can grant or revoke access
per data type. Use it when a read comes back empty because permission was denied.
**Android only** — on iOS the call does nothing; there, send users to the Health app manually
(Health → Sharing → Apps).

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.HealthBridge.openProviderSettings();
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { openProviderSettings } from "webtonative/HealthBridge";

openProviderSettings();
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `callback` | `Function` | No | Callback function invoked once the native call has been handled. |

***

### read

Reads records for one or more data types within a date range.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.HealthBridge.read({
  dataTypes: ["steps", "distance", "heartRate"],
  startDate: "2026-08-16T00:00:00Z",
  endDate: "2026-08-17T00:00:00Z",
  limit: 100,
  callback: function (response) {
    console.log(response);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { read } from "webtonative/HealthBridge";

read({
  dataTypes: ["steps", "distance", "heartRate"],
  startDate: "2026-08-16T00:00:00Z",
  endDate: "2026-08-17T00:00:00Z",
  limit: 100,
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
| `dataTypes` | `String[]` | Yes | One or more [data types](#data-types) to read. |
| `startDate` | `String` | Yes | ISO 8601 start of the range, e.g. `"2026-08-16T00:00:00Z"`. |
| `endDate` | `String` | Yes | ISO 8601 end of the range. |
| `limit` | `Number` | No | **Android only.** Caps how many records are returned. |
| `pageToken` | `String` | No | **iOS only.** Token returned by a previous `read` used to fetch the next page of results. |
| `callback` | `Function` | No | Callback function invoked with the records read. |

**Callback Response:**

| Key | Type | Description |
| --- | --- | --- |
| `type` | `String` | Always `"readHealthBridge"`. |
| `success` | `Boolean` | `false` when the read could not be performed at all (provider unavailable, range invalid). |
| `data` | `Object` | The records read, keyed by data type. Each record carries its `id` (needed by `deleteRecords`), its value, unit, and `startDate`/`endDate`. |
| `pageToken` | `String` | **iOS only.** Present when more results are available — pass it back as `pageToken` on the next `read`. |

{% hint style="info" %}
**Pagination differs by platform.** Android bounds a read with `limit`; iOS pages through results
with `pageToken`. Passing both is safe — each platform ignores the parameter it does not use — so
write one call that works on both.
{% endhint %}

***

### write

Writes one or more records into the health store. Written records are attributed to your app, which
is also what makes them deletable later.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.HealthBridge.write({
  records: [
    {
      dataType: "steps",
      value: 1000,
      unit: "count",
      start: "2026-08-17T08:30:00Z",
      end: "2026-08-17T09:00:00Z",
    },
  ],
  callback: function (response) {
    console.log(response);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { write } from "webtonative/HealthBridge";

write({
  records: [
    {
      dataType: "steps",
      value: 1000,
      unit: "count",
      start: "2026-08-17T08:30:00Z",
      end: "2026-08-17T09:00:00Z",
    },
  ],
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
| `records` | `Object[]` | Yes | The records to write. An empty array is ignored. |
| `callback` | `Function` | No | Callback function invoked with the write result. |

**Record object:**

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `dataType` | `String` | Yes | The [data type](#data-types) being written. |
| `value` | `Number` | Yes | The measured value. |
| `unit` | `String` | iOS | Unit of `value`, e.g. `"count"`, `"kg"`, `"ml"`. Required on iOS; Android derives the unit from the data type. |
| `start` | `String` | Yes | ISO 8601 start of the record. `startDate` is accepted as an alias. |
| `end` | `String` | Yes | ISO 8601 end of the record. For an instantaneous reading use the same value as `start`. `endDate` is accepted as an alias. |

**Callback Response:**

| Key | Type | Description |
| --- | --- | --- |
| `type` | `String` | Always `"writeHealthBridge"`. |
| `success` | `Boolean` | `true` when the record was stored. |

***

### deleteRecords

Deletes records your app previously wrote, by record id. Records written by other apps (or by the
device itself) cannot be deleted.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.HealthBridge.deleteRecords({
  dataType: "steps",
  recordIds: ["b9eadc1d-2bce-4990-9c14-4d976bb29aef"],
  callback: function (response) {
    console.log(response);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { deleteRecords } from "webtonative/HealthBridge";

deleteRecords({
  dataType: "steps",
  recordIds: ["b9eadc1d-2bce-4990-9c14-4d976bb29aef"],
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
| `dataType` | `String` | Yes | The [data type](#data-types) the records belong to. |
| `recordIds` | `String[]` | Yes | Ids of the records to delete, as returned by `read`. |
| `callback` | `Function` | No | Callback function invoked with the delete result. |

**Callback Response:**

| Key | Type | Description |
| --- | --- | --- |
| `type` | `String` | Always `"deleteHealthBridge"`. |
| `success` | `Boolean` | `true` when the records were deleted. |

***

## Putting It Together

A typical flow: check availability, send the user to install or grant access when needed, then read.

```javascript
window.WTN.HealthBridge.isAvailable({
  callback: function (response) {
    if (!response.isAvailable) {
      // Android: Health Connect missing or unsupported — offer to install it.
      window.WTN.HealthBridge.openProvider();
      return;
    }

    window.WTN.HealthBridge.read({
      dataTypes: ["steps"],
      startDate: "2026-08-16T00:00:00Z",
      endDate: "2026-08-17T00:00:00Z",
      limit: 100,
      callback: function (result) {
        if (!result.data || !result.data.steps || !result.data.steps.length) {
          // Nothing came back — most often permission for this type was denied.
          window.WTN.HealthBridge.openProviderSettings();
          return;
        }
        console.log(result.data.steps);
      },
    });
  },
});
```
