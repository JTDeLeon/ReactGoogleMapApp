import React, { Component } from 'react';
import FilterMarkers from './FilterMarkers'
import ListView from './ListView'
import './DetailsBar.css';


class DetailsBar extends Component {
  render() {
    return (
      <div className="sideBar">
        <h1 className="title">Orlando Parks Map!</h1>

        <div className="filterArea">
          <FilterMarkers />
        </div>

        <div className="listViewArea">
          <ListView />
        </div>


      </div>
    );
  }
}

export default DetailsBar;
