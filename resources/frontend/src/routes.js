import Login from './routes/Login.svelte'
import Signup from './routes/Signup.svelte'
import NotFound from './routes/NotFound.svelte'
import TripNew from './routes/TripNew.svelte'
import TripIndex from './routes/TripIndex.svelte'
import TripShow from './routes/TripShow.svelte'
import { replace, wrap } from "svelte-spa-router"
import { get } from 'svelte/store'
import { auth_token } from './stores'

function ensureAuth() {
    if (!get(auth_token)) {
        replace('/login');
        return false;
    }

    return true;
}

const routes = {
    '/': Login,
    '/login': Login,
    '/signup': Signup,
    '/trips/new': wrap(TripNew, ensureAuth),
    '/trips/:trip_id': wrap(TripShow, ensureAuth),
    '/trips': wrap(TripIndex, ensureAuth),
    '*': NotFound,
}

export default routes
