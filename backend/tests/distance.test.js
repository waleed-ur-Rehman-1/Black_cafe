const { calculateDistance } = require('../src/shared/distance');

test('distance ~0 for same point', () => {
  expect(calculateDistance(24.86, 67.0, 24.86, 67.0)).toBeCloseTo(0, 5);
});

test('Karachi to Lahore ~1200 km', () => {
  const d = calculateDistance(24.8607, 67.0011, 31.5204, 74.3587);
  expect(d).toBeGreaterThan(1000);
  expect(d).toBeLessThan(1400);
});