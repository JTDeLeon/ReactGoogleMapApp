import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';


//Component set up with the help a couple articles on :   https://www.fullstackreact.com/articles/how-to-write-a-google-maps-react-component/ & https://medium.com/front-end-hacking/using-the-google-maps-javascript-api-in-a-react-project-b3ed734375c6
export class Map extends Component {
  //Will handle updates to the map
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.google !== this.props.google) {
      this.loadMap();
    }
  }

  //Will handle inital load
  componentDidMount(){
    console.log("This was mounted")
    this.loadMap();
    console.log(this.props);
    console.log(this.props.google);
    console.log(ReactDOM.findDOMNode(this.refs.map));

  }

  callback = (results, status) => {
    if (status === "OK") {
      for (var i = 0; i < results.length; i++) {
      this.createMarker(results[i]);
      }
    }
    else {
      console.log("Error has occured")
    }
  }

  createMarker = (place) => {
    var placeLoc = place.geometry.location;
    var marker = new this.props.google.maps.Marker({
      map: this.map,
      position: placeLoc
    });
    console.log(place)
  }

  loadMap() {
    if (this.props && this.props.google) {
      // google is available
      const {google} = this.props;
      const maps = google.maps;

      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);

      let zoom = 13;
      let lat = 28.529270;
      let lng = -81.276423;
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

      var service = new google.maps.places.PlacesService(this.map);
      service.nearbySearch({
        location: center,
        radius: 5000,
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
