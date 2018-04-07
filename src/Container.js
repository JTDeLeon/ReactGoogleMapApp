import React, { Component } from 'react';
import {GoogleApiWrapper} from 'google-maps-react';
import Map from './Map';


export class Container extends Component {
  //Sends data from Map to App so that it can be sent to Apps child components
  updateListView(obj) {
    this.props.updateListView(obj);
  }

  render() {
    //Sets initial size of the map container
    const style = {
      width: '100%',
      height: '100vh'
    }

    return (
      <div style={style}>
        <Map
          google={this.props.google}
          location={this.props.location}
          distance={this.props.distance}
          updateListView={(obj)=>{
            this.updateListView(obj);
          }}
        >
        </Map>
      </div>
    );
  }
}

//Handles API calls to Google Maps API
export default GoogleApiWrapper({
  apiKey: 'AIzaSyCFJfDwa-JEntdf_ABHEmuF1QS27rDJaao',
  libraries: ['places']
})(Container)
