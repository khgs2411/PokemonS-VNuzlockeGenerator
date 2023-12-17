<template>
	<LayoutHeader />
	<Loading />
	<Pokedex />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Pokedex from "./views/Pokedex.vue";
import Loading from "./components/Loading.vue";
import LayoutHeader from "./layout/LayoutHeader.vue";

export default defineComponent({
	name: "App",
	components: {
		Pokedex,
		Loading,
		LayoutHeader,
	},
	setup() {
		// https://pokeapi.co/api/v2/region/{id or name}/
	},
});
</script>

<style scoped></style>
