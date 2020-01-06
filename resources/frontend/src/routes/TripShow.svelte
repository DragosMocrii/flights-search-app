<script>
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import { getData, deleteData } from "../utils/requests";
  import FlyingSegment from "../comp/FlyingSegment.svelte";
  import LayoverSegment from "../comp/LayoverSegment.svelte";
  import { app_errors } from "../stores";

  export let params;
  let trip_data;

  async function fetchTrip() {
    const response = await getData(`/api/trips/${params.trip_id}`);

    if (response.data) {
      return response.data;
    } else if (response.errors) {
      $app_errors = [...$app_errors, ...response.errors];
      push("/trips");
      reject();
    }
  }

  async function deleteTrip() {
    const response = await deleteData(`/api/trips/${params.trip_id}`);

    if (response.data) {
      push("/trips");
    } else if (response.errors) {
      $app_errors = [...$app_errors, ...response.errors];
    }
  }

  onMount(() => {
    trip_data = fetchTrip();
  });
</script>

<style lang="scss">
  .flight-wrapper {
    border: 1px solid #ccc;
  }

  .separator {
    margin: 6px;
    text-align: center;
  }
</style>

<section>
  {#if trip_data == undefined}
    Loading...
  {:else}
    {#await trip_data}
      Fetching trip data...
    {:then trip_data}
      <div>
        <h1>
          {trip_data.trip_name}
          <small>
            <button on:click={deleteTrip}>Delete trip</button>
          </small>
        </h1>

        {#each trip_data.itinerary as item, i}
          {#if i > 0}
            <div class="separator">Return...</div>
          {/if}
          <div class="flight-wrapper">
            {#each item.route_segments as segment}
              {#if segment.type == 'flying'}
                <FlyingSegment {...segment} />
              {:else if segment.type == 'layover'}
                <LayoverSegment {...segment} />
              {/if}
            {/each}
          </div>
        {/each}
      </div>
    {/await}
  {/if}
</section>
