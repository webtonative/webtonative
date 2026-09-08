# AI

AI functions that run natively in your app. Currently there is one function: read structured data out of an image — a document, a receipt, a label — by describing the fields you want instead of parsing text yourself.

> You'll need to import the javascript file in your website before starting from this [link](https://docs.webtonative.com/javascript-apis/getting-started).

> **Platform support:** Android and iOS.

***

## Extract Data From Image

Captures a photo with the camera, picks one from the gallery, or takes a Base64 image you already hold, and returns the fields described by `schema` through the callback.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.AI.extractDataFromImage({
  mode: "camera", // Options: "camera" | "gallery" | "base64"
  imageString: "", // Optional Base64 string if mode === "base64"
  schema: {
    fullName: { type: "string", description: "Full name of the person" },
    documentNumber: { type: "string", description: "ID or License Number" },
    dateOfBirth: { type: "string", description: "Date of birth in YYYY-MM-DD" },
    isExpired: { type: "boolean", description: "Whether document expiry date is past" },
  },
  uiOptions: {
    title: "Scan Driver's License",
    overlayHint: "Align ID within the frame",
  },
  callback: function (response) {
    console.log(response.data);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { extractDataFromImage } from "webtonative/AI";

extractDataFromImage({
  mode: "camera",
  schema: {
    fullName: { type: "string", description: "Full name of the person" },
    documentNumber: { type: "string", description: "ID or License Number" },
    dateOfBirth: { type: "string", description: "Date of birth in YYYY-MM-DD" },
    isExpired: { type: "boolean", description: "Whether document expiry date is past" },
  },
  uiOptions: {
    title: "Scan Driver's License",
    overlayHint: "Align ID within the frame",
  },
  callback: (response) => {
    console.log(response.data);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key           | Type       | Required | Description                                                                                                     |
| ------------- | ---------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| `mode`        | `String`   | No       | Where the image comes from. One of `"camera"`, `"gallery"`, or `"base64"`. Defaults to `"camera"`.               |
| `imageString` | `String`   | No       | Base64 encoded image. Required when `mode` is `"base64"`, ignored otherwise.                                    |
| `schema`      | `Object`   | Yes      | The fields to extract, keyed by the name you want them returned under. See **Schema** below.                    |
| `uiOptions`   | `Object`   | No       | Copy for the native capture screen. Ignored when `mode` is `"base64"`, since no screen is shown.                |
| `callback`    | `Function` | No       | Callback function invoked with the extraction response.                                                         |

**`uiOptions`:**

| Key           | Type     | Required | Description                                                                     |
| ------------- | -------- | -------- | ------------------------------------------------------------------------------- |
| `title`       | `String` | No       | Title shown on the capture screen, e.g. `"Scan Driver's License"`.              |
| `overlayHint` | `String` | No       | Hint shown over the camera frame, e.g. `"Align ID within the frame"`.           |

**Schema:**

Each key of `schema` is a field name, and its value describes what should go in it. The `description` is what the model reads to decide what belongs in the field, so write it as an instruction — including the format you want (`"Date of birth in YYYY-MM-DD"`) rather than just a label.

| Key           | Type       | Required | Description                                                                                                     |
| ------------- | ---------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| `type`        | `String`   | Yes      | One of `"string"`, `"number"`, `"boolean"`, `"array"`, or `"object"`.                                           |
| `description` | `String`   | No       | What to extract, and in what format.                                                                            |
| `enum`        | `Array`    | No       | Restricts the answer to a fixed set of values.                                                                   |
| `items`       | `Object`   | No       | The shape of each entry, when `type` is `"array"`. Same fields as a schema field.                                |
| `properties`  | `Object`   | No       | The nested fields, when `type` is `"object"`. Same shape as `schema`.                                            |
| `required`    | `Array`    | No       | Which nested field names must come back, when `type` is `"object"`.                                              |

**Callback Response:**

| Key         | Type      | Description                                                                                                      |
| ----------- | --------- | ---------------------------------------------------------------------------------------------------------------- |
| `type`      | `String`  | Always `"aiExtractDataFromImage"`.                                                                               |
| `isSuccess` | `Boolean` | `true` when the image was read, `false` if the user cancelled, extraction failed, or the request was rejected.    |
| `data`      | `Object`  | The extracted fields, keyed by the `schema` field names. A field the model could not find comes back as `null`.   |
| `error`     | `String`  | Present when `isSuccess` is `false`. Why the call failed.                                                        |

The callback also reports the cases where the request never reached the app — no `schema`, `mode: "base64"` without an `imageString`, or running on a website instead of the app — as an `isSuccess: false` response with the reason in `error`.

**Example — nested fields and a list:**

```javascript
window.WTN.AI.extractDataFromImage({
  mode: "gallery",
  schema: {
    merchant: { type: "string", description: "Store name printed on the receipt" },
    total: { type: "number", description: "Grand total as a number, without currency symbol" },
    paymentMethod: {
      type: "string",
      description: "How the bill was paid",
      enum: ["cash", "card", "upi", "other"],
    },
    items: {
      type: "array",
      description: "Every line item on the receipt",
      items: {
        type: "object",
        properties: {
          name: { type: "string", description: "Item name" },
          price: { type: "number", description: "Item price as a number" },
        },
        required: ["name"],
      },
    },
  },
  uiOptions: { title: "Pick a receipt" },
  callback: function (response) {
    if (response.isSuccess) {
      console.log(response.data.merchant, response.data.total);
      console.log(response.data.items);
    } else {
      console.error("Could not extract:", response.error);
    }
  },
});
```

**Example — an image you already have:**

```javascript
window.WTN.AI.extractDataFromImage({
  mode: "base64",
  imageString: base64Image, // no capture screen is shown in this mode
  schema: {
    plateNumber: { type: "string", description: "Vehicle number plate" },
  },
  callback: function (response) {
    console.log(response.data.plateNumber);
  },
});
```
