# OS Notification Sound

Lets your app play a **custom sound** — uploaded once via the **WebToNative Dashboard** — on demand from your website's JavaScript, and reuses that same sound as an [in-app haptic accompaniment](haptics.md). This is a *local* sound trigger: your JavaScript decides when it plays. It is separate from (but works alongside) a *remote push notification* playing a custom sound automatically when it arrives — see [Custom Notification Sound via OneSignal](onesignal-custom-notification-sound.md) and [Custom Notification Sound via Firebase Cloud Messaging (FCM)](fcm-send-notification-sound.md) for that.

> You'll need to import the javascript file in your website before starting from this [link](https://docs.webtonative.com/javascript-apis/getting-started).

> **Platform support:** Android and iOS.

***

## How It Works

One uploaded sound file can be used in three different places, and all three reference it **by the same name**:

1. **`Sound.play(soundName)`** — plays it immediately, triggered directly from your JavaScript (e.g. a chat "message sent" ping, a game effect).
2. **`Haptics.trigger({ effect, soundName })`** — plays it alongside a haptic vibration effect, in one call. See [Haptic Feedback](haptics.md).
3. **A remote push notification** — OneSignal or FCM tells the OS to play it automatically when a push arrives. This requires a file with the *exact same name* to already be uploaded per this page — see [OneSignal](onesignal-custom-notification-sound.md) / [FCM](fcm-send-notification-sound.md) for the sending side.

The sound file itself is never sent from your JavaScript or from a push payload — only its **name** is. It must already be uploaded to your app via the Dashboard before you reference it from any of the three places above.

***

## 1. Uploading the Sound File (Dashboard)

Go to your **WebToNative Dashboard → Add-ons → Notification → OS Notification Sound** and upload the sound file under the platform's sound setting. Android and iOS each have their **own separate upload field** — uploading for one platform does not make the file available on the other, so upload the same audio to both fields if you want consistent behavior across platforms.

- **Reference name:** the name you pass to `Sound.play` / `soundName` is derived from the uploaded file's name, minus its extension.
- **Format:** only `.mp3` and `.wav` files can be uploaded — these are the only supported formats on both platforms.
- **Extension:** `.mp3` is the default — if you call `Sound.play("your_sound_name")` **without an extension**, `.mp3` is assumed automatically, so you don't need to pass anything if you uploaded an `.mp3` file. If you uploaded a `.wav` file, you must pass the extension explicitly — `Sound.play("your_sound_name.wav")` — or the lookup will assume `.mp3` and fail to find it.

> Changes take effect on your app's next build — if you're testing on a device already running an older build, rebuild/reinstall after uploading a new or changed sound file.

***

## JavaScript API Reference

### Sound.play

Plays an uploaded sound immediately.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.Sound.play("your_sound_name");
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { play } from "webtonative/Sound";

play("your_sound_name");
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `soundName` | `String` | Yes | Name of the uploaded sound file, with or without extension (see [Uploading the Sound File](#1.-uploading-the-sound-file-dashboard)). If no extension is given, `.mp3` is assumed. |

This function does not take a `callback` — it is fire-and-forget, with no response to read. If the named sound isn't found or fails to play, it fails **silently** on both platforms — see [Troubleshooting](#troubleshooting) below.

***

### Haptics.trigger with a sound

`Haptics.trigger` also accepts an optional `soundName`, so one call can trigger a haptic effect and an uploaded sound together. Full parameter/effect reference lives on the [Haptic Feedback](haptics.md) page — this is the sound-specific addition to that same function.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.Haptics.trigger({
  effect: "impactMedium",
  soundName: "your_sound_name",
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { trigger } from "webtonative/Haptics";

trigger({
  effect: "impactMedium",
  soundName: "your_sound_name",
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `effect` | `String` | No | The vibration pattern to play. See [Haptic Feedback](haptics.md#trigger) for supported values. |
| `soundName` | `String` | No | Name of an uploaded sound file to play alongside the haptic effect, using the exact same lookup rules as [`Sound.play`](#sound.play) above. Omit it to trigger the haptic effect only. |

> Internally this plays the sound through the same path as `Sound.play` — there's no behavioral difference between calling `Sound.play("x")` directly versus passing `soundName: "x"` here, other than the haptic effect firing at the same time.

***

## Common Patterns

### Playing a Sound Only on Notification-Relevant Actions

Reserve `Sound.play` for actions that should feel like a native alert (message received in an open chat, item added to cart) rather than every UI tap — pair it with a haptic effect for actions that also warrant one:

```javascript
import { play } from "webtonative/Sound";
import { trigger } from "webtonative/Haptics";

function onChatMessageReceived() {
  // Sound only — this happens often, a haptic on every message would be excessive
  play("chat_ping");
}

function onOrderConfirmed() {
  // Sound + haptic together — a rarer, higher-significance event
  trigger({
    effect: "notificationSuccess",
    soundName: "order_confirmed",
  });
}
```

***

## Troubleshooting

- **Nothing plays, no error in the console:** this is expected if the sound isn't found — both platforms fail silently with no callback to JavaScript. Double-check that the file was uploaded to the correct platform's field on the Dashboard, that you've rebuilt/reinstalled since uploading, and that the name (and extension, if you passed one) matches exactly — see [Uploading the Sound File](#1.-uploading-the-sound-file-dashboard).

***

## Frequently Asked Questions

<details>

<summary>Do I need to enable an add-on on the WebToNative Dashboard to use this?</summary>

Yes — you need to add the **OS Notification Sound** add-on from WebToNative. Once it's added, you can upload your sound file under **OS Notification Sound**, in the **Notification** section of **Add-ons**, for each platform you want it on. The JavaScript bridge works as soon as it's imported as usual.

</details>

<details>

<summary>Can I use the same sound file for `Sound.play`, `Haptics.trigger`, and a push notification?</summary>

Yes — upload it once per platform via the Dashboard, and reference it by the same name from all three. For the push notification side, the platform-specific dashboard/API fields have their own naming conventions (extension required on iOS, omitted on Android) — see [OneSignal](onesignal-custom-notification-sound.md) and [FCM](fcm-send-notification-sound.md).

</details>

<details>

<summary>What audio formats are supported?</summary>

Only `.mp3` and `.wav` — these are the only formats you can upload, on either platform. `.mp3` is assumed by default if you don't pass an extension in `Sound.play`; for `.wav`, pass the extension explicitly.

</details>

<details>

<summary>Why did I get `PERMANENTLY_BLOCKED` or no sound after asking for notification permission?</summary>

That's unrelated to this page — `Sound.play`/`Haptics.trigger` play immediately from JavaScript and don't require notification permission at all. Notification permission only affects whether the OS shows/plays a *remote push* automatically; see [Permission](permission.md) for permission handling, and [OneSignal](onesignal-custom-notification-sound.md)/[FCM](fcm-send-notification-sound.md) for push-specific sound setup.

</details>