import { expect, it, vi } from 'vitest';
import { navigate } from './navigate.js';

it('dispatches popstate event', () => {
	const listener = vi.fn();
	window.addEventListener('popstate', listener);
	navigate('/about');
	expect(listener).toHaveBeenCalled();
});
