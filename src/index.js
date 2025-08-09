const fs = require("fs");
const path = require("path");
const dataPath = path.join(__dirname, "..", "data", "places.json");
const PLACES = JSON.parse(fs.readFileSync(dataPath, "utf8"));

function listRegions() {
  return PLACES.filter(p => p.type === "region");
}
function listChildren(parentCode) {
  return PLACES.filter(p => p.parent === parentCode);
}
function getByCode(code) {
  return PLACES.find(p => p.code.toLowerCase() === String(code).toLowerCase()) || null;
}
function search(q) {
  if (!q) return [];
  const s = q.toLowerCase();
  return PLACES.filter(p =>
    p.name.toLowerCase().includes(s) ||
    (p.aliases || []).some(a => a.toLowerCase().includes(s))
  );
}
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2-lat1) * Math.PI/180;
  const dLon = (lon2-lon1) * Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.sqrt(a));
}
function nearest(lat, lon, { type=null, limit=5, radiusKm=null } = {}) {
  const withDist = PLACES
    .filter(p => typeof p.lat === "number" && typeof p.lon === "number" && (!type || p.type === type))
    .map(p => ({ ...p, distanceKm: haversineKm(lat, lon, p.lat, p.lon) }))
    .sort((a,b) => a.distanceKm - b.distanceKm);
  const within = radiusKm ? withDist.filter(p => p.distanceKm <= radiusKm) : withDist;
  return within.slice(0, limit);
}

module.exports = { PLACES, listRegions, listChildren, getByCode, search, nearest };
