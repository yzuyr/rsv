/**
 * Options for navigation.
 * @typedef {Object} NavigateOptions
 * @property {boolean} [replace] - If true, replaces the current history entry instead of pushing a new one.
 */
export type NavigateOptions = {
	/** If true, replaces the current history entry instead of pushing a new one. */
	replace?: boolean;
};

/**
 * Imperatively navigate to a new URL.
 *
 * This function updates the browser's history and dispatches a 'popstate' event so that
 * any listeners (such as the Router) can update their state accordingly.
 *
 * @param {string} to - The new URL to navigate to (absolute path, e.g. '/about').
 * @param {NavigateOptions} [options] - Navigation options.
 * @example
 *   navigate('/about');
 *   navigate('/login', { replace: true });
 */
export function navigate(to: string, { replace = false }: NavigateOptions = {}): void {
	if (typeof window === 'undefined') return;
	if (replace) {
		window.history.replaceState({}, '', to);
	} else {
		window.history.pushState({}, '', to);
	}
	// Notify listeners (such as the Router) to update their state.
	window.dispatchEvent(new Event('popstate'));
}
