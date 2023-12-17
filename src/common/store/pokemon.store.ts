import { acceptHMRUpdate, defineStore } from "pinia";
import { Ref, ref } from "vue";
import Lib from "../../services/lib.services";
import Pokedex from "../../services/pokedex.service";
import { ERegions } from "../enums/regions";
import encounters_json from "../resources/encounters.json";
import { IEncountersDictionary, IRegionResponse, NamedAPIResource, PokemonAPIResource } from "../types/pokedex.type";

export const usePokemonStore = defineStore(
	"pokemon.store",
	() => {
		const loading: Ref<boolean> = ref(false);
		const version: Ref<"scarlet" | "violet"> = ref("scarlet");
		const region: Ref<IRegionResponse | undefined> = ref();
		const location: Ref<string | undefined> = ref();
		const generatedEncounterCount: Ref<number> = ref(0);
		const selectedEncounter: Ref<PokemonAPIResource | undefined> = ref();
		const pokemon: Ref<NamedAPIResource[]> = ref([]);
		const encounterPerArea = ref(1);
		const showCheaterMessage = ref(false);
		const locationInformation: Ref<string | undefined> = ref();
		const cacheLoaded = ref(false);
		const showTeamSidebar = ref(false);
		const team: Ref<PokemonAPIResource[]> = ref([]);

		const enocunters: IEncountersDictionary = JSON.parse(JSON.stringify(encounters_json));

		async function init() {
			try {
				await getRegion();
				await getPokemonList();
			} catch (err) {
				throw err;
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

		async function getPokemonList() {
			if (!Lib.isNumpty(pokemon.value)) return;
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

		return {
			loading: loading,
			version: version,
			region: region,
			location: location,
			showCheaterMessage: showCheaterMessage,
			generatedEncounterCount: generatedEncounterCount,
			locationInformation: locationInformation,
			pokemon: pokemon,
			selectedEncounter: selectedEncounter,
			enocunters: enocunters,
			encounterPerArea: encounterPerArea,
			showTeamSidebar: showTeamSidebar,
			cacheLoaded: cacheLoaded,
			team: team,
			init: init,
			getRegion: getRegion,
			getPokemonList: getPokemonList,
		};
	},
	{
		persist: {
			debug: true,
		},
	},
);

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(usePokemonStore, import.meta.hot));
}
