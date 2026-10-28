# PDF Viewer

Functions to open PDF files in a native, in-app viewer instead of downloading them or handing them
off to an external app. The WebToNative PDF Viewer plugin renders the file natively — search,
thumbnails, password-protected files, download, and share are all handled in-app.

> You'll need to import the javascript file in your website before starting from this [link](https://docs.webtonative.com/javascript-apis/getting-started).

> **Platform support:** Android and iOS.

***

## Setting Up PDF Viewer

1. Go to your **WebToNative dashboard** → **Add-ons** → **PDF Viewer** and enable it.
2. Configure the toolbar/behavior options you want under the same add-on page:

| Dashboard field | Maps to | Default | Description |
| --- | --- | --- | --- |
| Toolbar Title | `toolbarTitle` | *(uses the `title` passed from JS)* | Overrides the `title` argument if set to a non-blank value. |
| Show Download | `showDownload` | Off | Shows a download-to-device button in the toolbar. |
| Show Share | `showShare` | Off | Shows a share-sheet button in the toolbar. |
| Show Search | `showSearch` | Off | Shows an in-document search button. |
| Show Thumbnails | `showThumbnails` | Off | Shows a page-thumbnail grid button. |
| Show Page Indicator | `showPageIndicator` | **Off on Android, On on iOS** ⚠ | Shows a page-number pill at the bottom. See the platform-difference hint below. |
| Auto-Detect PDF Links | `autoDetectLinks` | Off | If a link the user taps inside your site resolves to a `.pdf` URL, opens it in the native viewer instead of navigating the WebView. See [Auto-Detect Matching](#auto-detect-matching-differs-by-platform) below. |
| URL Patterns | `urlPatterns` | *(empty)* | Only used when Auto-Detect is on — see below. |
| Error Message | `errorMessage` | *(native default message)* | Custom text shown if a PDF fails to load. |
| Error Button Text | `errorButtonName` | `"Retry"` | Label for the retry button on the error screen. |

{% hint style="warning" %}
**`showPageIndicator` defaults differently per platform when left unset.** Android hides the page indicator by default; iOS shows it by default. If you need identical behavior on both platforms, set this explicitly in the dashboard rather than relying on the default.
{% endhint %}

***

## JavaScript API Reference

### openPDF

Opens a PDF from a URL in the native in-app viewer.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.openPDF({
  url: "https://example.com/files/manual.pdf",
  title: "Product Manual",
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { openPDF } from "webtonative";

openPDF({
  url: "https://example.com/files/manual.pdf",
  title: "Product Manual",
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | `String` | Yes | The URL of the PDF to open. Throws a JavaScript error immediately (before reaching native code) if blank. |
| `title` | `String` | No | Shown in the viewer's toolbar, unless the dashboard's Toolbar Title field is set to a non-blank value, which takes priority. |

{% hint style="danger" %}
**`openPDF` has no `callback` parameter.** All viewer configuration (search, thumbnails, password
handling, download, share, auto-detect) comes from the dashboard settings above, not from
additional arguments to this call — there is nothing else to pass here beyond `url` and `title`.
{% endhint %}

***

## Auto-Detect Matching Differs By Platform

If you enable **Auto-Detect PDF Links**, the matching rule against `urlPatterns` is not identical
on both platforms:

- **Android** opens the viewer for any URL simply ending in `.pdf`. `urlPatterns` is only consulted
  as a fallback for URLs that *don't* end in `.pdf` (substring match).
- **iOS** requires the URL to *both* end in `.pdf` **and** match at least one entry in
  `urlPatterns` as a prefix. A bare `.pdf` URL with Auto-Detect on and no `urlPatterns` configured
  will open automatically on Android but **not** on iOS.

If you need consistent behavior, always fill in `urlPatterns` explicitly rather than relying on the
"any `.pdf` URL" fallback that only exists on Android.

***

## Frequently Asked Questions

<details>

<summary>Why does the page-number indicator show on iOS but not Android with the same config?</summary>

`showPageIndicator` defaults to off on Android and on iOS when left unset in the dashboard. Set it
explicitly if you need matching behavior across platforms.

</details>

<details>

<summary>Can I pass search/thumbnails/download settings directly in the `openPDF()` call?</summary>

No — `openPDF` only accepts `url` and `title`. Everything else is configured once, for the whole
app, via the dashboard's PDF Viewer add-on settings.

</details>

<details>

<summary>What happens if a PDF requires a password?</summary>

The viewer shows a native password-entry screen and retries opening the file once a password is
submitted. There is currently no JavaScript event for "password required" — the user is prompted
entirely natively.

</details>
