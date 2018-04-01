import React, { Component } from 'react';
import DetailsBar from './DetailsBar'
import Container from './Container'
import './App.css';

class App extends Component {

  //Handles the location changes
  state = {
    location: {
      lat: 28.229270,
      lng: -81.276423
    }
  }

  updateLocation(obj) {
    console.log("coming from APP component");
    console.log(obj);

  }

  render() {
    return (
      <div className="App">
        <div className="details_Bar">
          <DetailsBar
            updateLocation={(obj)=>{
              this.updateLocation(obj);
            }}
          />
        </div>
        <div className="map">
          <Container
            location={this.state.location}
          />
        </div>
      </div>
    );
  }
}

export default App;
