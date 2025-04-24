<script lang="ts">
	import { Router, Route } from '../lib/index.js';
	import Foo from './foo.svelte';
	import Bar from './bar.svelte';
	import Baz from './baz.svelte';
</script>

<Router>
	<Route path="/foo" component={Foo} />
	<Route path="/bar" component={Bar} />
	<Route path="/baz/:id" component={Baz} />
	<Route>
		<p data-testid="fallback">Fallback route</p>
	</Route>
</Router>
