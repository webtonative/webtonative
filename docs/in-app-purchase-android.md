# In-App Purchase (Android)

Functions to sell and restore Google Play In-App Purchases from your app. The WebToNative In-App Purchase plugin wraps Google Play Billing natively, giving you a single JavaScript API to initiate a purchase (one-time or subscription) and query the purchases a user already owns.

{% hint style="info" %}
You'll need to import the javascript file in your website before starting from this [link](https://docs.webtonative.com/javascript-apis/getting-started).
{% endhint %}

> **Platform support:** Android only.

> If you have not set up In-App Purchase in your Google Developer account yet, see [In-App Purchase Android Setup](https://docs.webtonative.com/plugin/in-app-purchase-android-setup) for how to configure IAP in Android.

***

## Initiate a Purchase

Starts the Google Play Billing purchase flow for the given product. On completion, the callback receives the purchase receipt, which you then verify with the Google Play Developer API.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.inAppPurchase({
  productId: "Product Id of IAP",
  productType: "INAPP",
  isConsumable: true,
  accountToken: "11112222-3333-4444-5555-666677778888",
  callback: function (data) {
    if (data.isSuccess) {
      // Send data.receiptData to your server to verify the purchase.
      console.log(data.receiptData);
    }
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { inAppPurchase } from "webtonative/InAppPurchase";

inAppPurchase({
  productId: "Product Id of IAP",
  productType: "INAPP",
  isConsumable: true,
  accountToken: "11112222-3333-4444-5555-666677778888",
  callback: (data) => {
    if (data.isSuccess) {
      // Send data.receiptData to your server to verify the purchase.
      console.log(data.receiptData);
    }
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key            | Type       | Required | Description                                                                                              |
| -------------- | ---------- | -------- | -------------------------------------------------------------------------------------------------------- |
| `productId`    | `String`   | Yes      | The product ID exactly as created in the Google Play Console.                                            |
| `productType`  | `String`   | Yes      | `"INAPP"` for one-time purchases, or `"SUBS"` for subscriptions.                                         |
| `isConsumable` | `Boolean`  | Yes      | Whether the product can be purchased again. See the guidance below.                                      |
| `accountToken` | `String`   | No       | A token that associates the purchase with a user in your system, for server-side reconciliation. **See availability note below.** |
| `callback`     | `Function` | No       | Callback function invoked with the response.                                                             |

> **`accountToken` availability:** The `accountToken` parameter went live on **09/06/26**. It is only honored by Android builds generated on or after **09/06/26** — earlier builds ignore the field. Regenerate your build after this date to use it.

**Choosing `isConsumable`:**

| Product                       | `productType` | `isConsumable` | Behavior                                              |
| ----------------------------- | ------------- | -------------- | ---------------------------------------------------- |
| One-time **consumable**       | `"INAPP"`     | `true`         | User can purchase the product again and again.       |
| One-time **non-consumable**   | `"INAPP"`     | `false`        | User can purchase the product only once.             |
| **Subscription**              | `"SUBS"`      | `false`        | Treated as a non-consumable product.                 |

![](https://lh4.googleusercontent.com/Ul-ASvSZWAgQ1XtPNhkkpUOfBWUI4XE0RL7tNgdlsAWdYnGiL5r1ccAFcOVsZkuJdJ_kPI04a6XtufpkvhGsQWL7s0fGrId-sMfHdEvR4dJfraKj6qXVL1kSvHTZUMlmzjNFshPCLWlUHFNr_etDujKmj3BOt-LXJX-zCGdhSLGwir9TBjUDh2raGn9V-g)

![](https://lh4.googleusercontent.com/sWo4XvEMj1UDKeYRKf_9d_EgNDsnoluu7E25_YPOmfsklegCAlc-fa4cd5TIR723T7ujoLqLSf9P53dGSmWKNDN1ShwZGb45MXfVAzguKcabXDy2FiLkZfC_PFkRxw59HumS-UXw31ZDf_5EZ6UW3gUeYCTD6nS9yxPjNWzmXPKydSIiZF6e7Th7jD-d4g)

**Callback Response:**

| Key           | Type      | Description                                                                       |
| ------------- | --------- | --------------------------------------------------------------------------------- |
| `type`        | `String`  | Always `"inAppPurchase"`. Use this to filter the callback.                        |
| `isSuccess`   | `Boolean` | `true` if the purchase completed successfully, `false` otherwise.                 |
| `receiptData` | `Object`  | The purchase receipt. Send this to your server for verification.                  |

**Example response:**

```json
{
  "type": "inAppPurchase",
  "receiptData": { },
  "isSuccess": true
}
```

***

## Query Purchases

Returns all purchases the user currently owns — active subscriptions and non-consumed one-time purchases. Use this to restore purchases or re-verify entitlements.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.getAllPurchases({
  callback: function (data) {
    if (data.isSuccess) {
      console.log(data.purchaseData);
    }
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { getAllPurchases } from "webtonative/InAppPurchase";

getAllPurchases({
  callback: (data) => {
    if (data.isSuccess) {
      console.log(data.purchaseData);
    }
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key        | Type       | Required | Description                                  |
| ---------- | ---------- | -------- | -------------------------------------------- |
| `callback` | `Function` | No       | Callback function invoked with the response. |

**Callback Response:**

| Key            | Type      | Description                                                                            |
| -------------- | --------- | -------------------------------------------------------------------------------------- |
| `type`         | `String`  | Always `"purchaseList"`. Use this to filter the callback.                              |
| `isSuccess`    | `Boolean` | `true` if the query completed successfully, `false` otherwise.                         |
| `purchaseData` | `Array`   | The user's active subscriptions and non-consumed one-time purchases.                   |

**Example response:**

```json
{
  "type": "purchaseList",
  "isSuccess": true,
  "purchaseData": [{ }, { }]
}
```

***

## Official References

* [Google Play Billing — Overview](https://developer.android.com/google/play/billing)
* [Verify purchases — Google Play Developer API](https://developer.android.com/google/play/billing/security#verify)
* [Google Play Console](https://play.google.com/console)
