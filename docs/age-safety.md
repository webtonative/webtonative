# Age Safety

Functions to support age assurance and regulatory compliance in your app. You can request the user's age signals / declared age range from the platform's native age‑verification service, and (on iOS) notify the system about a significant change to your app's content.

These APIs wrap **Google Play's Age Signals API** on Android and Apple's **Declared Age Range** framework on iOS. They are intended for apps that need to gate content or features by age in regulated regions.

> You'll need to import the javascript file in your website before starting from this [link](https://docs.webtonative.com/javascript-apis/getting-started).

> **Platform support:** `getAgeSignals` works on Android and iOS. `notifySignificantChange` is **iOS only**. The native age‑range/permission APIs on iOS require **iOS 26.2 or later**.

> **Store services required:** Both functions only run when the app build has store services enabled. If store services are disabled, the call is ignored and no callback fires.

***

## getAgeSignals

Requests the platform's age signals for the current user against a configured age gate.

- **Android** — calls the Google Play Age Signals API and returns the user's verification status and (when available) an age range.
- **iOS** — calls `AgeRangeService.requestAgeRange`, which may present a system sheet, and returns the declared age range. Requires iOS 26.2+.

The response shape differs between platforms (see the per‑platform tables below), so check `success` first and then read the fields relevant to the running platform.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.AgeSafety.getAgeSignals({
  ageGates: 18,
  callback: function (response) {
    console.log(response);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { getAgeSignals } from "webtonative/AgeSafety";

getAgeSignals({
  ageGates: 18,
  callback: (response) => {
    console.log(response);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key        | Type       | Required | Description                                                                                                                   |
| ---------- | ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `ageGates` | `Number`   | No       | The primary age threshold to check against, e.g. `18`. On iOS this drives the age band returned by the system. Defaults to `18`. |
| `callback` | `Function` | No       | Callback function invoked with the age‑signals response.                                                                      |

> **iOS note:** The underlying iOS API supports up to three age gates (creating up to four age bands, each spanning at least 2 years). The JavaScript API currently sends a single primary `ageGates` value.

### Callback Response — common fields

| Key       | Type      | Description                                                                                  |
| --------- | --------- | -------------------------------------------------------------------------------------------- |
| `type`    | `String`  | Always `"getAgeSignals"`.                                                                    |
| `success` | `Boolean` | `true` if the age signals were retrieved successfully, `false` otherwise.                    |
| `error`   | `String`  | Present when `success` is `false`. A human‑readable message describing what went wrong.      |

### Callback Response — Android

Returned by Google Play's Age Signals API.

| Key                      | Type      | Description                                                                                              |
| ------------------------ | --------- | -------------------------------------------------------------------------------------------------------- |
| `userStatus`             | `String`  | The user's age‑verification status as reported by Play.                                                  |
| `ageLower`               | `Number`  | Present when available. The lower bound of the user's age range.                                          |
| `ageUpper`               | `Number`  | Present when available. The upper bound of the user's age range.                                          |
| `installId`              | `String`  | Present when available. An install identifier associated with the signals.                               |
| `mostRecentApprovalDate` | `String`  | Present when available. The date of the most recent age approval, as a string.                           |

### Callback Response — iOS

Returned by Apple's Declared Age Range framework (iOS 26.2+).

| Key                        | Type        | Description                                                                                                                            |
| -------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `isEligibleForAgeFeatures` | `Boolean`   | `true` if the user is in a regulated region where age assurance is required. `false` means age sharing is voluntary.                    |
| `declined`                 | `Boolean`   | `true` if the user declined to share their age range (or no sharing occurred in a non‑regulated region).                               |
| `lowerBound`               | `Number`    | Present when sharing. The lower bound of the declared age range. Absent (`nil`) means the user is **below** the lowest age gate.        |
| `upperBound`               | `Number`    | Present when sharing. The upper bound of the declared age range. Absent (`nil`) means the user is **at or above** the highest age gate. |
| `activeParentalControls`   | `String[]`  | Active parental controls in effect, e.g. `["communicationLimits"]`. Empty array when none.                                             |
| `isSupervised`             | `Boolean`   | `true` if any parental controls are active (i.e. `activeParentalControls` is non‑empty).                                               |
| `ageRangeDeclaration`      | `String`    | How the age was established. See the table below. Present only when sharing.                                                            |
| `errorCode`                | `String`    | Present on certain failures. One of `"invalidRequest"` or `"notAvailable"` (see error table).                                          |

**`ageRangeDeclaration` values (iOS):**

| Value                          | Description                                                       |
| ------------------------------ | ----------------------------------------------------------------- |
| `selfDeclared`                 | Age was declared by the user themselves.                          |
| `guardianDeclared`             | Age was declared by a guardian.                                   |
| `paymentChecked`               | Age was verified via a payment method.                            |
| `governmentIDChecked`          | Age was verified via a government ID.                             |
| `checkedByOtherMethod`         | Age was verified by another method.                               |
| `guardianPaymentChecked`       | Guardian's age verified via a payment method.                     |
| `guardianGovernmentIDChecked`  | Guardian's age verified via a government ID.                      |
| `guardianCheckedByOtherMethod` | Guardian's age verified by another method.                        |
| `unknown`                      | An unrecognized declaration type.                                 |

**iOS `errorCode` values:**

| Code             | Description                                                                                             |
| ---------------- | ------------------------------------------------------------------------------------------------------- |
| `invalidRequest` | The age gates were invalid — each band must be ≥ 2 years, with a maximum of 3 gates in ascending order. |
| `notAvailable`   | The age range service is not available on this device (e.g. no iCloud account, parental restrictions).  |

**Example:**

```javascript
window.WTN.AgeSafety.getAgeSignals({
  ageGates: 18,
  callback: function (response) {
    if (!response.success) {
      console.error("Age signals failed:", response.errorCode, response.error);
      return;
    }

    // iOS
    if (typeof response.isEligibleForAgeFeatures !== "undefined") {
      if (response.declined) {
        console.log("User declined to share their age range");
      } else {
        console.log("Age range:", response.lowerBound, "-", response.upperBound);
        console.log("Supervised:", response.isSupervised);
      }
    }

    // Android
    if (response.userStatus) {
      console.log("User status:", response.userStatus);
      console.log("Age range:", response.ageLower, "-", response.ageUpper);
    }
  },
});
```

***

## notifySignificantChange

Notifies the system that the app has undergone a significant change to its content or experience (for example, a major content update relevant to age assurance). On iOS this presents a PermissionKit prompt via `AskCenter` so the user / guardian can be re‑asked.

> **Platform support:** iOS only, requires iOS 26.2+. On other platforms the call does nothing.

{% tabs %}
{% tab title="Plain Javascript" %}

```javascript
window.WTN.AgeSafety.notifySignificantChange({
  topicString: "Major content update for the 2026 season",
  callback: function (response) {
    console.log(response.success);
  },
});
```

{% endtab %}

{% tab title="npm" %}

```javascript
import { notifySignificantChange } from "webtonative/AgeSafety";

notifySignificantChange({
  topicString: "Major content update for the 2026 season",
  callback: (response) => {
    console.log(response.success);
  },
});
```

{% endtab %}
{% endtabs %}

**Parameters:**

| Key           | Type       | Required | Description                                                                                  |
| ------------- | ---------- | -------- | -------------------------------------------------------------------------------------------- |
| `topicString` | `String`   | Yes      | A description of the significant change. Must be non‑empty.                                  |
| `callback`    | `Function` | No       | Callback function invoked with the response.                                                 |

**Callback Response:**

| Key                  | Type      | Description                                                                                                        |
| -------------------- | --------- | ------------------------------------------------------------------------------------------------------------------ |
| `type`               | `String`  | Always `"notifySignificantChange"`.                                                                                |
| `success`            | `Boolean` | `true` if the notification was submitted successfully, `false` otherwise.                                          |
| `error`              | `String`  | Present when `success` is `false`. A human‑readable message describing the failure.                                |
| `regionNotSupported` | `Boolean` | Present and `true` when the failure is because PermissionKit / `AskCenter` is not available in the user's region (currently limited to EU/EEA). Use this to show a tailored message rather than treating it as a generic error. |
| `_simulator`         | `Boolean` | Present and `true` only on the iOS Simulator, where the PermissionKit UI cannot be presented (stubbed response).   |
| `_note`              | `String`  | Present only on the iOS Simulator. Explains that the response is a simulator stub.                                 |

**Example:**

```javascript
window.WTN.AgeSafety.notifySignificantChange({
  topicString: "Major content update for the 2026 season",
  callback: function (response) {
    if (response.success) {
      console.log("Significant change submitted");
    } else if (response.regionNotSupported) {
      console.log("This feature isn't available in your region yet");
    } else {
      console.error("Failed to notify:", response.error);
    }
  },
});
```

***

**Notes:**

- Both functions require **store services** to be enabled on the build; otherwise the call is silently ignored.
- `getAgeSignals` returns different fields on Android vs iOS. Always branch on the field you need (`userStatus` for Android, `isEligibleForAgeFeatures` / `declined` for iOS) rather than assuming a single shape.
- On iOS, `lowerBound`/`upperBound` being absent is meaningful: a missing `lowerBound` means the user is **below** the lowest age gate, and a missing `upperBound` means they are **at or above** the highest age gate.
- The iOS age‑range and significant‑change APIs require **iOS 26.2 or later**. On older iOS versions the callback fires with `success: false` and an explanatory `error`.
- On the **iOS Simulator**, `notifySignificantChange` cannot present the PermissionKit UI and returns a stub response with `_simulator: true`. Test the full flow on a real device.
- `notifySignificantChange` (and the underlying PermissionKit `AskCenter`) is currently restricted to certain regions (EU/EEA). Outside those regions it fails with `regionNotSupported: true`.
- **Debug only (Android):** in debug builds, `getAgeSignals` honors an optional `testScenario` value (e.g. `"SUPERVISED"`, `"VERIFIED"`) that drives a fake signals manager for testing. This is ignored in release builds, which always use the real Play Age Signals API.
