<script>
  import { onMount } from "svelte";
  import { getData } from "../utils/requests";
  import { link } from "svelte-spa-router";
  import { app_errors } from "../stores";

  let trips = [];

  onMount(() => {
    trips = fetchTrips();
  });

  async function fetchTrips() {
    const response = await getData("/api/trips");

    if (response.data) {
      return response.data;
    } else if (response.errors) {
      $app_errors = [...$app_errors, ...response.errors];
    }

    return [];
  }

  function displayDate(utc_date_string) {
    return new Date(utc_date_string).toLocaleString() + " current time";
  }
</script>

<style lang="scss">
  table {
    th {
      background: #f0f0f0;
      text-align: left;
    }

    th,
    td {
      padding: 4px;
    }
  }
</style>

{#await trips}
  Fetching trip data...
{:then trips}
  {#if trips.length > 0}
    <table>
      <tr>
        <th>Trip name</th>
        <th>Departs at</th>
        <th />
      </tr>
      {#each trips as trip}
        <tr>
          <td>{trip.name}</td>
          <td>{displayDate(trip.depart_at)}</td>
          <td>
            <a href="/trips/{trip.id}" use:link>Show</a>
          </td>
        </tr>
      {/each}
    </table>
  {:else}
    <p>
      You have no trips schedule.
      <a href="/trips/new" use:link>Create trip</a>
    </p>
  {/if}
{/await}
