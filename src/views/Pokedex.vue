<template>
	<div style="height: 32px"></div>
	<div class="pokedex">
		<div class="logos">
			<img :class="[{ selected: version == 'scarlet' }]" src="../assets/Pokemon_Scarlet_Logo.png" @click="version = 'scarlet'" alt="scarlet" />
			<img :class="[{ selected: version == 'violet' }]" src="../assets/Pokemon_Violet_Logo.png" @click="version = 'violet'" alt="violet" />
		</div>
		<template v-if="view == 'encounters'">
			<div class="content">
				<PokemonBox />
				<Location />
				<Encounters />
				<Settings />
			</div>
		</template>
		<template v-if="view == 'map'">
			<Map />
		</template>
	</div>
</template>

<script lang="ts">
import { storeToRefs } from "pinia";
import SelectButton from "primevue/selectbutton";
import { computed, defineComponent, onMounted } from "vue";
import { useDataStore } from "../common/store/data.store";
import { useSettingsStore } from "../common/store/settings.store";
import Encounters from "../components/Encounters.vue";
import Location from "../components/Location.vue";
import Map from "../components/Map.vue";
import PokemonBox from "../components/PokemonBox.vue";
import Lib from "../services/lib.services";
import Settings from "../components/Settings.vue";

export default defineComponent({
	name: "Pokedex",
	components: {
		Location,
		Map,
		Encounters,
		PokemonBox,
		SelectButton,
		Settings,
	},
	setup() {
		const store = useDataStore();
		const settings = useSettingsStore();
		const { version } = storeToRefs(store);
		const view = computed(() => settings.view);

		onMounted(async () => {
			await store.init();
		});

		return {
			view,
			version,
			Lib,
		};
	},
});
</script>

<style scoped lang="scss">
.pokedex {
	height: calc(100% - calc(32px * 2));
	width: 80%;
	margin: auto;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	position: relative;

	.logos {
		height: 8rem;
		width: 100%;
		display: flex;
		justify-content: center;
		gap: 1rem;
		img {
			cursor: pointer;
			height: 8rem;
			width: auto;
			&:not(.selected) {
				opacity: 0.3;
			}
		}
	}

	.content {
		height: calc(100% - 150px);
		overflow: hidden;
		overflow-y: auto;
	}
}
</style>
