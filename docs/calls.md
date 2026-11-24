# Calls

Native voice and video calling, built on LiveKit. Incoming calls ring on the system call screen
(CallKit on iOS, a full-screen call notification on Android) even when the app is closed, and your
website controls the call from JavaScript.

> You'll need to import the javascript file in your website before starting from this [link](https://docs.webtonative.com/javascript-apis/getting-started).

> **Platform support:** Android and iOS.

***

## How it fits together

1. After login, your page calls [`register`](#register) and sends `callPushToken` and `deviceId` to your backend, then calls [`setAuthToken`](#setauthtoken) with the user's session token.
2. **Outgoing call:** your backend creates the call, returns `callId`, `roomName`, `livekitUrl` and the caller's LiveKit `token`, and pushes `incoming_call` to the callee. Your page passes these to [`startCall`](#startcall).
3. **Incoming call:** the push wakes the app and the device rings. When the user answers, native calls your `tokenEndpoint` with `Authorization: Bearer <token>` and joins the room.
4. On every page load, call [`getActiveCall`](#getactivecall) and [`getPendingEvents`](#getpendingevents) so the page catches up on anything that happened while it was closed.
5. On logout, call [`unregister`](#unregister) and delete the token on your backend.

{% hint style="warning" %}
Ask for microphone permission with [`requestPermissions`](#requestpermissions) while the app is open.
iOS can't show the prompt on the lock screen, so a call answered there would have no audio.
{% endhint %}

***

## Responses

Every function returns a Promise and also accepts an optional `callback`. Both receive the same object:

```json
{ "type": "callsSetMuted", "success": true }
{ "type": "callsSetMuted", "success": false, "code": "NO_ACTIVE_CALL", "message": "..." }
```

Native errors **resolve** with `success: false`, so always check `success`. The promise only rejects
when the page isn't running inside a WebToNative app.

| `code` | Meaning |
| --- | --- |
| `NOT_SUPPORTED` | Calling is off, or isn't in this app build or version |
| `PERMISSION_DENIED` | A required permission is missing; `message` names it |
| `NO_ACTIVE_CALL` | No call matches `callId`, or the call isn't in the right state |
| `CALL_IN_PROGRESS` | Another call is already active |
| `INVALID_ARGUMENT` | A param is missing or invalid |
| `CONNECT_FAILED` | The call couldn't be started |
| `REGISTRATION_FAILED` | No push token available |

{% hint style="info" %}
On iOS, `callId` is required for every call-control function. Android falls back to the active call.
{% endhint %}

***

## JavaScript API Reference

### getStatus

Reports whether calling is available. Call it first. It works even when calling is turned off.

```javascript
const status = await window.WTN.Calls.getStatus();
// { success: true, enabled: true, video: true, registered: false, platform: "android" }
if (!status.success || !status.enabled) {
  // hide calling UI
}
```

Older iOS app versions never reply, so `getStatus` resolves with `code: "NOT_SUPPORTED"` after
`timeout` ms (default `5000`, `0` waits forever).

### register

Gets this device's call push token (FCM on Android, PushKit VoIP on iOS). Also asks for
notification permission on iOS and Android 13+.

```javascript
const res = await window.WTN.Calls.register();
if (res.success) {
  await fetch("/api/devices", {
    method: "POST",
    body: JSON.stringify({ platform: res.platform, callPushToken: res.callPushToken, deviceId: res.deviceId }),
  });
}
```

### unregister

Stops this device from ringing. Call it on logout.

```javascript
window.WTN.Calls.unregister();
```

### setAuthToken

Sets the bearer token native sends to your `tokenEndpoint` when the user answers. Call it after
login and whenever the session token changes.

```javascript
window.WTN.Calls.setAuthToken({ token: "session-token" });
```

### checkPermissions

Reports permission state without prompting. Each value is `"granted"`, `"denied"` or `"not_determined"`.

```javascript
const { permissions } = await window.WTN.Calls.checkPermissions();
// { microphone, camera, notifications, fullScreenIntent, batteryOptimizationExempt }
```

`fullScreenIntent` and `batteryOptimizationExempt` are Android only and always `"granted"` on iOS.

### requestPermissions

Shows the system prompts and resolves with the state afterwards. Accepts `"microphone"`, `"camera"`, `"notifications"`.

```javascript
window.WTN.Calls.requestPermissions({ permissions: ["microphone", "camera", "notifications"] });
```

### openSettings

Opens a system settings screen. `target` is `"app"` (default), `"fullScreenIntent"`,
`"batteryOptimization"` or `"autostart"`. Other targets are Android only; iOS always opens app settings.

```javascript
window.WTN.Calls.openSettings({ target: "batteryOptimization" });
```

### startCall

Starts an outgoing call. Resolves before the callee answers: wait for the `callConnected` event.

| Param | Required | Notes |
| --- | --- | --- |
| `callId` | yes | Must be a UUID on iOS |
| `roomName` | yes | LiveKit room |
| `livekitUrl` | yes | `wss://…` |
| `token` | yes | The caller's LiveKit token |
| `calleeName` | no | Shown in the call UI (up to 64 characters on Android) |
| `hasVideo` | no | Default `false` |
| `metadata` | no | Returned in events and sent to `callbackUrl` |

```javascript
const { callId, roomName, livekitUrl, token } = await createCallOnBackend(bobId);
const res = await window.WTN.Calls.startCall({ callId, roomName, livekitUrl, token, calleeName: "Bob" });
```

### answerCall / declineCall / endCall

```javascript
window.WTN.Calls.answerCall({ callId });  // only for an in-page answer button
window.WTN.Calls.declineCall({ callId });
window.WTN.Calls.endCall({ callId });     // on a ringing call, counts as a decline
```

### setMuted / setVideoEnabled / switchCamera

```javascript
window.WTN.Calls.setMuted({ callId, muted: true });
window.WTN.Calls.setVideoEnabled({ callId, enabled: true });
window.WTN.Calls.switchCamera({ callId });
```

### getAudioRoutes / setAudioRoute

```javascript
const { routes } = await window.WTN.Calls.getAudioRoutes();
// [{ id: "speaker", type: "speaker", name: "Speaker", active: false }, ...]
window.WTN.Calls.setAudioRoute({ callId, routeId: routes[1].id });
```

Pass the route `id` back unchanged. Android returns no routes when there is no active call.

### getActiveCall

Returns the call in progress, or `call: null`. Use it on page load to restore the call UI.

```javascript
const { call } = await window.WTN.Calls.getActiveCall();
```

### getPendingEvents

Returns events that happened while the page wasn't loaded (for example, a call answered from the
lock screen), oldest first, then clears them. Keeps up to 50 events for 24 hours. Pass
`dispatch: true` to replay them to your [`on`](#events) listeners.

```javascript
window.WTN.Calls.getPendingEvents({ dispatch: true });
```

***

## Events

```javascript
const stop = window.WTN.Calls.on("incomingCall", (call) => showRinging(call));
window.WTN.Calls.on("callEnded", (data) => console.log(data.reason, data.durationSec));
window.WTN.Calls.on("*", (data, event) => console.log(event, data));
stop(); // or window.WTN.Calls.off("incomingCall", handler)
```

`once` works like `on` but fires a single time.

| Event | `data` | Kept for `getPendingEvents` |
| --- | --- | --- |
| `tokenUpdated` | `{ platform, callPushToken }`: send the new token to your backend | ✅ |
| `incomingCall` | Call, `state: "ringing"` | |
| `callAccepted` | Call, `state: "connecting"` | ✅ |
| `callConnected` | Call + `connectedAt` (ms) | ✅ |
| `callDeclined` | Call | ✅ |
| `callMissed` | Call: ring timed out or caller cancelled | ✅ |
| `callEnded` | Call + `reason` + `durationSec` | ✅ |
| `muteChanged` | `{ callId, muted }` | |
| `audioRouteChanged` | `{ callId, route }`: a route object on Android, its `type` string on iOS | |
| `connectionQuality` | `{ callId, quality }`: `excellent`, `good`, `poor`, `lost` (Android also `unknown`) | |
| `reconnecting` / `reconnected` | `{ callId }` | |
| `participantVideoChanged` | `{ callId, enabled }`: the other side's camera | |

**Order:** incoming `incomingCall` → `callAccepted` → `callConnected` → `callEnded`;
outgoing `startCall` resolves → `callConnected` → `callEnded`.

`callEnded` reasons: `local_hangup`, `remote_hangup`, `declined`, `no_answer`, `caller_cancelled`,
`answered_elsewhere`, `network_lost`, `auth_failed` (tokenEndpoint 401/403), `call_unavailable`
(tokenEndpoint 404/410), `permission_denied`, `failed`.

***

## Call object

```json
{
  "callId": "6f1c2a3e-…",
  "direction": "incoming",
  "callerId": "alice",
  "callerName": "Alice",
  "hasVideo": false,
  "roomName": "room-123",
  "state": "connected",
  "metadata": {},
  "startedAt": 1764000000000
}
```

`callerId` is `null` on outgoing calls, and `callerName` is the `calleeName` you passed.
`state` is `ringing`, `connecting`, `connected`, `reconnecting` or `ended`.
