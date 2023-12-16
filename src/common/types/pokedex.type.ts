export type NamedAPIResource = {
  name: string;
  url: string;
};
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
