import { getGeohash, getNearbyGeohashBounds } from '../utils/haversine';

export { getGeohash, getNearbyGeohashBounds };

/**
 * Check if a coordinate pair is within the alarm radius.
 * Used on the client for quick pre-checks before server validation.
 */
export function isWithinAlarmRadius(
  myLat: number,
  myLon: number,
  theirLat: number,
  theirLon: number,
  radiusMeters = 10,
): boolean {
  // Fast bounding-box pre-check (degrees ≈ metres / 111_000)
  const latDiff = Math.abs(myLat - theirLat) * 111_000;
  const lonDiff =
    Math.abs(myLon - theirLon) * 111_000 * Math.cos((myLat * Math.PI) / 180);
  if (latDiff > radiusMeters || lonDiff > radiusMeters) return false;

  // Full haversine check
  const R = 6_371_000; // Earth radius in metres
  const φ1 = (myLat * Math.PI) / 180;
  const φ2 = (theirLat * Math.PI) / 180;
  const Δφ = ((theirLat - myLat) * Math.PI) / 180;
  const Δλ = ((theirLon - myLon) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return distance <= radiusMeters;
}

/**
 * Encode user position to a geohash payload for the backend.
 */
export function buildLocationPayload(lat: number, lon: number) {
  return { lat, lon, geohash: getGeohash(lat, lon) };
}
