# Android TV Remote (D-Pad) Handling

When your app runs on an Android TV device, users navigate with a remote control (D-Pad) instead of touch. WebToNative's Smart TV Support add-on forwards every remote button press into your website as a JavaScript function call, so your site can react to it — highlight the next focusable element, trigger a "select" action, respond to media transport buttons, and so on.

Unlike the other bridges in these docs, this is not something your website calls — it's a contract in the other direction: **your website defines a global function, and the native app calls it** whenever the user presses a remote key.

> You'll need to import the javascript file in your website before starting from this [link](https://docs.webtonative.com/javascript-apis/getting-started).

> **Platform support:** Android only. This add-on has no iOS/tvOS equivalent — `handleKeyEvent` is never called on iOS.

***

## How It Works

1. Enable **Smart TV Support** in the WebToNative dashboard (see [Setup](#setting-up-smart-tv-support) below).
2. On your website, define a global `window.handleKeyEvent(key)` function.
3. When the app is running on a device the SDK detects as Android TV, every remote button press is checked against `typeof handleKeyEvent === 'function'`. If your function exists, it's called with a string identifying the key (see [Key Values](#key-values) below).

{% hint style="danger" %}
**Your website cannot block or "consume" a key press.** The native side does not look at anything `handleKeyEvent` returns. For the navigation keys (`UP`, `DOWN`, `LEFT`, `RIGHT`, `CENTER`, `HOME`, `MENU`, `ENTER`, `INFO`), the native app **always** additionally re-dispatches the raw key event into the WebView right after calling `handleKeyEvent`, to move DOM focus between focusable elements. You can react to these keys (e.g. play a sound, update some UI state) but you cannot prevent the underlying focus movement from also happening. The media transport keys (`PLAY`, `PAUSE`, `STOP`, `NEXT`, `PREVIOUS`) are the exception — see the note below.
{% endhint %}

***

## Setting Up Smart TV Support

1. Go to your **WebToNative dashboard** → **Add-ons** → **Smart TV Support** and enable it.
2. No credentials are required — once enabled, the behavior described on this page is active automatically whenever the app is running on a device detected as Android TV.

{% hint style="info" %}
Detection is automatic: the SDK checks the device's `UiModeManager` for TV mode and for the Android TV "leanback" feature. You don't need to detect Android TV yourself in JavaScript before defining `handleKeyEvent` — just define it, and it will simply never be called on a phone/tablet.
{% endhint %}

***

## Defining `handleKeyEvent`

Define this function anywhere on your page, before the user starts interacting with the remote (e.g. on page load):

```javascript
window.handleKeyEvent = function (key) {
  switch (key) {
    case "UP":
    case "DOWN":
    case "LEFT":
    case "RIGHT":
      // Optional: react to directional movement (e.g. play a focus sound).
      // The app also moves DOM focus for you automatically — you don't need
      // to move focus yourself for these four keys.
      break;
    case "CENTER":
    case "ENTER":
      // The user pressed select/OK on the currently focused element.
      document.activeElement?.click?.();
      break;
    case "HOME":
    case "MENU":
    case "INFO":
      // React to these as your UI needs.
      break;
    case "PLAY":
      videoElement.play();
      break;
    case "PAUSE":
      videoElement.pause();
      break;
    case "STOP":
      videoElement.pause();
      videoElement.currentTime = 0;
      break;
    case "NEXT":
      playNextInPlaylist();
      break;
    case "PREVIOUS":
      playPreviousInPlaylist();
      break;
  }
};
```

**Parameters passed to your function:**

| Key | Type | Description |
| --- | --- | --- |
| `key` | `String` | The remote button pressed. See [Key Values](#key-values) below. |

Your function has no meaningful return value — nothing reads it.

***

## Key Values

| Value | Remote Button | Native fallback behavior |
| --- | --- | --- |
| `UP` | D-Pad Up | Always also moves DOM focus upward, in addition to calling `handleKeyEvent`. |
| `DOWN` | D-Pad Down | Always also moves DOM focus downward, in addition to calling `handleKeyEvent`. |
| `LEFT` | D-Pad Left | Always also moves DOM focus left, in addition to calling `handleKeyEvent`. |
| `RIGHT` | D-Pad Right | Always also moves DOM focus right, in addition to calling `handleKeyEvent`. |
| `CENTER` | D-Pad Center / Select | Also re-dispatched to the WebView for native focus handling — see the warning above. |
| `HOME` | Home | Also re-dispatched to the WebView. |
| `MENU` | Menu | Also re-dispatched to the WebView. |
| `ENTER` | Enter | Also re-dispatched to the WebView. |
| `INFO` | Info | Also re-dispatched to the WebView. |
| `PLAY` | Media Play/Pause (while paused) | **Not** re-dispatched — your website is fully responsible for handling it. If `handleKeyEvent` isn't defined, the user sees a "Media Player not working" toast and nothing happens. |
| `PAUSE` | Media Play/Pause (while playing) | Same as `PLAY` — not re-dispatched, fully your responsibility. |
| `STOP` | Media Stop | Same as `PLAY` — not re-dispatched, fully your responsibility. |
| `NEXT` | Media Next Track | Not re-dispatched. No fallback toast if undefined — it's simply a no-op. |
| `PREVIOUS` | Media Previous Track | Not re-dispatched. No fallback toast if undefined — it's simply a no-op. |

{% hint style="warning" %}
**`PLAY`, `PAUSE`, and `STOP` are only forwarded to `handleKeyEvent` if the separate Custom Media Player add-on is disabled.** If you also have WebToNative's Custom Media Player add-on enabled, those three keys are intercepted by the native custom player instead, and your `handleKeyEvent` never receives them at all. Disable Custom Media Player if you need to handle transport controls yourself in JavaScript.
{% endhint %}

### Keys That Never Reach `handleKeyEvent`

| Remote Button | What happens instead |
| --- | --- |
| Back | Handled entirely natively as the app's back-navigation action. Never forwarded to JavaScript. |
| Voice/Assistant button | Natively launches Google Assistant. Never forwarded to JavaScript. |

***

## Related: Volume Keys

Volume buttons are a **separate** feature from D-Pad handling, with its own dashboard toggle and its own callback name — don't confuse the two:

```javascript
window.volumeEventCallback = function (event) {
  // event is "VOLUME_UP_PRESSED" or "VOLUME_DOWN_PRESSED"
  console.log(event);
};
```

***

## Implementation Checklist

### WebToNative Dashboard

* [ ] Smart TV Support add-on enabled
* [ ] Custom Media Player add-on left disabled if you want `PLAY` / `PAUSE` / `STOP` delivered to `handleKeyEvent`

### Your Website

* [ ] Imported the [WebToNative JavaScript bridge](https://docs.webtonative.com/javascript-apis/getting-started)
* [ ] Defined `window.handleKeyEvent(key)` before the user can interact with the remote
* [ ] Handled `PLAY`, `PAUSE`, `STOP`, `NEXT`, `PREVIOUS` explicitly — these have no native fallback
* [ ] Not relying on `handleKeyEvent` to block/prevent navigation for `UP`/`DOWN`/`LEFT`/`RIGHT`/`CENTER`/`HOME`/`MENU`/`ENTER`/`INFO` — the native focus movement always happens regardless
* [ ] Defined `window.volumeEventCallback(event)` separately, if you also need to react to volume button presses

***

## Frequently Asked Questions

<details>

<summary>Why is `handleKeyEvent` never called on my device?</summary>

Two things are required: the Smart TV Support add-on must be enabled in the WebToNative dashboard, and the device must be detected as Android TV (TV UI mode or the "leanback" feature). On a regular phone or tablet — or on iOS — `handleKeyEvent` is never called.

</details>

<details>

<summary>Can I prevent the D-Pad from moving focus to the next element?</summary>

No, not for the navigation keys (`UP`, `DOWN`, `LEFT`, `RIGHT`, `CENTER`, `HOME`, `MENU`, `ENTER`, `INFO`). The native app calls `handleKeyEvent` (if defined) and then unconditionally re-dispatches the key event for native focus handling — there's no way to intercept or cancel that from JavaScript today.

</details>

<details>

<summary>Why did the user see a "Media Player not working" message?</summary>

That toast only appears for the media transport keys (`PLAY`, `PAUSE`, `STOP`) when `window.handleKeyEvent` isn't defined at all. Define the function and handle those key values to remove it.

</details>

<details>

<summary>I pressed Play/Pause/Stop but nothing happened in my JavaScript function.</summary>

Check whether the Custom Media Player add-on is also enabled — if it is, those three keys are consumed by the native custom player before they ever reach `handleKeyEvent`.

</details>

<details>

<summary>Does pressing Back on the remote trigger `handleKeyEvent`?</summary>

No. Back is handled entirely by the app's native back-navigation logic and is never forwarded to JavaScript, regardless of whether `handleKeyEvent` is defined.

</details>

<details>

<summary>Is there an equivalent for tvOS / Apple TV?</summary>

No. This feature is Android TV-only. There is currently no Siri Remote / tvOS equivalent in WebToNative.

</details>
