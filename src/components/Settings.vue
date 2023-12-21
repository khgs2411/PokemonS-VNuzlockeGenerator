<template>
	<Sidebar v-model:visible="sidebar" header="Settings" class="p-sidebar-md settings" position="left">
		<div class="setting">
			<div><b>Encounters Per Area:</b></div>
			<InputNumber
				@input="
					(event) => {
						encountersPerArea = (event.value as number) ?? 0;
					}
				"
				v-model="encountersPerArea" />
		</div>
		<div class="setting text">
			<div>
				<div>
					<b>Your own Nuzlocke Rules:</b>
				</div>
				<small>You can write down your own rules just so you remember how you decided to play</small>
			</div>
			<Textarea rows="5" cols="65" v-model="nuzlockeRules" />
		</div>
		<div class="setting text">
			<div>
				<div>
					<b>Note:</b>
				</div>
				<small
					>Write down notes for your journy. <br />
					Badges you obtained, locations you've noted</small
				>
			</div>
			<Textarea rows="5" cols="65" v-model="note" />
		</div>
		<div class="setting">
			<div>Reset Progress</div>
			<div class="reset-btn" v-tooltip.left="'Clicking here will reset all progress up to this point'">
				<Button text @click="resetCaptures">
					<template #icon> <Icon width="28px" icon="tabler:pokeball-off" /> </template
				></Button>
			</div>
		</div>
	</Sidebar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useSettingsStore } from "../common/store/settings.store";
import Sidebar from "primevue/sidebar";
import { storeToRefs } from "pinia";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import { usePokemon } from "../common/composables/usePokemon";
import Button from "primevue/button";
import { Icon } from "@iconify/vue";
import Textarea from "primevue/textarea";

export default defineComponent({
	name: "Settings",
	components: {
		Sidebar,
		InputText,
		InputNumber,
		Button,
		Icon,
		Textarea,
	},
	setup() {
		const settings = useSettingsStore();
		const { sidebar, encountersPerArea, nuzlockeRules, note } = storeToRefs(settings);

		return { sidebar, encountersPerArea, nuzlockeRules, note, ...usePokemon() };
	},
});
</script>

<style lang="scss" scoped>
.settings {
	.setting {
		width: 100%;

		height: 3rem;
		margin: 1rem 0;
		gap: 1rem;
		&:not(.text) {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		&.text {
			height: fit-content;
		}
	}
	.reset-btn {
		width: fit-content;
		display: flex;
		height: fit-content;
		align-items: center;
		justify-content: flex-end;
		float: right;
	}
}
</style>
