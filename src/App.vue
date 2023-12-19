<template>
	<LayoutHeader />
	<Loading />
	<Pokedex />
	<LayoutFooter />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Pokedex from "./views/Pokedex.vue";
import Loading from "./components/Loading.vue";
import LayoutHeader from "./layout/LayoutHeader.vue";
import LayoutFooter from "./layout/LayoutFooter.vue";

export default defineComponent({
	name: "App",
	components: {
		Pokedex,
		Loading,
		LayoutHeader,
		LayoutFooter,
	},
	setup() {
		// https://pokeapi.co/api/v2/region/{id or name}/
	},
});
</script>

<style scoped></style>
