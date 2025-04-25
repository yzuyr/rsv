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
 * Router context object.
 * @typedef {Object} RouterContext
 * @property {string | undefined} path - The current path.
 * @property {string[]} routes - All registered route patterns.
 * @property {Record<string, string>} query - Query parameters.
 * @property {Record<string, string>} params - Dynamic route parameters.
 * @property {function} navigate - Navigation function.
 * @property {function} getQueryParam - Get query parameter value.
 * @property {function} hasQueryParam - Check if query parameter exists.
 * @property {function} removeQueryParams - Remove query parameters from URL.
 * @property {function} getParam - Get dynamic route parameter value.
 */
export interface RouterContext {
	path: string | undefined;
	routes: string[];
	query: Record<string, string>;
	params: Record<string, string>;
	navigate: (to: string, options?: NavigateOptions) => void;
	getQueryParam: (key: string) => string | undefined;
	hasQueryParam: (key: string) => boolean;
	removeQueryParams: (keys: string[]) => void;
	getParam: (key: string) => string | undefined;
}
