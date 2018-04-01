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
          <ListView />
        </div>


      </div>
    );
  }
}

export default DetailsBar;
