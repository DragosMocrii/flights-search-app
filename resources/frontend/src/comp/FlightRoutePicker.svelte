<script>
  import { onMount } from "svelte";
  import { getData } from "../utils/requests";
  import { createEventDispatcher } from "svelte";
  import Select from "svelte-select";
  import { app_errors } from "../stores";

  export let type = "one-way"; // one-way || roundtrip

  const dispatch = createEventDispatcher();

  let from_airport;
  let to_airport;
  let depart_date;
  let return_date;
  let filters = {};
  let filter_max_duration = 1440;
  let filter_max_layovers = 1;
  let filter_min_depart_at = "";
  let filter_restricted_airline;
  let search_query = {};

  $: filters = {
    max_duration: filter_max_duration,
    max_layovers: filter_max_layovers,
    min_depart_at: filter_min_depart_at,
    restricted_airline:
      filter_restricted_airline && filter_restricted_airline.id
        ? filter_restricted_airline.id
        : undefined
  };

  $: search_query = {
    from: from_airport && from_airport.id ? from_airport.id : undefined,
    to: to_airport && to_airport.id ? to_airport.id : undefined,
    depart_date: depart_date || null,
    return_date: type === "roundtrip" ? return_date : null
  };

  function initSearch() {
    dispatch("search", { search_query, filters });
  }

  async function findAirports(search_term) {
    const response = await getData("/api/airports", { search: search_term });

    if (response.data) {
      return response.data;
    } else if (response.errors) {
      $app_errors = [...$app_errors, ...response.errors];
    }
  }

  async function findAirlines(search_term) {
    const response = await getData("/api/airlines", { search: search_term });

    if (response.data) {
      return response.data;
    } else if (response.errors) {
      $app_errors = [...$app_errors, ...response.errors];
    }
  }
</script>

<style lang="scss">
  .flight-picker-wrapper {
    border-radius: 10px;
    border: 1px solid #ccc;
    background: #f0f0f0;
    padding: 20px;
    margin-bottom: 30px;
  }

  .row {
    &:not(:last-child) {
      margin-bottom: 10px;
    }

    &--submit {
      text-align: center;
    }
  }

  .btn {
    &.btn-submit {
      padding: 8px 16px;
      font-weight: 600;
      color: #000;
      border: 1px solid royalblue;
      background: #fff;
      border-radius: 4px;
    }
  }
</style>

<div class="flight-picker-wrapper">

  <div class="row">
    <label>
      One way:
      <input bind:group={type} type="radio" value="one-way" />
    </label>
    <label>
      Roundtrip:
      <input bind:group={type} type="radio" value="roundtrip" />
    </label>
  </div>

  <div class="row">
    <label>
      From:
      <Select
        loadOptions={findAirports}
        optionIdentifier="id"
        getSelectionLabel={option => option.iata_code + ' - ' + option.name}
        getOptionLabel={option => option.iata_code + ' - ' + option.name}
        bind:selectedValue={from_airport}
        placeholder="Search airports" />
    </label>
  </div>

  <div class="row">
    <label>
      To:
      <Select
        loadOptions={findAirports}
        optionIdentifier="id"
        getSelectionLabel={option => option.iata_code + ' - ' + option.name}
        getOptionLabel={option => option.iata_code + ' - ' + option.name}
        bind:selectedValue={to_airport}
        placeholder="Search airports" />
    </label>
  </div>

  <div class="row">
    <label>
      Depart:
      <input bind:value={depart_date} type="date" />
    </label>
    {#if type === 'roundtrip'}
      <label>
        Return:
        <input bind:value={return_date} min={depart_date} type="date" />
      </label>
    {/if}
  </div>

  <div class="row row--filter">
    Max stops:
    <input
      bind:value={filter_max_layovers}
      type="number"
      min="0"
      max="2"
      step="1"
      value={1} />
  </div>
  <div class="row row--filter">
    Max duration (minutes):
    <input
      bind:value={filter_max_duration}
      type="number"
      min="1"
      max="2880"
      step="1"
      value={1440} />
  </div>
  <div class="row row--filter">
    Restrict airline:
    <Select
      loadOptions={findAirlines}
      optionIdentifier="id"
      getSelectionLabel={option => option.name + ` (${option.iata_code})`}
      getOptionLabel={option => option.name + ` (${option.iata_code})`}
      bind:selectedValue={filter_restricted_airline}
      placeholder="Search airlines" />
    <input bind:value={filter_min_depart_at} type="hidden" />
  </div>

  <div class="row row--submit">
    <button on:click={initSearch} class="btn btn-submit">Find flights</button>
  </div>
</div>
