import { defineStore, acceptHMRUpdate } from "pinia";
import { Ref, computed, ref, watch } from "vue";
import { Pokemon } from "../types/pokedex.type";
import Lib from "../../services/lib.services";
import Pokedex from "../../services/pokedex.service";

export const usePokedexStore = defineStore("pokedex.store", () => {
	const loading: Ref<boolean> = ref(false);
	const pokedex: Ref<{ [key: string]: Pokemon }> = ref({});
	const pendingIds: Ref<number[]> = ref([]);
	const hasPendingIds = computed(() => pendingIds.value.length > 0);

	function addToPending(id: number) {
		// if (!loading.value) loading.value = true;
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

	async function getPokemon() {
		const pokemonIdsToFetch = [...pendingIds.value];
		try {
			const resolvedData = await Promise.allSettled(pokemonIdsToFetch.map((id) => Pokedex.Pokemon(id)));
			resolvedData.forEach((response) => {
				if (response.status === "fulfilled") {
					const { value } = response;
					if (!Lib.isNumpty(value)) pokedex.value[value.id] = value;
				}
			});
		} catch (err) {
			console.error("fetchPokemonData error: ", err);
		} finally {
			loading.value = false;
			pokemonIdsToFetch.forEach((id) => {
				removeFromPending(id);
			});
		}
	}

	const debouncedFetchPokemon = Lib.debounce(() => {
		if (hasPendingIds.value) getPokemon();
	}, 200);

	watch(
		() => hasPendingIds.value,
		(hasPending) => {
			if (hasPending) debouncedFetchPokemon();
		},
	);

	return {
		loading,
		pokedex,
		pendingIds,
		addToPending,
		removeFromPending,
		getPokemon,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(usePokedexStore, import.meta.hot));
}
