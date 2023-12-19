<template>
	<nav class="layout-header">
		<div class="left">
			<div @click="showSettings" class="header-layout-element">Settings <Icon icon="mdi:cog" width="20px" /></div>
			<Divider style="margin-right: 0" layout="vertical"></Divider>
			<div class="change-view">
				<SelectButton option-label="label" option-value="value" :options="viewOptions" v-model="view"></SelectButton>
			</div>
			<div class="change-view region">
				Region:
				<Dropdown option-label="label" option-value="value" :options="regionOptions" v-model="currentRegion"></Dropdown>
			</div>
		</div>
		<div class="right">
			<div v-tooltip.bottom="'View Team'" @click="showTeam" class="header-layout-element">
				<Icon icon="mdi:pokeball" width="20px"></Icon>
				<div class="text">Team: {{ teamCount }} / 6</div>
			</div>
			<Divider layout="vertical"></Divider>
			<div class="caught header-layout-element">
				<Icon icon="ic:baseline-catching-pokemon" :rotate="90" width="20px" />
				<div class="text">Caught: {{ caughtCount }}</div>
			</div>
			<Divider layout="vertical"></Divider>
			<div class="caught header-layout-element">
				<Icon icon="ic:baseline-catching-pokemon" :rotate="90" width="20px" />
				<div class="text">Available Encounters: {{ currentArea?.availableEncounters }}</div>
			</div>
			<Divider layout="vertical"></Divider>
		</div>
	</nav>
</template>

<script lang="ts">
import { storeToRefs } from "pinia";
import SelectButton from "primevue/selectbutton";
import { computed, defineComponent, ref } from "vue";
import { useSettingsStore } from "../common/store/settings.store";
import { useDataStore } from "../common/store/data.store";
import { Icon } from "@iconify/vue";
import Divider from "primevue/divider";
import Dropdown from "primevue/dropdown";
import { ERegions } from "../common/enums/regions";
import Lib from "../services/lib.services";
import { usePokemon } from "../common/composables/usePokemon";

export default defineComponent({
	name: "LayoutHeader",
	components: {
		SelectButton,
		Icon,
		Divider,
		Dropdown,
	},
	setup() {
		const store = useDataStore();
		const settings = useSettingsStore();
		const { view, currentRegion } = storeToRefs(settings);
		const team = computed(() => store.team);
		const caught = computed(() => store.caught);
		const dead = computed(() => store.dead);
		const teamCount = computed(() => team.value.length);
		const caughtCount = computed(() => caught.value.length + dead.value.length);
		const currentArea = computed(() => store.currentArea);
		const viewOptions = ref([
			{ label: "Show Map", value: "map" },
			{ label: "Show Encounters", value: "encounters" },
		]);

		const regionOptions = ref([
			{ label: Lib.toTitleCase(ERegions.PALDEA), value: ERegions.PALDEA },
			{ label: Lib.toTitleCase(ERegions.KITAKAMI), value: ERegions.KITAKAMI },
			{ label: Lib.toTitleCase(ERegions.TERARIUM), value: ERegions.TERARIUM },
		]);

		function showTeam() {
			if (!currentArea.value) return;
			settings.showTeam = !settings.showTeam;
		}

		function showSettings() {
			settings.sidebar = !settings.sidebar;
		}

		return {
			ERegions,
			teamCount,
			caughtCount,
			view,
			viewOptions,
			currentArea,
			regionOptions,
			currentRegion,
			showTeam,
			showSettings,
			getRegion: store.getRegion,
			...usePokemon(),
		};
	},
});
</script>

<style lang="scss" scoped>
.layout-header {
	height: 32px;
	width: 100vw;
	background: #1e1e1e;
	border-bottom: 1px solid #383838;
	position: absolute;
	top: 0;
	left: 0;
	display: flex;
	align-items: center;
	font-size: 0.75rem;

	.left,
	.right {
		width: fit-content;
		flex: 1;
		overflow: hidden;
		overflow-x: auto;
		display: flex;
		align-items: center;
	}

	.left {
		padding-left: 0.5rem;
	}
	.right {
		flex-direction: row-reverse;
		padding-right: 0.5rem;
	}
	.change-view {
		&:deep() {
			.p-button,
			.p-dropdown {
				font-size: 0.75rem;
				height: 31px;
				border: none;
				border-radius: 0;

				.p-dropdown-label {
					font-size: 0.75rem;
				}
			}
		}
		&.region {
			margin-left: 0.5rem;
		}
	}
	.header-layout-element {
		height: 100%;
		display: flex;
		align-items: center;
		gap: 0.25rem;
		cursor: pointer;
		width: fit-content;
		white-space: nowrap;
	}
}
</style>
