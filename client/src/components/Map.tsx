import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import styled from "styled-components";
import ball from "../assets/ball.png";
import goal from "../assets/goal.png";

// Custom icons for the markers
const ballIcon = new L.Icon({
  iconUrl: ball,
  iconSize: [50, 50],
});

const goalIcon = new L.Icon({
  iconUrl: goal,
  iconSize: [100, 100],
});

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const StartButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 18px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:focus {
    outline: none;
  }
`;

const MapComponent = () => {
  const [started, setStarted] = useState(false);
  const [ballPosition, setBallPosition] = useState<[number, number] | null>(
    null
  );
  const [goalPosition, setGoalPosition] = useState<[number, number]>([0, 0]);
  const cheeringSound = useRef<HTMLAudioElement | null>(null);

  // Load cheering sound
  useEffect(() => {
    if (!cheeringSound.current) {
      cheeringSound.current = new Audio("/cheering.mp3");
    }
  }, []);

  useEffect(() => {
    if (!started) {
      if (cheeringSound.current) {
        cheeringSound.current.pause();
        cheeringSound.current.currentTime = 0;
      }
      setGoalPosition([0, 0]);
      setBallPosition(null);
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setBallPosition([latitude, longitude]);
          axios
            .post("/api/goal", {
              latitude: latitude,
              longitude: longitude,
            })
            .then((response) => {
              const { latitude, longitude } = response.data;
              console.log("Goal position:", latitude, longitude);
              setGoalPosition([latitude, longitude]);
            })
            .catch((error) => {
              console.error("Error fetching goal position:", error);
            });
        },
        (error) => {
          console.error("Error fetching geolocation:", error);
        }
      );
    }
  }, [started]);

  useEffect(() => {
    if (started) {
      navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        setBallPosition([latitude, longitude]);
      });
    }
  }, [started, cheeringSound]);

  useEffect(() => {
    if (ballPosition && started) {
      axios
        .post("/api/check-distance", {
          ballPosition: {
            latitude: ballPosition[0],
            longitude: ballPosition[1],
          },
          goalPosition: {
            latitude: goalPosition[0],
            longitude: goalPosition[1],
          },
          radius: 10,
        })
        .then((response) => {
          if (response.data.withinRadius) {
            cheeringSound.current?.play();
            alert("GOAL!");
            setStarted(false);
          }
        })
        .catch((error) => {
          console.error("Error checking distance:", error);
        });
    }
  }, [ballPosition, goalPosition, started, cheeringSound]);

  if (!started) {
    return (
      <CenteredContainer>
        <StartButton onClick={() => setStarted(true)}>Start Game</StartButton>
      </CenteredContainer>
    );
  }

  if (!ballPosition) {
    return <div>Loading...</div>; // Optionally add a loading state
  }

  return (
    <MapContainer
      center={ballPosition}
      zoom={15}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={ballPosition} icon={ballIcon}></Marker>
      <Marker position={goalPosition} icon={goalIcon}></Marker>
    </MapContainer>
  );
};

export default MapComponent;
