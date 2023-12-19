<template>
	<div class="location">
		<small>Select a location to view available encounters</small>
		<div class="options">
			<Icon width="32" icon="mdi:pokemon-go" />
			<Dropdown @update:model-value="onSelectLocation" filter placeholder="Select an area for an encounter" option-label="label" option-value="value" v-model="location" :options="locations"></Dropdown>
			<div v-tooltip="'Finished all available encounters in this area'">
				<Icon width="32" :rotate="90" icon="ic:baseline-catching-pokemon" v-if="location && areas[location]?.encounters.length > areas[location]?.availableEncounters" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import Dropdown from "primevue/dropdown";
import { useDataStore } from "../common/store/data.store";
import Lib from "../services/lib.services";
// import { NamedAPIResource } from "../common/types/pokedex.type";
import { storeToRefs } from "pinia";
import { Icon } from "@iconify/vue";
import { useSettingsStore } from "../common/store/settings.store";
import { usePokemon } from "../common/composables/usePokemon";

export default defineComponent({
	name: "Location",
	components: {
		Icon,
		Dropdown,
	},
	setup() {
		const store = useDataStore();
		const { location, generatedEncounterCount, selectedEncounter, areas } = storeToRefs(store);
		const settings = useSettingsStore();
		const { showCheaterMessage, currentRegion } = storeToRefs(settings);

		const locations = computed((): { label: string; value: string }[] => {
			return Lib.isNumpty(currentRegion.value)
				? []
				: Object.keys(store.enocunters.locations[currentRegion.value]).map((location: string) => {
						return {
							label: Lib.toTitleCase(location),
							value: location,
						};
					});
		});

		function onSelectLocation(value: string) {
			const exists = areas.value[value];
			if (!exists) {
				areas.value[value] = {
					encounters: [],
					generatedCount: 0,
					availableEncounters: settings.encountersPerArea,
					lastCapture: undefined,
				};
			}
			showCheaterMessage.value = false;
			selectedEncounter.value = undefined;
		}

		return {
			locations,
			generatedEncounterCount,
			showCheaterMessage,
			location,
			onSelectLocation,
			...usePokemon(),
		};
	},
});
</script>

<style lang="scss" scoped>
.location {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	.options {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 42px;
		gap: 1rem;
	}
}
</style>
