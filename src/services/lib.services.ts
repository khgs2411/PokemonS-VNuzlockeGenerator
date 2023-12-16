class Lib {
  public static isNil(value: any): value is null | undefined {
    return value == null || value == undefined;
  }

  public static isEmpty(value: any): value is "" | [] | {} {
    return (
      value == "" ||
      (Array.isArray(value) && value.length == 0) ||
      Object.entries(value).length == 0
    );
  }

  public static isNumpty(value: any): boolean {
    return this.isNil(value) || this.isEmpty(value);
  }

  public static toTitleCase(str: string) {
    return str.replace(/(^|\-)[a-z]/g, function (match) {
      return match.toUpperCase();
    });
  }
}
export default Lib;
