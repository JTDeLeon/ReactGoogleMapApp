import React, { Component } from 'react';

class FilterMarkers extends Component {
  render() {
    return (
      <div>
        <h2>Search For Parks In Orlando</h2>
        <form>

          <select>
            <option value="5">5 Miles</option>
            <option value="10">10 Miles</option>
            <option value="15">15 Miles</option>
            <option value="20">20 Miles</option>
          </select>

          <br/>
          <span>From:</span>
          <br/>


          <input
            type="address"
            placeholder="Insert Location"
          ></input>

          <br/>
          <br/>

          <button>Find Parks!</button>


        </form>
      </div>

    );
  }
}

export default FilterMarkers;
