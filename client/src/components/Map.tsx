import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import ball from '../assets/ball.png';
import goal from '../assets/goal.png';

// Custom icons for the markers
const ballIcon = new L.Icon({
  iconUrl: ball,
  iconSize: [50, 50]
});

const goalIcon = new L.Icon({
  iconUrl: goal,
  iconSize: [100, 100]
});

const MapComponent: React.FC = () => {
  const [ballPosition, setBallPosition] = useState<[number, number] | null>(null);
  const [goalPosition, setGoalPosition] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setBallPosition([latitude, longitude]);
      axios.post('/api/goal', {
        latitude: latitude,
        longitude: longitude
      }).then(response => {
        const { latitude, longitude } = response.data;
        console.log("Goal position:", latitude, longitude);
        setGoalPosition([latitude, longitude]);
      }).catch(error => {
        console.error("Error fetching goal position:", error);
      });
    }, (error) => {
      console.error("Error fetching geolocation:", error);
    });
  }, []);

  // useEffect(() => {
  //   if (ballPosition) {
  //     console.log("Ball position:", ballPosition);
  //     // if (goalPosition[0] !== 0 && goalPosition[1] !== 0) {
  //     //   return;
  //     // }
  //     // axios.post('/api/goal', {
  //     //   latitude: ballPosition[0],
  //     //   longitude: ballPosition[1]
  //     // }).then(response => {
  //     //   const { latitude, longitude } = response.data;
  //     //   console.log("Goal position:", latitude, longitude);
  //     //   setGoalPosition([latitude, longitude]);
  //     // }).catch(error => {
  //     //   console.error("Error fetching goal position:", error);
  //     // });
  //   }
  // }, [ballPosition, goalPosition]);

  useEffect(() => {
    navigator.geolocation.watchPosition((position) => {
      const { latitude, longitude } = position.coords;
      setBallPosition([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    if (ballPosition) {
      axios.post('/api/check-distance', {
        ballPosition: {
          latitude: ballPosition[0],
          longitude: ballPosition[1]
        },
        goalPosition: {
          latitude: goalPosition[0],
          longitude: goalPosition[1]
        },
        radius: 10
      }).then(response => {
        if (response.data.withinRadius) {
          alert("GOAL!");
        }
      }).catch(error => {
        console.error("Error checking distance:", error);
      });
    }
  }, [ballPosition, goalPosition]);

  if (!ballPosition) {
    return <div>Loading...</div>; // Optionally add a loading state
  }

  return (
    <MapContainer center={ballPosition} zoom={15} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={ballPosition} icon={ballIcon}></Marker>
      <Marker position={goalPosition} icon={goalIcon}></Marker>
    </MapContainer>
  );
}

export default MapComponent;
