# OneSignal Web Push SDK → WebToNative Native Bridge Override

---

## Background — Why This Exists

### How users do it today

Clients who use both WebToNative and OneSignal have to manually check whether
they are inside a native app before every OneSignal call:

```js
if (WTN.isNativeApp) {
    // inside native app → use WTN native bridge
    WTN.OneSignal.requestPermission();
    WTN.OneSignal.setExternalUserId("user123");
    WTN.OneSignal.setTags({ tags: { plan: "pro" } });
} else {
    // regular browser → use OneSignal web SDK
    OneSignal.requestPermission();
    OneSignal.login("user123");
    OneSignal.User.addTag("plan", "pro");
}
```

Every single OneSignal call requires this split. The client has to know WTN
exists, understand the WTN API, and maintain two parallel code paths forever.

### What we want

The client writes **one code path only** — standard OneSignal JS, nothing
WTN-specific:

```js
OneSignal.requestPermission();
OneSignal.login("user123");
OneSignal.User.addTag("plan", "pro");
```

- **Regular browser** → real OneSignal Web SDK handles it, no change.
- **WTN native app** → our bridge silently intercepts those exact same calls
  and routes them through the native bridge under the hood.

The client never writes `WTN.isNativeApp`. They never write `WTN.OneSignal.*`.
They just write OneSignal code and it works everywhere.

### Migration for existing clients

Delete the `isNativeApp` block and keep only the OneSignal code:

```js
// Before
if (WTN.isNativeApp) {
    WTN.OneSignal.requestPermission();
} else {
    OneSignal.requestPermission();
}

// After — works in both browser and native app
OneSignal.requestPermission();
```

---

## Overview

Websites using OneSignal's Web Push JS SDK inside a WebToNative-wrapped app
will automatically have their OneSignal calls routed through the native WTN
bridge — no code changes required on the website side.

Two delivery options:
- **Full SDK:** bundled inside `webtonative.min.js`
- **Standalone:** `onesignal-bridge.min.js` (~17 KB) for sites that only need
  OneSignal integration

Activates only when `window.WTN` is present (i.e. running inside a native
WebToNative app). In a regular browser the module exits immediately and the
real OneSignal SDK works normally.

---

## HTML Integration

### Option A — Full SDK

```html
<head>
  <script src="https://cdn.webtonative.com/bridge.js"></script>
  <script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer></script>
</head>
```

### Option B — OneSignal only (lighter)

```html
<head>
  <script src="https://cdn.webtonative.com/onesignal-bridge.js"></script>
  <script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer></script>
</head>
```

WTN script must come **before** the OneSignal script so the shim is in place
before the SDK loads.

---

## File Structure

| File | Purpose |
|------|---------|
| `src/OneSignal/index.ts` | Existing WTN OneSignal native bridge (untouched) |
| `src/OneSignal/types.ts` | Added 3 new response types |
| `src/OneSignal/extended.ts` | 3 new native bridge methods (separate, non-breaking) |
| `src/OneSignalOverride/index.ts` | The shim — intercepts window.OneSignal |
| `src/OneSignalOverride/types.ts` | Global window type declarations |
| `onesignal-bridge.ts` | Standalone webpack entry point |
| `client.ts` | Wires override into full SDK bundle |

---

## Step 1 — New types in `src/OneSignal/types.ts`

Added alongside existing types (no existing lines changed):

```typescript
export interface PermissionStatusResponse {
    status: "granted" | "denied" | "default";
}

export interface RequestPermissionResponse {
    accepted: boolean;
}

export interface SubscriptionStatusResponse {
    isOptedIn: boolean;
    pushToken?: string;
    playerId?: string;
}
```

---

## Step 2 — New native bridge methods in `src/OneSignal/extended.ts`

Kept separate from `index.ts` so existing code is completely undisturbed.
Follows the same `registerCb` / Promise pattern as `getPlayerId()`.

| Method | Android action | iOS action | Returns |
|--------|---------------|------------|---------|
| `getPermissionStatus()` | `getPermissionStatus` | `getPermissionStatus` | `Promise<PermissionStatusResponse>` |
| `requestPermission()` | `requestPermission` | `requestPermission` | `Promise<RequestPermissionResponse>` |
| `getSubscriptionStatus()` | `getSubscriptionStatus` | `getSubscriptionStatus` | `Promise<SubscriptionStatusResponse>` |

---

## Step 3 — `src/OneSignalOverride/index.ts`

### 3a. Activation guard

```typescript
export function initOneSignalOverride(): void {
    if (typeof window === "undefined" || !window.WTN) return;
    // ...
}
```

### 3b. Internal event emitter

Handles `addEventListener` / `removeEventListener` for the JS side:

```typescript
const listeners: Record<string, Record<string, Function[]>> = {};
function on(namespace, event, fn) { ... }
function off(namespace, event, fn) { ... }
function emit(namespace, event, data) { ... }
```

### 3c. Global event hook (called by native side)

```typescript
window.__WTN_OneSignalEvent = function(namespace, event, data) {
    emit(namespace, event, data);
};
```

Native teams fire this at the right lifecycle points:

| Native Event | JS Call |
|-------------|---------|
| Notification tapped | `window.__WTN_OneSignalEvent('Notifications', 'click', { notification: {...} })` |
| Permission granted/denied | `window.__WTN_OneSignalEvent('Notifications', 'permissionChange', { permission: true/false })` |
| Notification received in foreground | `window.__WTN_OneSignalEvent('Notifications', 'foregroundWillDisplay', { notification: {...} })` |
| User opted in/out | `window.__WTN_OneSignalEvent('User.PushSubscription', 'change', { current: { isOptedIn: true } })` |

### 3d. Proxy-based shim

Every namespace (`User`, `Notifications`, `Slidedown`, `Debug`) and the root
`OneSignal` object are wrapped in `Proxy`. This means:

- **Known methods** → translated to WTN native bridge calls
- **Unknown methods** (future OneSignal API versions) → safe no-op Promise +
  `console.warn` instead of a crash

```typescript
function makeProxy(target, path) {
    return new Proxy(target, {
        get(t, prop) {
            if (prop in t) return t[prop];
            console.warn(`[WTN] OneSignal.${path}.${prop} not implemented — no-op`);
            return () => Promise.resolve();
        }
    });
}
```

### 3e. Locking `window.OneSignal` and `window.OneSignalDeferred`

**Critical:** a plain assignment (`window.OneSignal = shim`) can be overwritten
when the real OneSignal SDK loads. We use `Object.defineProperty` to prevent
that:

```typescript
Object.defineProperty(window, 'OneSignal', {
    get: () => shimOneSignal,
    set: () => { /* ignore — inside WTN native app */ },
    configurable: false,
});

Object.defineProperty(window, 'OneSignalDeferred', {
    get: () => deferredShim,
    set: () => { /* ignore */ },
    configurable: false,
});
```

This guarantees our shim stays in place regardless of script load order or
the real SDK trying to overwrite it.

### 3f. OneSignalDeferred queue drain

```typescript
const existingQueue = Array.isArray(window.OneSignalDeferred)
    ? window.OneSignalDeferred : [];

// Drain callbacks queued before our script loaded
existingQueue.forEach(fn => {
    if (typeof fn === "function") fn(shimOneSignal);
});
```

---

## Step 4 — Wiring

### `client.ts` (full SDK bundle)

```typescript
import * as OneSignalExtended from "./src/OneSignal/extended";
import { initOneSignalOverride } from "./src/OneSignalOverride";

window.WTN.OneSignal = { ...OneSignal, ...OneSignalExtended };
// ...
initOneSignalOverride(); // must run after window.WTN is fully assembled
```

### `onesignal-bridge.ts` (standalone bundle)

```typescript
if (!window.WTN) window.WTN = {};
window.WTN.OneSignal = { ...OneSignal, ...OneSignalExtended };
window.WTN.Firebase = Firebase;
initOneSignalOverride();
```

If the full `webtonative.min.js` is also loaded, it reuses the existing `WTN`
object — no conflict.

---

## Behavior Matrix

| Scenario | Result |
|----------|--------|
| Regular browser (no WTN) | Override exits silently, OneSignal Web SDK works normally |
| No OneSignal on page | Override exits silently, no effect |
| OneSignal inside WTN app | All calls routed through native bridge |
| `OneSignal.login("u123")` | `WTN.OneSignal.setExternalUserId("u123")` |
| `OneSignal.User.PushSubscription.optIn()` | `WTN.OneSignal.optInUser()` |
| `OneSignal.User.addTag("plan", "pro")` | `WTN.OneSignal.setTags({ tags: { plan: "pro" } })` |
| `OneSignal.Slidedown.promptPush()` | No-op + console.warn |
| Unknown future method called | No-op Promise + console.warn (Proxy catches it) |
| Notification tapped natively | `Notifications.click` listeners fire |
| Real OneSignal SDK tries to overwrite shim | Blocked by `Object.defineProperty` |

---

## Pending

- [ ] Apply `Object.defineProperty` lock for `window.OneSignal` and
  `window.OneSignalDeferred` (currently uses plain assignment — real SDK can
  overwrite the shim)
