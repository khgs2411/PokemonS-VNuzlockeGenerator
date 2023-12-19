import { defineStore, acceptHMRUpdate } from "pinia";
import { Ref, reactive, ref } from "vue";
import CacheService from "../../services/cache.service";
import { ERegions } from "../enums/regions";

export const useSettingsStore = defineStore(
	"settings.store",
	() => {
		const view: Ref<"map" | "encounters"> = ref("encounters"); // "map" | "encounters
		const showTeam = ref(false);
		const sidebar = ref(false);
		const encountersPerArea = ref(1);
		const showCheaterMessage = ref(false);
		const currentRegion = ref(ERegions.PALDEA);
		const clauses = reactive({
			dupes: true,
			species: true,
			shiny: true,
		});

		function resetCache() {
			CacheService.resetCache("settings.store");
			CacheService.resetCache("pokemon.store");
		}
		return {
			view,
			showCheaterMessage,
			encountersPerArea,
			showTeam,
			clauses,
			sidebar,
			currentRegion,
			resetCache,
		};
	},
	{
		persist: true,
	},
);

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot));
}
