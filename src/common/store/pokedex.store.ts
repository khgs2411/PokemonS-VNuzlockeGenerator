import { defineStore, acceptHMRUpdate } from "pinia";
import { IRegionResponse, NamedAPIResource, PokemonAPIResource, Pokemon } from "../types/pokedex.type";
import { Ref, computed, ref, watch } from "vue";
import { ERegions } from "../enums/regions";
import Pokedex from "../../services/pokedex.service";
import Lib from "../../services/lib.services";
import encounters_json from "../resources/encounters.json";

export const usePokedexStore = defineStore("pokedex.store", () => {
	const loading: Ref<boolean> = ref(false);
	const loadingPokemon: Ref<boolean> = ref(true);
	const version: Ref<"scarlet" | "violet"> = ref("scarlet");
	const region: Ref<IRegionResponse | undefined> = ref();
	const location: Ref<string | undefined> = ref();
	const generatedEncounterCount: Ref<number> = ref(0);
	const selectedEncounter: Ref<PokemonAPIResource | undefined> = ref();
	const pokemon: Ref<NamedAPIResource[]> = ref([]);
	const encounterPerArea = ref(1);
	const pokedex: Ref<{ [key: string]: Pokemon }> = ref({});
	const showCheaterMessage = ref(false);
	const locationInformation: Ref<string | undefined> = ref();
	const pendingIds: Ref<number[]> = ref([]);
	const cacheLoaded = ref(false);
	const showTeamSidebar = ref(false);
	const hasPendingIds = computed(() => pendingIds.value.length > 0);
	const team: Ref<PokemonAPIResource[]> = ref([]);

	const enocunters: {
		locations: { [key: string]: PokemonAPIResource[] };
	} = JSON.parse(JSON.stringify(encounters_json));

	async function init() {
		try {
			const cookie = localStorage.getItem("pokedex");
			if (Lib.isNil(cookie)) {
				getPokemonList();
				getRegion();
			} else {
				loadCache(cookie);
			}
			cacheLoaded.value = true;
		} catch (err) {
			throw err;
		}
	}

	function loadCache(cookie: string) {
		try {
			const data = JSON.parse(decodeURIComponent(atob(cookie)));
			version.value = data.version ?? "scarlet";
			region.value = data.region ?? undefined;
			location.value = data.location ?? undefined;
			pokemon.value = data.pokemon ?? {};
			locationInformation.value = data.locationInformation ?? undefined;
		} catch (err) {
			console.log("loadCache: ", err);
		}
	}

	async function getRegion(name: ERegions = ERegions.PALDEA) {
		if (!Lib.isNumpty(region.value)) return;
		loading.value = true;
		try {
			const response = await Pokedex.Region(name);
			region.value = response;
		} catch (err) {
			throw err;
		} finally {
			loading.value = false;
		}
	}

	async function getLocation(all: boolean = false) {
		loading.value = true;
		try {
			const response = await Pokedex.Location(all ? "" : locationInformation.value ?? "");
			console.log("getLocation: ", response);
		} catch (err) {
			throw err;
		} finally {
			loading.value = false;
		}
	}

	async function getPokemonList() {
		loading.value = true;
		try {
			const response: { count: number; next: string | null; previous: string | null; results: NamedAPIResource[] } = await Pokedex.Pokemon();
			pokemon.value = response.results;
		} catch (err) {
			throw err;
		} finally {
			loading.value = false;
		}
	}
	async function getPokemon(nameOrId: string | number) {
		try {
			const response: Pokemon = await Pokedex.Pokemon(nameOrId);
			pokedex.value[response.name] = response;
		} catch (err) {
			console.log("getPokemon: ", nameOrId);
		}
	}

	function addToPending(id: number) {
		if (!loadingPokemon.value) loadingPokemon.value = true;
		if (!pendingIds.value.includes(id)) {
			pendingIds.value.push(id);
		}
	}

	function removeFromPending(id: number) {
		const index = pendingIds.value.indexOf(id);
		if (index !== -1) {
			pendingIds.value.splice(index, 1);
		}
	}

	async function fetchPokemonData() {
		const pokemonIdsToFetch = [...pendingIds.value];
		try {
			const resolvedData = await Promise.allSettled(pokemonIdsToFetch.map((id) => Pokedex.Pokemon(id)));
			resolvedData.forEach((response) => {
				if (response.status === "fulfilled") {
					const { value } = response;
					if (!Lib.isNumpty(value)) {
						pokedex.value[value.name] = value;
					}
				}
			});
		} catch (err) {
			console.error("fetchPokemonData error: ", err);
		} finally {
			loadingPokemon.value = false;
			pokemonIdsToFetch.forEach((id) => {
				removeFromPending(id);
			});
		}
	}

	const debouncedFetchPokemon = Lib.debounce(() => {
		if (hasPendingIds.value) {
			fetchPokemonData();
		}
	}, 200);

	watch(
		() => hasPendingIds.value,
		(hasPending) => {
			if (hasPending) debouncedFetchPokemon();
		},
	);

	return {
		loading: loading,
		version: version,
		region: region,
		location: location,
		showCheaterMessage: showCheaterMessage,
		generatedEncounterCount: generatedEncounterCount,
		loadingPokemon: loadingPokemon,
		locationInformation: locationInformation,
		pokemon: pokemon,
		selectedEncounter: selectedEncounter,
		pokedex: pokedex,
		enocunters: enocunters,
		encounterPerArea: encounterPerArea,
		showTeamSidebar: showTeamSidebar,
		cacheLoaded: cacheLoaded,
		team: team,
		init: init,
		getRegion: getRegion,
		getLoaction: getLocation,
		getPokemon: getPokemon,
		getPokemonList: getPokemonList,
		addToPending: addToPending,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(usePokedexStore, import.meta.hot));
}
