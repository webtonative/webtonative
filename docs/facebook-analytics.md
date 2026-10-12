# Facebook Analytics Collection

Functions to enable or disable Facebook Analytics (App Events) collection in the app, and to check whether collection is currently enabled. Use these to respect user consent before sending data to Facebook.

> You'll need to import the javascript file in your website before starting from this [link](https://docs.webtonative.com/javascript-apis/getting-started).

## Set Collection

Enables or disables Facebook Analytics collection.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.facebook.events.setCollection({
  enabled: true,
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { events } from "webtonative/Facebook";

events.setCollection({
  enabled: true,
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key       | Type      | Required | Description                                                        |
| --------- | --------- | -------- | ------------------------------------------------------------------ |
| `enabled` | `Boolean` | Yes      | `true` to enable Facebook Analytics collection, `false` to disable. |

***

## Get Collection Status

Returns whether Facebook Analytics collection is currently enabled.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.facebook.events.getCollectionStatus({
  callback: function (response) {
    console.log(response.enabled);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { events } from "webtonative/Facebook";

events.getCollectionStatus({
  callback: function (response) {
    console.log(response.enabled);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key        | Type       | Required | Description                                  |
| ---------- | ---------- | -------- | -------------------------------------------- |
| `callback` | `Function` | No       | Called with the collection status response. |

**Response:**

```json
{
  "type": "getFacebookAnalyticsCollectionStatus",
  "enabled": true
}
```
