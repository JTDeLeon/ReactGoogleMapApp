import React, { Component } from 'react';
import Geocode from "react-geocode";
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

  getLatLong(address){
    Geocode.setApiKey("AIzaSyCFJfDwa-JEntdf_ABHEmuF1QS27rDJaao");

    // Get latidude & longitude from address.
    Geocode.fromAddress(address).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        console.log(lat, lng);
        console.log(lat);
        console.log(lng);

        let newLocation = this.state.location;
        console.log("OLD Location",newLocation);

        newLocation.lat = lat;
        newLocation.lng = lng;
        console.log("NEW Location",newLocation);
        this.setState({location:newLocation})
        // this.setState({location:lng})

        console.log(this.state);

      },
      error => {
        console.error(error);
      }
    );
  }

  updateLocation(obj) {
    console.log("coming from APP component");
    console.log(obj);

    this.getLatLong(obj.address)

  }

  render() {
    console.log("APP IS RERENDERING")
    console.log(this.state)
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
