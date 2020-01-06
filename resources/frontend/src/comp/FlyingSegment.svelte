<script>
  export let type;
  export let starts_at;
  export let ends_at;
  export let duration;
  export let airline_name;
  export let flight_code;
  export let location_from;
  export let location_to;
  export let starts_at_timestamp;
  export let ends_at_timestamp;
</script>

<style lang="scss">
  .segment-wrapper {
    display: flex;
    justify-content: space-evenly;
    padding: 10px 0;
    font-size: 13px;

    &:not(:last-child) {
      margin-bottom: 10px;
    }

    > div {
      padding: 0 8px;
      flex-basis: 25%;
    }
  }
</style>

<div class="segment-wrapper">
  <div>
    {airline_name}
    <br />
    {flight_code}
  </div>

  <div>
    <span>{starts_at}</span>
    <br />
    <span>{location_from}</span>
  </div>

  <div>
    <span>{ends_at}</span>
    <br />
    <span>{location_to}</span>
  </div>

  <div>{duration}</div>
</div>
