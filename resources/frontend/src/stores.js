import { writable } from 'svelte/store'

const token_val = localStorage.getItem('auth_token') || null

export const auth_token = writable(token_val)

export const app_errors = writable([])