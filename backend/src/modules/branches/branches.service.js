const ApiError = require('../../shared/ApiError');
const { Branch } = require('../../models');
const { calculateDistance } = require('../../shared/distance');

async function findNearest({ lat, lng, orderType }) {
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    throw new ApiError(400, 'Invalid coordinates');
  }
  const branches = await Branch.find({ isActive: true }).lean();
  if (!branches.length) throw new ApiError(404, 'No active branches');

  const candidates = branches
    .map((b) => {
      const [bLng, bLat] = b.location.coordinates;
      const dist = calculateDistance(lat, lng, bLat, bLng);
      const eligible =
        orderType === 'PICKUP'
          ? b.isPickupEnabled
          : b.isDeliveryEnabled && dist <= b.deliveryRadius;
      return { branch: b, distance: dist, eligible };
    })
    .sort((a, b) => a.distance - b.distance);

  const chosen = candidates.find((c) => c.eligible);
  if (!chosen) throw new ApiError(422, 'No branch can serve this location');
  return {
    branch: chosen.branch,
    distanceKm: Number(chosen.distance.toFixed(2)),
    alternatives: candidates.filter((c) => c.eligible && c !== chosen).map((c) => c.branch),
  };
}

module.exports = { findNearest };