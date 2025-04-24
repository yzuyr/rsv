/**
 * RSV exports: Router, Route, navigate, and useRsv.
 *
 * @module rsv
 */
import { getContext } from 'svelte';
import type { RouterContext } from './types.js';

/**
 * Router component for Svelte apps. Provides context for child Route components.
 * @see ./router.svelte
 */
export { default as Router } from './router.svelte';

/**
 * Route component for Svelte apps. Used as a child of Router.
 * @see ./route.svelte
 */
export { default as Route } from './route.svelte';

/**
 * Imperative navigation function for programmatic routing.
 * @see ./navigate.ts
 */
export { navigate } from './navigate.js';

/**
 * Access the router context anywhere in the component tree.
 * @returns {object} The router context (path, routes, query, helpers)
 * @example
 *   const router = useRsv();
 *   const currentPath = $derived(router.path);
 */
export function useRsv(): RouterContext {
	return getContext('router');
}
