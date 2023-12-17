export type NamedAPIResource = {
	name: string;
	url: string;
};

export type PokemonAPIResource = {
	name: string;
	id: number;
};

export interface MoveLearnData {
	level_learned_at: number;
	move_learn_method: NamedAPIResource;
	version_group: NamedAPIResource;
}

export interface PokemonMoves {
	move: NamedAPIResource;
	version_group_details: MoveLearnData[];
}

export interface PokemonAbility {
	ability: {
		name: string;
		url: string;
	};
	is_hidden: boolean;
	slot: number;
}

export interface Pokemon {
	abilities: PokemonAbility[];
	base_experience: number | null;
	forms: NamedAPIResource[];
	game_indices: any[]; // You can specify the structure if needed
	height: number;
	held_items: any[]; // You can specify the structure if needed
	id: number;
	is_default: boolean;
	location_area_encounters: string;
	moves: {}[];
	name: string;
	order: number;
	past_abilities: any[]; // You can specify the structure if needed
	past_types: any[]; // You can specify the structure if needed
	species: { name: string; url: string };
	sprites: {
		back_default: string | null;
		back_female: string | null;
		back_shiny: string | null;
		back_shiny_female: string | null;
		front_default: string | null;
		// Add other sprite properties here
	};
	stats: { base_stat: number; effort: number; stat: NamedAPIResource };
	types: { slot: number; type: NamedAPIResource }[];
	weight: number;
}

export interface IRegionResponse {
	id: number;
	name: string;
	names: { language: NamedAPIResource; name: string }[]; // Array of additional names in different languages

	// Main generation
	main_generation: NamedAPIResource; // Object containing generation name and URL

	// Locations
	locations: NamedAPIResource[]; // Array of objects representing individual locations

	// Pokedexes
	pokedexes: NamedAPIResource[]; // Array of objects representing available pokedexes

	// Version groups
	version_groups: NamedAPIResource[];
}

export interface IEncountersDictionary {
	locations: {
		paldea: {
			[key: string]: PokemonAPIResource[];
		};
		kitakami: {
			[key: string]: PokemonAPIResource[];
		};
		terarium: {
			[key: string]: PokemonAPIResource[];
		};
	};
}
