export type PlaceType = "region" | "district" | "city" | "town" | "village";
export interface Place {
  code: string; name: string; type: PlaceType; parent: string|null;
  lat: number; lon: number; aliases?: string[];
}
export const PLACES: Place[];
export function listRegions(): Place[];
export function listChildren(parentCode: string): Place[];
export function getByCode(code: string): Place|null;
export function search(q: string): Place[];
export function nearest(
  lat: number, lon: number,
  opts?: { type?: PlaceType|null; limit?: number; radiusKm?: number|null }
): (Place & { distanceKm: number })[];
