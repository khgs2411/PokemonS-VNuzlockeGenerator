class Lib {
	public static isNil(value: any): value is null | undefined {
		return value == null || value == undefined;
	}

	public static isEmpty(value: any): value is "" | [] | {} {
		return value == "" || (Array.isArray(value) && value.length == 0) || Object.entries(value).length == 0;
	}

	public static isNumpty(value: any): boolean {
		return this.isNil(value) || this.isEmpty(value);
	}

	public static toTitleCase(str: string) {
		return str.replace(/(^|\-)[a-z]/g, function (match) {
			return match.toUpperCase();
		});
	}

	public static debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
		let timeoutId: ReturnType<typeof setTimeout>;

		return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
			clearTimeout(timeoutId);

			timeoutId = setTimeout(() => {
				func.apply(this, args);
			}, wait);
		};
	}

	public static getRandomItem<T>(array: any[], notIn: any[]): T {
		let selection = array[Math.floor(Math.random() * array.length)];
		if (notIn.includes(selection)) {
			return this.getRandomItem(array, notIn);
		}
		return selection;
	}
}
export default Lib;
