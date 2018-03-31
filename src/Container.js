import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

export class Container extends Component {



  render() {
    const style = {
      width: '100vw',
      height: '100vh'
    }
    return (
      <div style={style}>
        <Map google={this.props.google}
          />
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyCFJfDwa-JEntdf_ABHEmuF1QS27rDJaao"
})(Container)
