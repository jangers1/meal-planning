# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
````

## Global Alert System (Joy UI)

A reusable global alert/toast system has been added using Joy UI components. It supports:

- Color + variant selection (leveraging Joy UI `Alert` props)
- Success / Error / Info / Warning convenience helpers
- Loading state with a spinner
- Optional progress bar (indeterminate or determinate with clamped 0–100 values)
- Optional title + message
- Optional custom action area + custom icon
- Auto-hide with per-alert duration
- Persistent (manual dismiss) alerts
- Manual update of existing alerts (e.g. switch from loading -> success)
- Max stack size with oldest non-persistent replacement
- Smooth enter / exit slide + scale transitions
- Accessible roles (`role="alert"`, aria-live regions, progress aria attributes)
- Programmatic clear-all

### Core Files

- `src/components/ui_components/alerts/AlertProvider.tsx` – Context provider, hook, renderer
- `src/components/ui_components/alerts/AlertDemo.tsx` – Optional demo / examples (remove when not needed)

### Setup

`main.tsx` already wraps the app:

```tsx
<AlertProvider>
  <App />
</AlertProvider>
```

You can customize position or stack size:
```tsx
<AlertProvider position="bottom-left" maxStack={7} gap={10}>
  <App />
</AlertProvider>
```
Positions: `top-right` (default), `top-left`, `bottom-right`, `bottom-left`.

### Hook API

```ts
const {
  alerts,        // current alert objects
  push,          // push(options) => id
  pushSuccess,   // shorthand
  pushError,
  pushInfo,
  pushWarning,
  update,        // update(id, patch)
  dismiss,       // dismiss(id)
  clear          // clear all (animated)
} = useAlerts();
```

### Creating Alerts

```ts
const id = push({
  title: 'Saving',
  message: 'We are saving your changes…',
  color: 'neutral',
  loading: true,
  withProgress: true,         // indeterminate progress bar
  autoHideDuration: 5000       // optional
});
```

### Updating (e.g. after async completes)

```ts
update(id, {
  title: 'Saved',
  message: 'All changes stored successfully',
  color: 'success',
  loading: false,
  progress: 100,
  autoHideDuration: 2500
});
```

### Determinate Progress Example

```ts
const uploadId = push({
  title: 'Uploading',
  message: 'Starting upload…',
  loading: true,
  withProgress: true,
  progress: 0,
  persistent: true // prevent auto removal until finished
});

// Later in a loop / interval
update(uploadId, {progress: 42});
// On completion
update(uploadId, {title: 'Complete', loading: false, color: 'success', autoHideDuration: 2000, persistent: false});
```

### Convenience Helpers

```ts
pushSuccess('Profile saved');
pushError('Failed to save profile');
pushInfo('New version available');
pushWarning('Low remaining quota');
```

### Dismissing / Clearing

```ts
dismiss(id); // single
clear();     // all
```

### Custom Action Button

```ts
push({
  title: 'Undo Delete',
  message: 'Item deleted',
  color: 'warning',
  action: <Button size="sm" variant="soft" onClick={handleUndo}>Undo</Button>
});
```

### Edge Cases & Behavior

- Progress values automatically clamp to `[0,100]`.
- Oldest non-persistent alert is removed when max stack exceeded.
- Persistent alerts ignore `autoHideDuration`.
- `onClose` (if provided) fires after exit animation completes.

### Potential Enhancements (Future)

- Pause auto-hide on hover
- Add keyboard focus trap / focus return logic for action-heavy toasts
- Group duplicate messages with a counter
- Swipe-to-dismiss on touch devices
- Theming overrides via Joy UI custom variants
- SSR safety guards (current code already checks for `document`)
