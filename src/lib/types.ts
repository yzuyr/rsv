// Shared type for the router context
import type { NavigateOptions } from './navigate.js';

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
