<template>
	<Sidebar v-model:visible="showTeam" header="Pokemon" class="p-sidebar-md" position="right">
		<TabView>
			<TabPanel header="Team">
				<div class="team">
					<template v-for="pokemon in team">
						<Pokemon in-team is-caught :pokemon="pokemon"></Pokemon>
					</template>
				</div>
			</TabPanel>
			<TabPanel header="In Boxes">
				<div class="caught">
					<template v-for="pokemon in inBox">
						<Pokemon is-in-box is-caught size="24px" :pokemon="pokemon"></Pokemon>
					</template>
				</div>
			</TabPanel>
			<TabPanel header="Graveyard" :disabled="dead.length == 0">
				<div class="caught">
					<template v-for="pokemon in dead">
						<Pokemon is-caught is-dead size="24px" :pokemon="pokemon"></Pokemon>
					</template>
				</div>
			</TabPanel>
			<TabPanel header="Add Pokemon">
				<div class="add-pokemon">
					<Dropdown
						filter
						placeholder="Select a Pokemon"
						:virtual-scroller-options="{ itemSize: 38 }"
						v-model="pokemonToAdd"
						:options="
							pokemon.map((item) => {
								return { ...item, name: Lib.toTitleCase(item.name) };
							})
						"
						option-label="name" />
					<Pokemon v-if="pokemonData" size="24px" :pokemon="pokemonData"></Pokemon>
					<Icon v-if="!pokemonData && pokemonToAdd" style="margin: auto" icon="mdi:pokeball" height="120" class="spinner"></Icon>
					<div class="actions" v-if="pokemonData">
						<Button @click="addToTeam" label="Add">
							<template #icon>
								<div class="action-icon">
									<Icon icon="tabler:pokeball"></Icon>
								</div>
							</template>
						</Button>
						<Button severity="danger" @click="failCapture" label="Cancel">
							<template #icon>
								<div class="action-icon">
									<Icon icon="tabler:pokeball-off"></Icon>
								</div>
							</template>
						</Button>
					</div>
				</div>
			</TabPanel>
		</TabView>
		<div class="reset-btn" v-tooltip.left="'Clicking here will reset all progress up to this point'">
			<Button text @click="resetCaptures">
				<template #icon> <Icon width="28px" icon="tabler:pokeball-off" /> </template
			></Button>
		</div>
	</Sidebar>
</template>

<script lang="ts">
import { Ref, computed, defineComponent, ref, watch } from "vue";

import Sidebar from "primevue/sidebar";
import { useDataStore } from "../common/store/data.store";
import { storeToRefs } from "pinia";
import Pokemon from "./Pokemon.vue";
import { useSettingsStore } from "../common/store/settings.store";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Button from "primevue/button";
import { Icon } from "@iconify/vue";
import Dropdown from "primevue/dropdown";
import { PokemonAPIResource, NamedAPIResource } from "../common/types/pokedex.type";
import Lib from "../services/lib.services";
import { usePokedexStore } from "../common/store/pokedex.store";
import Card from "primevue/card";
import { usePokemon } from "../common/composables/usePokemon";

export default defineComponent({
	name: "PokemonBox",
	components: {
		Sidebar,
		Pokemon,
		TabView,
		Card,
		TabPanel,
		Button,
		Icon,
		Dropdown,
	},
	setup() {
		const store = useDataStore();
		const pokedex = usePokedexStore();
		const pokemon = computed((): NamedAPIResource[] => store.pokemon);
		const settings = useSettingsStore();
		const { showTeam } = storeToRefs(settings);
		const pokemonToAdd: Ref<NamedAPIResource | undefined> = ref();

		const pokemonId = computed((): number | undefined => {
			if (pokemonToAdd.value) {
				return parseInt(pokemonToAdd.value.url.split("/")[6]);
			} else {
				return undefined;
			}
		});
		const pokemonData = computed((): PokemonAPIResource | undefined => (pokemonId.value ? pokedex.pokedex[pokemonId.value] : undefined));

		function getPokemon(id: number) {
			return pokedex.addToPending(id);
		}

		function addToTeam() {
			if (!pokemonData.value) return;

			usePokemon().catchPokemon(pokemonData.value, true);

			pokemonToAdd.value = undefined;
			showTeam.value = false;
		}

		watch(pokemonId, (id) => {
			if (id) {
				getPokemon(id);
			}
		});

		return {
			Lib,
			pokemon,
			showTeam,
			pokemonId,
			pokemonToAdd,
			pokemonData,
			addToTeam,
			...usePokemon(),
		};
	},
});
</script>

<style lang="scss" scoped>
.team,
.caught,
.add-pokemon {
	height: 100%;
	overflow: hidden;
	overflow-y: auto;
}
.team {
	width: 100%;
	height: fit-content;
	justify-content: center;
	display: flex;
	// flex-wrap: wrap;
	flex-direction: column;
	gap: 1rem;
	margin: 1rem 0;
}
.caught {
	width: 100%;
	height: fit-content;
	justify-content: center;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	margin: 1rem 0;
}
.add-pokemon {
	width: 100%;
	display: flex;
	flex-direction: column;

	// align-items: center;
	gap: 1rem;
}
.reset-btn {
	width: fit-content;
	display: flex;
	height: fit-content;
	align-items: center;
	justify-content: flex-end;
	float: right;
}
</style>
