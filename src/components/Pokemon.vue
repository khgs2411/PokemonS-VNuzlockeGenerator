<template>
	<div @click="selectPokemonAsAnEncounter(pokemon)" class="pokemon-card" :class="[{ 'can-cheat': canCheat && !isCaught }]">
		<Card>
			<template #header>
				{{ Lib.toTitleCase(pokemon.name) }}
			</template>
			<template #content>
				<div v-if="isCaught && (isInBox || (inTeam && team.length > 1))" v-tooltip.top="isInBox ? 'Move to team' : 'Move to Box'" @click="switchPokemon(pokemon)">
					<Icon icon="tabler:pokeball"></Icon>
				</div>
				<div class="pokemon">
					<transition name="fade" mode="out-in">
						<template v-if="!loading">
							<img style="width: 100px; height: auto" :src="pokemonData?.sprites?.front_default" v-if="pokemonData?.sprites?.front_default" />
							<Icon v-else :width="size" icon="mdi:pokeball"></Icon>
						</template>
						<template v-else>
							<div class="spinner">
								<Icon :width="size" icon="mdi:pokeball"></Icon>
							</div>
						</template>
					</transition>
				</div>
				<div class="bottom">
					<div v-if="isCaught" v-tooltip="{ escape: true, value: 'Remove this pokemon \n This is not the same as fainting \n as this will remove this pokemon completely. ' }" class="remove" @click="removePokemon(pokemon)">
						<Icon icon="mdi:trash" />
					</div>
					<div v-if="isCaught && !isDead" v-tooltip.left="'Pokemon Fainted'" class="fainted" @click="pokemonFainted(pokemon)">
						<Icon icon="tabler:pokeball-off"></Icon>
					</div>
				</div>
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
import { useDataStore } from "../common/store/data.store";
import { useSettingsStore } from "../common/store/settings.store";
import { usePokemon } from "../common/composables/usePokemon";
export default defineComponent({
	name: "Pokemon",
	components: {
		Card,
		Icon,
	},
	setup(props) {
		const pokedexStore = usePokedexStore();
		const store = useDataStore();
		const settings = useSettingsStore();
		const loading = computed(() => pokedexStore.loading);
		const pokedex = computed(() => pokedexStore.pokedex);
		const pokemonData = computed(() => pokedex.value[pokemonId.value]);
		const currentArea = computed(() => store.currentArea);
		const canCheat = computed(() => (settings.showCheaterMessage && store.currentArea ? store.currentArea.generatedCount > 1 : false));
		const pokemonId = computed(() => getPokemonId());

		function getPokemon(nameOrId: number) {
			return pokedexStore.addToPending(nameOrId);
		}

		function getPokemonId() {
			let id = props.pokemon.id;
			/* check if id has more than 3 digits, if so, if the first digit it higher than 1 remove the last digit */
			/* this will hapen for pokemon with more than one form. PokeAPI changes their id to fit that logic (adds a number at the end) */
			if (id.toString().length > 3) {
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
			// remove the first item and push the new one from currentArea.value.encounters
			currentArea.value?.encounters?.shift();
			currentArea.value?.encounters?.push(pokemon);
			settings.showCheaterMessage = false;
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
			...usePokemon(),
		};
	},
	props: {
		pokemon: {
			type: Object as PropType<PokemonAPIResource>,
			required: true,
		},
		size: {
			type: String,
			default: "100px",
		},
		isCaught: {
			type: Boolean,
			default: false,
		},
		isInBox: {
			type: Boolean,
			default: false,
		},
		inTeam: {
			type: Boolean,
			default: false,
		},
		isDead: {
			type: Boolean,
			default: false,
		},
	},
});
</script>

<style lang="scss" scoped>
.pokemon-card {
	border-radius: 4px;
	border: 1px solid transparent;
	text-align: center;

	.header {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.fainted {
		color: coral;
	}
	.remove {
	}

	.bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	&.can-cheat {
		&:hover {
			cursor: pointer;
			border-color: green;
		}
	}

	&:hover {
		.remove {
			display: flex;
		}
	}
}
</style>
