# Defer Notification

Functions to register the app for push notifications and to clear notifications from the device's notification tray.

> You'll need to import the javascript file in your website before starting from this [link](https://docs.webtonative.com/javascript-apis/getting-started).

## Register Notification

Registers the app for push notifications and returns the user's permission status along with the OneSignal player ID and Firebase token.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.registerNotification({
  callback: function (response) {
    console.log(response.permissionStatus);
    console.log(response.oneSignalPlayerId);
    console.log(response.firebaseToken);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { registerNotification } from "webtonative";

registerNotification({
  callback: (response) => {
    console.log(response.permissionStatus);
    console.log(response.oneSignalPlayerId);
    console.log(response.firebaseToken);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key        | Type       | Required | Description                                  |
| ---------- | ---------- | -------- | -------------------------------------------- |
| `callback` | `Function` | No       | Callback function invoked with the response. |

**Callback Response:**

| Key                 | Type     | Description                                                       |
| ------------------- | -------- | ----------------------------------------------------------------- |
| `type`              | `String` | Always `"registerNotification"`.                                  |
| `permissionStatus`  | `String` | The notification permission status: `"ALLOWED"` or `"NOT_ALLOWED"`. |
| `oneSignalPlayerId` | `String` | The OneSignal player ID for this device.                          |
| `firebaseToken`     | `String` | The Firebase Cloud Messaging token for this device.               |

***

## Remove All Notifications

Removes all currently displayed push notifications for the app from the device's notification tray/center.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.removeAllNotifications({
  callback: function (response) {
    console.log(response.isSuccess);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { removeAllNotifications } from "webtonative";

removeAllNotifications({
  callback: (response) => {
    console.log(response.isSuccess);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key        | Type       | Required | Description                                  |
| ---------- | ---------- | -------- | -------------------------------------------- |
| `callback` | `Function` | No       | Callback function invoked with the response. |

**Callback Response:**

| Key         | Type                | Description                                                               |
| ----------- | ------------------- | ------------------------------------------------------------------------- |
| `type`      | `String`            | Always `"removeAllNotifications"`.                                        |
| `isSuccess` | `Boolean`           | `true` if all notifications were removed successfully, `false` otherwise. |
| `error`     | `String` or `null`  | `null` on success. Error message describing what went wrong on failure.   |

**Example:**

```javascript
window.WTN.removeAllNotifications({
  callback: function (response) {
    if (response.isSuccess) {
      console.log("All notifications removed successfully.");
    } else {
      console.error("Failed to remove notifications:", response.error);
    }
  },
});
```
