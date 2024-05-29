# HighLander Game

## Overview
The repository contains the server and client implementations for the Highlander tech test.

The client is implemented in React and the server is using express. Both are written in TypeScript.

### Client Details
The client uses the react-leaflet package for generating a map around the current users's position.
The ball is generated in the initial users's position and changes based on periodical navigation updates from the browser.

The goal is generated once by calling the server's `api/goal` endpoint and passing the ball's coordinates

On each location change, the client calls the server's `/api/check-distance` endpoint for checking if we have a goal. If there's a goal (the ball is within the specificed distance from the goal icon), an alert is shown and audio is played.

### Server Details
The server exposes the above mentioned endpoints for the client.
It has no state, and for checking the distance it needs to receive both ball and goal coordinates as well as the needed radius. This allows for flexibility with different clients calling the server at the same time and with different configurations.

## Running the game

### Client
* `cd client`
* `npm install`
* `npm run start`

### Server
Make sure you are in a different terminal session
* `cd server`
* `npm install`
* `npm run start`
