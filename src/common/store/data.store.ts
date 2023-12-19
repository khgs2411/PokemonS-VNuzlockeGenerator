import { acceptHMRUpdate, defineStore } from "pinia";
import { Ref, computed, reactive, ref } from "vue";
import Lib from "../../services/lib.services";
import Pokedex from "../../services/pokedex.service";
import { ERegions } from "../enums/regions";
import encounters_json from "../resources/encounters.json";
import { IEncountersDictionary, IRegionResponse, NamedAPIResource, PokemonAPIResource } from "../types/pokedex.type";

export const useDataStore = defineStore(
	"data.store",
	() => {
		const loading: Ref<boolean> = ref(false);
		const version: Ref<"scarlet" | "violet"> = ref("scarlet");
		const region: Ref<IRegionResponse | undefined> = ref();
		const location: Ref<string | undefined> = ref();
		const generatedEncounterCount: Ref<number> = ref(0);
		const selectedEncounter: Ref<PokemonAPIResource | undefined> = ref();
		const pokemon: Ref<NamedAPIResource[]> = ref([]);
		const team: Ref<PokemonAPIResource[]> = ref([]);
		const inBox: Ref<PokemonAPIResource[]> = ref([]);
		const caught: Ref<PokemonAPIResource[]> = ref([]);
		const dead: Ref<PokemonAPIResource[]> = ref([]);
		const forced: Ref<PokemonAPIResource[]> = ref([]);
		const enocunters: IEncountersDictionary = JSON.parse(JSON.stringify(encounters_json));
		const areas: { [key: string]: { generatedCount: number; availableEncounters: number; encounters: PokemonAPIResource[]; lastCapture: PokemonAPIResource | undefined } } = reactive({});
		const currentArea = computed(() => (location.value ? areas[location.value] : undefined));
		async function init() {
			try {
				await getRegion();
				await getPokemonList();
			} catch (err) {
				throw err;
			}
		}

		async function getRegion(name: ERegions = ERegions.PALDEA, force = false) {
			if (!Lib.isNumpty(region.value) && !force) return;
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
			loading,
			version,
			region,
			location,
			generatedEncounterCount,
			pokemon,
			selectedEncounter,
			enocunters,
			team,
			caught,
			areas,
			dead,
			inBox,
			forced,
			currentArea,
			init,
			getRegion,
			getPokemonList,
		};
	},
	{
		persist: true,
	},
);

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useDataStore, import.meta.hot));
}
