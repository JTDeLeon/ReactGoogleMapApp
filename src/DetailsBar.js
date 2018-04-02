import React, { Component } from 'react';
import FilterMarkers from './FilterMarkers'
import ListView from './ListView'
import './DetailsBar.css';


class DetailsBar extends Component {

  updateLocation(obj) {
    console.log("coming from details bar component");
    console.log(obj);

    //Sends to App
    this.props.updateLocation(obj);
  }

  render() {
    // console.log("IN DETAILS BAR PROPS IS ",this.props)
    return (
      <div className="sideBar">
        <div className="header">
          <h1 className="title">Orlando Parks Map!</h1>
        </div>

        <div className="filterArea">
          <FilterMarkers
            updateLocation={(obj)=>{
              this.updateLocation(obj);
            }}
          />
        </div>

        <div className="listViewArea">
          <ListView
            parks={this.props.parks}
          />
        </div>


      </div>
    );
  }
}

export default DetailsBar;
