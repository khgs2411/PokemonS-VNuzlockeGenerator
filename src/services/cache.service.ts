import Lib from "./lib.services";
class CacheService {
	public static debouncedLocalStorageSave = Lib.debounce((key: string, data: any) => {
		console.log("setItem");
		const encodedState = btoa(encodeURIComponent(JSON.stringify(data)));
		localStorage.setItem(key, encodedState);
	}, 200);
}

export default CacheService;
