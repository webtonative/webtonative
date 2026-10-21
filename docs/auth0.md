# Auth0 Secure Login

Functions to integrate Auth0 authentication into your app. The WebToNative Auth0 plugin integrates the Auth0 Android and iOS SDKs natively, supporting Universal Login, biometric authentication, and automatic session management.

> You'll need to import the javascript file in your website before starting from this [link](https://docs.webtonative.com/javascript-apis/getting-started).

## Setting Up Your Auth0 Account

WebToNative leverages Auth0's authentication service to power login within your app. To get started, create an account at [auth0.com](https://auth0.com).

### Configure Auth0

1. Log in to your [Auth0 Dashboard](https://manage.auth0.com).
2. Go to **Applications** → **Create Application**.
3. Select **Native** as the application type and click **Create**.
4. Under **Settings** → **Application URIs**, add the following to **Allowed Callback URLs** and **Allowed Logout URLs**:

**For Android:**

```
YOUR_SCHEME://YOUR_AUTH0_DOMAIN/android/YOUR_PACKAGE_NAME/callback
```

**For iOS:**

```
YOUR_SCHEME://YOUR_AUTH0_DOMAIN/ios/YOUR_BUNDLE_ID/callback
```

| Placeholder          | Where to Find It                                                                 |
| -------------------- | -------------------------------------------------------------------------------- |
| `YOUR_PACKAGE_NAME`  | WebToNative dashboard → App Info → Package Name.                                 |
| `YOUR_BUNDLE_ID`     | The Bundle ID you created in App Store Connect (iOS only).                       |
| `YOUR_SCHEME`        | The same scheme you enter on the WebToNative Auth0 plugin page (e.g. `https`).   |
| `YOUR_AUTH0_DOMAIN`  | Your Auth0 tenant domain from the Auth0 Dashboard.                               |

5. Go to **Advanced Settings** → **OAuth** and turn on **Allow Offline Access** — this is required for refresh tokens and auto-login.
6. Copy your **Domain** and **Client ID** from the Auth0 Settings page.
7. Go to your **WebToNative dashboard** → **Add-ons** → **Auth0** and enter:

| Field         | Description                                                      |
| ------------- | ---------------------------------------------------------------- |
| `Client ID`   | Paste the Client ID copied from Auth0.                           |
| `Domain`      | Paste the Domain copied from Auth0.                              |
| `Scheme`      | Enter the same scheme you used in the callback URL (e.g. `https`). |

***

## Login

Opens the Auth0 Universal Login screen. On success, returns access, ID, and refresh tokens.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.Auth0.login({
  scope: "openid profile email offline_access",
  enableBiometrics: true,
  callback: function (response) {
    console.log(response.accessToken);
    console.log(response.idToken);
    console.log(response.refreshToken);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { login } from "webtonative/Auth0";

login({
  scope: "openid profile email offline_access",
  enableBiometrics: true,
  callback: (response) => {
    console.log(response.accessToken);
    console.log(response.idToken);
    console.log(response.refreshToken);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key                | Type       | Required | Description                                                                 |
| ------------------ | ---------- | -------- | --------------------------------------------------------------------------- |
| `scope`            | `String`   | No       | OAuth scopes to request (e.g. `"openid profile email offline_access"`).     |
| `enableBiometrics` | `Boolean`  | No       | If `true`, saves credentials with biometric protection for future sessions. |
| `callback`         | `Function` | No       | Callback function invoked with the response.                                |

**Callback Response:**

| Key             | Type      | Description                               |
| --------------- | --------- | ----------------------------------------- |
| `accessToken`   | `String`  | The OAuth access token.                   |
| `idToken`       | `String`  | The OpenID Connect ID token.              |
| `refreshToken`  | `String`  | The refresh token for renewing sessions.  |
| `error`         | `String`  | Error message if login failed.            |

***

## Logout

Clears saved credentials and ends the Auth0 session.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.Auth0.logout({
  callback: function (response) {
    console.log(response.success);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { logout } from "webtonative/Auth0";

logout({
  callback: (response) => {
    console.log(response.success);
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

| Key       | Type      | Description                            |
| --------- | --------- | -------------------------------------- |
| `success` | `Boolean` | Whether the logout was successful.     |
| `error`   | `String`  | Error message if logout failed.        |

***

## Get Status

Checks whether the user has a valid saved session and whether biometrics are available on the device.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.Auth0.getStatus({
  callback: function (response) {
    console.log(response.hasValidCredentials);
    console.log(response.biometryAvailable);
    console.log(response.biometryType);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { getStatus } from "webtonative/Auth0";

getStatus({
  callback: (response) => {
    console.log(response.hasValidCredentials);
    console.log(response.biometryAvailable);
    console.log(response.biometryType);
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

| Key                   | Type      | Description                                              |
| --------------------- | --------- | -------------------------------------------------------- |
| `hasValidCredentials` | `Boolean` | `true` if the user has a saved session.                  |
| `biometryAvailable`   | `Boolean` | `true` if Face ID or Fingerprint is available.           |
| `biometryType`        | `String`  | Type of biometric available: `"faceId"`, `"touchId"`, or `"none"`. |

***

## Get Credentials

Retrieves saved credentials from device secure storage. If biometrics are available, a Face ID or Fingerprint prompt is shown automatically.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.Auth0.getCredentials({
  callback: function (response) {
    console.log(response.accessToken);
    console.log(response.idToken);
    console.log(response.refreshToken);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { getCredentials } from "webtonative/Auth0";

getCredentials({
  callback: (response) => {
    console.log(response.accessToken);
    console.log(response.idToken);
    console.log(response.refreshToken);
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

| Key            | Type     | Description                              |
| -------------- | -------- | ---------------------------------------- |
| `accessToken`  | `String` | The OAuth access token.                  |
| `idToken`      | `String` | The OpenID Connect ID token.             |
| `refreshToken` | `String` | The refresh token.                       |
| `error`        | `String` | Error message if no credentials saved.   |

***

## Renew Credentials

Renews expired tokens using the saved refresh token. If no `refreshToken` is provided, the plugin uses the token saved from a previous login.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.Auth0.renew({
  callback: function (response) {
    console.log(response.accessToken);
    console.log(response.idToken);
    console.log(response.refreshToken);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { renew } from "webtonative/Auth0";

renew({
  callback: (response) => {
    console.log(response.accessToken);
    console.log(response.idToken);
    console.log(response.refreshToken);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key             | Type       | Required | Description                                                       |
| --------------- | ---------- | -------- | ----------------------------------------------------------------- |
| `refreshToken`  | `String`   | No       | A refresh token to use. If omitted, the saved token is used.      |
| `callback`      | `Function` | No       | Callback function invoked with the response.                      |

**Callback Response:**

| Key            | Type     | Description                             |
| -------------- | -------- | --------------------------------------- |
| `accessToken`  | `String` | The renewed OAuth access token.         |
| `idToken`      | `String` | The renewed OpenID Connect ID token.    |
| `refreshToken` | `String` | The renewed refresh token.              |
| `error`        | `String` | Error message if renewal failed.        |