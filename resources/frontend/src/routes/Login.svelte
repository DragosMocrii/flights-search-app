<script>
  import { link } from "svelte-spa-router";
</script>

<div>
  <input type="email" name="email" placeholder="Email" />
  <input type="password" name="pass" placeholder="Password" />
  <button>Log in</button>
</div>

<a href="/signup" use:link>Sign Up</a>
