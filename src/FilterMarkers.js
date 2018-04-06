import React, { Component } from 'react';
import './FilterMarkers.css'

class FilterMarkers extends Component {

  handleChange = (event) => {
    console.log("Change has occured")
    console.log(event.target.value)
  }

  handleClick = (event) => {
    console.log("click has occured")
    if(document.querySelector('#location').value.length === 0){
      window.alert("Uh Oh! Insert an address please.");
    }else{
      //Collects user input
      let locationDetails = {
        address: document.querySelector('#location').value,
        distance: document.querySelector('#distance').value
      }
      console.log(locationDetails.address);
      console.log(locationDetails.distance);

      //Sends to parent component
      this.props.updateLocation(locationDetails);

      return locationDetails;
    }
  }

  render() {
    return (
      <div role='search'>
        <h2 id="filterTitle">Search For Parks Near You</h2>
        <form>
          <label htmlFor="distance">Distance: </label>
          <br/>
          <select
            id="distance"
          >
            <option value="5">5 Miles</option>
            <option value="10">10 Miles</option>
            <option value="15">15 Miles</option>
            <option value="20">20 Miles</option>
          </select>

          <br/>
          <br/>


          <label htmlFor="location">From: </label>
          <br/>
          <input
            id="location"
            type="address"
            placeholder="Insert Your Address"
            onChange={this.handleChange}
          ></input>

          <br/>
          <br/>

          <button
            type="button"
            onClick={this.handleClick}
          >Find Parks!</button>


        </form>
      </div>

    );
  }
}

export default FilterMarkers;
