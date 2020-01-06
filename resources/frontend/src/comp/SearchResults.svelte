<script>
  import { onMount } from "svelte";
  import { getData } from "../utils/requests";
  import poll from "poll";
  import FlightInfo from "../comp/FlightInfo.svelte";
  import { app_errors } from "../stores";

  export let search_hash;

  let last_result_id = 0;
  let search_complete = false;
  let search_results = [];
  let ordered_search_results = [];

  $: no_results_found = search_complete && search_results.length < 1;

  $: {
    ordered_search_results = [...search_results].sort(function(a, b) {
      return a.total_price - b.total_price;
    });
  }

  onMount(async () => {
    poll(pollResults, 1000, () => search_complete == true);
  });

  async function pollResults() {
    const response = await getData("/api/search/" + search_hash, {
      last_result_id
    });

    last_result_id = response.last_result_id;

    if (response.data) {
      search_complete = response.search_completed;

      if (response.data.length > 0) {
        search_results = [...search_results, ...response.data];
      }
    } else if (response.errors) {
      $app_errors = [...$app_errors, ...response.errors];
      search_complete = true;
    }
  }
</script>

{#if !search_complete}
  <slot name="current_action" />
{/if}

{#if no_results_found}
  <p>No results found. Try a different search.</p>
{/if}

{#each ordered_search_results as search_result (search_result.result_id)}
  <FlightInfo on:flightPicked {...search_result} />
{/each}
