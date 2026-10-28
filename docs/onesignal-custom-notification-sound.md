# Custom Notification Sound via OneSignal

This page covers how to make a push notification play a **custom sound** when it's sent through the **OneSignal Dashboard**, instead of the device's default notification sound.

> This is the OneSignal-specific half of custom sound support. Before using this page, your app must already have the sound file uploaded via the Dashboard and working with [`Sound.play`](os-notification-sound.md) — OneSignal only tells the OS *which* uploaded sound to play, it does not deliver the sound file itself. See [OS Notification Sound](os-notification-sound.md) for how to upload the file for your Android/iOS app.

> **Platform support:** Android and iOS, both from the OneSignal Dashboard — no JavaScript call is involved on this page. The WebToNative JS OneSignal module (`webtonative/OneSignal`) covers player ID/tags/triggers, not sound; sound is set entirely from OneSignal's own composer and settings screens.

***

## How It Works

- **iOS**: the Dashboard's Sound field takes the sound's filename **with its extension** (e.g. `custom_notify.wav`), matching exactly what you uploaded for iOS.
- **Android**: the Dashboard's Sound field takes the sound's resource name **without extension** (e.g. `custom_notify`, for a file uploaded as `custom_notify.mp3`/`.wav`), and the sound is tied to whichever **Notification Channel** you select alongside it.
- The sound file itself is never uploaded to OneSignal directly — it must already exist in the app (uploaded per [OS Notification Sound](os-notification-sound.md)). These OneSignal composer/settings fields just reference it by name.

***

## Setting Sound on a Single Notification

1. Log in to the [OneSignal Dashboard](https://dashboard.onesignal.com/).
2. Select the correct **App** from the app switcher.
3. Go to **Messages → New Push**.
4. Compose the notification (title, body, audience) as usual.
5. Expand **Delivery → Advanced Options** (or **Platform-specific settings**, depending on your dashboard version).
6. Under **iOS Settings**:
   - Locate the **Sound** field.
   - Enter the exact sound filename with extension (e.g. `custom_notify.wav`).
   - Leave it blank to use the system default sound.
7. Under **Android Settings**:
   - Locate the **Sound** field.
   - Enter the resource name without extension (e.g. `custom_notify`).
   - Locate the **Notification Channel** dropdown and select (or create) the channel that has this sound configured — see [Notification Channels (Android)](#notification-channels-android) below.
8. Send or schedule the notification.

***

## Notification Channels (Android)

Android notification sounds are tied to a **Notification Channel**, and a channel's sound **cannot be changed after it's created** on a user's device — this is an Android OS restriction, not a OneSignal limitation.

1. In the Dashboard, go to **Settings → Notification Channels** (or the Android platform settings panel).
2. If you need to change the sound for an existing channel, **create a new channel** (e.g. `custom_channel_v2`) instead of editing the old one — reusing an existing channel ID with a new sound will not take effect on devices that already have that channel installed.
3. Assign the desired sound resource to the new channel.
4. Reference this channel from the composer ([Setting Sound on a Single Notification](#setting-sound-on-a-single-notification), step 7) or set it as the default in app settings.

***

## Verification Checklist

- [ ] The sound file is already uploaded per [OS Notification Sound](os-notification-sound.md), before configuring anything here.
- [ ] iOS Sound field includes the file extension; Android Sound field does not.
- [ ] Android: correct Notification Channel selected/created for the sound.
- [ ] Sent a test push from the Dashboard to a real device to confirm the sound plays (simulators are unreliable for custom sounds on iOS).
- [ ] Left the Sound field blank where the system default is intended, to avoid accidental overrides.

***

## Frequently Asked Questions

<details>

<summary>I set the sound but the default notification sound plays instead — why?</summary>

The most common cause is the filename being entered incorrectly for the platform — remember iOS needs the extension (`custom_notify.wav`) and Android does not (`custom_notify`). Double-check it matches exactly what you uploaded per [OS Notification Sound](os-notification-sound.md).

</details>

<details>

<summary>My new sound works for fresh installs but not for existing users — why?</summary>

On Android, a Notification Channel's sound is locked in the first time it's created on a device and can't be changed afterward. If you changed the sound on an existing channel, existing users keep hearing the old sound. Create a new channel ID with the new sound and reference that instead — see [Notification Channels (Android)](#notification-channels-android).

</details>

***

## Common Pitfalls

| Symptom | Likely Cause |
| --- | --- |
| Custom sound never plays, default plays instead | Filename entered incorrectly (extension included/excluded incorrectly for the platform) |
| Works for new installs, not for existing users after a change | Android channel sound is locked in — create a new channel and select it instead of editing the old one |