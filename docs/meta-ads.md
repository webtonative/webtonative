# Meta Ads (Audience Network)

Functions to display [Meta Audience Network](https://www.facebook.com/business/help/audience-network) ads — banner, fullscreen (interstitial), and rewarded video — inside your app. The WebToNative Meta Ads plugin integrates the native Meta Audience Network Android and iOS SDKs, so ad requests, rendering, and lifecycle events all happen natively, and are reported back to your website through a JavaScript callback.

> You'll need to import the javascript file in your website before starting from this [link](https://docs.webtonative.com/javascript-apis/getting-started).

> **Platform support:** Android and iOS. `setMetaAdsTestMode` currently only has an effect on Android — see the note under [setMetaAdsTestMode](#setmetaadstestmode).

***

## Setting Up Meta Audience Network

### 1. Create Your Audience Network Placements

1. Sign in to [Meta Audience Network](https://www.facebook.com/audiencenetwork) via your Facebook Business account.
2. Add your app under **Apps** and create one **Placement** per ad unit you want to show — one for your banner, one for your fullscreen/interstitial, one for your rewarded video (placement IDs differ by ad format, e.g. an image-format ID can't be used for a rewarded video slot).
3. Copy your **Facebook App ID** and the **Placement ID** for each placement you created.

### 2. Enable the Add-on in WebToNative

1. Go to your **WebToNative dashboard** → **Add-ons** → **Meta Ads** and enable it.
2. Enter your **Facebook App ID** (Android also requires a **Client Token**, iOS also requires a **Client Token** — both are found on the same Meta for Developers app dashboard as your App ID). WebToNative wires these into the platform-specific native config (`facebook_app_id` on Android, `FacebookAppID`/`FacebookClientToken` in `Info.plist` on iOS) for you — you don't set these from JavaScript.

{% hint style="warning" %}
**Android also requires at least one Placement Rule saved in the dashboard add-on, even if you only intend to trigger ads manually from JavaScript.** If the add-on is disabled, or enabled with zero placement rules configured, every `WTN.MetaAds.*` call below silently does nothing — no callback fires at all. Enter at least one placement (it doesn't have to be the one you actually trigger manually) to make the bridge available. iOS does not have this extra requirement — enabling the add-on and setting the App ID/Client Token is enough.
{% endhint %}

***

## JavaScript API Reference

### showMetaBannerAd

Displays a banner ad docked to the top or bottom of the screen.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.MetaAds.showMetaBannerAd({
  placementId: "YOUR_BANNER_PLACEMENT_ID",
  position: "BOTTOM",
  callback: function (response) {
    console.log(response);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { showMetaBannerAd } from "webtonative/MetaAds";

showMetaBannerAd({
  placementId: "YOUR_BANNER_PLACEMENT_ID",
  position: "BOTTOM",
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
| `placementId` | `String` | Yes | The Audience Network Placement ID for this banner, from the Meta Audience Network dashboard. |
| `position` | `String` | No | Where to dock the banner — `"TOP"` or `"BOTTOM"`. Defaults to `"BOTTOM"`. |
| `callback` | `Function` | No | Function invoked with every ad lifecycle event. See [Callback Response Format](#callback-response-format). |

{% hint style="warning" %}
**`position` is case-sensitive and only accepts uppercase `"TOP"` / `"BOTTOM"`.** Passing `"top"` or `"bottom"` in lowercase does not match on either platform and silently falls back to the bottom position.
{% endhint %}

***

### showMetaFullscreenAd

Displays a fullscreen interstitial ad over your app.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.MetaAds.showMetaFullscreenAd({
  placementId: "YOUR_INTERSTITIAL_PLACEMENT_ID",
  callback: function (response) {
    console.log(response);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { showMetaFullscreenAd } from "webtonative/MetaAds";

showMetaFullscreenAd({
  placementId: "YOUR_INTERSTITIAL_PLACEMENT_ID",
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
| `placementId` | `String` | Yes | The Audience Network Placement ID for this interstitial (must be a video- or image-format placement created for this slot). |
| `callback` | `Function` | No | Function invoked with every ad lifecycle event. See [Callback Response Format](#callback-response-format). |

***

### showMetaRewardedAd

Displays a rewarded video ad. The user watches the full video in exchange for an in-app reward you grant yourself — the SDK only tells you the video was **completed**, it does not grant anything on your behalf.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.MetaAds.showMetaRewardedAd({
  placementId: "YOUR_REWARDED_PLACEMENT_ID",
  callback: function (response) {
    if (response.status === "onAdCompleted") {
      console.log("Grant the reward now");
    }
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { showMetaRewardedAd } from "webtonative/MetaAds";

showMetaRewardedAd({
  placementId: "YOUR_REWARDED_PLACEMENT_ID",
  callback: (response) => {
    if (response.status === "onAdCompleted") {
      console.log("Grant the reward now");
    }
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `placementId` | `String` | Yes | The Audience Network Placement ID for this rewarded video slot. |
| `callback` | `Function` | No | Function invoked with every ad lifecycle event. See [Callback Response Format](#callback-response-format). |

{% hint style="info" %}
**Only `onAdCompleted` means the user watched the whole video.** If the user closes the ad early, you get `onAdClosed` instead, with no `onAdCompleted` event — check specifically for `onAdCompleted` before granting a reward, don't grant on `onAdClosed`.
{% endhint %}

***

### setMetaAdsTestMode

Toggles Meta Audience Network's test mode, so ad requests return Meta's shared test creatives instead of live ads — useful for development and app-review builds without registering individual device hashes.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.MetaAds.setMetaAdsTestMode({
  state: "TRUE",
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { setMetaAdsTestMode } from "webtonative/MetaAds";

setMetaAdsTestMode({
  state: "TRUE",
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `state` | `String` | Yes | `"TRUE"` to request test ads, `"FALSE"` to go back to live ads. |

There is no `callback` for this function and no response is emitted.

{% hint style="danger" %}
**Android only.** `setMetaAdsTestMode` calls Meta's `AdSettings.setTestMode()` on Android, which affects every ad request made afterwards for the rest of the session. On **iOS this call currently has no effect at all** — it's silently ignored. iOS instead auto-enables Meta's test device mode on its own, but only inside Debug builds, and this is not controllable from JavaScript. Don't rely on this function to turn test ads on/off on iOS.
{% endhint %}

***

## Callback Response Format

All callbacks receive a JSON object. The `type` field always matches the function name that triggered the callback, so you can safely share one callback across multiple calls and branch on `type`.

### Success Response

```json
{
  "status": "onAdLoaded",
  "type": "showMetaBannerAd"
}
```

```json
{
  "status": "onAdDisplayed",
  "type": "showMetaFullscreenAd"
}
```

### Error Response

```json
{
  "status": "adError",
  "type": "showMetaFullscreenAd",
  "error": {
    "message": "No fill available for this placement",
    "code": 1001
  }
}
```

`error.message` and `error.code` are passed straight through from Meta's own Audience Network SDK, so the exact set of codes/messages you may see is defined by Meta, not WebToNative — see [Meta's Audience Network error codes](https://developers.facebook.com/docs/audience-network/reference/error-codes) for the full list.

### All Possible `status` Values

| Status | Fires for | Description |
| --- | --- | --- |
| `onAdLoaded` | Banner, Fullscreen, Rewarded | Ad has been successfully loaded and is ready. |
| `onAdDisplayed` | Fullscreen | Ad is now visible on screen. Banners do not emit this — treat `onAdLoaded` as "visible" for banners. |
| `onAdClicked` | Banner, Fullscreen, Rewarded | User tapped/clicked the ad. |
| `onAdDismissed` | Fullscreen | User closed the interstitial. |
| `onAdClosed` | Rewarded | User closed the rewarded video (with or without finishing it — check `onAdCompleted` separately to know which). |
| `onAdCompleted` | Rewarded | User watched the full rewarded video. This is the only signal you should grant a reward on. |
| `adError` | Banner, Fullscreen, Rewarded | Ad failed to load or display — see `error` object. |

### All Possible `type` Values

| Type | Triggered By |
| --- | --- |
| `showMetaBannerAd` | `showMetaBannerAd()` |
| `showMetaFullscreenAd` | `showMetaFullscreenAd()` |
| `showMetaRewardedAd` | `showMetaRewardedAd()` |

***

## Implementation Checklist

### Meta Audience Network

* [ ] App added and one Placement created per ad format you plan to use (banner / interstitial / rewarded)
* [ ] Facebook App ID and Client Token copied

### WebToNative Dashboard

* [ ] Meta Ads add-on enabled
* [ ] Facebook App ID (and Client Token) entered
* [ ] *(Android only)* At least one Placement Rule saved, even if ads are only triggered manually from JavaScript

### Your Website

* [ ] Imported the [WebToNative JavaScript bridge](https://docs.webtonative.com/javascript-apis/getting-started)
* [ ] Called the relevant `showMeta*Ad()` function with the correct `placementId` for that ad format
* [ ] Callback checks `response.type` before branching, since one callback can receive events from multiple ad calls
* [ ] Rewarded flow grants the reward only on `status === "onAdCompleted"`, never on `onAdClosed`
* [ ] Handled `adError` (e.g. retry, or just skip showing the ad) instead of assuming every call succeeds

***

## Frequently Asked Questions

<details>

<summary>Why isn't my banner/interstitial/rewarded ad showing at all — no callback fires?</summary>

On Android, the Meta Ads add-on must be enabled **and** have at least one Placement Rule saved in the WebToNative dashboard, or the native bridge for all four functions is never initialized — every call silently no-ops with no callback. Add at least one placement in the dashboard, then retry.

</details>

<details>

<summary>Why does my banner never fire `onAdDisplayed`?</summary>

Banners only emit `onAdLoaded`, `onAdClicked`, and `adError` on both platforms — there's no separate "displayed" event for banners in the underlying Audience Network SDK. Treat `onAdLoaded` as your signal that the banner is now visible.

</details>

<details>

<summary>Why does `position: "top"` show my banner at the bottom?</summary>

`position` is matched as an exact, case-sensitive string against `"TOP"` on both platforms. Any other casing (including `"top"` or `"Top"`) doesn't match and falls back to the bottom position. Always send uppercase `"TOP"` or `"BOTTOM"`.

</details>

<details>

<summary>Does `setMetaAdsTestMode` work on iOS?</summary>

No. It's fully functional on Android but currently has no effect on iOS — the call is silently ignored there. On iOS, test ads are only enabled automatically in Debug builds, independent of this function.

</details>

<details>

<summary>How do I know when to grant the reward for a rewarded ad?</summary>

Only on `status === "onAdCompleted"`. If the user closes the ad before it finishes, you get `onAdClosed` instead, with no `onAdCompleted` event — don't grant a reward for that case.

</details>

<details>

<summary>What do the numeric `error.code` values mean?</summary>

They're Meta Audience Network's own error codes, passed straight through unchanged (e.g. `1001` = no fill). See [Meta's Audience Network error code reference](https://developers.facebook.com/docs/audience-network/reference/error-codes) for the full, authoritative list.

</details>

***

## Official References

* [Meta Audience Network](https://www.facebook.com/audiencenetwork)
* [Audience Network error codes](https://developers.facebook.com/docs/audience-network/reference/error-codes)
