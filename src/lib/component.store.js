import { writable } from 'svelte/store';
import Adduser from './components/custom/adduser.svelte';

export const componentSide = writable();
export const componentData = writable();
export const importStatus = writable(0);

export const isAuthenticated = writable(true);
export const role = writable('admin');
export const viewSummary = writable(0);

export function login() {
	isAuthenticated.set(true);
}

export function logout() {
	isAuthenticated.set(false);
}
