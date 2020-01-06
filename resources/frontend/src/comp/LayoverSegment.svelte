<script>
  export let type;
  export let starts_at;
  export let ends_at;
  export let duration;
  export let starts_at_timestamp;
  export let ends_at_timestamp;
</script>

<style lang="scss">
  .segment-wrapper {
    text-align: center;
    font-style: italic;
    font-size: 13px;
    color: #999;

    &:not(:last-child) {
      margin-bottom: 10px;
    }
  }
</style>

<div class="segment-wrapper">{duration} layover</div>
