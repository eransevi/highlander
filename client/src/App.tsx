import React from 'react';
import MapComponent from './components/Map';
import HeaderComponent from './components/Header';

const App: React.FC = () => {
  return (
    <div className="App">
      <HeaderComponent/>
      <MapComponent />
    </div>
  );
}

export default App;
