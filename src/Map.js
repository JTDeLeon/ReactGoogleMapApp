import React, { Component } from 'react';
import ReactDOM from 'react-dom';


export class Map extends Component {
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.google !== this.props.google) {
      this.loadMap();
    }
  }

  componentDidMount(){
    console.log("This was mounted")
    this.loadMap();
    console.log(this.props);
    console.log(this.props.google);
    console.log(ReactDOM.findDOMNode(this.refs.map));

  }

  loadMap() {
    if (this.props && this.props.google) {
      // google is available
      const {google} = this.props;
      const maps = google.maps;

      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);

      let zoom = 10;
      let lat = 28.529270;
      let lng = -81.276423;
      const center = new maps.LatLng(lat, lng);
      const mapConfig = Object.assign({}, {
        center: center,
        zoom: zoom
      })
      this.map = new maps.Map(node, mapConfig);
    }
  }

  render() {
    const style = {
      width: '100vw',
      height: '100vh'
    }

    return (
      <div ref="map" style={style}>
        loading map...
      </div>
    )


  }
}

export default Map;
