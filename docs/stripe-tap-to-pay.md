# Stripe Tap to Pay

Accept in-person card payments directly on a customer's phone — no extra hardware required. The WebToNative Stripe plugin integrates [Stripe Terminal](https://stripe.com/docs/terminal)'s native Tap to Pay SDKs for [Android](https://stripe.com/docs/terminal/payments/setup-reader/tap-to-pay?platform=android) and [iOS](https://stripe.com/docs/terminal/payments/setup-reader/tap-to-pay?platform=ios), letting your app turn a compatible Android device or iPhone into a contactless card reader.

> You'll need to import the javascript file in your website before starting from this [link](https://docs.webtonative.com/javascript-apis/getting-started).

> **Platform support:** Android and iOS. iOS Tap to Pay requires a physical iPhone (XS or later) on a supported iOS version and Apple's explicit approval — see [Limitations](#limitations-read-before-purchasing) below.

***

## Limitations — read before purchasing

Stripe Tap to Pay is a paid add-on with hard requirements outside WebToNative's control. Please review this table before purchasing.

| Limitation | Tag | Details |
| --- | --- | --- |
| **Apple approval required** | `Hard requirement` | Tap to Pay on iPhone requires Apple's explicit entitlement approval before it works on real devices in production. Purchasing this add-on does not guarantee Apple will grant approval. |
| **Backend required** | `Hard requirement` | The SDK does not provide backend APIs. You must build and host the Connection Token API and PaymentIntent API on your own server. |
| **Stripe account required** | `Hard requirement` | You must use your own Stripe account. WebToNative does not provide or manage Stripe accounts, Stripe Dashboard configuration, or merchant onboarding. |
| **Country restrictions** | `Verify first` | Stripe Terminal and Tap to Pay are only available in Stripe-supported countries. Check [stripe.com](https://stripe.com/global) for the current list before purchasing. |
| **No refund processing** | | The SDK does not process refunds. Refunds must be handled by your backend using Stripe's refund APIs. |
| **No webhook replacement** | | The SDK does not replace Stripe Webhooks. Your backend should process Stripe Webhooks independently for reliable payment status updates. |
| **Real device required for testing** | | Final testing must be done on a supported physical device. Simulator and emulator testing has limited support — use `isSimulated: true` for development only. |
| **Internet connection required** | | Most payment operations require an active internet connection. Limited offline support depends on Stripe Terminal's own offline capabilities and your implementation. |

***

## How It Works

1. Your website calls `makeTapToPay()` with a Stripe Terminal **connection token**, an amount/currency (or an existing PaymentIntent's `clientSecret`), and a Stripe Terminal **Location ID**.
2. The native SDK initializes Stripe Terminal, discovers a Tap to Pay reader on the device, and connects to it.
3. The SDK creates (or retrieves) a PaymentIntent, then prompts the customer to tap their card, phone, or wallet on the back of the device.
4. Stripe confirms the payment, and the result is returned to your `callback`.

{% hint style="info" %}
**Platform difference:** On iOS, the SDK only supports **retrieving** an existing PaymentIntent — you must create the PaymentIntent on your backend first and pass its `clientSecret`. On Android, `clientSecret` is optional: if you omit it, the SDK creates the PaymentIntent itself from `amount` and `currency`. To keep behavior identical across platforms, always create the PaymentIntent on your backend and pass `clientSecret`.
{% endhint %}

***

## Setting Up Stripe Tap to Pay

### 1. Set Up Your Stripe Account

1. Create or use an existing account at [stripe.com](https://stripe.com) and enable [Stripe Terminal](https://dashboard.stripe.com/terminal).
2. Create a [Location](https://stripe.com/docs/terminal/fleet/locations) in the Stripe Dashboard (or via the API) and note its Location ID (`tml_...`) — this is your `stripeLocationId`.
3. Apply for the [Tap to Pay on iPhone entitlement](https://developer.apple.com/apple-pay/tap-to-pay-on-iphone/) directly with Apple if you plan to support iOS. This is a manual approval process handled entirely by Apple — WebToNative cannot request or expedite it on your behalf.

### 2. Build Your Backend Endpoints

The SDK does not talk to Stripe's servers on its own for these two steps — your server must:

* **Connection Token endpoint** — a POST endpoint that creates a [Stripe Terminal connection token](https://stripe.com/docs/terminal/fleet/locations#create) and returns it as JSON: `{ "secret": "<connection_token>" }`. Your website fetches this and passes the token as `connectionToken`.
* **PaymentIntent endpoint** *(required for iOS, recommended for Android)* — a POST endpoint that [creates a PaymentIntent](https://stripe.com/docs/api/payment_intents/create) with `payment_method_types: ["card_present"]` and `capture_method` set to `automatic` or `manual`, and returns its `client_secret`. Your website passes this as `clientSecret`.
* Handle **capture** (for `manual` capture method) and **refunds** using Stripe's standard APIs — the SDK does not do this for you.
* Process **Stripe Webhooks** independently to keep your own order/payment records in sync — the SDK's callback is not a substitute for webhooks.

### 3. Enable the Add-on in WebToNative

1. Open your **WebToNative Dashboard → Add-ons → Stripe Tap to Pay** and purchase/enable it.
2. Unlike some other add-ons, there is no dashboard configuration screen for Stripe — your Stripe keys, connection tokens, and location IDs are all supplied at runtime from your JavaScript, as shown below.

### 4. Platform Permissions

WebToNative's Stripe plugin already declares the required permissions and usage-description strings for both platforms. You still need to make sure your app can obtain them at runtime:

**Android** — the plugin adds `ACCESS_FINE_LOCATION`, `BLUETOOTH_CONNECT`, `BLUETOOTH_SCAN`, and `NFC` to your manifest. Tap to Pay will fail with `LOCATION_PERMISSION_NOT_GRANTED` or `GPS_NOT_ENABLED` if these aren't granted/enabled — prompt the user for location and nearby-devices (Bluetooth) permissions, and ensure GPS is turned on, before calling `makeTapToPay`.

**iOS** — the plugin adds `NSBluetoothAlwaysUsageDescription` and `NSBluetoothPeripheralUsageDescription` to your `Info.plist`. The device also needs NFC reading capability, and location services must be enabled and authorized — otherwise the callback returns `NO_NFC_SUPPORT_ON_DEVICE`, `BLUETOOTH_PERMISSION_NOT_GRANTED`, `GPS_NOT_ENABLED`, or `LOCATION_PERMISSION_NOT_GRANTED`.

***

## JavaScript API Reference

### makeTapToPay

Discovers a Tap to Pay reader on the device, connects to it, and collects a payment.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.Stripe.makeTapToPay({
  connectionToken: "YOUR_STRIPE_TERMINAL_CONNECTION_TOKEN",
  stripeLocationId: "tml_xxxxxxxxxxxx",
  clientSecret: "pi_xxxxxxxx_secret_xxxxxxxx",
  amount: 1999,
  currency: "usd",
  captureMethod: "automatic",
  isSimulated: false,
  callback: function (response) {
    if (response.paymentStatus === "SUCCESS") {
      console.log("Payment ID:", response.paymentId);
    } else {
      console.error("Payment failed:", response.failureReason);
    }
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { makeTapToPay } from "webtonative/Stripe";

makeTapToPay({
  connectionToken: "YOUR_STRIPE_TERMINAL_CONNECTION_TOKEN",
  stripeLocationId: "tml_xxxxxxxxxxxx",
  clientSecret: "pi_xxxxxxxx_secret_xxxxxxxx",
  amount: 1999,
  currency: "usd",
  captureMethod: "automatic",
  isSimulated: false,
  callback: (response) => {
    if (response.paymentStatus === "SUCCESS") {
      console.log("Payment ID:", response.paymentId);
    } else {
      console.error("Payment failed:", response.failureReason);
    }
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key                 | Type       | Required                     | Description                                                                                                                                                              |
| ------------------- | ---------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `connectionToken`   | `String`   | Yes                          | A Stripe Terminal connection token, fetched from your backend's connection-token endpoint before calling `makeTapToPay`.                                                |
| `stripeLocationId`  | `String`   | Yes                          | The Stripe Terminal Location ID (`tml_...`) to associate the reader with.                                                                                               |
| `clientSecret`      | `String`   | Required on iOS, optional on Android | The `client_secret` of a PaymentIntent created on your backend. If provided, the SDK retrieves and confirms that PaymentIntent. On Android only, if omitted, the SDK creates a new PaymentIntent from `amount`/`currency` instead. |
| `amount`            | `Number`   | Yes, unless `clientSecret` is set | Payment amount in the smallest currency unit (e.g. `1999` = $19.99 USD).                                                                                            |
| `currency`          | `String`   | Yes, unless `clientSecret` is set | Three-letter ISO currency code (e.g. `"usd"`).                                                                                                                      |
| `captureMethod`     | `String`   | No — default `"automatic"`   | `"automatic"` or `"manual"`. Ignored when `clientSecret` is provided, since the capture method is already set on the existing PaymentIntent.                            |
| `isSimulated`       | `Boolean`  | No — default `false`         | Use Stripe's simulated reader for development. Must be `false` for real transactions on a physical device.                                                              |
| `apiUrl`            | `String`   | No                           | URL of a backend endpoint that returns a Stripe Terminal connection token as `{ "secret": "..." }`. Currently only honored on iOS as a fallback when `connectionToken` isn't supplied — Android always requires `connectionToken`. Prefer always passing `connectionToken` directly. |
| `callback`          | `Function` | No                           | Function invoked with the payment result. See **Response** below.                                                                                                       |

**Response:**

| Key             | Type     | Description                                                                                    |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `type`          | `String` | Always `"makeTapToPayStripePayment"`.                                                          |
| `paymentStatus` | `String` | `"SUCCESS"` or `"FAILED"`.                                                                      |
| `token`         | `String` | The connection token used for this payment.                                                    |
| `paymentId`     | `String` | The Stripe PaymentIntent ID (e.g. `"pi_..."`), present when `paymentStatus` is `"SUCCESS"`.     |
| `paymentIntent` | `String` | A stringified representation of the full Stripe PaymentIntent object, present on success.      |
| `failureReason` | `String` | Present only when `paymentStatus` is `"FAILED"`. See **Failure Reasons** below.                |

**Failure Reasons:**

| Value                             | Platform      | Meaning                                                                                     |
| ---------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `JSON_UNDEFINED`                   | Android       | The options passed to `makeTapToPay` could not be parsed.                                  |
| `GPS_NOT_ENABLED`                  | Android, iOS  | Device location services are turned off.                                                   |
| `LOCATION_PERMISSION_NOT_GRANTED`  | Android, iOS  | The app does not have location permission.                                                 |
| `BLUETOOTH_PERMISSION_NOT_GRANTED` | iOS           | Bluetooth permission was denied.                                                            |
| `NO_NFC_SUPPORT_ON_DEVICE`         | iOS           | The device doesn't support NFC and `isSimulated` was `false`.                              |
| `LOCATION_ID_MISSING`              | iOS           | `stripeLocationId` was missing.                                                             |
| `TOKEN_ISSUE`                      | Android       | `connectionToken` was empty or invalid.                                                    |
| `API_CONNECTION_FAILED`            | Android       | The Stripe Terminal SDK could not be initialized with the given token.                     |
| `INVALID_TOKEN`                    | Android       | Stripe rejected the connection token.                                                       |
| `NO_NEARBY_READER_DEVICE_FOUND`    | Android       | Reader discovery completed without finding a Tap to Pay reader.                            |
| `READER_FAILURE - <code>` / other message | Android, iOS | Reader connection, card collection, or payment confirmation failed — the value contains the underlying Stripe Terminal SDK error. |

***

## Typical Implementation Flow

1. **Create a PaymentIntent** — call your backend to create a PaymentIntent for the order total, and get back its `client_secret`.
2. **Fetch a connection token** — call your backend's connection-token endpoint to get a fresh Stripe Terminal `connectionToken`.
3. **Collect payment** — call `makeTapToPay()` with the `connectionToken`, `clientSecret`, and `stripeLocationId`, and prompt the customer to tap their card.
4. **Handle the result** — on `"SUCCESS"`, store `paymentId` against the order. On `"FAILED"`, inspect `failureReason` and show the customer an appropriate retry message.
5. **Reconcile via webhooks** — use Stripe Webhooks on your backend as the source of truth for payment status, independent of the app callback.

***

## Implementation Checklist

### Stripe Dashboard

* [ ] Stripe Terminal enabled on your Stripe account
* [ ] A Location created, with its Location ID noted
* [ ] (iOS) Tap to Pay on iPhone entitlement requested from Apple

### Your Backend

* [ ] Connection Token endpoint returning `{ "secret": "..." }`
* [ ] PaymentIntent creation endpoint returning `client_secret`
* [ ] Capture and refund handling via Stripe's APIs
* [ ] Stripe Webhooks configured for reliable payment status updates

### WebToNative Dashboard

* [ ] Stripe Tap to Pay add-on purchased and enabled

### Your Website

* [ ] Imported the [WebToNative JavaScript bridge](https://docs.webtonative.com/javascript-apis/getting-started)
* [ ] Implemented `makeTapToPay()` with a fresh `connectionToken` and `clientSecret` per transaction
* [ ] Handled both `"SUCCESS"` and `"FAILED"` in the callback

***

## Frequently Asked Questions

<details>

<summary>Do I need my own Stripe account?</summary>

Yes. WebToNative does not provide, manage, or proxy a Stripe account for you — you supply your own Stripe keys, connection tokens, and PaymentIntents from your own backend.

</details>

<details>

<summary>Will this work in production on iPhone without any extra steps?</summary>

No. Tap to Pay on iPhone requires Apple's explicit entitlement approval for your app. Purchasing this WebToNative add-on does not guarantee or expedite that approval — you must apply directly with Apple.

</details>

<details>

<summary>Can I test without a physical reader-capable device?</summary>

Partially. Pass `isSimulated: true` to use Stripe's simulated reader during development. Final testing before release must be done on a real, supported device — simulator/emulator support is limited.

</details>

<details>

<summary>Does the SDK handle refunds or webhooks?</summary>

No. Refunds must be processed by your backend using Stripe's refund APIs, and you should independently process Stripe Webhooks on your backend for reliable payment status — the JavaScript `callback` is not a substitute for either.

</details>

<details>

<summary>Why does iOS require `clientSecret` but Android doesn't?</summary>

The current iOS implementation only supports retrieving an existing PaymentIntent by `client_secret`; it does not create one from `amount`/`currency` on-device. Android can create a PaymentIntent directly from `amount`/`currency` if `clientSecret` is omitted. To keep your integration consistent across both platforms, always create the PaymentIntent on your backend and pass `clientSecret`.

</details>

<details>

<summary>What happens if the customer's card is declined?</summary>

The callback fires with `paymentStatus: "FAILED"` and a `failureReason` describing the underlying Stripe Terminal error (for example, a decline reason from Stripe's API). Show the customer a retry option.

</details>

***

*Feature taken live on 19/07/26*
