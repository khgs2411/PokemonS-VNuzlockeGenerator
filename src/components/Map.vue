<template>
  <div>
    <iframe
      src="https://mapgenie.io/pokemon-scarlet-violet/maps/paldea-region?embed=light"
      height="500"
      style="position: relative; width: 100%"
    ></iframe>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Map",
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
