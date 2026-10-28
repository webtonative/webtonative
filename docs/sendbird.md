# SendBird

Functions to integrate SendBird chat into your app.

> You'll need to import the javascript file in your website before starting from this [link](https://docs.webtonative.com/javascript-apis/getting-started).

## Initialize

Initializes SendBird with a user ID and connects the user to the SendBird service.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.SendBird.sendbirdInitialize({
  userId: "user123",
  nickname: "John",
  profileurl: "https://example.com/avatar.png",
  callback: function (response) {
    console.log(response);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { sendbirdInitialize } from "webtonative/SendBird";

sendbirdInitialize({
  userId: "user123",
  nickname: "John",
  profileurl: "https://example.com/avatar.png",
  callback: (response) => {
    console.log(response);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key          | Type       | Required | Description                                      |
| ------------ | ---------- | -------- | ------------------------------------------------ |
| `userId`     | `String`   | Yes      | The unique user ID to connect with.              |
| `nickname`   | `String`   | No       | Display name for the user.                       |
| `profileurl` | `String`   | No       | URL of the user's profile image.                 |
| `callback`   | `Function` | No       | Callback function invoked with the response.     |

***

## Is Initialized

Checks whether SendBird has been initialized.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.SendBird.sendbirdIsInitialized({
  callback: function (response) {
    console.log(response.initialized); // true or false
    console.log(response.appId);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { sendbirdIsInitialized } from "webtonative/SendBird";

sendbirdIsInitialized({
  callback: (response) => {
    console.log(response.initialized); // true or false
    console.log(response.appId);
  },
});
```

{% endtab %}
{% endtabs %}

**Callback Response:**

| Key            | Type      | Description                                        |
| -------------- | --------- | -------------------------------------------------- |
| `initialized`  | `Boolean` | Whether SendBird has been initialized.             |
| `appId`        | `String`  | The SendBird application ID.                       |

***

## Is Connected

Checks whether the user is currently connected to SendBird.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.SendBird.sendbirdIsConnected({
  callback: function (response) {
    console.log(response.connected); // true or false
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { sendbirdIsConnected } from "webtonative/SendBird";

sendbirdIsConnected({
  callback: (response) => {
    console.log(response.connected); // true or false
  },
});
```

{% endtab %}
{% endtabs %}

**Callback Response:**

| Key         | Type      | Description                                    |
| ----------- | --------- | ---------------------------------------------- |
| `connected` | `Boolean` | Whether the user is connected to SendBird.     |

***

## Get User ID

Retrieves the currently connected user's ID.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.SendBird.sendbirdGetUserId({
  callback: function (response) {
    console.log(response.userId);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { sendbirdGetUserId } from "webtonative/SendBird";

sendbirdGetUserId({
  callback: (response) => {
    console.log(response.userId);
  },
});
```

{% endtab %}
{% endtabs %}

**Callback Response:**

| Key      | Type     | Description                          |
| -------- | -------- | ------------------------------------ |
| `userId` | `String` | The current user's SendBird user ID. |

***

## Update User Info

Updates the current user's nickname and/or profile image URL.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.SendBird.sendbirdUpdateUserInfo({
  nickname: "New Name",
  profileurl: "https://example.com/new-avatar.png",
  callback: function (response) {
    console.log(response.success);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { sendbirdUpdateUserInfo } from "webtonative/SendBird";

sendbirdUpdateUserInfo({
  nickname: "New Name",
  profileurl: "https://example.com/new-avatar.png",
  callback: (response) => {
    console.log(response.success);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key          | Type       | Required | Description                                      |
| ------------ | ---------- | -------- | ------------------------------------------------ |
| `nickname`   | `String`   | No       | The new display name for the user.               |
| `profileurl` | `String`   | No       | The new profile image URL for the user.          |
| `callback`   | `Function` | No       | Callback function invoked with the response.     |

**Callback Response:**

| Key       | Type      | Description                                |
| --------- | --------- | ------------------------------------------ |
| `success` | `Boolean` | Whether the user info was updated.         |

***

## Create Group Channel

Creates a new group channel with the specified users.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.SendBird.sendbirdCreateGroupChannel({
  name: "My Channel",
  userIds: ["user1", "user2", "user3"],
  isDistinct: true,
  callback: function (response) {
    console.log(response.channelUrl);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { sendbirdCreateGroupChannel } from "webtonative/SendBird";

sendbirdCreateGroupChannel({
  name: "My Channel",
  userIds: ["user1", "user2", "user3"],
  isDistinct: true,
  callback: (response) => {
    console.log(response.channelUrl);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key          | Type       | Required | Description                                                                                               |
| ------------ | ---------- | -------- | --------------------------------------------------------------------------------------------------------- |
| `name`       | `String`   | No       | The name of the group channel.                                                                            |
| `userIds`    | `String[]` | No       | An array of user IDs to add to the channel.                                                               |
| `isDistinct` | `Boolean`  | No       | If `true`, reuses an existing channel with the same members instead of creating a new one.                |
| `callback`   | `Function` | No       | Callback function invoked with the response.                                                              |

**Callback Response:**

| Key          | Type      | Description                                        |
| ------------ | --------- | -------------------------------------------------- |
| `success`    | `Boolean` | Whether the channel was created successfully.      |
| `channelUrl` | `String`  | The URL of the created group channel.              |

***

## Show UI

Opens the full SendBird chat UI showing the channel list.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.SendBird.sendbirdShowUI({
  callback: function (response) {
    console.log(response.status);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { sendbirdShowUI } from "webtonative/SendBird";

sendbirdShowUI({
  callback: (response) => {
    console.log(response.status);
  },
});
```

{% endtab %}
{% endtabs %}

**Callback Response:**

| Key      | Type      | Description                                    |
| -------- | --------- | ---------------------------------------------- |
| `success`| `Boolean` | Whether the UI was shown successfully.         |
| `status` | `String`  | Status of the UI display operation.            |

***

## Show Channel UI

Opens the SendBird chat UI for a specific channel.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.SendBird.sendbirdShowChannelUI({
  url: "sendbird_group_channel_123",
  callback: function (response) {
    console.log(response.status);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { sendbirdShowChannelUI } from "webtonative/SendBird";

sendbirdShowChannelUI({
  url: "sendbird_group_channel_123",
  callback: (response) => {
    console.log(response.status);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key        | Type       | Required | Description                                      |
| ---------- | ---------- | -------- | ------------------------------------------------ |
| `url`      | `String`   | No       | The channel URL to open.                         |
| `callback` | `Function` | No       | Callback function invoked with the response.     |

**Callback Response:**

| Key          | Type      | Description                                    |
| ------------ | --------- | ---------------------------------------------- |
| `success`    | `Boolean` | Whether the channel UI was shown successfully. |
| `status`     | `String`  | Status of the UI display operation.            |
| `channelUrl` | `String`  | The URL of the displayed channel.              |

***

## Disconnect

Disconnects the current user from SendBird. The user can reconnect later using `sendbirdInitialize`.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.SendBird.sendbirdDisconnect({
  callback: function (response) {
    console.log(response.success);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { sendbirdDisconnect } from "webtonative/SendBird";

sendbirdDisconnect({
  callback: (response) => {
    console.log(response.success);
  },
});
```

{% endtab %}
{% endtabs %}

**Callback Response:**

| Key       | Type      | Description                                    |
| --------- | --------- | ---------------------------------------------- |
| `success` | `Boolean` | Whether the disconnect was successful.         |

***

## Logout

Logs out the current user from SendBird and cleans up all resources including push notification tokens.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.SendBird.sendbirdLogout({
  callback: function (response) {
    console.log(response.success);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { sendbirdLogout } from "webtonative/SendBird";

sendbirdLogout({
  callback: (response) => {
    console.log(response.success);
  },
});
```

{% endtab %}
{% endtabs %}

**Callback Response:**

| Key       | Type      | Description                                |
| --------- | --------- | ------------------------------------------ |
| `success` | `Boolean` | Whether the logout was successful.         |

Logout differs from disconnect in that it also unregisters the device's push notification token and clears all stored SendBird data. Use `sendbirdDisconnect` for temporary disconnections and `sendbirdLogout` when the user is signing out of your app.
