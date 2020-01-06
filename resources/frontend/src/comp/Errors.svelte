<script>
  import { onMount } from "svelte";
  import { app_errors } from "../stores";

  let errors = [];

  $: {
    $app_errors.forEach(error => {
      errors = [
        ...errors,
        {
          message: error,
          added_at: Date.now()
        }
      ];
    });

    $app_errors = [];
  }

  let cleanup_interval = setInterval(() => {
    errors = errors.filter(({ added_at }) => added_at + 3 * 1000 > Date.now());
  }, 1000);

  onMount(() => {
    return () => {
      clearInterval(cleanup_interval);
    };
  });
</script>

<style lang="scss">
  ul {
    padding: 10px;
    background: #fff0f0;
    color: red;
    margin: 0;
    margin-bottom: 10px;
  }
  li {
    list-style: none;
    color: red;
  }
</style>

{#if errors.length > 0}
  <div>
    <ul>
      {#each errors as error}
        <li>{error.message}</li>
      {/each}
    </ul>
  </div>
{/if}
