# RSV

Tiny router for Svelte 5 SPAs. Runes friendly.

## Features

- Minimal, fast, and dependency-free
- Supports dynamic segments (e.g. `/user/:id`)
- Fallback route support
- Route param and query param helpers
- Imperative navigation API

## Installation

```sh
npm install @ryuz/rsv
```

## Usage

```svelte
<script lang="ts">
	import { Router, Route, navigate, useRsv } from '@ryuz/rsv';
</script>

<Router>
	<Route path="/" component={Home} />
	<Route path="/about" component={About} />
	<Route path="/user/:id" component={User} />
	<Route><!-- fallback route, rendered if no other matches --></Route>
</Router>
```

---

## Hash Router Mode

RSV supports both history and hash-based routing. Hash mode is useful for SPAs that are served from static file hosts or environments where server-side routing is not available.

### Enabling Hash Mode

Set the `mode` prop on the `Router` component:

```svelte
<Router mode="hash">
	<Route path="/foo" component={Foo} />
	<Route path="/bar" component={Bar} />
</Router>
```

### Anchor Hrefs in Hash Mode

When using hash mode, anchor tags should use `href="#/your-path"` to ensure navigation works as expected:

```svelte
<a href="#/bar">Go to Bar</a>
```

Imperative navigation (`router.navigate('/bar')` or `navigate('/bar')`) works the same in both modes.

### When to Use Hash Mode

- Deploying to static file hosts (e.g., GitHub Pages, S3, Netlify static)
- No server-side support for SPA routing
- Wanting URLs like `/#/foo` instead of `/foo`

---

### Dynamic Segments

If a route contains `:param`, the matched value is passed as a prop:

```svelte
<Route path="/user/:id" component={User} />
<!-- User receives prop { id } -->
```

### Fallback Route

If you omit the `path` prop, the Route acts as a fallback:

```svelte
<Route><!-- This renders if no other Route matches --></Route>
```

### Imperative Navigation

```ts
import { navigate } from '@ryuz/rsv';
navigate('/about');
navigate('/login', { replace: true });
```

### Access Router Context

```ts
import { useRsv } from '@ryuz/rsv';
const router = useRsv();
const currentPath = $derived(router.path);
```

### Query & Param Helpers

- `router.getQueryParam(key)` – get a query param value
- `router.hasQueryParam(key)` – check if param exists
- `router.removeQueryParams([keys])` – remove query params from URL
- `router.getParam(key)` – get a dynamic route param value (e.g. `id` from `/user/:id`)

## API Reference

### `<Router>`

- Provides routing context and manages URL state for child `<Route>` components.
- Props:
  - `url` (optional): initial path for SSR/testing
  - `children`: Route components (via slot)

### `<Route>`

- Renders its content when the current path matches `path` (supports dynamic segments, e.g. `/user/:id`).
- Props:
  - `path` (optional): route pattern. If omitted, acts as fallback route.
  - `component` (optional): Svelte component to render
  - `children`: fallback content if no `component` prop
- Dynamic segments (e.g. `:id`) are passed as props to the rendered component and are also accessible via `router.getParam(key)`.

### `navigate(to: string, options?: { replace?: boolean })`

- Programmatically change the route.
- `replace`: if true, replaces history entry

### `useRsv()`

- Returns the router context object:
  - `path`: current path
  - `routes`: all registered route patterns
  - `query`: query params as object
  - `params`: dynamic params as object
  - `navigate(to, options)`: navigation function
  - `getQueryParam(key)`: get query param value
  - `hasQueryParam(key)`: check if query param exists
  - `removeQueryParams([keys])`: remove query params from URL
  - `getParam(key)`: get dynamic route param value

## Credits

Prior art - [svelte-tiny-router](https://github.com/notnotsamuel/svelte-tiny-router)
