import { auth_token } from '../stores';
import { get } from 'svelte/store'
import { replace } from "svelte-spa-router"

async function fetchData(url = '', method = 'GET', data = {}) {
    const token_value = get(auth_token)
    // Default options are marked with *
    const opts = {
        method: method, // GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        //redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
    }

    if (method !== 'GET') {
        opts['body'] = JSON.stringify(data) // body data type must match "Content-Type" header
    }

    if (token_value) {
        opts.headers['Authorization'] = 'Bearer ' + token_value
    }

    const response = await fetch(url, opts);

    if (response.status === 401) {
        resetAuthToken()
    }

    return await response.json(); // parses JSON response into native JavaScript objects
}

export function postData(url, data) {
    return fetchData(url, 'POST', data)
}

export function getData(url, data) {
    const query_string = new URLSearchParams(data).toString()
    url = query_string ? (url + '?' + query_string) : url

    return fetchData(url, 'GET')
}

export function deleteData(url, data) {
    return fetchData(url, 'DELETE', data)
}

function resetAuthToken() {
    console.log('Auth token reset.')
    localStorage.removeItem('auth_token')
    auth_token.set(null)
    replace('/login')
}