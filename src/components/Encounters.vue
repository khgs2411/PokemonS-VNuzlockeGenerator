<template>
	<div class="encounters">
		<div class="generator" v-if="locationHasEncounters">
			<Button @click="generateEncounter" outlined raised label="Generate an Encounter">
				<template #icon>
					<div class="icon"><Icon width="32" icon="mdi:pokeball"></Icon></div>
				</template>
			</Button>
			<transition name="fade-slide">
				<div class="encounter" v-if="selectedEncounter">
					<div class="image-container">
						<img v-if="pokedex[selectedEncounter.id]" :alt="selectedEncounter.name" :src="pokedex[selectedEncounter.id]?.sprites.front_default ?? ''" />
						<Icon v-else width="50px" icon="mdi:pokeball"></Icon>
					</div>
					<div class="encounter-name">
						{{ Lib.toTitleCase(selectedEncounter.name) }}
						<template v-if="team.find((pokemon) => pokemon.name == selectedEncounter?.name)"> (Caught) </template>
					</div>
					<div class="actions">
						<Button @click="caught" label="Caught">
							<template #icon>
								<div class="action-icon">
									<Icon icon="tabler:pokeball"></Icon>
								</div>
							</template>
						</Button>
						<Button severity="danger" @click="failed" label="Failed">
							<template #icon>
								<div class="action-icon">
									<Icon icon="tabler:pokeball-off"></Icon>
								</div>
							</template>
						</Button>
					</div>
				</div>
			</transition>
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
import { usePokemonStore } from "../common/store/pokemon.store";
import Lib from "../services/lib.services";
import { Icon } from "@iconify/vue";
import PokemonList from "./PokemonList.vue";
import Button from "primevue/button";
import { PokemonAPIResource } from "../common/types/pokedex.type";
import { storeToRefs } from "pinia";
import Divider from "primevue/divider";
import { usePokedexStore } from "../common/store/pokedex.store";

export default defineComponent({
	name: "Encounters",
	components: {
		Icon,
		PokemonList,
		Button,
		Divider,
	},
	setup() {
		const store = usePokemonStore();
		const pokedexStore = usePokedexStore();
		const { generatedEncounterCount: generatedCount, selectedEncounter, showCheaterMessage, showTeamSidebar } = storeToRefs(store);
		const team = computed(() => store.team);
		const region = computed(() => store.region);
		const encounterPerArea = computed(() => store.encounterPerArea);
		const pokedex = computed(() => pokedexStore.pokedex);
		const locationInformation = computed(() => store.locationInformation);
		const location = computed(() => store.location);
		const encounters = computed(() => store.enocunters.locations.paldea);

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
			generatedCount.value++;
			selectedEncounter.value = Lib.getRandomItem(selectedLocationEncounters.value);
			if (generatedCount.value > encounterPerArea.value) showCheaterMessage.value = true;
		}

		function caught() {
			if (!selectedEncounter.value) return;
			if (generatedCount.value > 1 && team.value.length > 0) {
				team.value[team.value.length - 1] = selectedEncounter.value;
			} else {
				team.value.push(selectedEncounter.value);
			}
			selectedEncounter.value = undefined;
			showTeamSidebar.value = true;
			showCheaterMessage.value = false;
		}

		function failed() {
			selectedEncounter.value = undefined;
			showCheaterMessage.value = false;
		}

		return {
			encounters: encounters,
			location: location,
			locationInformation: locationInformation,
			generatedCount: generatedCount,
			region: region,
			pokedex: pokedex,
			team: team,
			showCheaterMessage: showCheaterMessage,
			locationHasEncounters: locationHasEncounters,
			selectedLocationEncounters: selectedLocationEncounters,
			selectedEncounter: selectedEncounter,
			parseLocationName: parseLocationName,
			isSelectedLocation: isSelectedLocation,
			generateEncounter: generateEncounter,
			caught: caught,
			failed: failed,
			Lib: Lib,
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

		.encounter {
			display: flex;
			flex-direction: column;
			align-items: center;

			.encounter-name {
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

		.actions {
			display: flex;
			gap: 1rem;
			margin: 0.6rem 0;

			.action-icon {
				margin: 0 0.3rem;
			}
		}
	}

	.cheater-message {
		text-align: center;
		width: 100%;
		height: fit-content;
	}
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}

/* Slide-in Transition */
.slide-enter-active,
.slide-leave-active {
	transition: transform 0.5s;
}
.slide-enter,
.slide-leave-to {
	transform: translateX(100%);
}

/* Slide-out Transition */
.slide-out-enter-active,
.slide-out-leave-active {
	transition: transform 0.5s;
}
.slide-out-enter,
.slide-out-leave-to {
	transform: translateX(-100%);
}

/* Fade-Slide-in Transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
	transition: all 0.5s;
}
.fade-slide-enter,
.fade-slide-leave-to {
	opacity: 0;
	transform: translateX(100%);
}

/* Fade-Slide-out Transition */
.fade-slide-out-enter-active,
.fade-slide-out-leave-active {
	transition: all 0.5s;
}
.fade-slide-out-enter,
.fade-slide-out-leave-to {
	opacity: 0;
	transform: translateX(-100%);
}
</style>
../common/store/pokemon.store
