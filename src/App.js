import React, { Component } from 'react';
// import Geocode from "react-geocode";
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


  getLatLong(address){
    const apiKey = MAP_KEY;
    const formattedAddress = address.split(' ').join('+');
    const preURL = 'https://maps.googleapis.com/maps/api/geocode/json?';


    const formattedURL = `${preURL}address=${formattedAddress}&key=${apiKey}`
    console.log("fetch url is ",formattedURL);

    fetch(formattedURL)
      .then((response)=>{
        console.log("Success")
        console.log(response)
        return response.json()
      })
      .then((myJSON)=>{
        console.log("My JSON is ",myJSON);
        if(myJSON.status === 'REQUEST_DENIED'){
          throw Error;
          return;
        }

        const toPassIntoState = myJSON.results[0].geometry.location;
        console.log(toPassIntoState)
        this.setState({location:toPassIntoState})
      })
      .catch((err)=>{
        console.log("Failed")
        console.log(err)
        //Notifies user that the API key may be the problem.
        // if(!document.querySelector('#error'))
          document.querySelector('#root').insertAdjacentHTML('beforebegin',"<h3 id='error' style='color:red'>Error Fetching Google Maps Data: Please check your internet connection & ensure that your Google Maps API key is properly set and try again.</h3>")
       throw err;
     });

    // Geocode.setApiKey("AIzaSyCFJfDwa-JEntdf_ABHEmuF1QS27rDJaao");
    //
    // // Get latidude & longitude from address.
    // Geocode.fromAddress(address).then(
    //   response => {
    //     const { lat, lng } = response.results[0].geometry.location;
    //     console.log(lat, lng);
    //     console.log(lat);
    //     console.log(lng);
    //
    //     let newLocation = this.state.location;
    //     console.log("OLD Location",newLocation);
    //
    //     newLocation.lat = lat;
    //     newLocation.lng = lng;
    //     console.log("NEW Location",newLocation);
    //     this.setState({location:newLocation})
    //
    //     console.log(this.state);
    //
    //   },
    //   error => {
    //     console.error(error);
    //   }
    // );
  }



  getDistance(miles){
    const meters = Math.ceil(miles*1609.344);
    console.log("METERS IS NOW ",meters);
    this.setState({metersAway:meters});
  }

  updateLocation(obj) {
    console.log("coming from APP component");
    console.log(obj);

    this.getLatLong(obj.address);
    this.getDistance(obj.distance);



  }

  updateListView(obj) {
    console.log("coming from APP component List View");
    console.log(obj);
    console.log(this.state.refresh);
    console.log(this.state.listOfParks);


    if(this.state.listOfParks.length !== obj.length){
      // for(var i = 0; i<obj.length; i++){
      //   if(this.state.listOfParks[i].id !== obj[i].id){
          console.log("+++ Inside State +++ ")
          //@TODO NEED TO FIGURE OUT WHY THIS DOESN"T RUN ON REFRESH OF NEW LOCATION
          console.log(obj);
          console.log(this.state.listOfParks);
          this.setState({listOfParks:obj});
          console.log(this.state.listOfParks);

        // }
      }
      else {
        for(var i = 0; i<obj.length; i++){
          if(this.state.listOfParks[i].id !== obj[i].id){
            console.log("+++ Inside State +++ ")
            //@TODO NEED TO FIGURE OUT WHY THIS DOESN"T RUN ON REFRESH OF NEW LOCATION
            console.log(obj);
            console.log(this.state.listOfParks);
            this.setState({listOfParks:obj});
            console.log(this.state.listOfParks);
          }
        }
      }




    console.log(this.state);

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
