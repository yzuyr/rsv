<script lang="ts">
	import { setContext, onDestroy, type Snippet, onMount } from 'svelte';
	import { navigate as rsvNavigate, type NavigateOptions } from './navigate.js';

	let { url = '', children } = $props<{ url?: string; children: Snippet }>();

	import type { RouterContext } from './types.js';
	let router: RouterContext = $state({
		path: url || (typeof window !== 'undefined' ? window.location.pathname : '/'),
		routes: [],
		query: {},
		params: {},
		navigate: () => {},
		getQueryParam: () => undefined,
		hasQueryParam: () => false,
		removeQueryParams: () => {},
		getParam: () => undefined
	});

	/**
	 * Update path and query params from window.location.
	 * Called on navigation and popstate.
	 */
	function updateRouter() {
		if (typeof window === 'undefined') return;
		router.path = window.location.pathname;
		const search = window.location.search;
		const params = new URLSearchParams(search);
		let queryObj: Record<string, string> = {};
		for (const [key, value] of params.entries()) {
			queryObj[key] = value;
		}
		router.query = queryObj;
	}

	// Assign the imported navigation to the router context.
	router.navigate = (to: string, options: NavigateOptions = {}) => {
		rsvNavigate(to, options);
		updateRouter();
	};

	/**
	 * Remove specified query parameters from the URL and update router state.
	 */
	function removeQueryParams(keys: string[]): void {
		if (typeof window === 'undefined') return;
		const url = new URL(window.location.href);
		keys.forEach((key) => url.searchParams.delete(key));
		window.history.replaceState({}, '', url.toString());
		updateRouter();
	}

	let popstateCleanup: (() => void) | undefined;

	onMount(() => {
		if (typeof window === 'undefined') return;
		updateRouter();
		const handler = updateRouter;
		window.addEventListener('popstate', handler);
		popstateCleanup = () => window.removeEventListener('popstate', handler);
	});

	// Clean up event listeners on destroy
	onDestroy(() => {
		if (popstateCleanup) popstateCleanup();
	});

	router.navigate = rsvNavigate;

	// Improved query helper function names.
	/**
	 * Get the value of a query parameter.
	 */
	router.getQueryParam = (key: string) => router.query[key];

	/**
	 * Check if a query parameter exists.
	 */
	router.hasQueryParam = (key: string) => Object.prototype.hasOwnProperty.call(router.query, key);

	/**
	 * Remove specified query parameters from the URL.
	 */
	router.removeQueryParams = removeQueryParams;

	/**
	 * Get the value of a dynamic route parameter.
	 */
	router.getParam = (key: string) => {
		if (!router.path) return undefined;
		return router.params[key];
	};

	/**
	 * Set the router context for child Route components.
	 * The router object exposes:
	 * - path: current path
	 * - routes: all registered route patterns
	 * - query: query params as object
	 * - navigate: navigation function
	 * - getQueryParam, hasQueryParam, removeQueryParams: helpers
	 */
	setContext('router', router);
</script>

<!-- Render children (the Route components) via the default slot -->
{@render children()}
