<template>
  <div class="pokedex">
    <div class="logos">
      <img
        :class="[{ selected: version == 'scarlet' }]"
        src="../assets/Pokemon_Scarlet_Logo.png"
        @click="version = 'scarlet'"
        alt="scarlet"
      />
      <img
        :class="[{ selected: version == 'violet' }]"
        src="../assets/Pokemon_Violet_Logo.png"
        @click="version = 'violet'"
        alt="violet"
      />
    </div>
    <Encounter />
    <Map />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, watch } from "vue";
import { usePokdexStore } from "../common/store/pokdex.store";
import Lib from "../services/lib.services";
import Encounter from "../components/Encounter.vue";
import Map from "../components/Map.vue";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "Pokedex",
  components: {
    Encounter,
    Map,
  },
  setup() {
    const store = usePokdexStore();
    const { version } = storeToRefs(store);
    const region = computed(() => store.region);

    async function init() {
      await store.init();
    }

    watch(
      store.$state,
      (state) => {
        // persist the whole state to the local storage whenever it changes
        localStorage.setItem("pokedex", JSON.stringify(state));
      },
      { deep: true }
    );

    onMounted(async () => {
      await init();
    });
    return {
      version,
      region,
      Lib,
    };
  },
});
</script>

<style scoped lang="scss">
.pokedex {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  .logos {
    display: flex;
    justify-content: center;
    gap: 1rem;
    img {
      cursor: pointer;
      width: 300px;
      height: auto;
      &:not(.selected) {
        opacity: 0.3;
      }
    }
  }
}
</style>
