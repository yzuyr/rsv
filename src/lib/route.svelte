<script lang="ts">
	import { getContext, onMount, type Component, type Snippet } from 'svelte';

	let { path, component, children } = $props<{
		path?: string;
		component?: Component;
		children?: Snippet;
	}>();
	import type { RouterContext } from './types.js';
	const router = getContext<RouterContext>('router');

	// Only register the route pattern once (on mount), not on every render.
	onMount(() => {
		if (path && !router.routes.includes(path)) {
			router.routes.push(path);
		}
	});

	/**
	 * Match the current path against the route pattern.
	 * Supports dynamic segments (e.g. /user/:id).
	 * Returns params object if matched, null otherwise.
	 */
	function matchPath(current: string | undefined, route: string): Record<string, string> | null {
		const currentSegments = current?.split('/').filter(Boolean) || [];
		const routeSegments = route.split('/').filter(Boolean);
		if (currentSegments.length !== routeSegments.length) return null;
		let params: Record<string, string> = {};
		for (let i = 0; i < routeSegments.length; i++) {
			const rseg = routeSegments[i];
			const cseg = currentSegments[i];
			if (rseg.startsWith(':')) {
				// Dynamic segment—store the parameter.
				params[rseg.slice(1)] = cseg;
			} else if (rseg !== cseg) {
				return null;
			}
		}
		return params;
	}

	/**
	 * Extracts parameters from a route pattern and actual path.
	 * Returns an object of parameters if the path matches the pattern, undefined otherwise.
	 */
	function extractParams(
		routePattern: string,
		actualPath: string
	): Record<string, string> | undefined {
		const patternSegments = routePattern.split('/').filter(Boolean);
		const pathSegments = actualPath.split('/').filter(Boolean);
		const params: Record<string, string> = {};
		if (patternSegments.length !== pathSegments.length) return undefined;
		patternSegments.forEach((segment, index) => {
			if (segment.startsWith(':')) {
				const key = segment.slice(1);
				params[key] = pathSegments[index];
			} else if (segment !== pathSegments[index]) {
				throw new Error(
					`Segment mismatch at index ${index}: expected "${segment}", got "${pathSegments[index]}"`
				);
			}
		});
		return params;
	}

	// Compute match result for this route.
	let matchResult = $derived.by(() => {
		if (path) {
			return matchPath(router.path, path);
		} else {
			return null; // fallback route handled separately
		}
	});

	// Fallback route logic: only render if no other route matches.
	let fallbackMatch = $derived.by(() => {
		if (!path) {
			// this is the fallback route
			for (let pattern of router.routes) {
				if (matchPath(router.path, pattern) !== null) {
					return null; // a defined route matched—do not render fallback
				}
			}
			return {}; // no defined route matched—fallback should render
		} else {
			return null;
		}
	});

	// Should this route render?
	let shouldRender = $derived.by(() => {
		return path ? matchResult !== null : fallbackMatch !== null;
	});

	// Params to pass to the rendered component.
	let paramsToPass = $derived.by(() => {
		return matchResult || fallbackMatch || {};
	});

	$effect(() => {
		if (!shouldRender || !router.path || !path) return;
		const extractedParams = extractParams(path, router.path);
		if (!extractedParams) return;
		router.params = extractedParams;
	});
</script>

{#if shouldRender}
	{#if component}
		{@const Component = component}
		<Component {...paramsToPass} />
	{:else}
		{@render children()}
	{/if}
{/if}
