<script lang="ts">
	import { setContext, onDestroy, type Snippet, onMount } from 'svelte';
	import { navigate as rsvNavigate, type NavigateOptions } from './navigate.js';

	let {
		url = '',
		children,
		mode = 'history'
	} = $props<{ url?: string; children: Snippet; mode?: 'history' | 'hash' }>();

	// Determine if we're in hash mode
	const isHashMode = mode === 'hash';

	import type { RouterContext } from './types.js';
	let initialPath = '/';
	if (typeof window !== 'undefined' && isHashMode) {
		const hash = window.location.hash.replace(/^#/, '') || '/';
		const [hashPath] = hash.split('?');
		initialPath = hashPath.startsWith('/') ? hashPath : '/' + hashPath;
	}
	if (typeof window !== 'undefined' && !isHashMode) {
		initialPath = window.location.pathname;
	}
	let router: RouterContext = $state({
		path: url || initialPath,
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

		let path: string;
		let search: string;

		if (isHashMode) {
			// Hash mode: path after #, query after ? in hash
			const hash = window.location.hash.replace(/^#/, '') || '/';
			const [hashPath, hashQuery = ''] = hash.split('?');
			path = hashPath.startsWith('/') ? hashPath : '/' + hashPath;
			search = hashQuery ? '?' + hashQuery : '';
		} else {
			path = window.location.pathname;
			search = window.location.search;
		}

		const params = new URLSearchParams(search);
		let queryObj: Record<string, string> = {};
		for (const [key, value] of params.entries()) {
			queryObj[key] = value;
		}

		router.path = path;
		router.query = queryObj;
	}

	// Assign the imported navigation to the router context.
	router.navigate = (to: string, options: NavigateOptions = {}) => {
		if (typeof window === 'undefined') return;
		if (isHashMode) {
			// In hash mode, update the hash
			const [path, search = ''] = to.split('?');
			const hash = path.startsWith('/') ? path : '/' + path;
			const hashWithQuery = search ? `${hash}?${search}` : hash;
			if (options.replace) {
				window.location.replace(`#${hashWithQuery}`);
			} else {
				window.location.hash = hashWithQuery;
			}
			// updateRouter will be called by hashchange event
		} else {
			rsvNavigate(to, options);
			updateRouter();
		}
	};

	/**
	 * Remove specified query parameters from the URL and update router state.
	 */
	function removeQueryParams(keys: string[]): void {
		if (typeof window === 'undefined') return;
		if (isHashMode) {
			// In hash mode, update the hash
			const hash = window.location.hash.replace(/^#/, '') || '/';
			const [hashPath, hashQuery = ''] = hash.split('?');
			const searchParams = new URLSearchParams(hashQuery);
			keys.forEach((key) => searchParams.delete(key));
			const newHashQuery = searchParams.toString();
			const newHash = `${hashPath}?${newHashQuery}`;
			window.location.hash = newHash;
			updateRouter();
		} else {
			const url = new URL(window.location.href);
			keys.forEach((key) => url.searchParams.delete(key));
			window.history.replaceState({}, '', url.toString());
			updateRouter();
		}
	}

	let popstateCleanup: (() => void) | undefined;

	if (typeof window !== 'undefined') {
		updateRouter();
		if (isHashMode) {
			window.addEventListener('hashchange', updateRouter);
			popstateCleanup = () => window.removeEventListener('hashchange', updateRouter);
		} else {
			window.addEventListener('popstate', updateRouter);
			popstateCleanup = () => window.removeEventListener('popstate', updateRouter);
		}
	}

	// Clean up event listeners on destroy
	onDestroy(() => {
		if (popstateCleanup) popstateCleanup();
	});

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
