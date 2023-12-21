import { storeToRefs } from "pinia";
import { watch } from "vue";
import { useDataStore } from "../store/data.store";
import { useSettingsStore } from "../store/settings.store";
import { PokemonAPIResource } from "../types/pokedex.type";

export const usePokemon = () => {
	const store = useDataStore();
	const settings = useSettingsStore();
	const { selectedEncounter, currentArea, team, caught, dead, inBox, forced, areas, region } = storeToRefs(store);
	const { showTeam, showCheaterMessage } = storeToRefs(settings);

	function catchPokemon(pokemon: PokemonAPIResource, force: boolean = false) {
		if (!pokemon || !currentArea.value) return;

		const replaceCurrentEncounter = currentArea.value.availableEncounters == 0 && currentArea.value.lastCapture;
		const shouldAddToTeam = team.value.length < 6;
		if (force || !replaceCurrentEncounter) {
			if (shouldAddToTeam) team.value.push(pokemon);
			else inBox.value.push(pokemon);
			caught.value.push(pokemon);
		}

		if (!force && replaceCurrentEncounter) {
			const teamIndex = team.value.findIndex((pokemon) => pokemon.name === currentArea.value?.lastCapture?.name);
			const caughtIndex = caught.value.findIndex((pokemon) => pokemon.name === currentArea.value?.lastCapture?.name);
			team.value[teamIndex] = pokemon;
			caught.value[caughtIndex] = pokemon;
		}

		if (!force) {
			currentArea.value.lastCapture = pokemon;
			currentArea.value.encounters.push(pokemon);
			currentArea.value.availableEncounters--;
			if (currentArea.value.availableEncounters < 0) currentArea.value.availableEncounters = 0;
		}

		showTeam.value = true;

		resetEncounter();
	}

	function failCapture() {
		resetEncounter();
	}

	function resetEncounter() {
		selectedEncounter.value = undefined;
		showCheaterMessage.value = false;
		if (currentArea.value) {
			currentArea.value.generatedCount = 0;
		}
	}

	function resetCaptures() {
		settings.resetCache();
		team.value = [];
		dead.value = [];
		inBox.value = [];
		caught.value = [];
		store.selectedEncounter = undefined;
		settings.showCheaterMessage = false;
		Object.keys(store.areas).forEach((area) => {
			store.areas[area].availableEncounters = settings.encountersPerArea;
			store.areas[area].defaultAvailableEncounters = settings.encountersPerArea;
			store.areas[area].encounters = [];
			store.areas[area].generatedCount = 0;
		});
	}

	function pokemonFainted(pokemon: PokemonAPIResource) {
		const teamIndex = team.value.findIndex((poke) => poke.name === pokemon.name);
		const inBoxIndex = inBox.value.findIndex((poke) => poke.name === pokemon.name);
		team.value.splice(teamIndex, 1);
		caught.value.splice(inBoxIndex, 1);
		dead.value.push(pokemon);
	}

	function removePokemon(pokemon: PokemonAPIResource) {
		const teamIndex = team.value.findIndex((poke) => poke.name === pokemon.name);
		const caughtIndex = caught.value.findIndex((poke) => poke.name === pokemon.name);
		const deadIndex = dead.value.findIndex((poke) => poke.name === pokemon.name);
		const forcedIndex = forced.value.findIndex((poke) => poke.name === pokemon.name);
		const inBoxIndex = inBox.value.findIndex((poke) => poke.name === pokemon.name);
		team.value.splice(teamIndex, 1);
		caught.value.splice(caughtIndex, 1);
		dead.value.splice(deadIndex, 1);
		inBox.value.splice(inBoxIndex, 1);
		if (currentArea.value?.lastCapture?.name === pokemon.name) {
			currentArea.value.lastCapture = undefined;
			if (forcedIndex > -1) forced.value.splice(forcedIndex, 1);
			else currentArea.value.availableEncounters++;
		}
	}

	function switchPokemon(pokemon: PokemonAPIResource) {
		const teamIndex = team.value.findIndex((poke) => poke.name === pokemon.name);
		const inBoxIndex = inBox.value.findIndex((poke) => poke.name === pokemon.name);
		if (teamIndex === -1) {
			inBox.value.splice(inBoxIndex, 1);
			team.value.push(pokemon);
		} else if (team.value.length > 1) {
			team.value.splice(teamIndex, 1);
			inBox.value.push(pokemon);
		}
	}

	watch(
		() => settings.encountersPerArea,
		(newValue) => {
			Object.keys(store.areas).forEach((area) => {
				console.log(newValue, store.areas[area].defaultAvailableEncounters, store.areas[area].availableEncounters);
				store.areas[area].availableEncounters = store.areas[area].availableEncounters + newValue - store.areas[area].defaultAvailableEncounters;
				store.areas[area].defaultAvailableEncounters = newValue;
			});
		},
	);

	return {
		region,
		inBox,
		team,
		dead,
		caught,
		forced,
		areas,
		selectedEncounter,
		catchPokemon,
		failCapture,
		resetCaptures,
		removePokemon,
		pokemonFainted,
		switchPokemon,
	};
};
