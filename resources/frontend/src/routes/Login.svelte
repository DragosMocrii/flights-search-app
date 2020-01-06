<script>
  import { link, push } from "svelte-spa-router";
  import { getData } from "../utils/requests";
  import { auth_token, app_errors } from "../stores";

  let email;
  let password;

  async function logIn() {
    const response = await getData("/api/auth", {
      email: email,
      password: password
    });

    if (response.errors) {
      $app_errors = [...$app_errors, ...response.errors];
    } else {
      auth_token.set(response.token);
      //bad practice to store in lcoalStorage :(
      localStorage.setItem("auth_token", response.token);
      push("/trips/new");
    }
  }
</script>

<style lang="scss">
  input {
    border: 1px solid #ccc;
    padding: 8px 10px;
  }

  button {
    border: 1px solid #ccc;
    background: #fff;
    color: #000;
    padding: 8px 10px;
  }

  small {
    margin-top: 10px;
    display: inline-block;
  }
</style>

<div>
  <input bind:value={email} type="email" name="email" placeholder="Email" />
  <input
    bind:value={password}
    type="password"
    name="pass"
    placeholder="Password" />
  <button on:click={logIn}>Log in</button>
</div>

<small>
  No account?
  <a href="/signup" use:link>Sign Up</a>
</small>
