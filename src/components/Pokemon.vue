<template>
	<div @click="selectPokemonAsAnEncounter(pokemon)" class="pokemon-card" :class="[{ 'can-cheat': canCheat }]">
		<Card>
			<template #header>{{ Lib.toTitleCase(pokemon.name) }}</template>
			<template #content>
				<template v-if="!loading">
					<img style="width: 100px; height: auto" :src="pokemonData?.sprites?.front_default" v-if="pokemonData?.sprites?.front_default" />
					<Icon v-else width="100" icon="mdi:pokeball"></Icon>
				</template>
				<template v-else>
					<div class="spinner">
						<Icon width="100" icon="mdi:pokeball"></Icon>
					</div>
				</template>
			</template>
		</Card>
	</div>
</template>

<script lang="ts">
import { PropType, computed, defineComponent, watch } from "vue";
import { usePokedexStore } from "../common/store/pokedex.store";
import Card from "primevue/card";
import Lib from "../services/lib.services";
import { Icon } from "@iconify/vue";
import { PokemonAPIResource } from "../common/types/pokedex.type";
export default defineComponent({
	name: "Pokemon",
	components: {
		Card,
		Icon,
	},
	setup(props) {
		const store = usePokedexStore();
		const loading = computed(() => store.loadingPokemon);
		const pokedex = computed(() => store.pokedex);
		const generatedCount = computed(() => store.generatedEncounterCount);
		const pokemonData = computed(() => pokedex.value[props.pokemon.name]);
		const canCheat = computed(() => generatedCount.value > 1);
		function getPokemon(nameOrId: number) {
			return store.addToPending(nameOrId);
		}

		function init() {
			if (Lib.isNumpty(pokemonData.value)) getPokemon(props.pokemon.id);
		}

		function selectPokemonAsAnEncounter(pokemon: PokemonAPIResource) {
			if (!canCheat.value) return;
			store.selectedEncounter = pokemon;
			store.showCheaterMessage = false;
		}

		watch(
			() => store.cacheLoaded,
			(value) => {
				if (value) {
					init();
				}
			},
			{ immediate: true },
		);
		return {
			loading,
			pokedex,
			pokemonData,
			canCheat,
			getPokemon: getPokemon,
			selectPokemonAsAnEncounter: selectPokemonAsAnEncounter,
			Lib: Lib,
		};
	},
	props: {
		pokemon: {
			type: Object as PropType<PokemonAPIResource>,
			required: true,
		},
	},
});
</script>

<style lang="scss" scoped>
.pokemon-card {
	border-radius: 4px;
	border: 1px solid transparent;
	text-align: center;

	&.can-cheat {
		&:hover {
			cursor: pointer;
			border-color: green;
		}
	}
}
</style>
