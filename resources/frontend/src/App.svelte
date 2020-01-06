<script>
  import Router, { link } from "svelte-spa-router";
  import routes from "./routes";
  import Errors from "./comp/Errors.svelte";
</script>

<style lang="scss">
  :global(body) {
    padding-bottom: 50px;
  }

  nav {
    margin-bottom: 24px;
  }

  main {
    margin-top: 60px;
    margin-left: auto;
    margin-right: auto;
    max-width: 600px;
  }
</style>

<main>
  <nav>
    <a href="/trips" use:link>All trips</a>
    |
    <a href="/trips/new" use:link>New Trip</a>
  </nav>
  <Errors />
  <Router {routes} />
</main>
