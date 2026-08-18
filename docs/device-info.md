# Device Info

The Device Info APIs let you read information about the device and the current state of the native app shell from your web code.

> You'll need to import the javascript file in your website before starting from this [link](https://docs.webtonative.com/javascript-apis/getting-started).

## Get Device Info

Returns details about the device and the installed app, such as the operating system, app version, model, language, time zone, and a unique installation id.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.deviceInfo().then(function (value) {
  console.log(value);
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { deviceInfo } from "webtonative";

deviceInfo().then((value) => {
  console.log(value);
});
```

{% endtab %}
{% endtabs %}

**Response (Android):**

```json
{
  "appId": "com.webtonative.myapp",
  "appVersion": "1",
  "appVersionCode": 1,
  "hardware": "OnePlus/OnePlus3/OnePlus3T:9/PKQ1.***203.001/****042108:user/release-keys",
  "installationId": "d29c4372-****-427b-bbc2-******d549da",
  "installationType": "debug",
  "language": "en",
  "model": "OnePlus ONEPLUS A3003",
  "operator": "Jio 4G",
  "os": "Android",
  "osVersion": "9",
  "platform": "android",
  "timeZone": "Asia/Kolkata"
}
```

**Response (iOS):**

```json
{
  "appId": "com.webtonative.com",
  "appVersion": "1",
  "appVersionCode": "1.1",
  "installationId": "C6A*****-D*69-4**E-8**2-76*****B8B2C",
  "language": "en",
  "model": "Testing iPhone",
  "os": "iOS",
  "osVersion": "15.1",
  "platform": "ios",
  "timeZone": "Asia/Kolkata"
}
```

**Response Fields:**

| Key                | Type             | Description                                                                 |
| ------------------ | ---------------- | --------------------------------------------------------------------------- |
| `appId`            | `String`         | The application bundle / package identifier.                                |
| `appVersion`       | `String`         | The app version name.                                                       |
| `appVersionCode`   | `Number\|String` | The app build / version code.                                               |
| `hardware`         | `String`         | Device hardware fingerprint. **Android only.**                             |
| `installationId`   | `String`         | A unique id generated for this installation of the app.                     |
| `installationType` | `String`         | Build type, e.g. `"debug"` or `"release"`. **Android only.**               |
| `language`         | `String`         | The device language code (e.g. `"en"`).                                     |
| `model`            | `String`         | The device model name.                                                      |
| `operator`         | `String`         | The mobile network operator. **Android only.**                             |
| `os`               | `String`         | The operating system name (`"Android"` or `"iOS"`).                         |
| `osVersion`        | `String`         | The operating system version.                                               |
| `platform`         | `String`         | The platform identifier (`"android"` or `"ios"`).                           |
| `timeZone`         | `String`         | The device time zone (e.g. `"Asia/Kolkata"`).                               |

> **Note:** `hardware`, `installationType`, and `operator` are returned on **Android only** and are not present in the iOS response.

## Get Component Status

Returns the current visibility and state of the native UI components rendered around your web content (sidebar, navigation bars, floating buttons, modals, offer card, etc.), along with the current screen orientation and the WebView URL. Use it to keep your web UI in sync with what the native shell is currently showing.

> **Availability:** Available from **3rd June 2026** on **Android** and **iOS**.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.getComponentStatus({
  callback: function (response) {
    console.log(response);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { getComponentStatus } from "webtonative";

getComponentStatus({
  callback: (response) => {
    console.log(response);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key        | Type       | Required | Description                                                                                              |
| ---------- | ---------- | -------- | -------------------------------------------------------------------------------------------------------- |
| `keys`     | `String[]` | No       | Limit the response to specific sections. Allowed values: `"components"`, `"webView"`. When omitted, all sections are returned. |
| `callback` | `Function` | No       | Callback function invoked with the status response.                                                      |

**Filtering the response with `keys`:**

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.getComponentStatus({
  keys: ["components", "webView"],
  callback: function (response) {
    console.log(response);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { getComponentStatus } from "webtonative";

getComponentStatus({
  keys: ["components", "webView"],
  callback: (response) => {
    console.log(response);
  },
});
```

{% endtab %}
{% endtabs %}

**Callback Response:**

```json
{
  "orientation": "portrait",
  "type": "getComponentStatus",
  "components": {
    "sidebar": {
      "visible": false
    },
    "secondaryNavigation": {
      "visible": true
    },
    "floatingButton": {
      "visible": true
    },
    "topAppBar": {
      "visible": true
    },
    "floatingActionMenu": {
      "visible": true
    },
    "multiPurposeModal": {
      "visible": false
    },
    "offerCard": {
      "visible": false
    },
    "advancedBottomNavigation": {
      "visible": true
    }
  },
  "webView": {
    "currentUrl": "Current URL"
  }
}
```

**Response Fields:**

| Key            | Type     | Description                                                                                  |
| -------------- | -------- | -------------------------------------------------------------------------------------------- |
| `type`         | `String` | Always `"getComponentStatus"`.                                                               |
| `orientation`  | `String` | The current screen orientation (e.g. `"portrait"` or `"landscape"`).                         |
| `components`   | `Object` | The visibility state of each native component. Each entry contains a `visible` boolean.      |
| `webView`      | `Object` | Information about the WebView, including `currentUrl`.                                        |

**Components:**

| Component                  | Type      | Description                                          |
| -------------------------- | --------- | ---------------------------------------------------- |
| `sidebar`                  | `Object`  | Sidebar / drawer. `visible` indicates if it's shown. |
| `secondaryNavigation`      | `Object`  | Secondary navigation bar.                            |
| `floatingButton`           | `Object`  | Floating button.                                     |
| `topAppBar`                | `Object`  | Top app bar.                                         |
| `floatingActionMenu`       | `Object`  | Floating action menu.                                |
| `multiPurposeModal`        | `Object`  | Multi-purpose modal.                                 |
| `offerCard`                | `Object`  | Offer card.                                          |
| `advancedBottomNavigation` | `Object`  | Advanced bottom navigation bar.                      |

> Each component object exposes a `visible` boolean indicating whether that component is currently shown.

**Notes:**

- Works on **Android** and **iOS** for apps built on or after **3rd June 2026**.
- Use the `keys` parameter to request only the sections you need (for example `["components", "webView"]`) to keep responses lightweight.
