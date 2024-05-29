import express from 'express';
import { Coordinates } from './gameService/types';
import { generateGoalCoordinates, isBallWithinRadius } from './gameService/gameService';

const app = express();
const port = 3001;

app.use(express.json());

app.post('/api/goal', (req, res) => {
  const ballPosition: Coordinates = req.body;

  if (!ballPosition || typeof ballPosition.latitude !== 'number' || typeof ballPosition.longitude !== 'number') {
    return res.status(400).send('Invalid ball position');
  }  
  const goalPosition = generateGoalCoordinates(ballPosition);
  res.json(goalPosition);
});

app.post('/api/check-distance', (req, res) => {
  const { ballPosition, goalPosition, radius } = req.body;

  if (!ballPosition || !goalPosition || typeof radius !== 'number') {
    return res.status(400).send('Invalid input');
  }
  const withinRadius = isBallWithinRadius(ballPosition, goalPosition, radius);
  res.json({ withinRadius });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});