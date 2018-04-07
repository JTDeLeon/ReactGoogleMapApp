import React, { Component } from 'react';
import { MAP_KEY } from './Credentials';
import DetailsBar from './DetailsBar'
import Container from './Container'
import './App.css';

class App extends Component {

  //Handles the location changes
  state = {
    location: {
      lat: 28.5383355,
      lng: -81.3792365
    },
    metersAway: 8045,
    listOfParks: []
  }

  //Fetches the address Lat Long coordinates
  getLatLong(address){
    const apiKey = MAP_KEY;
    const formattedAddress = address.split(' ').join('+');
    const preURL = 'https://maps.googleapis.com/maps/api/geocode/json?';
    const formattedURL = `${preURL}address=${formattedAddress}&key=${apiKey}`

    fetch(formattedURL)
      .then((response)=>{
        return response.json()
      })
      .then((myJSON)=>{
        //Handles if API key is incorrect
        if(myJSON.status === 'REQUEST_DENIED'){
          throw Error;
        }
        const toPassIntoState = myJSON.results[0].geometry.location;
        //Sets the new location coordinates in state
        this.setState({location:toPassIntoState})
      })
      .catch((err)=>{
        //Notifies user that the API key or Internet may be the problem.
        document.querySelector('#root').insertAdjacentHTML('beforebegin',"<h3 id='error' style='color:red'>Error Fetching Google Maps Data: Please check your internet connection & ensure that your Google Maps API key is properly set and try again.</h3>")
       throw err;
     });
  }

  //Converts Miles to Meters
  getDistance(miles){
    const meters = Math.ceil(miles*1609.344);
    this.setState({metersAway:meters});
  }

  //Initial handle function when a new location is set by a user
  updateLocation(obj) {
    this.getLatLong(obj.address);
    this.getDistance(obj.distance);
  }

  //Updates the parks in the listOfParks state
  updateListView(obj) {
    //If the length of returned parks is different compared to previously set, then update.
    if(this.state.listOfParks.length !== obj.length){
      this.setState({listOfParks:obj});
    }
    //If the arrays are the same length, then we need to check if the contents are different
    else {
      for(var i = 0; i<obj.length; i++){
        if(this.state.listOfParks[i].id !== obj[i].id){
          this.setState({listOfParks:obj});
        }
      }
    }
  }

  render() {
    return (
      <div className="App">
        <div className="details_Bar">
          <DetailsBar
            updateLocation={(obj)=>{
              this.updateLocation(obj);
            }}
            parks={this.state.listOfParks}
          />
        </div>
        <div className="map">
          <Container
            location={this.state.location}
            distance={this.state.metersAway}
            updateListView={(obj)=>{
              this.updateListView(obj);
            }}
          />
        </div>
      </div>
    );
  }
}

export default App;
