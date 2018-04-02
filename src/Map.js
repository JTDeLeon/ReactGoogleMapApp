import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ListView from './ListView'

//Component set up with the help a couple articles on :   https://www.fullstackreact.com/articles/how-to-write-a-google-maps-react-component/ & https://medium.com/front-end-hacking/using-the-google-maps-javascript-api-in-a-react-project-b3ed734375c6
export class Map extends Component {

  //Will handle updates to the map
  componentDidUpdate(prevProps, prevState) {
    console.log("Inside the componentDidUpdate");
    console.log(prevProps);
    console.log(this.props);
    if(prevProps != this.props){
      this.loadMap();
      // prevProps = this.props;
    }
    else {
      console.log("Not loading map from update comp")
      // return
    }


  }

  //Will handle inital load
  componentDidMount(){
    console.log("Inside the componentDidMound");
    this.loadMap();
  }

  callback = (results, status) => {
    let resultsArray=[];
    if (status === "OK") {
      for (var i = 0; i < results.length; i++) {
      this.createMarker(results[i]);
      //Just gather 5 of the parks
      // if(resultsArray.length<5){
      //   //Ratings > 4 will be included
      //   if(results[i].rating > 4){
          //create array that will send to list view
          resultsArray.push(results[i]);
      //   }
      //
      // }

      }
      // window.setTimeout(()=>{
        console.log("results Array is ",resultsArray);
        //Send to list view
        this.props.updateListView(resultsArray);

      // },2000);

    }
    else {
      console.log("Error has occured")
      console.log(status)
    }
  }

  createMarker = (place) => {
    var placeLoc = place.geometry.location;
    var marker = new this.props.google.maps.Marker({
      map: this.map,
      position: placeLoc
    });

    let infowindow = new this.props.google.maps.InfoWindow();

    this.props.google.maps.event.addListener(marker, 'click', () => {
      infowindow.setContent(place.name);
      infowindow.open(this.map, marker);
    });
  }

  loadMap() {
    console.log("loading the map")
    if (this.props && this.props.google) {
      // google is available
      const {google} = this.props;
      const maps = google.maps;

      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);

      let zoom = 13;
      // let lat = 28.529270;
      // let lng = -81.276423;
      let lat = this.props.location.lat;
      let lng = this.props.location.lng;

      const center = new maps.LatLng(lat, lng);
      const mapConfig = Object.assign({}, {
        center: center,
        zoom: zoom
      })
      this.map = new maps.Map(node, mapConfig);

      //Marker
      const marker = new google.maps.Marker({
        position: center,
        map: this.map,
        title: "Current Location"
      });

      //InfoWindow
      var infowindow = new google.maps.InfoWindow({
        content: `<h3>${marker.title}</h3>
        <h4>At position ${marker.position}</h4>`
      });
      marker.addListener('click', function() {
        infowindow.open(this.map, marker);
      });

      console.log("Meters passed in is ",this.props.distance);

      var service = new google.maps.places.PlacesService(this.map);
      service.nearbySearch({
        location: center,
        radius: this.props.distance,
        type: ['park']
      }, this.callback);
    }
  }

  render() {
    const style = {
      width: '70vw',
      height: '100vh'
    }

    return (
      <div ref="map" style={style}>
        loading map...
      </div>
    )


  }
}

Map.propTypes = {
  google: PropTypes.object,
  zoom: PropTypes.number,
  initialCenter: PropTypes.object
}

export default Map;
