<template>
	<div class="encounters">
		<div class="generator" v-if="locationHasEncounters">
			<Button :disabled="currentArea?.availableEncounters == 0" @click="generateEncounter" outlined raised label="Generate an Encounter">
				<template #icon>
					<div class="icon"><Icon width="32" icon="mdi:pokeball"></Icon></div>
				</template>
			</Button>
			<div class="selection">
				<template v-for="encounter in currentArea?.encounters">
					<transition name="fade-slide">
						<div class="encounter" v-if="encounter">
							<div class="image-container">
								<img v-if="pokedex[encounter.id]" :alt="encounter.name" :src="pokedex[encounter.id]?.sprites.front_default ?? ''" />
								<Icon v-else width="50px" icon="mdi:pokeball"></Icon>
							</div>
							<div class="encounter-name">
								{{ Lib.toTitleCase(encounter.name) }}
								<template v-if="team.find((pokemon) => pokemon.name == encounter?.name)"> (Caught) </template>
							</div>
							<div class="actions">
								<Button @click="() => catchPokemon(encounter)" label="Caught">
									<template #icon>
										<div class="action-icon">
											<Icon icon="tabler:pokeball"></Icon>
										</div>
									</template>
								</Button>
								<Button severity="danger" @click="() => failCapture(encounter)" label="Failed">
									<template #icon>
										<div class="action-icon">
											<Icon icon="tabler:pokeball-off"></Icon>
										</div>
									</template>
								</Button>
							</div>
						</div>
					</transition>
				</template>
			</div>
		</div>
		<div class="cheater-message" v-if="showCheaterMessage">
			<p>You little cheater ;)</p>
			<p>I won't tell anyone, don't worry</p>
			<p>You can pick whomever you like</p>
		</div>
		<Divider>
			<b>Available Encounters</b>
		</Divider>
		<template v-for="(pokemonList, loc) in encounters">
			<template v-if="isSelectedLocation(loc as string)">
				<template v-if="pokemonList">
					<p v-if="pokemonList.length == 0">There are no encounters in this area</p>
					<PokemonList :pokemon-list="pokemonList"></PokemonList>
				</template>
			</template>
		</template>
		<template v-if="!isSelectedLocation(location as string)">
			<p>There are no encounters in this area</p>
		</template>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useDataStore } from "../common/store/data.store";
import Lib from "../services/lib.services";
import { Icon } from "@iconify/vue";
import PokemonList from "./PokemonList.vue";
import Button from "primevue/button";
import { PokemonAPIResource } from "../common/types/pokedex.type";
import { storeToRefs } from "pinia";
import Divider from "primevue/divider";
import { usePokedexStore } from "../common/store/pokedex.store";
import { useSettingsStore } from "../common/store/settings.store";
import { usePokemon } from "../common/composables/usePokemon";

export default defineComponent({
	name: "Encounters",
	components: {
		Icon,
		PokemonList,
		Button,
		Divider,
	},
	setup() {
		const store = useDataStore();
		const settings = useSettingsStore();
		const pokedexStore = usePokedexStore();
		const { currentArea } = storeToRefs(store);
		const { showCheaterMessage, currentRegion } = storeToRefs(settings);
		const region = computed(() => store.region);
		const pokedex = computed(() => pokedexStore.pokedex);
		const location = computed(() => store.location);
		const encounters = computed(() => store.enocunters.locations[currentRegion.value]);

		const selectedLocationEncounters = computed((): PokemonAPIResource[] => {
			const found = Object.keys(encounters.value).find((loc) => loc == location.value || parseLocationName(loc) == location.value);
			if (found) return encounters.value[found];
			return [];
		});
		const locationHasEncounters = computed(() => {
			const found = Object.keys(encounters.value).find((loc) => loc == location.value || parseLocationName(loc) == location.value);
			if (found) return encounters.value[found].length > 0;
			return false;
		});

		function parseLocationName(loc: string) {
			let formattedLoc = loc;
			const directions = ["north", "south", "east", "west"];
			const directionRegex = new RegExp(`^(${directions.join("|")})`, "i");
			if (directionRegex.test(loc) && region.value?.name && region.value.name.trim() !== "") {
				formattedLoc = `${region.value.name.toLowerCase()}-${loc}`;
			}
			return formattedLoc;
		}

		function isSelectedLocation(loc: string): boolean {
			return loc == location.value || parseLocationName(loc as string) == location.value;
		}

		function generateEncounter() {
			if (!currentArea.value) return;
			if (currentArea.value.encounters.length > 0) {
				currentArea.value.encounters = [];
			}
			for (let i = 0; i < currentArea.value.availableEncounters; i++) {
				const pokemon = Lib.getRandomItem<PokemonAPIResource>(selectedLocationEncounters.value, currentArea.value.encounters);
				if (!pokemon) throw new Error("Something went wrong");
				currentArea.value.encounters.push(pokemon);
			}
			if (currentArea.value.generatedCount > 0 || currentArea.value.availableEncounters <= 0) showCheaterMessage.value = true;
			currentArea.value.generatedCount++;
		}

		return {
			currentArea,
			encounters,
			location,
			pokedex,
			showCheaterMessage,
			locationHasEncounters,
			selectedLocationEncounters,
			parseLocationName,
			isSelectedLocation,
			generateEncounter,
			Lib,
			...usePokemon(),
		};
	},
});
</script>

<style lang="scss" scoped>
.encounters {
	width: 100%;
	height: fit-content;

	.generator {
		margin: 1rem 0;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: 1rem;
		.icon {
			margin: 0 0.3rem;
		}
		.selection {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			gap: 1rem;
			.encounter {
				display: flex;
				flex-direction: column;
				align-items: center;

				.encounter-name {
				}
			}
		}
		.image-container {
			max-width: 100%; /* Ensure the container does not exceed its parent's width */
			margin: 0 auto; /* Center the container horizontally (optional) */
		}

		/* Style the image itself with specific width and height */
		.image-container img {
			width: 50px; /* Set the desired width for the image */
			height: auto; /* Set the desired height for the image */
			display: block; /* Remove any extra space below the image (removes inline-block spacing) */
			margin: 0 auto; /* Center the image horizontally (optional) */
		}
	}

	.cheater-message {
		text-align: center;
		width: 100%;
		height: fit-content;
	}
}
</style>
