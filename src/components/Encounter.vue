<template>
  <div>
    <Dropdown
      filter
      placeholder="Select an area for an encounter"
      option-label="label"
      option-value="value"
      v-model="area"
      :options="locations"
    ></Dropdown>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from "vue";
import Dropdown from "primevue/dropdown";
import { usePokdexStore } from "../common/store/pokdex.store";
import Lib from "../services/lib.services";
import { NamedAPIResource } from "../common/types/pokedex.type";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "Encounter",
  components: {
    Dropdown,
  },
  setup() {
    const store = usePokdexStore();
    const { area } = storeToRefs(store);
    const locations = computed((): { label: string; value: string }[] => {
      return Lib.isNumpty(store.region?.locations)
        ? []
        : (store.region?.locations as NamedAPIResource[]).map(
            (location: NamedAPIResource) => {
              return {
                label: Lib.toTitleCase(location.name),
                value: location.name,
              };
            }
          );
    });

    watch(
      () => area.value,
      async (area) => {
        console.log(area);
        await store.getLoaction();
        await store.getPokemonEncounters();
      }
    );
    return {
      locations,
      area,
    };
  },
});
</script>

<style scoped></style>
