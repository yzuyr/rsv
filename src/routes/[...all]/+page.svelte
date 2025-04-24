<script lang="ts">
	const useHash = true;
	import App from '../../test/app.svelte';
	import AppHash from '../../test/app-hash.svelte';
</script>

{#if useHash}
	<AppHash />
{:else}
	<App />
{/if}
