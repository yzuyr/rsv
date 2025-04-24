<script lang="ts">
	import { useRsv } from '../lib/index.js';

	const router = useRsv();
	const bar = $derived(router.getQueryParam('bar'));
</script>

<p>Foo</p>

<a href="#/bar" data-testid="app-anchor">Go to Bar with anchor</a>

<button onclick={() => router.navigate('/bar')} data-testid="app-navigate"
	>Go to Bar with button</button
>

<p data-testid="app-search-param">{bar}</p>
