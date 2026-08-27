# In-App Purchase (iOS)

Functions to sell and restore Apple In-App Purchases from your app. The WebToNative In-App Purchase plugin wraps Apple's StoreKit natively, giving you a single JavaScript API to initiate a purchase, return the App Store receipt to your page, and fetch previously completed transactions for verification.

> You'll need to import the javascript file in your website before starting from this [link](https://docs.webtonative.com/javascript-apis/getting-started).

> **Platform support:** iOS only.

> If you have not set up In-App Purchase in your Apple account yet, see [In-App Purchase iOS Setup](https://docs.webtonative.com/plugin/in-app-purchase-ios-setup) for how to configure IAP in iOS.

***

## Initiate a Purchase

Starts the StoreKit purchase flow for the given product ID. On completion, the callback receives the App Store receipt, which you then verify with Apple (see [Verify a Transaction](#verify-a-transaction)).

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.inAppPurchase({
  productId: "Product Id of IAP",
  accountToken: "11112222-3333-4444-5555-666677778888",
  callback: function (data) {
    if (data.isSuccess) {
      // Send data.receiptData to your server to verify the transaction.
      // refer: https://developer.apple.com/documentation/appstorereceipts/verifyreceipt
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
  accountToken: "11112222-3333-4444-5555-666677778888",
  callback: (data) => {
    if (data.isSuccess) {
      // Send data.receiptData to your server to verify the transaction.
      // refer: https://developer.apple.com/documentation/appstorereceipts/verifyreceipt
      console.log(data.receiptData);
    }
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key            | Type       | Required | Description                                                                                                                                       |
| -------------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `productId`    | `String`   | Yes      | The full product ID of the IAP as configured in App Store Connect.                                                                                |
| `accountToken` | `String`   | No       | A UUID that associates the purchase with a user in your system. Surfaced in the verified receipt as `app_account_token` for server-side reconciliation. **See availability note below.** |
| `callback`     | `Function` | No       | Callback function invoked with the response.                                                                                                      |

> **`accountToken` availability:** The `accountToken` parameter went live on iOS on **09/06/26**. It is only honored by iOS builds generated on or after **09/06/26** — earlier builds ignore the field. Regenerate your build after this date to use it.

**Callback Response:**

| Key           | Type      | Description                                                                          |
| ------------- | --------- | ------------------------------------------------------------------------------------ |
| `isSuccess`   | `Boolean` | `true` if the purchase completed successfully, `false` otherwise.                    |
| `receiptData` | `String`  | The base64-encoded App Store receipt. Send this to your server for verification.     |

> **Troubleshooting — no products returned?** If the purchase was unsuccessful and you didn't see any products, check the following:
>
> 1. Does the project's Bundle ID match the App ID from the iOS Developer Center?
> 2. Is the full product ID being used when calling the purchase method?
> 3. Is the Paid Applications Contract in effect on App Store Connect? It can take hours to days to move from pending to accepted after you submit it.
> 4. Have you waited several hours since adding your product to App Store Connect? Product additions may be active immediately or may take some time.
> 5. Check [Apple Developer System Status](https://developer.apple.com/system-status/). If the sandbox doesn't respond with a status value, the iTunes sandbox may be down.
> 6. Have IAPs been enabled for the App ID? (Did you select **Cleared for Sale** earlier?)
> 7. Have you tried deleting the app from your device and reinstalling it?
> 8. Still stuck? Contact us.

***

## Verify a Transaction

There are two ways to fulfill a user's purchase: **server-side** and **on-device**. Server-side verification is recommended when purchases are tied to a user account, as it is more secure. When a purchase is made, the receipt is returned to your page through the callback; send it to your server, which verifies it with Apple and then credits or unlocks the purchased item. During this process, associate the purchase with the logged-in user in your system.

For example, your website may have a free membership tier and a premium tier. Display the purchase page only inside the logged-in section of your site. When the purchase completes, the callback fires with `receiptData`.

Your web server should POST to `https://buy.itunes.apple.com/verifyReceipt` with the following body:

```json
{
  "receipt-data": "xxxxxxxxxxxxxxx",
  "password": "shared secret from App Store Connect",
  "exclude-old-transactions": true
}
```

If `exclude-old-transactions` is set to `true`, Apple returns only the latest transaction for auto-renewing subscriptions. Otherwise, you get the entire subscription history.

Apple's server returns HTTP status 200 with a JSON object (see example below). If the JSON object is `{"status":21007}`, the receipt was generated from the sandbox/test environment — in that case, re-do the POST to `https://sandbox.itunes.apple.com/verifyReceipt`.

Assuming the response has `status` 0, verify that the receipt's `bundle_id` matches your app and check what products were purchased. Save the `receipt-data` in your database so you can verify successful auto-renewals — it serves as a token you can reuse to get updated subscription information. At this point, your server should provide whatever the user purchased (premium content, virtual currency, etc.).

If `status` is any value other than 0, or Apple's endpoint does not return HTTP 200, or the request to Apple fails, **do not fulfill the purchase**. See the [App Store receipt status codes](https://developer.apple.com/documentation/appstorereceipts/status) for other possible values. Your web server should respond with a JSON object with `success` set to `false`. We recommend logging Apple's response — especially the `status` field — for troubleshooting.

An example response from App Store Connect looks as follows:

```json
{
  "receipt": {
    "receipt_type": "ProductionSandbox",
    "adam_id": 0,
    "app_item_id": 0,
    "bundle_id": "com.webtonative.com",
    "application_version": "1",
    "download_id": 0,
    "version_external_identifier": 0,
    "receipt_creation_date": "2022-04-27 11:20:28 Etc/GMT",
    "receipt_creation_date_ms": "1651058428000",
    "receipt_creation_date_pst": "2022-04-27 04:20:28 America/Los_Angeles",
    "request_date": "2022-07-07 13:52:28 Etc/GMT",
    "request_date_ms": "1657201948298",
    "request_date_pst": "2022-07-07 06:52:28 America/Los_Angeles",
    "original_purchase_date": "2013-08-01 07:00:00 Etc/GMT",
    "original_purchase_date_ms": "1375340400000",
    "original_purchase_date_pst": "2013-08-01 00:00:00 America/Los_Angeles",
    "original_application_version": "1.0",
    "in_app": [
      {
        "quantity": "1",
        "product_id": "com.webtonative.com.extralives",
        "transaction_id": "2000000042206189",
        "original_transaction_id": "2000000042206189",
        "purchase_date": "2022-04-27 11:20:28 Etc/GMT",
        "purchase_date_ms": "1651058428000",
        "purchase_date_pst": "2022-04-27 04:20:28 America/Los_Angeles",
        "original_purchase_date": "2022-04-27 11:20:28 Etc/GMT",
        "original_purchase_date_ms": "1651058428000",
        "original_purchase_date_pst": "2022-04-27 04:20:28 America/Los_Angeles",
        "is_trial_period": "false",
        "in_app_ownership_type": "PURCHASED"
      }
    ]
  },
  "environment": "Sandbox",
  "status": 0
}
```

> When you pass `accountToken` to `inAppPurchase`, the verified receipt includes a matching `app_account_token` field. Use it on your server to reconcile the transaction with the correct user account.

***

## Auto-renewable Subscriptions

Apple automatically bills users who have purchased auto-renewable subscriptions. To check the status of a user's subscription, POST the receipt again to Apple's endpoint and inspect the `latest_receipt_info` field. You may wish to set up a regular job to walk through all active subscriptions.

Apple can also notify you of subscription status changes by posting to an endpoint you configure to handle the change events. Go to **App Store Connect → Your App → App Information** and enter the URL. See the "Status Update Notifications" section in Apple's [In-App Purchase Programming Guide](https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/StoreKitGuide/Chapters/Subscriptions.html).

***

## Fetch Previous Transactions

Returns the receipt for transactions previously completed on the device. Use this to restore purchases or re-verify an existing subscription.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.getReceiptData({
  callback: function (data) {
    if (data.isSuccess) {
      // Send data.receiptData to your server to verify the transaction.
      // refer: https://developer.apple.com/documentation/appstorereceipts/verifyreceipt
      console.log(data.receiptData);
    }
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { getReceiptData } from "webtonative";

getReceiptData({
  callback: (data) => {
    if (data.isSuccess) {
      // Send data.receiptData to your server to verify the transaction.
      // refer: https://developer.apple.com/documentation/appstorereceipts/verifyreceipt
      console.log(data.receiptData);
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

| Key           | Type      | Description                                                                       |
| ------------- | --------- | --------------------------------------------------------------------------------- |
| `isSuccess`   | `Boolean` | `true` if a receipt was retrieved successfully, `false` otherwise.                |
| `receiptData` | `String`  | The base64-encoded App Store receipt. Send this to your server for verification.  |

***

## Official References

* [verifyReceipt — Apple Developer](https://developer.apple.com/documentation/appstorereceipts/verifyreceipt)
* [App Store receipt status codes](https://developer.apple.com/documentation/appstorereceipts/status)
* [In-App Purchase Programming Guide — Subscriptions](https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/StoreKitGuide/Chapters/Subscriptions.html)
