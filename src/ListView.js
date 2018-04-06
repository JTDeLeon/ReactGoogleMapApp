import React, { Component } from 'react';

class ListView extends Component {

  render() {
    console.log("IN LIST VIEW THE PROPS ARE",this.props.parks);
    if(document.getElementById("list")){
      document.getElementById("list").innerHTML = "";
    }

    let count = 0;
    return (
      <div role="complementary">
        <h2>THIS IS ListView</h2>
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
