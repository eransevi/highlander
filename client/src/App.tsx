import React from 'react';
import MapComponent from './components/Map';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <div className="App">
      <Header/>
      <MapComponent />
    </div>
  );
}

export default App;
