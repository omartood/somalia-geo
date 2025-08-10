export type PlaceType = "region" | "district" | "city" | "town" | "village";

export interface Place {
  code: string; 
  name: string; 
  type: PlaceType; 
  parent: string|null;
  lat?: number; 
  lon?: number; 
  aliases?: string[];
  population?: number;
  area_km2?: number;
  _score?: number; // For fuzzy search results
}

export interface SearchOptions {
  fuzzy?: boolean;
  limit?: number | null;
}

export interface FilterCriteria {
  type?: PlaceType | PlaceType[];
  region?: string;
  population?: { min?: number; max?: number };
  area?: { min?: number; max?: number };
  hasCoordinates?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}

export interface Stats {
  total: number;
  byType: Record<PlaceType, number>;
  byRegion: Record<string, number>;
  withCoordinates: number;
  withPopulation: number;
  withArea: number;
}

export const PLACES: Place[];
export function listRegions(): Place[];
export function listChildren(parentCode: string): Place[];
export function getByCode(code: string): Place|null;
export function search(q: string, options?: SearchOptions): Place[];
export function fuzzySearch(q: string, limit?: number): Place[];
export function filter(criteria?: FilterCriteria): Place[];
export function getStats(): Stats;
export function getLargestByPopulation(limit?: number): Place[];
export function getLargestByArea(limit?: number): Place[];
export function nearest(
  lat: number, lon: number,
  opts?: { type?: PlaceType|null; limit?: number; radiusKm?: number|null }
): (Place & { distanceKm: number })[];
