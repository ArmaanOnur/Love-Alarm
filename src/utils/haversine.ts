import { distanceBetween, geohashForLocation, geohashQueryBounds } from 'geofire-common';

/** Alarm radius in km (10 metres) */
export const ALARM_RADIUS_KM = 0.01;
export const ALARM_RADIUS_METERS = 10;

/**
 * Calculate straight-line distance between two GPS coordinates.
 * @returns Distance in metres
 */
export function haversineMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  return distanceBetween([lat1, lon1], [lat2, lon2]) * 1000;
}

/**
 * Generate a GeoHash string for a coordinate pair.
 * Precision 9 gives ~4.7m accuracy.
 */
export function getGeohash(lat: number, lon: number, precision = 9): string {
  return geohashForLocation([lat, lon], precision);
}

/**
 * Get GeoHash query bounds for a radius search.
 * Use these bounds to query the alarm_sessions table.
 */
export function getNearbyGeohashBounds(lat: number, lon: number): string[][] {
  return geohashQueryBounds([lat, lon], ALARM_RADIUS_METERS);
}

/**
 * Format metres to a human-readable string.
 */
export function formatDistance(metres: number): string {
  if (metres < 1000) return `${Math.round(metres)}m`;
  return `${(metres / 1000).toFixed(1)}km`;
}

/**
 * Return proximity tier for colour coding.
 */
export function getProximityTier(metres: number): 'near' | 'medium' | 'far' {
  if (metres <= 5) return 'near';
  if (metres <= 8) return 'medium';
  return 'far';
}
