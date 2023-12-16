<template>
  <div>
    <Pokedex />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Pokedex from "./views/Pokedex.vue";
export default defineComponent({
  name: "App",
  components: {
    Pokedex,
  },
  setup() {
    // https://pokeapi.co/api/v2/region/{id or name}/
  },
});
</script>

<style scoped></style>
