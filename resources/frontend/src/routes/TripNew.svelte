<script>
  import FlightRoutePicker from "../comp/FlightRoutePicker.svelte";
  import SearchResults from "../comp/SearchResults.svelte";
  import { postData } from "../utils/requests";
  import { link, push } from "svelte-spa-router";
  import { app_errors } from "../stores";

  let trip_type = "one-way";
  let trip_itinerary = [];
  let current_search = null;
  let search_data = null;
  let searching_depart_flights;
  let searching_return_flights;

  $: searching_depart_flights = !!current_search && trip_itinerary.length < 1;
  $: searching_return_flights = !!current_search && trip_itinerary.length == 1;

  function resetSearch() {
    //reset variables
    search_data = { depart: {}, return: {} };
    current_search = null;
    trip_itinerary = [];
    searching_depart_flights = null;
    searching_return_flights = null;
  }

  function searchFlights(event) {
    resetSearch();

    let search_query = Object.assign({}, event.detail.search_query);
    let filters = Object.assign({}, event.detail.filters);

    search_data.depart = {
      from: search_query.from,
      to: search_query.to,
      date: search_query.depart_date,
      filters: filters
    };

    if (trip_type === "roundtrip") {
      search_data.return = {
        from: search_query.to,
        to: search_query.from,
        date: search_query.return_date,
        filters: filters
      };
    }

    search_data = search_data;

    runSearch(search_data.depart);
  }

  async function runSearch(search_data_obj) {
    const response = await postData("/api/search", search_data_obj);

    if (response.search_hash) {
      current_search = response.search_hash;
    } else if (response.errors) {
      $app_errors = [...$app_errors, ...response.errors];
    }
  }

  function flightPicked(event) {
    trip_itinerary = trip_itinerary.concat([
      { result_id: event.detail.result_id }
    ]);
    current_search = null;

    if (
      (trip_type === "one-way" && trip_itinerary.length === 1) ||
      (trip_type === "roundtrip" && trip_itinerary.length === 2)
    ) {
      createTrip(trip_itinerary);
    } else {
      search_data.return.filters.min_depart_at = event.detail.ends_at_timestamp;
      runSearch(search_data.return);
    }
  }

  async function createTrip(trip_itinerary) {
    const response = await postData("/api/trips", { trip_itinerary });

    if (response.data.trip_id) {
      push("/trips/" + response.data.trip_id);
    } else if (response.errors) {
      $app_errors = [...$app_errors, ...response.errors];
    }
  }
</script>

<section>
  <FlightRoutePicker on:search={searchFlights} bind:type={trip_type} />
</section>

{#if !!current_search}
  <section>
    <SearchResults on:flightPicked={flightPicked} search_hash={current_search}>
      <p slot="current_action">
        {#if searching_depart_flights}
          Searching for depart flights...
        {:else if searching_return_flights}Searching for return flights...{/if}
      </p>
    </SearchResults>
  </section>
{/if}
