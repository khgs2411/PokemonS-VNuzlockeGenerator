import { AxiosResponse } from "axios";
import api from "../common/api/api";
import { PokdexApiOptions } from "../common/types/api.types";
import { IRegionResponse } from "../common/types/pokedex.type";
import { get_url } from "../common/consts/endpoints";
import Lib from "./lib.services";

class Pokedex {
	public static async Region(name: string, options?: PokdexApiOptions) {
		try {
			const response: AxiosResponse<IRegionResponse> = await api.get(get_url("region", name, options));
			if (Lib.isNumpty(response.data)) throw new Error("Invalid data received from API.");
			return response.data;
		} catch (err) {
			throw err;
		}
	}

	public static async Location(name: string, options?: PokdexApiOptions) {
		try {
			const response: AxiosResponse<any> = await api.get(get_url("location", name, options));
			if (Lib.isNumpty(response.data)) throw new Error("Invalid data received from API.");
			return response.data;
		} catch (err) {
			throw err;
		}
	}

	public static async Pokemon(nameOrId?: string | number) {
		try {
			const response: AxiosResponse<any> = await api.get(get_url("pokemon", nameOrId));
			if (Lib.isNumpty(response.data)) throw new Error("Invalid data received from API.");
			return response.data;
		} catch (err) {
			return {};
		}
	}
}

export default Pokedex;
