<template>
	<div @click="selectPokemonAsAnEncounter(pokemon)" class="pokemon-card" :class="[{ 'can-cheat': canCheat }]">
		<Card>
			<template #header>{{ Lib.toTitleCase(pokemon.name) }}</template>
			<template #content>
				<transition name="fade" mode="out-in">
					<template v-if="!loading">
						<img style="width: 100px; height: auto" :src="pokemonData?.sprites?.front_default" v-if="pokemonData?.sprites?.front_default" />
						<Icon v-else width="100" icon="mdi:pokeball"></Icon>
					</template>
					<template v-else>
						<div class="spinner">
							<Icon width="100" icon="mdi:pokeball"></Icon>
						</div>
					</template>
				</transition>
			</template>
		</Card>
	</div>
</template>

<script lang="ts">
import { PropType, computed, defineComponent } from "vue";
import Card from "primevue/card";
import Lib from "../services/lib.services";
import { Icon } from "@iconify/vue";
import { PokemonAPIResource } from "../common/types/pokedex.type";
import { usePokedexStore } from "../common/store/pokedex.store";
import { usePokemonStore } from "../common/store/pokemon.store";
export default defineComponent({
	name: "Pokemon",
	components: {
		Card,
		Icon,
	},
	setup(props) {
		const pokedexStore = usePokedexStore();
		const store = usePokemonStore();
		const loading = computed(() => pokedexStore.loading);
		const pokedex = computed(() => pokedexStore.pokedex);
		const generatedCount = computed(() => store.generatedEncounterCount);
		const pokemonData = computed(() => pokedex.value[pokemonId.value]);
		const canCheat = computed(() => generatedCount.value > 1);
		const pokemonId = computed(() => getPokemonId());

		function getPokemon(nameOrId: number) {
			return pokedexStore.addToPending(nameOrId);
		}

		function getPokemonId() {
			let id = props.pokemon.id;
			/* check if id has more than 3 digits, if so, if the first digit it higher than 1 remove the last digit */
			/* this will hapen for pokemon with more than one form. PokeAPI changes their id to fit that logic (adds a number at the end) */
			if (id.toString().length > 3) {
				console.log(id);
				let idString = id.toString();
				let firstDigit = idString[0];
				let secondDigit = idString[1];
				if (parseInt(firstDigit) > 1) {
					id = parseInt(idString.slice(0, 3));
				}
				if (parseInt(firstDigit) == 1 && parseInt(secondDigit) > 0) {
					id = parseInt(idString.slice(0, 3));
				}
			}
			return id;
		}

		function init() {
			if (Lib.isNumpty(pokemonData.value)) getPokemon(pokemonId.value);
		}

		function selectPokemonAsAnEncounter(pokemon: PokemonAPIResource) {
			if (!canCheat.value) return;
			store.selectedEncounter = pokemon;
			store.showCheaterMessage = false;
		}

		init();

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
../common/store/pokemon.store
