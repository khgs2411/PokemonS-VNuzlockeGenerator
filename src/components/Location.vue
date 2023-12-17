<template>
	<div class="location">
		<small>Select a location to view available encounters</small>
		<div class="options">
			<Icon width="32" icon="mdi:pokemon-go" />
			<Dropdown
				@update:model-value="
					() => {
						generatedEncounterCount = 0;
						showCheaterMessage = false;
						selectedEncounter = undefined;
					}
				"
				filter
				placeholder="Select an area for an encounter"
				option-label="label"
				option-value="value"
				v-model="location"
				:options="locations"></Dropdown>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import Dropdown from "primevue/dropdown";
import { usePokemonStore } from "../common/store/pokemon.store";
import Lib from "../services/lib.services";
import { NamedAPIResource } from "../common/types/pokedex.type";
import { storeToRefs } from "pinia";
import { Icon } from "@iconify/vue";

export default defineComponent({
	name: "Location",
	components: {
		Icon,
		Dropdown,
	},
	setup() {
		const store = usePokemonStore();
		const { locationInformation: area, location, generatedEncounterCount, showCheaterMessage, selectedEncounter } = storeToRefs(store);
		const locations = computed((): { label: string; value: string }[] => {
			return Lib.isNumpty(store.region?.locations)
				? []
				: (store.region?.locations as NamedAPIResource[]).map((location: NamedAPIResource) => {
						return {
							label: Lib.toTitleCase(location.name),
							value: location.name,
						};
					});
		});

		return {
			locations,
			generatedEncounterCount,
			showCheaterMessage,
			selectedEncounter,
			location,
			area,
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
../common/store/pokemon.store
