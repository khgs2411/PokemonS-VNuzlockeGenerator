<template>
	<div class="pokedex">
		<!-- <div class="view">
			<SelectButton option-label="label" option-value="value" :options="viewOptions" v-model="view"></SelectButton>
		</div> -->
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
import { ref, defineComponent, onMounted, Ref } from "vue";
import { usePokemonStore } from "../common/store/pokemon.store";
import Lib from "../services/lib.services";
import Location from "../components/Location.vue";
import Map from "../components/Map.vue";
import { storeToRefs } from "pinia";
import Encounters from "../components/Encounters.vue";
import SelectButton from "primevue/selectbutton";
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
		const store = usePokemonStore();
		const { version } = storeToRefs(store);

		const view: Ref<"map" | "encounters"> = ref("encounters"); // "map" | "encounters
		const viewOptions = ref([
			{ label: "Show Encounters", value: "encounters" },
			{ label: "Show Map", value: "map" },
		]);

		onMounted(async () => {
			await store.init();
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
	height: calc(100% - 32px);
	width: 80%;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	position: relative;
	.view {
		position: absolute;
		top: calc(32px + 0.5rem);
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
../common/store/pokemon.store
