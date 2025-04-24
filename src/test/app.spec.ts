import { describe, it, expect } from 'vitest';
import { render, act } from '@testing-library/svelte';
import App from './app.svelte';
import { navigate } from '../lib/index.js';

describe('Test App', () => {
	it('renders fallback route when no match', async () => {
		const { getByTestId } = render(App);
		await act(() => {
			navigate('/not-a-route');
		});
		await new Promise((resolve) => setTimeout(resolve, 100));
		const fallback = getByTestId('fallback').innerText;
		expect(fallback).toEqual('Fallback route');
	});

	it('handles query parameters', async () => {
		const { getByText } = render(App);
		await act(() => {
			navigate('/foo?bar=baz');
		});
		await new Promise((resolve) => setTimeout(resolve, 100));
		const rendered = getByText('Foo').innerText;
		expect(rendered).toEqual('Foo');
	});

	it('handles dynamic segments', async () => {
		const { getByTestId } = render(App);
		await act(() => {
			navigate('/baz/123');
		});
		await new Promise((resolve) => setTimeout(resolve, 100));
		const rendered = getByTestId('app-path').innerText;
		expect(rendered).toEqual('123');
	});

	it('renders children', async () => {
		const { getByText } = render(App);
		act(() => {
			navigate('/foo');
		});
		// wait for render
		await new Promise((resolve) => setTimeout(resolve, 100));
		const rendered = getByText('Foo').innerText;
		expect(rendered).toEqual('Foo');
	});

	it('can navigate', async () => {
		const { getByText, getByTestId } = render(App);
		await act(() => {
			navigate('/foo');
		});
		await new Promise((resolve) => setTimeout(resolve, 100));
		const anchor = getByTestId('app-navigate');
		await act(() => {
			anchor.click();
		});
		await new Promise((resolve) => setTimeout(resolve, 100));
		const rendered = getByText('Bar').innerText;
		expect(rendered).toEqual('Bar');
	});
});
