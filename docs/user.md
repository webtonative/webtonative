# Unified User Session

Functions to manage user sessions in the app. User data is stored securely on the device (Keychain on iOS, EncryptedSharedPreferences on Android) and can be used to personalize native UI components using template variables like `{{user.name}}`.

> You'll need to import the javascript file in your website before starting from this [link](https://docs.webtonative.com/javascript-apis/getting-started).

## Login

Creates a new user session with the provided user data. Clears any existing session before creating the new one. Automatically syncs the user ID, email, and phone number with OneSignal for push notifications.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.User.login({
  userId: "user_123",
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  avatar: "https://example.com/avatar.png",
  token: "auth_token_here",
  plan: "premium",
  role: "admin",
  group: "team_a",
  language: "en",
  meta: {
    storeId: "store_456",
    companyName: "Acme Inc",
    department: "engineering"
  },
  callback: function (response) {
    console.log(response.success);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { login } from "webtonative/User";

login({
  userId: "user_123",
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  avatar: "https://example.com/avatar.png",
  token: "auth_token_here",
  plan: "premium",
  role: "admin",
  group: "team_a",
  language: "en",
  meta: {
    storeId: "store_456",
    companyName: "Acme Inc",
    department: "engineering"
  },
  callback: (response) => {
    console.log(response.success);
  },
});
```

{% endtab %}
{% endtabs %}

### Pre-defined Fields

These fields are pre-defined because native features are hardcoded to read from them. Each field has a specific purpose in the platform.

| Field      | Type       | Required | Consumed By          | Purpose                                                  |
| ---------- | ---------- | -------- | -------------------- | -------------------------------------------------------- |
| `userId`   | `String`   | Yes      | All features         | Primary user identifier across all services.             |
| `name`     | `String`   | No       | Side Menu, Native UI | Display name in native UI components.                    |
| `email`    | `String`   | No       | Push, Analytics      | Push notification targeting, analytics ID.               |
| `phone`    | `String`   | No       | Push, Analytics      | SMS push, analytics identification.                      |
| `avatar`   | `URL`      | No       | Side Menu, Native UI | Profile image in native UI components.                   |
| `token`    | `String`   | No       | API Proxy            | Auth token for authenticated feature API calls.          |
| `plan`     | `String`   | No       | Segmentation         | User plan for targeted rollouts, segmentation.           |
| `role`     | `String`   | No       | Features, Access     | User role for content/access control.                    |
| `group`    | `String`   | No       | Push                 | User group for targeting and segmentation.               |
| `language` | `String`   | No       | Features, Content    | Preferred language for localized content.                |

### Meta Object

The `meta` object accepts any key-value pairs for data that doesn't fit the pre-defined fields. It is stored alongside fixed fields and accessible to features via the `{{user.meta.*}}` namespace.

```javascript
meta: {
  storeId: "store_456",
  companyName: "Acme Inc",
  department: "engineering",
  referralCode: "REF123",
  subscriptionTier: "annual",
  // any custom key-value pairs
}
```

| Key        | Type       | Required | Description                                                                                  |
| ---------- | ---------- | -------- | -------------------------------------------------------------------------------------------- |
| `callback` | `Function` | No       | Callback function invoked with the response.                                                 |

**Callback Response:**

| Key       | Type      | Description                                          |
| --------- | --------- | ---------------------------------------------------- |
| `type`    | `String`  | Always `"unifiedLogin"`.                             |
| `success` | `Boolean` | `true` if the session was created successfully.      |
| `error`   | `String`  | Error message if `success` is `false`.               |

***

## Set User Info

Updates the current user session with new or modified fields. The user must be logged in first — calling this without an active session will return an error. For the `meta` field, new keys are merged into existing meta data (existing keys are preserved unless overwritten).

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.User.setUserInfo({
  name: "Jane Doe",
  email: "jane@example.com",
  avatar: "https://example.com/new-avatar.png",
  plan: "enterprise",
  meta: {
    department: "sales"
  },
  callback: function (response) {
    console.log(response.success);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { setUserInfo } from "webtonative/User";

setUserInfo({
  name: "Jane Doe",
  email: "jane@example.com",
  avatar: "https://example.com/new-avatar.png",
  plan: "enterprise",
  meta: {
    department: "sales"
  },
  callback: (response) => {
    console.log(response.success);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

Any of the [pre-defined fields](#pre-defined-fields) and the `meta` object can be passed to update the session. If `userId`, `email`, or `phone` are updated, they are also synced with OneSignal.

| Key        | Type       | Required | Description                                                                                  |
| ---------- | ---------- | -------- | -------------------------------------------------------------------------------------------- |
| `callback` | `Function` | No       | Callback function invoked with the response.                                                 |

**Callback Response:**

| Key       | Type      | Description                                              |
| --------- | --------- | -------------------------------------------------------- |
| `type`    | `String`  | Always `"setUnifiedUserInfo"`.                           |
| `success` | `Boolean` | `true` if the user info was updated successfully.        |
| `error`   | `String`  | Error message if `success` is `false` (e.g., user not logged in). |

***

## Get User Info

Retrieves the current user session data. The `token` field is excluded from the response for security.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.User.getUserInfo({
  callback: function (response) {
    console.log(response.userId);
    console.log(response.name);
    console.log(response.avatar);
    console.log(response.plan);
    console.log(response.meta);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { getUserInfo } from "webtonative/User";

getUserInfo({
  callback: (response) => {
    console.log(response.userId);
    console.log(response.name);
    console.log(response.avatar);
    console.log(response.plan);
    console.log(response.meta);
  },
});
```

{% endtab %}
{% endtabs %}

**Callback Response:**

| Key              | Type      | Description                                                        |
| ---------------- | --------- | ------------------------------------------------------------------ |
| `type`           | `String`  | Always `"getUnifiedUserInfo"`.                                     |
| `sessionVersion` | `Number`  | The session version number.                                        |
| `userId`         | `String`  | The user's unique identifier.                                      |
| `name`           | `String`  | The user's display name.                                           |
| `email`          | `String`  | The user's email address.                                          |
| `phone`          | `String`  | The user's phone number.                                           |
| `avatar`         | `String`  | The user's profile image URL.                                      |
| `plan`           | `String`  | The user's plan.                                                   |
| `role`           | `String`  | The user's role.                                                   |
| `group`          | `String`  | The user's group.                                                  |
| `language`       | `String`  | The user's preferred language.                                     |
| `meta`           | `Object`  | Custom key-value pairs stored in the session.                      |
| `loggedInAt`     | `Number`  | Unix timestamp of when the session was created.                    |
| `lastUpdated`    | `Number`  | Unix timestamp of when the session was last updated.               |

The response includes all fields that were stored during `login` and `setUserInfo`, except `token`.

***

## Logout

Clears the current user session and removes all stored user data. Also removes the external user ID from OneSignal and reloads the webview.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.User.logout();
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { logout } from "webtonative/User";

logout();
```

{% endtab %}
{% endtabs %}

This function does not accept any parameters or return a callback. The webview is automatically reloaded after logout.

***

## Using User Data in Native Components

User session data can be referenced in native UI components (bottom navigation labels, side navigation, top app bar, etc.) using template variables:

| Template                                 | Description                                        |
| ---------------------------------------- | -------------------------------------------------- |
| `{{user.name}}`                          | Replaced with the user's name.                     |
| `{{user.email}}`                         | Replaced with the user's email.                    |
| `{{user.avatar}}`                        | Replaced with the user's profile image URL.        |
| `{{user.plan}}`                          | Replaced with the user's plan.                     |
| `{{user.role}}`                          | Replaced with the user's role.                     |
| `{{user.meta.storeId}}`                  | Replaced with the `storeId` value from meta.       |
| `{{user.name \| 'Guest'}}`              | Uses `"Guest"` as fallback if name is not set.     |
| `{{user.meta.companyName \| 'Unknown'}}` | Uses `"Unknown"` as fallback if not set.           |

Template variables with fallback values use the syntax `{{user.field | 'default'}}`. If the field is not set or empty, the fallback value is used instead.
