import { defineStore, acceptHMRUpdate } from "pinia";
import { Ref, computed, reactive, ref } from "vue";
import CacheService from "../../services/cache.service";
import { ERegions } from "../enums/regions";
import { gyms } from "../resources/gyms";

export const useSettingsStore = defineStore(
	"settings.store",
	() => {
		const view: Ref<"map" | "encounters"> = ref("encounters"); // "map" | "encounters
		const showTeam = ref(false);
		const sidebar = ref(false);
		const encountersPerArea = ref(3);
		const showCheaterMessage = ref(false);
		const currentRegion = ref(ERegions.PALDEA);
		const nuzlockeRules = ref("");
		const note = ref("");
		const clauses = reactive({
			dupes: true,
			species: true,
			shiny: true,
		});
		const gym_num = ref(0);
		const gymEncounters = computed(() => (gyms as { [key: number]: string })[gym_num.value]);

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
			nuzlockeRules,
			note,
			gymEncounters,
			gym_num,
			gyms,
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
