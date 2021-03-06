import React, { Component } from 'react';
import './ListView.css'

class ListView extends Component {

  render() {
    //Clears the previous list if there is a list in the DOM
    if(document.getElementById("list")){
      document.getElementById("list").innerHTML = "";
    }
    //Initates a unique ID counter for each element added
    let count = 0;
    return (
      <div role="complementary">
        <h2 id="list-view-title">List View:</h2>
        <ul id="list">
          {this.props.parks.forEach((park)=>{
            count++;
            document.querySelector("#list").insertAdjacentHTML('beforeend',`<a href="#" id="park-${count}" data-id="${park.id}"><li>${park.name}</li></a>`);
          })}
        </ul>
      </div>

    );
  }
}

export default ListView;
