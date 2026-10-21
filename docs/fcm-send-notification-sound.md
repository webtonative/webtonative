# Custom Notification Sound via Firebase Cloud Messaging (FCM)

This page covers how to make a push notification play a **custom sound** when you send it directly through the **Firebase Cloud Messaging HTTP v1 API**, as an alternative to sending through OneSignal.

> This is the FCM-specific half of custom sound support. Before sending anything below, your app must already have the sound file uploaded via the Dashboard and working with [`Sound.play`](os-notification-sound.md) — FCM only tells the OS *which* uploaded sound to play, it does not deliver the sound file itself. See [OS Notification Sound](os-notification-sound.md) for how to upload the file for your Android/iOS app.

> If you send pushes through the **OneSignal Dashboard** instead of calling FCM directly, use [Custom Notification Sound via OneSignal](onesignal-custom-notification-sound.md) instead — this page is for apps/backends that call the FCM API directly.

***

## Endpoint

```
POST https://fcm.googleapis.com/v1/projects/{project_id}/messages:send
Authorization: Bearer {OAuth2_access_token}
Content-Type: application/json
```

***

## How Sound Works Per Platform

- **iOS**: the native APNs payload has a real `sound` field (`apns.payload.aps.sound`). Set it to the sound's filename **with extension** (e.g. `custom_notify.wav`/`.caf`), matching what you uploaded for iOS. Use `"default"` for the system sound.
- **Android**: FCM has **no native sound field**. The sound actually played is whichever sound is attached to the **Notification Channel** the notification is delivered on — so for Android, "setting the sound" really means routing the notification to the right channel, either via the native `android.notification.channel_id` field, or by sending the sound name through `data` and having your app code build the notification on that channel itself. Both approaches are shown below.

***

## Payload Structure

```jsonc
{
  "message": {
    "token": "eH3kP9vQxT2:APA91bF7sN4dR8mLzYcW1oJpX6qKvA0uZtG3nBhMwEsRfCiVdT5jHkOlPmNq",
    "android": {
      "priority": "high",
      "notification": {
        "channel_id": "high" // Android: routes to a channel that already has the custom sound attached — see "Android: Channel-Based Sound" below
      }
    },
    "apns": {
      "headers": {
        "apns-priority": "10"
      },
      "payload": {
        "aps": {
          "alert": {
            "title": "Your order has shipped",
            "body": "Order #48213 is on its way and will arrive by Thursday."
          },
          "sound": "custom_notify.wav", // iOS: native APNs sound, played by the OS when the app is backgrounded/killed
          "mutable-content": 1
        }
      }
    },
    "data": {
      "title": "Your order has shipped",
      "body": "Order #48213 is on its way and will arrive by Thursday.",
      "sound": "custom_notify", // Android: sound key your app code reads if you're building the notification yourself instead of using android.notification.channel_id
      "channel_id": "high"
    }
  }
}
```

***

## Field Reference

### `message` (object, required)

Root wrapper for the entire notification request. FCM requires exactly one target field inside it — here it's `token`.

| Field | Type | Description |
| --- | --- | --- |
| `token` | string | The FCM registration token of the target device. Identifies the single device/app instance to receive the message. |

***

### `android.notification.channel_id` — Channel-Based Sound (Recommended for Android)

| Field | Type | Description |
| --- | --- | --- |
| `channel_id` | string | The ID of an Android Notification Channel that **already exists on the device** with your custom sound attached (created via `NotificationManager.createNotificationChannel()` in your Android app code). FCM applies this channel automatically — no app code needed to read it. |

If the channel doesn't already exist on the device, Android falls back to a default channel and plays the default sound.

***

### `data.sound` / `data.channel_id` — App-Handled Sound (Alternative for Android)

Use this instead of `android.notification.channel_id` only if your app already builds notifications manually in code (custom rendering, rich media, etc.) rather than relying on FCM's auto-displayed notification.

| Field | Type | Description |
| --- | --- | --- |
| `sound` | string | Sound resource identifier your own app code reads to pick a sound or channel when constructing the notification. **Not applied automatically** by FCM/Android — your app must read `data.sound` itself. |
| `channel_id` | string | Target Android Notification Channel ID. Like `sound`, this sits in the custom `data` block, so it is *not* auto-applied — your app code must read this value and pass it explicitly (e.g. `NotificationCompat.Builder(context, channelId)`) when building the notification. |

> **All `data` values must be strings.** FCM rejects numbers/booleans in `data` — send `"1"`/`"true"` instead.

***

### `apns.payload.aps.sound` — iOS Sound

Native Apple Push payload (`aps` dictionary), passed through unmodified by FCM to APNs.

| Field | Type | Description |
| --- | --- | --- |
| `sound` | string | Name of a custom sound file uploaded for the app (e.g. `custom_notify.caf`/`.wav`), matching what's uploaded per [OS Notification Sound](os-notification-sound.md). Played natively by APNs when the app is backgrounded or killed. Use `"default"` for the system sound. |
| `mutable-content` | int (0/1) | When `1`, allows a Notification Service Extension to intercept and modify the notification before display. Not required just for a custom sound — only needed if you're also modifying content (e.g. downloading media). |

***

### `apns.headers.apns-priority`

| Field | Type | Description |
| --- | --- | --- |
| `apns-priority` | string | `"10"` = send immediately — **required** for a notification with a custom sound to actually play it; `"5"` delivers silently in the background with no sound/alert. |

***

## Sample cURL Request

```bash
curl -X POST "https://fcm.googleapis.com/v1/projects/YOUR_PROJECT_ID/messages:send" \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "token": "eH3kP9vQxT2:APA91bF7sN4dR8mLzYcW1oJpX6qKvA0uZtG3nBhMwEsRfCiVdT5jHkOlPmNq",
      "android": {
        "priority": "high",
        "notification": { "channel_id": "high" }
      },
      "apns": {
        "headers": { "apns-priority": "10" },
        "payload": {
          "aps": {
            "alert": { "title": "Your order has shipped", "body": "Order #48213 is on its way and will arrive by Thursday." },
            "sound": "custom_notify.wav",
            "mutable-content": 1
          }
        }
      },
      "data": {
        "title": "Your order has shipped",
        "body": "Order #48213 is on its way and will arrive by Thursday.",
        "sound": "custom_notify",
        "channel_id": "high"
      }
    }
  }'
```

***

## Implementation Checklist

* [ ] Sound file uploaded for the Android/iOS app per [OS Notification Sound](os-notification-sound.md)
* [ ] Android: a Notification Channel created on-device (via app code) with the custom sound attached, and its ID passed as `android.notification.channel_id`
* [ ] iOS: `apns.payload.aps.sound` set to the exact uploaded filename, with extension
* [ ] `apns.headers.apns-priority` set to `"10"` (a custom sound will not play at priority `"5"`)
* [ ] Sent a real test push to a physical device on each platform to confirm the sound plays (simulators are unreliable for custom sounds on iOS)

***

## Frequently Asked Questions

<details>

<summary>Why does my custom sound not play on Android even though I set `data.sound`?</summary>

`data` is a custom payload — Android/FCM never reads it automatically. Either use `android.notification.channel_id` pointing at a channel that already has your sound attached (so FCM applies it for you), or read `data.sound`/`data.channel_id` yourself in app code when constructing the notification.

</details>

<details>

<summary>Why does my custom sound not play on iOS?</summary>

Check two things: `apns.payload.aps.sound` must exactly match the uploaded filename including its extension, and `apns-priority` must be `"10"` — at `"5"` iOS delivers the notification silently with no sound regardless of what's in `sound`.

</details>

<details>

<summary>I changed the Android channel's sound but existing users still hear the old one — why?</summary>

This is an Android OS restriction, not an FCM one — a Notification Channel's sound is fixed the first time it's created on a device and can't be changed afterward. Create a new channel ID with the new sound and point `channel_id` at that instead of editing the old channel.

</details>

<details>

<summary>Should I send through FCM directly or through OneSignal?</summary>

If you're already sending pushes through the OneSignal Dashboard, use [Custom Notification Sound via OneSignal](onesignal-custom-notification-sound.md) — it's simpler and needs no backend code. Use this FCM page only if your backend calls the FCM API directly instead of going through OneSignal.

</details>

***

## Official Documentation References

- [FCM HTTP v1 API — Send Messages](https://firebase.google.com/docs/cloud-messaging/send-message) — overview of building and sending messages via the v1 API.
- [`projects.messages.send` REST Reference](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages/send) — full request/response schema for the `messages:send` endpoint.
- [`ApnsConfig` Reference](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#apnsconfig) — schema for the `apns` block (`headers`, `payload`).
- [Apple: Generating a Remote Notification (`aps` payload)](https://developer.apple.com/documentation/usernotifications/generating-a-remote-notification) — canonical spec for `alert`, `sound`, `mutable-content`, and other `aps` keys.
- [Create and Manage Notification Channels (Android)](https://developer.android.com/develop/ui/views/notifications/channels) — `NotificationManager.createNotificationChannel()` and channel importance/sound behavior.
