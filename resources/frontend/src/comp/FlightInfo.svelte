<script>
  import FlyingSegment from "../comp/FlyingSegment.svelte";
  import LayoverSegment from "../comp/LayoverSegment.svelte";
  import { createEventDispatcher } from "svelte";

  export let result_id;
  export let flight_date;
  export let ends_at_timestamp;
  export let total_duration;
  export let total_duration_human;
  export let total_price;
  export let total_layovers;
  export let route_segments;

  const dispatch = createEventDispatcher();

  function pickFlight() {
    dispatch("flightPicked", { result_id, flight_date, ends_at_timestamp });
  }
</script>

<style lang="scss">
  .flight-wrapper {
    border: 1px solid #ccc;
    margin-bottom: 20px;
  }

  .header {
    background: #f0f0f0;
    padding: 8px 10px;
    margin-bottom: 10px;

    &:after {
      content: "";
      display: block;
      clear: both;
    }
  }

  .footer {
    background: #f0f0f0;
    font-size: 13px;
    color: #999;
    padding: 8px 10px;
  }

  .total-price {
    font-weight: 600;
    font-size: 26px;
    color: olivedrab;
  }

  .btn {
    &--select {
      background: orangered;
      color: #fff;
      font-size: 15px;
      padding: 10px;
      border: none;
      opacity: 0.95;
      float: right;

      &:hover {
        opacity: 1;
      }
    }
  }
</style>

<div class="flight-wrapper">
  <div class="total-price header">
    <button class="btn btn--select" on:click={pickFlight}>Select</button>
    ${total_price}
  </div>

  {#each route_segments as segment}
    {#if segment.type == 'flying'}
      <FlyingSegment {...segment} />
    {:else if segment.type == 'layover'}
      <LayoverSegment {...segment} />
    {/if}
  {/each}

  <div class="footer">
    {total_duration_human} trip time |
    {#if total_layovers > 0}{total_layovers} stops{:else}direct flight{/if}
  </div>
</div>
