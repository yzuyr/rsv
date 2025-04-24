<script lang="ts">
	import { useRsv } from '../lib/index.js';
	const router = useRsv();
	const path = $derived(router.getParam('id'));
</script>

<p data-testid="app-path">{path}</p>
