# OneSignal Web Push SDK → WebToNative Native Bridge Override
## Implementation Plan

---

## Overview

Websites using OneSignal's Web Push JS SDK inside a WebToNative-wrapped app will automatically have their OneSignal calls routed through the native WTN bridge — no code changes required on the website side.

The override module is bundled inside the existing `bridge.js` / `webtonative.min.js`. It activates only when `window.WTN` is present (i.e., running inside a native WebToNative app).

---

## Step 1 — Add missing native bridge methods to `src/OneSignal/`

**File:** `src/OneSignal/types.ts`

Add new response types:

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

**File:** `src/OneSignal/index.ts`

Add 3 new exported functions following the existing callback/bridge pattern:

| Method | Android action | iOS action | Returns |
|--------|---------------|------------|---------|
| `getPermissionStatus()` | `getPermissionStatus` | `getPermissionStatus` | `Promise<PermissionStatusResponse>` |
| `requestPermission()` | `requestPermission` | `requestPermission` | `Promise<RequestPermissionResponse>` |
| `getSubscriptionStatus()` | `getSubscriptionStatus` | `getSubscriptionStatus` | `Promise<SubscriptionStatusResponse>` |

Each wraps the native callback in a Promise using `registerCb`.

---

## Step 2 — Verify `getFCMToken()` exists in `src/Firebase/Messaging/`

The `PushSubscription.token` getter maps to `WTN.Firebase.Messaging.getFCMToken()`.

- If it exists: no action needed.
- If missing: add it following the same pattern as other Firebase/Messaging methods, returning `Promise<string>`.

---

## Step 3 — Create `src/OneSignalOverride/index.ts`

This is the main new file (~300 lines). Structure:

### 3a. Activation guard

```typescript
export function initOneSignalOverride() {
    if (typeof window === "undefined" || !window.WTN) return;
    // proceed with override
}
```

### 3b. Internal event emitter

```typescript
const listeners: Record<string, Record<string, Function[]>> = {};

function on(namespace: string, event: string, fn: Function) { ... }
function off(namespace: string, event: string, fn: Function) { ... }
function emit(namespace: string, event: string, data: any) { ... }
```

### 3c. Global event hook (called by native side)

```typescript
window.__WTN_OneSignalEvent = function(namespace: string, event: string, data: any) {
    emit(namespace, event, data);
};
```

Native teams call this at:
- Notification tap → `emit("Notifications", "click", payload)`
- Permission change → `emit("Notifications", "permissionChange", payload)`
- Subscription change → `emit("User.PushSubscription", "change", payload)`
- Foreground notification → `emit("Notifications", "foregroundWillDisplay", payload)`

### 3d. Shim object

Build the full `OneSignal` v16 API surface:

```typescript
const shimOneSignal = {
    init: (options: any) => {
        log(`init(appId: ${options?.appId}) → no-op (native SDK pre-configured)`);
        return Promise.resolve();
    },

    login: (externalId: string) => {
        log(`login("${externalId}") → WTN.OneSignal.setExternalUserId`);
        return window.WTN.OneSignal.setExternalUserId(externalId);
    },

    logout: () => {
        log(`logout() → WTN.OneSignal.removeExternalUserId`);
        return window.WTN.OneSignal.removeExternalUserId();
    },

    User: {
        PushSubscription: {
            optIn: () => { ... WTN.OneSignal.optInUser() },
            optOut: () => { ... WTN.OneSignal.optOutUser() },
            get id() { return WTN.OneSignal.getPlayerId() },
            get token() { return WTN.Firebase.Messaging.getFCMToken() },
            addEventListener: (event, fn) => on("User.PushSubscription", event, fn),
            removeEventListener: (event, fn) => off("User.PushSubscription", event, fn),
        },
        addTag: (key, value) => WTN.OneSignal.setTags({ tags: { [key]: value } }),
        addTags: (tags) => WTN.OneSignal.setTags({ tags }),
        removeTag: (key) => WTN.OneSignal.setTags({ tags: { [key]: "" } }),
        removeTags: (keys) => WTN.OneSignal.setTags({ tags: Object.fromEntries(keys.map(k => [k, ""])) }),
        addTrigger: (key, value) => WTN.OneSignal.addTrigger({ key, value }),
        addTriggers: (triggers) => WTN.OneSignal.addTriggers({ triggers }),
        removeTrigger: (key) => WTN.OneSignal.removeTrigger({ key }),
        removeTriggers: (keys) => WTN.OneSignal.removeTriggers({ keys }),
        addEmail: (email) => WTN.OneSignal.setEmail({ emailId: email }),
        removeEmail: (email) => WTN.OneSignal.logoutEmail({ emailId: email }),
        addSms: (number) => WTN.OneSignal.setSMSNumber({ smsNumber: number }),
        removeSms: (number) => WTN.OneSignal.logoutSMSNumber({ smsNumber: number }),
    },

    Notifications: {
        requestPermission: () => WTN.OneSignal.requestPermission(),
        get permission() { return WTN.OneSignal.getPermissionStatus() },
        addEventListener: (event, fn) => on("Notifications", event, fn),
        removeEventListener: (event, fn) => off("Notifications", event, fn),
    },

    Slidedown: {
        promptPush: () => { warn("Slidedown.promptPush() → no-op"); return Promise.resolve(); },
        promptPushCategories: () => { warn("Slidedown.promptPushCategories() → no-op"); return Promise.resolve(); },
        promptSms: () => { warn("Slidedown.promptSms() → no-op"); return Promise.resolve(); },
        promptEmail: () => { warn("Slidedown.promptEmail() → no-op"); return Promise.resolve(); },
        promptSmsAndEmail: () => { warn("Slidedown.promptSmsAndEmail() → no-op"); return Promise.resolve(); },
    },

    Debug: {
        setLogLevel: (level: any) => { /* no-op */ },
    },
};
```

### 3e. Intercept `window.OneSignalDeferred`

```typescript
// Drain any existing queue
const existingQueue: Function[] = window.OneSignalDeferred || [];

// Replace with proxy that executes callbacks immediately with the shim
window.OneSignalDeferred = {
    push: (fn: Function) => {
        try { fn(shimOneSignal); } catch(e) { console.error("[WTN-Override]", e); }
    }
};

// Drain queued entries
existingQueue.forEach(fn => {
    if (typeof fn === "function") fn(shimOneSignal);
});
```

### 3f. Claim `window.OneSignal`

```typescript
window.OneSignal = shimOneSignal;
```

This causes the real OneSignal SDK to detect "already initialized" and back off.

### 3g. Debug logging helper

```typescript
const PREFIX = "[WTN-OneSignal-Override]";
const log = (msg: string) => console.log(`${PREFIX} ${msg}`);
const warn = (msg: string) => console.warn(`${PREFIX} ${msg}`);
```

---

## Step 4 — Wire into `client.ts`

**File:** `client.ts`

```typescript
import { initOneSignalOverride } from "./src/OneSignalOverride";

// After window.WTN is fully assembled (end of file):
initOneSignalOverride();
```

The override must run after `window.WTN` is set, but as early as possible so it claims `window.OneSignal` before the real SDK script loads.

---

## Step 5 — Add TypeScript global declarations

**File:** `src/OneSignalOverride/types.ts`

```typescript
declare global {
    interface Window {
        WTN: any;
        OneSignal: any;
        OneSignalDeferred: any;
        __WTN_OneSignalEvent: (namespace: string, event: string, data: any) => void;
    }
}
```

---

## Step 6 — Build

```bash
npm run build
```

Verify `build/webtonative.min.js` contains `WTN-OneSignal-Override` (grep to confirm the shim is bundled).

---

## Step 7 — Native side instrumentation (Android/iOS teams)

The native apps need to call the JS hook at the right lifecycle events:

| Native Event | JS Call |
|-------------|---------|
| Notification tapped | `window.__WTN_OneSignalEvent('Notifications', 'click', { notification: {...} })` |
| Permission granted/denied | `window.__WTN_OneSignalEvent('Notifications', 'permissionChange', { permission: true/false })` |
| Notification received in foreground | `window.__WTN_OneSignalEvent('Notifications', 'foregroundWillDisplay', { notification: {...} })` |
| User opted in/out | `window.__WTN_OneSignalEvent('User.PushSubscription', 'change', { current: { isOptedIn: true } })` |

---

## File Change Summary

| Action | File |
|--------|------|
| Add 3 methods + types | `src/OneSignal/index.ts`, `src/OneSignal/types.ts` |
| Verify / add getFCMToken | `src/Firebase/Messaging/index.ts` |
| **Create** override module | `src/OneSignalOverride/index.ts` ← main work |
| **Create** types | `src/OneSignalOverride/types.ts` |
| Wire up init call | `client.ts` |

---

## HTML Integration (User Documentation)

Instruct users to place the WTN bridge script **before** the OneSignal script:

```html
<head>
  <!-- 1. WebToNative bridge (includes OneSignal override) -->
  <script src="https://cdn.webtonative.com/bridge.js"></script>

  <!-- 2. OneSignal Web SDK (will be intercepted) -->
  <script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer></script>
</head>
```

Note: Even if load order is reversed, the override still works because OneSignal v16+ uses `OneSignalDeferred.push()` which is intercepted regardless of order.

---

## Behavior Matrix

| Scenario | Result |
|----------|--------|
| No OneSignal on page | Override exits silently, no effect |
| Regular browser (no WTN) | Override exits silently, OneSignal Web SDK works normally |
| OneSignal inside WTN app | All calls routed through native bridge |
| `OneSignal.login("u123")` | `WTN.OneSignal.setExternalUserId("u123")` |
| `OneSignal.User.PushSubscription.optIn()` | `WTN.OneSignal.optInUser()` |
| `OneSignal.User.addTag("plan", "pro")` | `WTN.OneSignal.setTags({ tags: { plan: "pro" } })` |
| `OneSignal.Slidedown.promptPush()` | No-op + console.warn |
| Notification tapped natively | `Notifications.click` listeners fire |
