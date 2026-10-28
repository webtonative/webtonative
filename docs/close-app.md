# Close App

Closes the app entirely — the same result as the user quitting it from the OS app switcher. Use it to back a "Log Out & Exit" button in your website, end a kiosk-mode session, or let users leave the app from a menu instead of the hardware/gesture back action.

> You'll need to import the javascript file in your website before starting from this [link](https://docs.webtonative.com/javascript-apis/getting-started).

> **Platform support:** Android and iOS.

***

## JavaScript API Reference

### closeApp

Immediately closes the app. Takes no parameters and has no callback — there's nothing to configure and nothing to read back.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.closeApp();
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { closeApp } from "webtonative";

closeApp();
```

{% endtab %}
{% endtabs %}

> **This call cannot be cancelled or confirmed after the fact.** The app closes the instant it runs, with no native "Are you sure?" prompt. If you want the user to confirm first, gate the call behind your own confirmation UI — see [Common Patterns](#common-patterns) below.

***

## Common Patterns

### Confirm Before Closing

Since `closeApp` doesn't show any confirmation of its own, ask the user first with your own dialog and only call it once they agree. Replace the `window.confirm` below with your own modal if you don't want the plain browser dialog.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
function handleExitButtonClick() {
  const confirmed = window.confirm("Are you sure you want to exit the app?");

  if (confirmed) {
    window.WTN.closeApp();
  }
}
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { closeApp } from "webtonative";

function handleExitButtonClick() {
  const confirmed = window.confirm("Are you sure you want to exit the app?");

  if (confirmed) {
    closeApp();
  }
}
```

{% endtab %}
{% endtabs %}

### Closing After an Action Completes

If closing is the last step of a flow — for example, logging the user out on your server first — call `closeApp` only after that work finishes, so it isn't left half-done when the app quits.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
function logOutAndExit() {
  logOutFromYourBackend() // replace with your own logout call
    .then(() => {
      window.WTN.closeApp();
    })
    .catch((error) => {
      console.error("Logout failed, not closing the app:", error);
    });
}
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { closeApp } from "webtonative";

function logOutAndExit() {
  logOutFromYourBackend() // replace with your own logout call
    .then(() => {
      closeApp();
    })
    .catch((error) => {
      console.error("Logout failed, not closing the app:", error);
    });
}
```

{% endtab %}
{% endtabs %}

***

## Frequently Asked Questions

<details>

<summary>Does `closeApp` ask the user to confirm before quitting?</summary>

No. It closes the app the instant it's called, with no native prompt. Add your own confirmation dialog first if you want the user to be able to back out — see [Confirm Before Closing](#confirm-before-closing).

</details>

<details>

<summary>Can I run code after `closeApp` is called?</summary>

No — treat it as the last line of any flow. The app is closing, so nothing scheduled after it (a `.then()`, a later line in the function) is guaranteed to run. Finish any required work first, then call `closeApp` last, as shown in [Closing After an Action Completes](#closing-after-an-action-completes).

</details>

***

**Notes:**

- `closeApp` takes no parameters and has no callback — there's no response to check for success or failure.

***

*Feature taken live on 05/10/2023.*
