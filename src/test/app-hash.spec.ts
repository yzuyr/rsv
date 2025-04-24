import { describe, it, expect, beforeEach } from 'vitest';
import { render, act } from '@testing-library/svelte';
import AppHash from './app-hash.svelte';
import { navigate } from '../lib/index.js';

describe('Test App (hash mode)', () => {
	beforeEach(() => {
		window.location.hash = '';
	});

	it('renders fallback route when no match', async () => {
		window.location.hash = '#/not-a-route';
		const { getByTestId } = render(AppHash);
		await act(() => {
			navigate('/not-a-route');
		});
		await new Promise((resolve) => setTimeout(resolve, 100));
		const fallback = getByTestId('fallback').innerText;
		expect(fallback).toEqual('Fallback route');
	});

	it('handles query parameters', async () => {
		window.location.hash = '#/foo?bar=baz';
		const { getByText } = render(AppHash);
		await act(() => {
			navigate('/foo?bar=baz');
		});
		await new Promise((resolve) => setTimeout(resolve, 100));
		const rendered = getByText('Foo').innerText;
		expect(rendered).toEqual('Foo');
	});

	it('handles dynamic segments', async () => {
		window.location.hash = '#/baz/123';
		const { getByTestId } = render(AppHash);
		await act(() => {
			navigate('/baz/123');
		});
		await new Promise((resolve) => setTimeout(resolve, 100));
		const rendered = getByTestId('app-path').innerText;
		expect(rendered).toEqual('123');
	});

	it('renders children', async () => {
		window.location.hash = '#/foo';
		const { getByText } = render(AppHash);
		act(() => {
			navigate('/foo');
		});
		await new Promise((resolve) => setTimeout(resolve, 100));
		const rendered = getByText('Foo').innerText;
		expect(rendered).toEqual('Foo');
	});

	it('can navigate', async () => {
		window.location.hash = '#/foo';
		const { getByText, getByTestId } = render(AppHash);
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
