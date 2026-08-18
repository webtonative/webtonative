# Pull To Refresh

Lets users refresh the current page by pulling down on the screen — the standard native "swipe down to reload" gesture. It's enabled by default on every page and can be toggled at runtime from JavaScript, or turned on/off and scoped to specific pages from the **WebToNative dashboard**, without any code changes.

> You'll need to import the javascript file in your website before starting from this [link](https://docs.webtonative.com/javascript-apis/getting-started).

> **Platform support:** Fully supported on both Android and iOS, including the runtime JavaScript toggle.

***

## How It Works

- **Default:** pull-to-refresh is enabled on every page unless you change that.
- **Dashboard setting:** lets you disable it entirely, or only for specific pages, with no code — see [Scoping to Specific Pages](#scoping-to-specific-pages-dashboard).
- **Runtime override:** `enablePullToRefresh()` lets your JavaScript flip it on/off for the page currently loaded — see [JavaScript API Reference](#javascript-api-reference).
- **Precedence:** the dashboard setting is re-applied on every page load. A runtime override only lasts until the next navigation, at which point the dashboard setting takes over again — see the note under `enablePullToRefresh` below, and the copy-paste pattern in [Common Patterns](#common-patterns) if you need the override to stick across pages.

***

## JavaScript API Reference

### enablePullToRefresh

Enables or disables pull-to-refresh at runtime. Takes effect immediately on the current page.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.enablePullToRefresh(true);
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { enablePullToRefresh } from "webtonative";

enablePullToRefresh(true);
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key      | Type      | Required | Description                                            |
| -------- | --------- | -------- | -------------------------------------------------------- |
| `status` | `Boolean` | Yes      | `true` enables pull-to-refresh, `false` disables it.    |

This function does not take a `callback` — it applies synchronously and has no response to read.

> **Does not persist across navigation:** This call sets a temporary, in-memory override for the current page only. On the next page load, the app re-applies whatever is configured on the dashboard (see below) and may override what you just set. If you need the override to stick as the user navigates, call `enablePullToRefresh` again on every page/route — see [Common Patterns](#common-patterns) below.

***

## Scoping to Specific Pages (Dashboard)

Pull-to-refresh can also be turned on/off, or limited to specific pages, from the **WebToNative dashboard** — no code required. This is useful for disabling it on pages with their own internal scroll/refresh UI while keeping it enabled everywhere else.

***

## Common Patterns

### Reapplying the Override on Every Page/Navigation

Since `enablePullToRefresh` only affects the current page, you need to call it again whenever the page changes if you want a consistent state — for example, always disabling it on a page with its own pull-to-refresh-like interaction (a chat thread, a drag-to-reorder list). Replace the path checks below with your own routes.

{% tabs %}
{% tab title="Plain Javascript" %}

Add this to a script that loads on every page of a traditional multi-page site:

```javascript
// Runs once per full page load
const disableOn = ["/chat", "/editor"];

window.WTN.enablePullToRefresh(!disableOn.includes(window.location.pathname));
```

{% endtab %}

{% tab title="React" %}

Re-apply on every client-side route change. Mount `PullToRefreshController` once near the root of your app, alongside your router:

```javascript
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { enablePullToRefresh } from "webtonative";

const DISABLED_ROUTES = ["/chat", "/editor"];

function PullToRefreshController() {
  const location = useLocation();

  useEffect(() => {
    enablePullToRefresh(!DISABLED_ROUTES.includes(location.pathname));
  }, [location.pathname]);

  return null;
}
```

{% endtab %}
{% endtabs %}

***

## Frequently Asked Questions

<details>

<summary>I called `enablePullToRefresh(false)` but it turned back on after the user navigated — why?</summary>

This is expected. The override only applies to the page it was called on. Every new page load re-applies whatever is set on the WebToNative dashboard. If you need it to stay off across navigation, call `enablePullToRefresh` again on each page — see [Common Patterns](#common-patterns).

</details>

<details>

<summary>Should I use the dashboard setting or the JavaScript call?</summary>

Use the **dashboard** for anything static — pages that should always/never have pull-to-refresh. Use the **JavaScript call** only for temporary, conditional behavior within a session (e.g. disabling it while a specific modal or drag interaction is active, then re-enabling it). The dashboard setting is what any page falls back to once you're not actively overriding it.

</details>

<details>

<summary>Does this need a permission or dashboard add-on to be enabled first?</summary>

No. Pull-to-refresh is a built-in feature, on by default — there's no add-on to enable and no device permission involved. You can start calling `enablePullToRefresh` immediately after importing the WebToNative JavaScript bridge.

</details>

***

**Notes:**

- Default state is enabled on all pages unless changed on the dashboard.
- The runtime JavaScript toggle and the dashboard setting are not independent — the dashboard setting takes over again on every page navigation, so treat `enablePullToRefresh` as a per-page override rather than a persistent setting.

***

*Feature taken live on Android on 17 May 2023, and on iOS on 12 August 2026.*
