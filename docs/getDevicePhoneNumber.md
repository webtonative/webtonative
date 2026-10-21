# Get Device Phone Number

Retrieves a phone number linked to the user's Google account on the device. On Android, this uses Google's Phone Number Hint, which shows a system prompt allowing the user to pick from phone numbers associated with their signed-in Google account(s).

> You'll need to import the javascript file in your website before starting from this [link](https://docs.webtonative.com/javascript-apis/getting-started).

> **Platform support:** Android only.

## Get Device Phone Number

Triggers the Google Phone Number Hint prompt on Android and returns the selected number through the callback.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.getDevicePhoneNumber({
  callback: function (response) {
    console.log(response.phoneNumber);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { getDevicePhoneNumber } from "webtonative";

getDevicePhoneNumber({
  callback: (response) => {
    console.log(response.phoneNumber);
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

| Key           | Type               | Description                                                                                  |
| ------------- | ------------------ | -------------------------------------------------------------------------------------------- |
| `type`        | `String`           | Always `"getDevicePhoneNumber"`.                                                             |
| `success`     | `Boolean`          | `true` if a phone number was selected and retrieved successfully, `false` otherwise.         |
| `phoneNumber` | `String` or `null` | The phone number selected by the user from the Google account hint. `null` on failure.       |
| `error`       | `String` or `null` | `null` on success. Error message describing what went wrong (e.g., user dismissed the hint). |
| `error_code`  | `String` or `null` | `null` on success. A short error code identifying the failure case.                          |

**Example:**

```javascript
window.WTN.getDevicePhoneNumber({
  callback: function (response) {
    if (response.success && response.phoneNumber) {
      console.log("Selected phone number:", response.phoneNumber);
    } else {
      console.error(
        "Failed to get phone number:",
        response.error_code,
        response.error
      );
    }
  },
});
```

**Notes:**

- Works on **Android only**. iOS will not invoke the callback.
- Phone numbers come from the user's **Google account(s) signed in on the device**, not from the SIM. If the user has no phone number linked to their Google account, the hint prompt may show no options.
- The user must explicitly tap a number in the Google hint sheet — if they dismiss the sheet, `success` will be `false`.
- Requires Google Play services on the device.
