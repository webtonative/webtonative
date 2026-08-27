# Haptic Feedback

Functions to trigger haptic feedback effects on the device and to check whether haptic feedback is supported. Haptic effects use predefined vibration patterns that help users recognize the significance of different interactions.

> You'll need to import the javascript file in your website before starting from this [link](https://docs.webtonative.com/javascript-apis/getting-started).

## Trigger

Triggers a haptic feedback effect on the device. If `effect` is omitted or an invalid value is provided, a default effect is applied. Optionally, pass `soundName` to also play a custom sound (uploaded via the Dashboard) at the same time — see [OS Notification Sound](os-notification-sound.md) for how to upload a sound file and the full rules for this parameter.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.Haptics.trigger({
  effect: "impactMedium",
  soundName: "your_sound_name", // optional — see OS Notification Sound
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { trigger } from "webtonative/Haptics";

trigger({
  effect: "impactMedium",
  soundName: "your_sound_name", // optional — see OS Notification Sound
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key      | Type     | Required | Description                                                  |
| -------- | -------- | -------- | ------------------------------------------------------------ |
| `effect` | `String` | No       | The vibration pattern to play. See the supported values below. |
| `soundName` | `String` | No | Name of an uploaded sound file to play alongside the haptic effect. See [OS Notification Sound](os-notification-sound.md#javascript-api-reference) for upload rules and behavior — omit it to trigger the haptic effect only. |

**Supported `effect` values:**

| Value                 | Description                                              |
| --------------------- | -------------------------------------------------------- |
| `impactLight`         | A light impact, suitable for small UI interactions.      |
| `impactMedium`        | A medium impact, suitable for standard UI interactions.  |
| `impactHeavy`         | A heavy impact, suitable for prominent UI interactions.  |
| `notificationSuccess` | Indicates a successful action or outcome.                |
| `notificationWarning` | Indicates a warning or cautionary state.                 |
| `notificationError`  | Indicates an error or failed action.                     |

***

## Is Haptic Supported

Checks whether the device supports haptic feedback.

> This function is currently only available on **Android**. On iOS the callback will not be invoked.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.Haptics.isHapticSupported({
  callback: function (response) {
    console.log(response.isSupported);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { isHapticSupported } from "webtonative/Haptics";

isHapticSupported({
  callback: (response) => {
    console.log(response.isSupported);
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

| Key           | Type      | Description                                                  |
| ------------- | --------- | ------------------------------------------------------------ |
| `type`        | `String`  | Always `"isHapticSupported"`.                                |
| `isSupported` | `Boolean` | `true` if the device supports haptic feedback, `false` otherwise. |
