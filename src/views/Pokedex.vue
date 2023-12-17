<template>
	<div class="pokedex">
		<div class="view">
			<SelectButton option-label="label" option-value="value" :options="viewOptions" v-model="view"></SelectButton>
		</div>
		<div class="logos">
			<img :class="[{ selected: version == 'scarlet' }]" src="../assets/Pokemon_Scarlet_Logo.png" @click="version = 'scarlet'" alt="scarlet" />
			<img :class="[{ selected: version == 'violet' }]" src="../assets/Pokemon_Violet_Logo.png" @click="version = 'violet'" alt="violet" />
		</div>
		<template v-if="view == 'encounters'">
			<Team />
			<Location />
			<Encounters />
		</template>
		<template v-if="view == 'map'">
			<Map />
		</template>
	</div>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, watch, Ref } from "vue";
import { usePokedexStore } from "../common/store/pokedex.store";
import Lib from "../services/lib.services";
import Location from "../components/Location.vue";
import Map from "../components/Map.vue";
import { storeToRefs } from "pinia";
import Encounters from "../components/Encounters.vue";
import SelectButton from "primevue/selectbutton";
import CacheService from "../services/cache.service";
import Team from "../components/Team.vue";

export default defineComponent({
	name: "Pokedex",
	components: {
		Location,
		Map,
		Encounters,
		Team,
		SelectButton,
	},
	setup() {
		const store = usePokedexStore();
		const { version } = storeToRefs(store);
		const view: Ref<"map" | "encounters"> = ref("encounters"); // "map" | "encounters
		const viewOptions = ref([
			{ label: "Show Encounters", value: "encounters" },
			{ label: "Show Map", value: "map" },
		]);

		async function init() {
			await store.init();
		}

		watch(
			store.$state,
			(state) => {
				const cache = {
					version: state.version,
					region: state.region,
					location: state.location,
					pokemon: state.pokemon,
					locationInformation: state.locationInformation,
				};
				CacheService.debouncedLocalStorageSave("pokedex", cache);
			},
			{ deep: true },
		);

		onMounted(async () => {
			await init();
		});
		return {
			version,
			view,
			viewOptions,
			Lib,
		};
	},
});
</script>

<style scoped lang="scss">
.pokedex {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	position: relative;
	.view {
		position: absolute;
		top: 1rem;
		right: 0;
		width: fit-content;
		height: fit-content;
	}
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
