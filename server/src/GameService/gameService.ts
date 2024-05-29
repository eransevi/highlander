import * as turf from '@turf/turf';
import { Coordinates } from './types';

// Function to generate random goal coordinates within a 1km radius of the given ball position
export const generateGoalCoordinates = (ballPosition: Coordinates): Coordinates => {
  const center = turf.point([ballPosition.longitude, ballPosition.latitude]);
  const radius = 1; // 1km radius
  const options = { units: 'kilometers' };

  const randomPoint = turf.randomPoint(1, { bbox: turf.bbox(turf.buffer(center, radius)) });
  const [longitude, latitude] = randomPoint.features[0].geometry.coordinates;

  return { latitude, longitude };
};

// Function to check if the ball is within the radius threshold of the goal
export const isBallWithinRadius = (ballPosition: Coordinates, goalPosition: Coordinates, radius: number): boolean => {
  const ballPoint = turf.point([ballPosition.longitude, ballPosition.latitude]);
  const goalPoint = turf.point([goalPosition.longitude, goalPosition.latitude]);
  const distance = turf.distance(ballPoint, goalPoint, { units: 'meters' });
  return distance <= radius;
};
