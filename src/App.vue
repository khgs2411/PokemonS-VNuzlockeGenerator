<template>
  <Loading />
  <Pokedex />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Pokedex from "./views/Pokedex.vue";
import Loading from "./components/Loading.vue";
export default defineComponent({
  name: "App",
  components: {
    Pokedex,
    Loading,
  },
  setup() {
    // https://pokeapi.co/api/v2/region/{id or name}/
  },
});
</script>

<style scoped></style>
