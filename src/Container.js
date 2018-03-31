import React, { Component } from 'react';
import {InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import Map from './Map';


export class Container extends Component {


  render() {
    const style = {
      width: '100vw',
      height: '100vh'
    }

    console.log(this.props.google)
    return (
      <div style={style}>

        <Map
          google={this.props.google}
          // style={style}
          // initialCenter={{
          //   lat: 28.529270,
          //   lng: -81.276423
          // }}
          // zoom={13}
        >


        {/* <Marker
          name={'Dolores park'}
          title={'Dolores park'}
          position={{lat: 28.229270, lng: -81.276423}} />
        <Marker />
        <Marker
          title={'Location3'}
          position={{lat: 28.59270, lng: -81.376423}} />
        <Marker /> */}

      </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCFJfDwa-JEntdf_ABHEmuF1QS27rDJaao'
})(Container)
