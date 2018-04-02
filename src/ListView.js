import React, { Component } from 'react';

class ListView extends Component {

  render() {
    console.log("IN LIST VIEW THE PROPS ARE",this.props.parks);
    if(document.getElementById("list")){
      document.getElementById("list").innerHTML = "";
    }
    return (
      <div>
        <h2>THIS IS ListView</h2>

        <ul id="list">

          {this.props.parks.forEach((park)=>{
            document.querySelector("#list").insertAdjacentHTML('beforeend',`<li>${park.name}</li>`);
          })}
        </ul>
      </div>

    );
  }
}

export default ListView;
