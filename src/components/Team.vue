<template>
	<Sidebar v-model:visible="showTeamSidebar" header="Team" position="right">
		<div class="team">
			<template v-for="pokemon in team">
				<Pokemon :pokemon="pokemon"></Pokemon>
			</template>
		</div>
	</Sidebar>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Sidebar from "primevue/sidebar";
import { usePokedexStore } from "../common/store/pokedex.store";
import { storeToRefs } from "pinia";
import Pokemon from "./Pokemon.vue";

export default defineComponent({
	name: "Team",
	components: {
		Sidebar,
		Pokemon,
	},
	setup() {
		const store = usePokedexStore();
		const { showTeamSidebar, team } = storeToRefs(store);

		return {
			team,
			showTeamSidebar,
		};
	},
});
</script>

<style lang="scss" scoped>
.team {
	width: 100%;
	height: fit-content;
	justify-content: center;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	margin: 1rem 0;
}
</style>
