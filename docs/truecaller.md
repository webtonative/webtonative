# Truecaller Login

Function to integrate Truecaller authentication into your app. The WebToNative Truecaller plugin integrates the Truecaller Android and iOS SDKs natively, giving you a single JavaScript API that works across both platforms while preserving the platform-specific verification model required by Truecaller.

> You'll need to import the javascript file in your website before starting from this [link](https://docs.webtonative.com/javascript-apis/getting-started).

## How It Works

Truecaller uses two different verification flows depending on the operating system. The WebToNative plugin abstracts the SDK call into a single JavaScript function, but the data returned to your callback — and therefore the work your backend must do — depends on the platform the user is on.

| Platform | Flow                  | What the SDK Returns                              | Backend Responsibility                                                                |
| -------- | --------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Android  | OAuth 2.0 with PKCE   | `authorizationCode`, `codeVerifier`, `requestNonce` | Exchange the authorization code using the PKCE verifier, then fetch the user profile. |
| iOS      | Legacy JWT delegate   | Signed JWT (in `authorizationCode`), empty `codeVerifier`, `requestNonce` | Verify the JWT signature, decode the claims, and extract the user profile.            |

Always inspect `data.platform` in the callback response to decide which verification path to run on your backend.

***

## Setting Up Your Truecaller Account

WebToNative leverages Truecaller's developer platform to power phone-number based login within your app. To get started, register at the [Truecaller Developer Portal](https://developer.truecaller.com/).

### Configure Truecaller

1. Log in to the [Truecaller Developer Portal](https://developer.truecaller.com/).
2. Create a new application and select **Mobile** as the application type.
3. Add the following details for each platform:

**For Android:**

| Field          | Where to Find It                                            |
| -------------- | ----------------------------------------------------------- |
| `Package Name` | WebToNative dashboard → App Info → Package Name.            |
| `SHA-1`        | The release SHA-1 of the signing keystore used for your app. |

**For iOS:**

| Field        | Where to Find It                                            |
| ------------ | ----------------------------------------------------------- |
| `Bundle ID`  | The Bundle ID you created in App Store Connect (iOS only).  |
| `App Name`   | The display name of your app as listed on the App Store.    |

4. Once approved, copy your **Client ID** (Android) and **App Key** (iOS) from the Truecaller dashboard.
5. Go to your **WebToNative dashboard** → **Add-ons** → **Truecaller** and enter:

| Field                  | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| `Android Client ID`    | Paste the Client ID copied from the Truecaller dashboard.  |
| `iOS App Key`          | Paste the App Key copied from the Truecaller dashboard.    |
| `iOS App Link`          | Paste the App Link copied from the Truecaller Dashboard.
|

***

## Truecaller Login

Opens the Truecaller consent screen. On success, returns the credentials your backend needs to fetch the verified user profile.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.Truecaller.truecallerLogin({
  callback: function (response) {
    if (response.success) {
      console.log(response.data.platform);
      console.log(response.data.authorizationCode);
      console.log(response.data.codeVerifier);
      console.log(response.data.requestNonce);
    } else {
      console.error(response.error.code);
      console.error(response.error.message);
    }
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { truecallerLogin } from "webtonative/Truecaller";

truecallerLogin({
  callback: (response) => {
    if (response.success) {
      console.log(response.data.platform);
      console.log(response.data.authorizationCode);
      console.log(response.data.codeVerifier);
      console.log(response.data.requestNonce);
    } else {
      console.error(response.error.code);
      console.error(response.error.message);
    }
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key        | Type       | Required | Description                                      |
| ---------- | ---------- | -------- | ------------------------------------------------ |
| `callback` | `Function` | No       | Callback function invoked with the response.     |

**Callback Response:**

| Key       | Type      | Description                                                       |
| --------- | --------- | ----------------------------------------------------------------- |
| `type`    | `String`  | Always `"truecallerLogin"`. Use this to filter the callback.      |
| `success` | `Boolean` | `true` if the login flow completed, `false` if it failed.         |
| `data`    | `Object`  | Present when `success` is `true`. See **Data Object** below.      |
| `error`   | `Object`  | Present when `success` is `false`. See **Error Object** below.    |

**Data Object** (returned on success):

| Key                 | Type     | Description                                                                                                |
| ------------------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| `authorizationCode` | `String` | On Android, the OAuth authorization code. On iOS, the signed JWT token issued by Truecaller.               |
| `codeVerifier`      | `String` | On Android, the PKCE verifier required to exchange the authorization code. On iOS, this is an empty string. |
| `requestNonce`      | `String` | A unique nonce generated for this request. Send to your backend to prevent replay attacks.                 |
| `platform`          | `String` | Either `"android"` or `"ios"`. Use this to choose the correct backend verification path.                   |

**Error Object** (returned on failure):

| Key       | Type     | Description                                  |
| --------- | -------- | -------------------------------------------- |
| `code`    | `String` | Machine-readable error code. See the table below. |
| `message` | `String` | Human-readable error description.            |

**Error Codes:**

| Error Code                 | Description                       |
| -------------------------- | --------------------------------- |
| `USER_CANCELLED`           | User cancelled or closed the flow. |
| `TRUECALLER_NOT_INSTALLED` | Truecaller app is unavailable.     |
| `SDK_INTERNAL_ERROR`       | Internal SDK failure.              |

***

## Example Responses

### Android Success Response

```json
{
  "type": "truecallerLogin",
  "success": true,
  "data": {
    "authorizationCode": "tc_oauth_code_abc123",
    "codeVerifier": "pkce_verifier_xyz",
    "requestNonce": "nonce_def456",
    "platform": "android"
  }
}
```

### iOS Success Response

```json
{
  "type": "truecallerLogin",
  "success": true,
  "data": {
    "authorizationCode": "eyJhbGciOiJSUzUxMiJ9...",
    "codeVerifier": "",
    "requestNonce": "nonce_ghi789",
    "platform": "ios"
  }
}
```

### Error Response

```json
{
  "type": "truecallerLogin",
  "success": false,
  "error": {
    "code": "USER_CANCELLED",
    "message": "User cancelled the request"
  }
}
```

***

## iOS Callback Limitation

Unlike Android, iOS does not always emit a cancellation callback. This is a limitation of the current legacy TrueSDK and is **not** something the WebToNative plugin can work around.

No callback is received when:

* The user closes Truecaller manually.
* The user dismisses the login flow.
* The user switches away before the redirect completes.
* The universal-link callback never fires.

### Recommended Handling

Wrap the call in a frontend timeout so your UI never gets stuck waiting on a response that will never come.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
let completed = false;

const timeout = setTimeout(() => {
  if (!completed) {
    console.log({
      type: "truecallerLogin",
      success: false,
      error: {
        code: "USER_CANCELLED",
        message: "User cancelled the request",
      },
    });
  }
}, 10000);

window.WTN.Truecaller.truecallerLogin({
  callback: function (response) {
    completed = true;
    clearTimeout(timeout);
    console.log(response);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { truecallerLogin } from "webtonative/Truecaller";

let completed = false;

const timeout = setTimeout(() => {
  if (!completed) {
    console.log({
      type: "truecallerLogin",
      success: false,
      error: {
        code: "USER_CANCELLED",
        message: "User cancelled the request",
      },
    });
  }
}, 10000);

truecallerLogin({
  callback: (response) => {
    completed = true;
    clearTimeout(timeout);
    console.log(response);
  },
});
```

{% endtab %}
{% endtabs %}

***

## Backend Verification

The credentials returned by the SDK are not user identities — they are proof that the user completed the Truecaller flow. The verified profile is only available after your backend exchanges or decodes these credentials with Truecaller.

Always branch your backend logic on the `platform` field:

```javascript
if (value.data.platform === "android") {
  // OAuth + PKCE flow
} else if (value.data.platform === "ios") {
  // JWT verification flow
}
```

### Android Verification Flow

```text
Authorization Code
        │
        ▼
Exchange with PKCE verifier
        │
        ▼
  Access Token
        │
        ▼
 Fetch User Profile
```

1. POST the `authorizationCode` and `codeVerifier` to Truecaller's token endpoint.
2. Receive an access token in exchange.
3. Call Truecaller's profile API with the access token to fetch the verified user.

### iOS Verification Flow

```text
Signed JWT
    │
    ▼
Verify Signature
    │
    ▼
Decode Claims
    │
    ▼
Extract User Profile
```

1. Receive the signed JWT from `data.authorizationCode`.
2. Verify the JWT signature against Truecaller's public keys.
3. Decode the claims to extract the verified phone number and profile fields.

***

## Complete Example

A full implementation that handles both platforms, errors, and iOS cancellations:

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
let completed = false;

const timeout = setTimeout(() => {
  if (!completed) {
    handleResponse({
      type: "truecallerLogin",
      success: false,
      error: {
        code: "USER_CANCELLED",
        message: "User cancelled the request",
      },
    });
  }
}, 10000);

window.WTN.Truecaller.truecallerLogin({
  callback: function (response) {
    completed = true;
    clearTimeout(timeout);
    handleResponse(response);
  },
});

function handleResponse(value) {
  if (value.type !== "truecallerLogin") return;

  if (!value.success) {
    console.error(value.error.code, value.error.message);
    return;
  }

  console.log("Platform:", value.data.platform);
  console.log("Authorization Code:", value.data.authorizationCode);
  console.log("Code Verifier:", value.data.codeVerifier);
  console.log("Request Nonce:", value.data.requestNonce);

  // Send the credentials to your backend for verification
  sendToBackend(value.data);
}
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { truecallerLogin } from "webtonative/Truecaller";

let completed = false;

const timeout = setTimeout(() => {
  if (!completed) {
    handleResponse({
      type: "truecallerLogin",
      success: false,
      error: {
        code: "USER_CANCELLED",
        message: "User cancelled the request",
      },
    });
  }
}, 10000);

truecallerLogin({
  callback: (response) => {
    completed = true;
    clearTimeout(timeout);
    handleResponse(response);
  },
});

const handleResponse = (value) => {
  if (value.type !== "truecallerLogin") return;

  if (!value.success) {
    console.error(value.error.code, value.error.message);
    return;
  }

  console.log("Platform:", value.data.platform);
  console.log("Authorization Code:", value.data.authorizationCode);
  console.log("Code Verifier:", value.data.codeVerifier);
  console.log("Request Nonce:", value.data.requestNonce);

  sendToBackend(value.data);
};
```

{% endtab %}
{% endtabs %}

***

## Best Practices

* **Always verify on the backend.** Treat anything returned to the frontend as untrusted until your server has exchanged or verified it with Truecaller.
* **Never trust frontend profile data.** The phone number and identity are only authoritative after backend verification.
* **Store the Android PKCE verifier securely.** It must accompany the authorization code on the server-side exchange request.
* **Verify the JWT signature on iOS.** Decoding without verification leaves you open to forged tokens.
* **Use the request nonce.** Pass it through to your backend and reject any verification response whose nonce does not match the one you issued — this prevents replay attacks.
* **Branch on `platform`.** Do not assume one flow on the server; the credentials look superficially similar but require different verification.
* **Apply an iOS timeout.** Treat the missing-callback case as a cancellation so your UI never hangs.

***

## Integration Checklist

Use this checklist before shipping to make sure the integration is wired up end-to-end.

**Truecaller portal**

* [ ] Application registered on the [Truecaller Developer Portal](https://developer.truecaller.com/).
* [ ] Android package name and release SHA-1 added.
* [ ] iOS bundle ID and app name added.
* [ ] Android Client ID and iOS App Key copied.

**WebToNative dashboard**

* [ ] Truecaller add-on enabled.
* [ ] Android Client ID entered.
* [ ] iOS App Key entered.
* [ ] Build regenerated after saving credentials.

**Frontend**

* [ ] WebToNative JS file imported on the page that triggers login.
* [ ] `window.WTN.Truecaller.truecallerLogin` called only on `ANDROID_APP` / `IOS_APP` platforms.
* [ ] Callback handles both `success: true` and `success: false` paths.
* [ ] Callback filters by `response.type === "truecallerLogin"`.
* [ ] iOS cancellation timeout implemented.

**Backend**

* [ ] `data.platform` is checked before choosing a verification path.
* [ ] Android: authorization code exchanged with PKCE verifier, then profile fetched.
* [ ] iOS: JWT signature verified against Truecaller's public keys before decoding claims.
* [ ] `requestNonce` validated against the nonce expected for that request.
* [ ] User session issued only after successful backend verification.

***

## FAQs

**Why does `codeVerifier` come back empty on iOS?**
iOS uses the legacy JWT delegate flow, which does not use PKCE. The field is included in the response so the frontend shape stays identical across platforms, but it is intentionally empty on iOS.

**Do I need to call a different function for Android and iOS?**
No. `window.WTN.Truecaller.truecallerLogin` is the single entry point. Branching happens on the backend based on `data.platform`.

**What happens if Truecaller is not installed on the device?**
The callback fires with `success: false` and `error.code: "TRUECALLER_NOT_INSTALLED"`. Fall back to your existing phone-number login flow (e.g. OTP) in this case.

**Why didn't I receive a callback on iOS when the user closed the prompt?**
This is a known limitation of the legacy TrueSDK on iOS — the SDK does not always emit a cancellation event. Implement the timeout pattern from the **iOS Callback Limitation** section to recover gracefully.

**Can I receive the user's phone number directly in the frontend callback?**
No. The frontend only receives credentials that prove the user completed the flow. The verified phone number and profile are returned by Truecaller's backend APIs after your server completes the exchange or JWT verification.

**Why is `requestNonce` important?**
It binds a specific verification response to a specific request. Storing the nonce on your server when you initiate the flow, and checking it again when verification completes, prevents an attacker from replaying a previously captured Truecaller response.

**Does Truecaller login work on the web?**
No. The plugin only activates inside the Android and iOS WebToNative shells. The call is a no-op in a regular browser.

***

## Official References

* [Truecaller Developer Portal](https://developer.truecaller.com/)
* [Truecaller SDK Documentation](https://docs.truecaller.com/truecaller-sdk)
* [Android OAuth SDK 3.0 — Setup](https://docs.truecaller.com/truecaller-sdk/android/oauth-sdk-3.0.0/integration-steps/setup)
* [iOS SDK — Integration Guide](https://docs.truecaller.com/truecaller-sdk/ios/integrating-with-your-ios-app)
