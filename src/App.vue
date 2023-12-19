<template>
	<LayoutHeader />
	<Loading v-if="loading" />
	<Pokedex />
	<LayoutFooter />
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import Pokedex from "./views/Pokedex.vue";
import Loading from "./components/Loading.vue";
import LayoutHeader from "./layout/LayoutHeader.vue";
import LayoutFooter from "./layout/LayoutFooter.vue";
import { useDataStore } from "./common/store/data.store";

export default defineComponent({
	name: "App",
	components: {
		Pokedex,
		Loading,
		LayoutHeader,
		LayoutFooter,
	},
	setup() {
		const store = useDataStore();
		const loading = computed(() => store.loading);
		return {
			loading,
		};
	},
});
</script>

<style scoped></style>
