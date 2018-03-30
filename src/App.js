import React, { Component } from 'react';
import DetailsBar from './DetailsBar'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="details_Bar">
          <DetailsBar />
        </div>
        <div className="map"></div>
      </div>
    );
  }
}

export default App;
