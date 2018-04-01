import React, { Component } from 'react';

class FilterMarkers extends Component {

  handleChange = (event) => {
    console.log("Change has occured")
    console.log(event.target.value)
  }

  handleClick = (event) => {
    console.log("click has occured")
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

  render() {
    return (
      <div>
        <h2>Search For Parks In Orlando</h2>
        <form>

          <select
            id="distance"
          >
            <option value="5">5 Miles</option>
            <option value="10">10 Miles</option>
            <option value="15">15 Miles</option>
            <option value="20">20 Miles</option>
          </select>

          <br/>
          <span>From:</span>
          <br/>


          <input
            id="location"
            type="address"
            placeholder="Insert Location"
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
