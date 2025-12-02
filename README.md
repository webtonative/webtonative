# WebToNative SDK

Repository for WebToNative TypeScript/JavaScript SDK. Build your Android/iOS app from https://webtonative.com

## Installation

```bash
npm install webtonative
```

## TypeScript Support

This package includes TypeScript type definitions. You can use it in your TypeScript projects with full type checking and autocompletion support.

```typescript
import webtonative from 'webtonative';

// Use with TypeScript type checking
webtonative.statusBar({ color: '#FFFFFF', style: 'dark' });

// Access device information with typed response
webtonative.deviceInfo().then(info => {
  console.log(info);
});
```

## Documentation

For complete documentation, visit:
https://docs.webtonative.com
