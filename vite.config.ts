import { svelteTesting } from '@testing-library/svelte/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), svelteTesting()],
	test: {
		name: 'client',
		environment: 'happy-dom',
		clearMocks: true,
		setupFiles: ['./vitest-setup-client.ts']
	}
});
