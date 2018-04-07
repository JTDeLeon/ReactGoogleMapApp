import React, { Component } from 'react';
import FilterMarkers from './FilterMarkers'
import ListView from './ListView'
import './DetailsBar.css';


class DetailsBar extends Component {

  //Sends data from FilterMarks to App so it can be passed to child component MAP
  updateLocation(obj) {
    this.props.updateLocation(obj);
  }

  render() {
    return (
      <div className="sideBar">
        <header className="header">
          <h1 className="title">Orlando Parks Map!</h1>
        </header>

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
          <footer>
            <p>Created by: Jonathan Deleon, Apr 2018.</p>
            <p>Data Provided By: Google Maps & FourSquare</p>
          </footer>
        </div>
      </div>
    );
  }
}

export default DetailsBar;
