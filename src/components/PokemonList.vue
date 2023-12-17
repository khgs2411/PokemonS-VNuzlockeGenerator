<template>
	<div class="pokemon-list">
		<template v-for="pokemon in pokemonList">
			<DeferredContent>
				<Pokemon :pokemon="pokemon" />
			</DeferredContent>
		</template>
	</div>
</template>

<script lang="ts">
import { PropType, defineComponent } from "vue";
import { PokemonAPIResource } from "../common/types/pokedex.type";
import Pokemon from "./Pokemon.vue";
import DeferredContent from "primevue/deferredcontent";

export default defineComponent({
	name: "PokemonList",
	components: {
		Pokemon,
		DeferredContent,
	},
	setup() {
		return {};
	},
	props: {
		pokemonList: {
			type: Array as PropType<PokemonAPIResource[]>,
			required: true,
		},
	},
});
</script>

<style lang="scss" scoped>
.pokemon-list {
	width: 100%;
	height: fit-content;
	justify-content: center;
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
	margin: 1rem 0;
}
</style>
