class ObjMap {
  container: Record<string, number>;
  constructor() {
    this.container = {};
  }

  get(key: string): number | void {
    return this.container[key];
  }

  get size(): number {
    return Object.keys(this.container).length;
  }

  set(key: string, value: number): Record<string, number> {
    this.container[key] = value;
    return this.container;
  }

  has(key: string): boolean {
    return !!this.container[key];
  }

  forEach(fn: (value: number, key: string) => void): void {
    const keys = Object.keys(this.container);
    keys.forEach((key) => fn(this.container[key], key));
  }
}

export const M = typeof Map === "undefined" ? ObjMap : Map;

export function toArray(map: ObjMap | Map<string, number>) {
  const result = new Array<[string, number]>(map.size);
  let i = 0;
  map.forEach((value, key) => (result[i++] = [key, value]));
  return result;
}
