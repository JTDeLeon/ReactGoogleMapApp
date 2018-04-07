import React, { Component } from 'react';
import './FilterMarkers.css'

class FilterMarkers extends Component {
  //Where event details can be added in order to see what the application sees from the user input
  handleChange = (event) => {
    // console.log("Change has occured")
    // console.log(event.target.value)
  }

  //Handles the click event from the user
  handleClick = (event) => {
    //Checks to ensure that the user inserted a value into the search input
    if(document.querySelector('#location').value.length === 0){
      window.alert("Uh Oh! Insert an address please.");
    }else{
      //Collects user input
      let locationDetails = {
        address: document.querySelector('#location').value,
        distance: document.querySelector('#distance').value
      }

      //Sends to parent component DetailsBar
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
