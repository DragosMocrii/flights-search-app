<script>
  import { link } from "svelte-spa-router";
</script>

<div>
  <input type="email" name="email" placeholder="Email" />
  <input type="password" name="password" placeholder="Password" />
  <button>Sign Up</button>
</div>

<a href="/login" use:link>Log in</a>
