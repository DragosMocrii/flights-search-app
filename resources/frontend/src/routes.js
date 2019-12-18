import Login from './routes/Login.svelte'
import Signup from './routes/Signup.svelte'
import NotFound from './routes/NotFound.svelte'

const routes = {
    '/': Login,
    '/login': Login,
    '/signup': Signup,
    '*': NotFound,
}

export default routes