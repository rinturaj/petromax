import { writable } from 'svelte/store';
import Adduser from './components/custom/adduser.svelte';

export const componentSide = writable();

export const isAuthenticated = writable(true);

export function login() {
	isAuthenticated.set(true);
}

export function logout() {
	isAuthenticated.set(false);
}
