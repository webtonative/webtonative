# RevenueCat In-App Purchases

[RevenueCat](https://www.revenuecat.com/) is a subscription and in-app purchase management platform that sits on top of Apple's StoreKit and Google Play Billing. Instead of writing separate purchase, receipt-validation, and entitlement logic for each store, you manage products, pricing, and subscriber state in one dashboard, and RevenueCat keeps both platforms in sync.

WebToNative's RevenueCat plugin integrates the official [RevenueCat Android SDK](https://www.revenuecat.com/docs/getting-started/installation/android) and [iOS SDK](https://www.revenuecat.com/docs/getting-started/installation/ios) natively, and exposes them as a single JavaScript API — so you can trigger native purchase flows and read subscriber status from your website's JavaScript.

> You'll need to import the javascript file in your website before starting from this [link](https://docs.webtonative.com/javascript-apis/getting-started).

> **Platform support:** Android and iOS. Native paywalls (`showPaywall`) require iOS 15 or later; all other functions support iOS 14+ and Android.

***

## Key Concepts

If you're new to RevenueCat, these four terms will make the rest of this page much easier to follow:

| Term | What it means |
| --- | --- |
| **Product** | A single purchasable item, defined in App Store Connect / Google Play Console (e.g. `premium_monthly`), and imported into RevenueCat. This is the `productId` you pass to `makePurchase`. |
| **Entitlement** | A level of access you define in RevenueCat (e.g. `"pro"`), which one or more Products unlock. Your app should check entitlements — not specific product IDs — to decide what a user can access. |
| **Offering** | A named group of Products you want to present together (e.g. your current pricing screen). This is the `offeringId` you pass to `showPaywall`. Offerings let you change pricing/products remotely without an app update. |
| **Paywall** | A pre-built purchase screen you design visually in the RevenueCat dashboard and attach to an Offering. `showPaywall` renders this native screen for you — no UI code required. |
| **CustomerInfo** | RevenueCat's record of what a specific user has purchased and which entitlements are currently active. Returned by `getCustomerInfo`, `setUserId`, and `restorePurchase`. |

There are two different ways to sell something with this plugin — pick based on how much UI you want RevenueCat to build for you:

* **`showPaywall`** — shows RevenueCat's own paywall screen (built in their dashboard) for an Offering. Handles product selection, purchase, restore, and cancellation UI for you.
* **`makePurchase`** — skips any RevenueCat UI and goes straight to the native App Store / Play Store purchase sheet for one specific Product ID. Use this if you're building your own pricing screen in your web UI and just need the native checkout.

***

## How It Works

1. **`configure()`** initializes the SDK once per app session — normally right after your app loads.
2. Every other function requires `configure()` to have already succeeded. If you call any of them first, they immediately return a `NOT_CONFIGURED` error.
3. When a user logs into your app, call **`setUserId()`** to attach your own user ID to their RevenueCat subscriber record (instead of RevenueCat's auto-generated anonymous ID).
4. Use **`showPaywall`** or **`makePurchase`** to sell a subscription or one-time product.
5. Use **`getCustomerInfo`** anywhere in your app to check what the current user has access to (e.g. before showing premium content).
6. Use **`restorePurchase`** to let returning users recover purchases made previously on the same App Store / Play Store account.

{% hint style="warning" %}
**`configure()` must run first.** `isInitialized` also works before configuration (it just reports `false`), but `setUserId`, `getCustomerInfo`, `showPaywall`, `makePurchase`, and `restorePurchase` will all fail with `NOT_CONFIGURED` until `configure()` has completed successfully.
{% endhint %}

{% hint style="danger" %}
**The `callback` response is not proof of a valid, ongoing purchase — don't use it as your source of truth.** It only fires while your app happens to be open, for the one event that just occurred on that device. It cannot tell you about a renewal, a billing-retry recovery, an Apple/Google-initiated refund or chargeback, a subscription expiring while the user isn't in your app, or a family-sharing member losing access. Use the callback purely for immediate UI feedback ("Purchase complete!"). Your backend must get its entitlement state from [RevenueCat Webhooks](#4.-set-up-webhooks-required) instead — see below.
{% endhint %}

***

## Setting Up RevenueCat

### 1. Create Your RevenueCat Project

1. Sign up at [app.revenuecat.com](https://app.revenuecat.com/) and create a Project.
2. Add your app under both the **App Store** and **Play Store** platforms (RevenueCat treats them as two separate "apps" inside one project, each with its own API key).
3. Import your in-app products/subscriptions from App Store Connect and Google Play Console into RevenueCat as **Products**.
4. Group related Products into an **Entitlement** (e.g. `"pro"`), and group the Products you want to sell together into an **Offering**.
5. *(Optional, for `showPaywall`)* Design a **Paywall** in the RevenueCat dashboard and attach it to your Offering.

### 2. Get Your API Keys

RevenueCat issues a **separate public API key for iOS and for Android** within the same project (**Project Settings → API Keys**). Since your JavaScript runs in both apps, detect the platform and pass the matching key:

```javascript
import { platform } from "webtonative";
import { configure } from "webtonative/RevenueCat";

const apiKey = platform === "IOS_APP" ? "appl_YOUR_IOS_KEY" : "goog_YOUR_ANDROID_KEY";

configure({
  apiKey,
  callback: (response) => console.log(response),
});
```

### 3. Enable the Add-on in WebToNative

Open your **WebToNative Dashboard → Add-ons → RevenueCat** and enable it. There's no additional dashboard configuration — your API key, user IDs, offerings, and product IDs are all supplied at runtime from your JavaScript, as shown below.

### 4. Set Up Webhooks (Required)

This SDK only reports what happened during a live app session — it is not a backend integration. To keep your own database's subscription/entitlement state correct, you need a server that listens for [RevenueCat Webhooks](https://www.revenuecat.com/docs/integrations/webhooks):

1. In the RevenueCat dashboard, go to **Project Settings → Integrations → Webhooks** and add your backend's endpoint URL.
2. Set an **Authorization header value** — RevenueCat sends it with every webhook request so you can verify the request actually came from RevenueCat before trusting it.
3. On your server, handle at least these event types (`event.type` in the webhook payload): `INITIAL_PURCHASE`, `RENEWAL`, `CANCELLATION`, `UNCANCELLATION`, `EXPIRATION`, `BILLING_ISSUE`, `PRODUCT_CHANGE`, `TRANSFER`, and `REFUND_REVERSED`. Update the affected `app_user_id`'s access in your own database on each one.
4. Treat webhooks — not the JS `callback` — as the authoritative signal for whether a user currently has access.

{% hint style="info" %}
WebToNative does not provide, proxy, or store these events for you — this webhook endpoint must be built and hosted on your own backend.
{% endhint %}

***

## JavaScript API Reference

### configure

Initializes the RevenueCat SDK for the current app session. Call this once, as early as possible (e.g. on app load), before calling any other function in this API.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.RevenueCat.configure({
  apiKey: "YOUR_REVENUECAT_API_KEY",
  userId: "optional_user_id", // omit to start as an anonymous user
  callback: function (response) {
    console.log(response);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { configure } from "webtonative/RevenueCat";

configure({
  apiKey: "YOUR_REVENUECAT_API_KEY",
  userId: "optional_user_id", // omit to start as an anonymous user
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
| `apiKey` | `String` | Yes | Your platform-specific RevenueCat public API key (see [Get Your API Keys](#2.-get-your-api-keys)). |
| `userId` | `String` | No | A stable ID for this user (e.g. your own database user ID). If omitted, RevenueCat generates and persists an anonymous ID on-device. You can attach a real user ID later with `setUserId`. |
| `callback` | `Function` | No | Function invoked with the result. |

**Response:**

| Key | Type | Description |
| --- | --- | --- |
| `type` | `String` | Always `"configure"`. |
| `success` | `Boolean` | `true` if the SDK initialized successfully. |
| `error` | `String` | Present on failure. On iOS, this is `"API_KEY_MISSING"` if `apiKey` was empty. Android does not currently return an `error` value for this call — only `success: false`. |

***

### isInitialized

Checks whether `configure()` has already been called successfully in this session. Use this to avoid re-configuring, or to decide whether to show a loading state while `configure()` runs.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.RevenueCat.isInitialized({
  callback: function (response) {
    console.log(response.isInitialized);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { isInitialized } from "webtonative/RevenueCat";

isInitialized({
  callback: (response) => {
    console.log(response.isInitialized);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `callback` | `Function` | No | Function invoked with the result. |

**Response:**

| Key | Type | Description |
| --- | --- | --- |
| `type` | `String` | Always `"isInitialized"`. |
| `success` | `Boolean` | `true` if the check completed (this is `true` even when `isInitialized` is `false`, as long as no error occurred). |
| `isInitialized` | `Boolean` | `true` if the SDK has been configured. |
| `error` | `String` | Present only if the check itself failed after configuration. |

***

### setUserId

Attaches your own user ID to the current subscriber, replacing RevenueCat's anonymous ID. Call this right after a user logs into your app, so their purchases and entitlements follow their account across devices.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.RevenueCat.setUserId({
  userId: "your_app_user_id",
  callback: function (response) {
    console.log(response.customerInfo);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { setUserId } from "webtonative/RevenueCat";

setUserId({
  userId: "your_app_user_id",
  callback: (response) => {
    console.log(response.customerInfo);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `userId` | `String` | Yes | The user ID to identify this subscriber as. |
| `callback` | `Function` | No | Function invoked with the result. |

**Response:**

| Key | Type | Description |
| --- | --- | --- |
| `type` | `String` | Always `"setUserId"`. |
| `success` | `Boolean` | `true` if the ID was set successfully. |
| `customerInfo` | `Object` | The subscriber's [CustomerInfo](#customerinfo-object) after switching to this user ID. |
| `error` | `String` | Present on failure, e.g. `"NOT_CONFIGURED"` if called before `configure()`. |

***

### getCustomerInfo

Fetches the current user's latest purchase and entitlement status, without showing any UI. Call this whenever you need to check what a user has access to — for example, before rendering a premium feature.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.RevenueCat.getCustomerInfo({
  callback: function (response) {
    const isPro = response.customerInfo?.entitlements?.active?.["pro"] != null;
    console.log("Has pro access:", isPro);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { getCustomerInfo } from "webtonative/RevenueCat";

getCustomerInfo({
  callback: (response) => {
    const isPro = response.customerInfo?.entitlements?.active?.["pro"] != null;
    console.log("Has pro access:", isPro);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `callback` | `Function` | No | Function invoked with the result. |

**Response:**

| Key | Type | Description |
| --- | --- | --- |
| `type` | `String` | Always `"getCustomerInfo"`. |
| `success` | `Boolean` | `true` if the info was fetched successfully. |
| `customerInfo` | `Object` | The subscriber's [CustomerInfo](#customerinfo-object). |
| `error` | `String` | Present on failure, e.g. `"NOT_CONFIGURED"` if called before `configure()`. |

***

### showPaywall

Displays the native paywall screen you designed in the RevenueCat dashboard for a given Offering. RevenueCat handles product display, purchase, restore, and cancellation entirely within this screen — your callback just reports the final outcome.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.RevenueCat.showPaywall({
  offeringId: "default",
  callback: function (response) {
    if (response.success) {
      if (response.restore) {
        console.log("Previous purchases restored:", response.customerInfo);
      } else {
        console.log("Purchase completed:", response.transaction);
      }
    } else {
      console.error("Paywall closed without a purchase:", response.error);
    }
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { showPaywall } from "webtonative/RevenueCat";

showPaywall({
  offeringId: "default",
  callback: (response) => {
    if (response.success) {
      if (response.restore) {
        console.log("Previous purchases restored:", response.customerInfo);
      } else {
        console.log("Purchase completed:", response.transaction);
      }
    } else {
      console.error("Paywall closed without a purchase:", response.error);
    }
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `offeringId` | `String` | Yes | The identifier of the Offering (with an attached Paywall) to display, as configured in the RevenueCat dashboard. |
| `callback` | `Function` | No | Function invoked once per outcome — purchase, restore, error, or dismissal. See **Response** below. |

**Response — purchase completed (`restore` absent):**

| Key | Type | Description |
| --- | --- | --- |
| `type` | `String` | Always `"showPaywall"`. |
| `success` | `Boolean` | `true`. |
| `transaction` | `Object` | See [Transaction object](#transaction-object) below — shape differs by platform. |

**Response — restore completed from within the paywall:**

| Key | Type | Description |
| --- | --- | --- |
| `type` | `String` | Always `"showPaywall"`. |
| `success` | `Boolean` | `true`. |
| `restore` | `Boolean` | `true`. |
| `customerInfo` | `Object` | The subscriber's [CustomerInfo](#customerinfo-object) after restoring. |

**Response — failure:**

| Key | Type | Description |
| --- | --- | --- |
| `success` | `Boolean` | `false`. |
| `restore` | `Boolean` | Present and `true` only if the failure happened during a restore attempt. |
| `error` | `String` | See error values below. |

**Errors you may see:**

| Value | Platform | Meaning |
| --- | --- | --- |
| `NOT_CONFIGURED` | Android, iOS | `configure()` hasn't succeeded yet. |
| `OFFERING_NOT_FOUND` | Android | No Offering matching `offeringId` was found. |
| `PURCHASE_CANCELLED_BY_USER` | Android | User dismissed the paywall without purchasing. |
| `PURCHASE_FLOW_CANCELLED` | iOS | User dismissed the paywall without purchasing (equivalent to `PURCHASE_CANCELLED_BY_USER` on Android — see hint below). |
| any other message | Android, iOS | The underlying RevenueCat/store error for a failed purchase or restore. |

{% hint style="info" %}
**Platform inconsistencies to handle:** The cancellation error string differs by platform — Android sends `"PURCHASE_CANCELLED_BY_USER"`, iOS sends `"PURCHASE_FLOW_CANCELLED"`. Check for both if you want to detect "user simply closed the paywall" versus a real error. Also, on iOS, if `offeringId` doesn't match any existing Offering, the SDK currently does not invoke the callback at all — no error is returned. Apply a client-side timeout if you need to handle an invalid `offeringId` gracefully on iOS; on Android, this same case returns `OFFERING_NOT_FOUND` immediately.
{% endhint %}

***

### makePurchase

Skips any RevenueCat UI and opens the native App Store / Play Store purchase sheet directly for one Product ID. Use this when you're building your own pricing/paywall screen in your website and only need the native checkout step.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.RevenueCat.makePurchase({
  productId: "premium_monthly",
  callback: function (response) {
    if (response.success) {
      console.log("Purchase completed:", response.transaction);
    } else {
      console.error("Purchase not completed:", response.error);
    }
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { makePurchase } from "webtonative/RevenueCat";

makePurchase({
  productId: "premium_monthly",
  callback: (response) => {
    if (response.success) {
      console.log("Purchase completed:", response.transaction);
    } else {
      console.error("Purchase not completed:", response.error);
    }
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `productId` | `String` | Yes | The store product identifier to purchase, exactly as it exists in App Store Connect / Google Play Console and RevenueCat. |
| `callback` | `Function` | No | Function invoked with the result. |

**Response — success:**

| Key | Type | Description |
| --- | --- | --- |
| `type` | `String` | Always `"makePurchase"`. |
| `success` | `Boolean` | `true`. |
| `transaction` | `Object` | See [Transaction object](#transaction-object) below — shape differs by platform. |

**Response — failure:**

| Key | Type | Description |
| --- | --- | --- |
| `success` | `Boolean` | `false`. |
| `error` | `String` | See error values below. |

**Errors you may see:**

| Value | Platform | Meaning |
| --- | --- | --- |
| `NOT_CONFIGURED` | Android, iOS | `configure()` hasn't succeeded yet. |
| `PRODUCT_<productId>_NOT_FOUND.` | Android | No store product matching `productId` was found. |
| `PURCHASE_FLOW_CANCELLED` | iOS | User cancelled the purchase sheet. |
| any other message | Android, iOS | The underlying RevenueCat/store error message. |

{% hint style="info" %}
**Platform inconsistency:** When the user cancels, iOS returns the fixed value `"PURCHASE_FLOW_CANCELLED"`. Android does **not** currently normalize this — it returns whatever raw error message the store/RevenueCat SDK produced for the cancellation. Don't do a strict string match against `"PURCHASE_FLOW_CANCELLED"` on Android if you need to detect user cancellation reliably.
{% endhint %}

***

### restorePurchase

Restores any purchases already associated with the device's App Store / Play Store account, without showing a checkout screen. Use this behind a "Restore Purchases" button, typically on a settings or paywall screen.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.RevenueCat.restorePurchase({
  callback: function (response) {
    console.log(response.customerInfo);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { restorePurchase } from "webtonative/RevenueCat";

restorePurchase({
  callback: (response) => {
    console.log(response.customerInfo);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `callback` | `Function` | No | Function invoked with the result. |

**Response:**

| Key | Type | Description |
| --- | --- | --- |
| `type` | `String` | Always `"restorePurchase"`. |
| `success` | `Boolean` | `true` if the restore completed (this does **not** mean anything was found — a user with no past purchases still gets `success: true` with an empty `customerInfo`). |
| `customerInfo` | `Object` | The subscriber's [CustomerInfo](#customerinfo-object) after restoring. |
| `error` | `String` | Present on failure, e.g. `"NOT_CONFIGURED"` if called before `configure()`. |

***

## Reference Objects

### CustomerInfo object

`customerInfo` is RevenueCat's own subscriber record, passed straight through from the native SDK. The fields you'll use most often:

| Field | Description |
| --- | --- |
| `entitlements.active` | An object keyed by entitlement identifier (e.g. `"pro"`) — a key is present only if that entitlement is currently active for this user. Use this to gate premium features. |
| `activeSubscriptions` | Array of product identifiers the user currently has an active subscription for. |
| `allExpirationDates` / `allPurchaseDates` | Per-product expiration/purchase timestamps. |
| `originalAppUserId` | The RevenueCat App User ID this record belongs to. |
| `requestDate` | When this CustomerInfo snapshot was generated. |

For the complete, authoritative field list, see RevenueCat's [CustomerInfo reference](https://www.revenuecat.com/docs/customers/customer-info).

### Transaction object

Returned in `transaction` by both `showPaywall` and `makePurchase` on a successful purchase. The shape differs by platform:

**iOS:**

| Key | Description |
| --- | --- |
| `transactionId` | The App Store transaction identifier. |
| `productId` | The purchased product's identifier. |
| `purchaseDate` | Purchase timestamp, in milliseconds since epoch (as a string). |
| `storefrontId` | The App Store storefront (country/region) the purchase was made in. |
| `appUserId` | The RevenueCat App User ID for this subscriber. |

**Android:**

| Key | Description |
| --- | --- |
| `transactionId` | The Google Play purchase token for this transaction. |
| `googleOrderId` | The Google Play order ID. |
| `productId` | The purchased product's identifier. |
| `purchaseDate` | Purchase timestamp, in milliseconds since epoch. |
| `appUserId` | The RevenueCat App User ID for this subscriber. |

***

## Typical Implementation Flow

1. **On app load** — call `configure()` with the platform-specific API key. If the user is already logged into your app, pass their ID as `userId` directly.
2. **On login** (if you didn't have the user ID at configure-time) — call `setUserId()` to attach it.
3. **Gate premium content** — call `getCustomerInfo()` and check `entitlements.active` before showing premium features.
4. **Sell a subscription/product** — call `showPaywall()` if you've designed a RevenueCat paywall, or `makePurchase()` if you built your own pricing UI.
5. **Give returning users a way back in** — call `restorePurchase()` from a "Restore Purchases" button.
6. **Keep your backend in sync independently** — don't rely on step 4's callback for anything beyond immediate UI feedback. Your backend should listen to RevenueCat Webhooks to know when access should actually be granted, renewed, or revoked.

***

## Implementation Checklist

### RevenueCat Dashboard

* [ ] Project created, with both App Store and Play Store apps added
* [ ] Products imported from App Store Connect / Google Play Console
* [ ] Products grouped into at least one Entitlement
* [ ] Products grouped into at least one Offering
* [ ] *(If using `showPaywall`)* A Paywall designed and attached to the Offering
* [ ] Webhook endpoint added under Project Settings → Integrations → Webhooks, with an Authorization header configured

### Your Backend

* [ ] An endpoint that receives RevenueCat Webhooks and verifies the Authorization header before trusting the payload
* [ ] Handles `INITIAL_PURCHASE`, `RENEWAL`, `CANCELLATION`, `EXPIRATION`, and `BILLING_ISSUE` at minimum, updating each `app_user_id`'s access in your own database
* [ ] Treats webhook events — not the JS `callback` — as the source of truth for whether a user currently has access

### WebToNative Dashboard

* [ ] RevenueCat add-on enabled

### Your Website

* [ ] Imported the [WebToNative JavaScript bridge](https://docs.webtonative.com/javascript-apis/getting-started)
* [ ] Called `configure()` on app load with the correct platform-specific API key
* [ ] Called `setUserId()` after login (if not passed at configure-time)
* [ ] Used `getCustomerInfo()` to gate premium features based on entitlements
* [ ] Implemented `showPaywall()` or `makePurchase()` for checkout
* [ ] Added a `restorePurchase()` option for returning users

***

## Frequently Asked Questions

<details>

<summary>What's the difference between `showPaywall` and `makePurchase`?</summary>

`showPaywall` renders a full paywall screen you designed in the RevenueCat dashboard, for a group of products (an Offering) — RevenueCat handles selection, purchase, and restore UI for you. `makePurchase` skips all of that and opens the native purchase sheet directly for one specific product ID, for use with your own custom pricing UI.

</details>

<details>

<summary>Do I need the same API key for iOS and Android?</summary>

No. RevenueCat issues a separate public API key per platform within the same project. Detect the platform in your JavaScript and pass the matching key to `configure()`.

</details>

<details>

<summary>Why did my function call fail with `NOT_CONFIGURED`?</summary>

Every function except `configure()` requires `configure()` to have completed successfully first. Make sure `configure()` runs (and its callback fires with `success: true`) before calling any other RevenueCat function.

</details>

<details>

<summary>Why do cancellation errors look different on Android vs iOS?</summary>

The native SDKs don't normalize this consistently yet. For `showPaywall`, Android sends `"PURCHASE_CANCELLED_BY_USER"` while iOS sends `"PURCHASE_FLOW_CANCELLED"` for the same event. For `makePurchase`, iOS sends the fixed `"PURCHASE_FLOW_CANCELLED"`, while Android passes through the raw underlying error message instead. Check for both/loosely on Android rather than relying on an exact string match.

</details>

<details>

<summary>Does `restorePurchase` show any UI to the user?</summary>

No. It silently checks the App Store / Play Store account already signed in on the device and updates `customerInfo` accordingly. There's no purchase sheet or confirmation dialog — build your own success/failure UI around the callback.

</details>

<details>

<summary>How do I check if a user has an active subscription?</summary>

Call `getCustomerInfo()` and check `response.customerInfo.entitlements.active` for the entitlement identifier you configured in RevenueCat (e.g. `"pro"`) — its presence means the entitlement is currently active, regardless of which specific product unlocked it.

</details>

<details>

<summary>Do I still need webhooks if I already get a `callback` after a purchase?</summary>

Yes. The `callback` only fires for the exact purchase/restore action that just happened on that device, while your app is open. It never fires for events that happen when your app isn't running — a subscription renewing, a billing retry succeeding, an Apple/Google-initiated refund or chargeback, or a subscription simply expiring. If you grant access based only on the client callback, your backend's records will silently drift out of sync with what the user actually has. Set up [RevenueCat Webhooks](#4.-set-up-webhooks-required) pointed at your own backend and treat those events as authoritative.

</details>

***

*Feature taken live on 20/07/26*
