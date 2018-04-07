import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { MAP_KEY, CLIENT_ID , CLIENT_SECRET } from './Credentials';

//Component set up with the aid of a couple articles :   https://www.fullstackreact.com/articles/how-to-write-a-google-maps-react-component/ &   https://medium.com/front-end-hacking/using-the-google-maps-javascript-api-in-a-react-project-b3ed734375c6
export class Map extends Component {

  state = {
    markers: [],
    listArray: [],
    parks: [],
  }

  //Will handle updates to the map
  componentDidUpdate(prevProps, prevState) {
    if(prevProps !== this.props){
      this.loadMap();
    }
    else {
      // console.log("Not loading map from update comp")
    }
  }

  //Will handle inital load of map
  componentDidMount(){
    this.loadMap();
  }

  //Callback function after the Google API has returned with data
  callback = (results, status) => {
    let resultsArray=[];
    let markers=[];
    if (status === "OK") {
      for (var i = 0; i < results.length; i++) {
        //Create the markers for the map
        markers.push(this.createMarker(results[i]));
        //Send to a workable array
        resultsArray.push(results[i]);
      }
      //Sets all the markers in the state to be used
      this.setState({markers:markers})

      //Send list of parks in the map to App so it can be rendered in list view component
      this.props.updateListView(resultsArray);
      //Sets state of parks that are on the map
      this.setState({listArray:resultsArray});

      //Adds event listeners to each of the list view items
      for(let x = 1; x <= resultsArray.length; x++){
        document.getElementById('park-'+x).addEventListener('click', this.showParkInfo);
      }
    }
    else {
      console.log("Error has occured")
      console.log(status)
    }
  }

  //Function to create the markers for the map
  createMarker = (place) => {
    var placeLoc = place.geometry.location;
    var marker = new this.props.google.maps.Marker({
      map: this.map,
      position: placeLoc
    });

    // Get latidude & longitude from google map api address.
    const latLongPromise = this.getLatLong(place.vicinity)
    latLongPromise.then((latLong)=>{
      //Create a fetch to the FourSquare API and returns usable JSON response into a promise
      const returnedPromise = this.fetchFourSquare(latLong);

      //Parse the returned promise
      returnedPromise.then((item)=>{
        //If venues exist and 1 or more venues are found
        if(item.response.groups && item.response.groups.length > 0){
          const venues = item.response.groups[0].items;
          //Venues are found so we can evaluate
          if(venues.length > 0){
            //Checks for the name matches with case insensitive checks and returns a new array with our matches between google api and FourSquare api results
            const venuesToCompare = venues.map((arrayItem)=>{
              if(arrayItem.venue.name.toUpperCase() === place.name.toUpperCase()){
                return arrayItem;
              }
              return undefined;
            })
            //Gets the non undefined venues that were returned
            const venueMatch = venuesToCompare.filter((item)=>{
              if(item !== undefined)
                return item;
              return undefined;
            })

            //If a successful venue match was made
            if(venueMatch.length > 0) {
              const venue = venueMatch[0];
              //Set Rating Variable
              let rating;
              if(venue.venue.rating){
                rating = venue.venue.rating.toString()+'/10';
              }else{
                rating = 'N/A';
              }

              //Set URL variables
              let url, urlLink;
              if(venue.venue.url){
                url = venue.venue.url;
                urlLink = venue.venue.url;
              }else{
                url = 'N/A';
                urlLink = '#';
              }

              //Initialize Info Window
              let infowindow = new this.props.google.maps.InfoWindow();

              //Set Opened JSX
              let opened = '';
              if(place.opening_hours){
                // console.log("Opening hours are ",place.opening_hours.open_now)
                if(place.opening_hours.open_now){
                  opened = '<h3 style="color:green">Yes!</h3>';
                }else{
                  opened = '<h4 style="color:red">No...</h4>';
                }
              }else{
                opened = 'N/A';
              }

              //Add InfoWindow with the Google & FourSquare data to map marker clicks
              this.props.google.maps.event.addListener(marker, 'click', () => {
                marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
                infowindow.setContent(`<h4>${place.name}</h4> <p>${place.vicinity}</p><p>Open Now: <strong>${opened}</strong></p><p>Rating: ${rating}</p><p>URL: <a href=${urlLink}>${url}</a></p>`);
                infowindow.open(this.map, marker);
              });


            }
            else {
              //Set info window data as N/A as we didn't find a match
              //Set Info Window
              let infowindow = new this.props.google.maps.InfoWindow();
              let opened = '';
              if(place.opening_hours){
                // console.log("Opening hours are ",place.opening_hours.open_now)
                if(place.opening_hours.open_now){
                  opened = '<h3 style="color:green">Yes!</h3>';
                }else{
                  opened = '<h4 style="color:red">No...</h4>';
                }
              }else{
                opened = 'N/A';
              }

              this.props.google.maps.event.addListener(marker, 'click', () => {
                marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
                infowindow.setContent(`<h4>${place.name}</h4> <p>${place.vicinity}</p><p>Open Now: <strong>${opened}</strong></p><p>Rating: N/A</p><p>URL: N/A</p>`);
                infowindow.open(this.map, marker);
              });
            }

          }
          //Venues are not found in foursquare
          else {
            //Set Info Window
            let infowindow = new this.props.google.maps.InfoWindow();
            let opened = '';
            if(place.opening_hours){
              // console.log("Opening hours are ",place.opening_hours.open_now)
              if(place.opening_hours.open_now){
                opened = '<h3 style="color:green">Yes!</h3>';
              }else{
                opened = '<h4 style="color:red">No...</h4>';
              }
            }else{
              opened = 'N/A';
            }

            this.props.google.maps.event.addListener(marker, 'click', () => {
              marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
              infowindow.setContent(`<h4>${place.name}</h4> <p>${place.vicinity}</p><p>Open Now: <strong>${opened}</strong></p><p>Rating: N/A</p><p>URL: N/A</p>`);
              infowindow.open(this.map, marker);
            });
          }

        }else {
          //No venues found matching
          // console.log("no venues found for ", item);
        }
      })
    })

    return marker;
  }

  //Makes API request to search for google maps coordinate locations
  fetchFourSquare = (latLong) => {

    const fsURL = 'https://api.foursquare.com/v2/venues';
    const typeOfSearch = '/explore';
    const version = '20180401'
    const clientID = CLIENT_ID;
    const secretID = CLIENT_SECRET;

    return fetch(`${fsURL}${typeOfSearch}?client_id=${clientID}&client_secret=${secretID}&v=${version}&ll=${latLong.lat},${latLong.lng}&radius=250`)
        .then((response)=>{
          if (!response.ok) {
            throw response
          } else return response.json();
         })
         .then((myJson)=> {
           return myJson;
         })
         .catch((err)=>{
           if(!document.querySelector('#error')){
             //If query limit is too much for credentials
             if(err.status === 429){
               document.querySelector('#root').insertAdjacentHTML('beforebegin',"<h3 id='error' style='color:red'>Error Fetching FourSquare Data: You have exceeded the API query limit, please try again with a fresh FourSquare client & secret key credentials.</h3>")
               throw err;
             }
             //Internet or API key is wrong
             else{
               document.querySelector('#root').insertAdjacentHTML('beforebegin',"<h3 id='error' style='color:red'>Error Fetching FourSquare Data: Please check your internet connection & ensure that your client/secret key is properly set and try again.</h3>")
             }
           }
           throw err;
         });

  }

  //Helper function to get the lat long coordinates to an address
  getLatLong = (address) =>{
    const apiKey = MAP_KEY;
    const formattedAddress = address.split(' ').join('+');
    const preURL = 'https://maps.googleapis.com/maps/api/geocode/json?';
    const formattedURL = `${preURL}address=${formattedAddress}&key=${apiKey}`

    return fetch(formattedURL)
      .then((response)=>{
        return response.json()
      })
      .then((myJSON)=>{
        if(myJSON.status === 'REQUEST_DENIED'){
          throw Error;
        }
        const toPassIntoState = myJSON.results[0].geometry.location;
        return toPassIntoState;
      })
      .catch((err)=>{
        //Notifies user that the API key may be the problem.
        document.querySelector('#root').insertAdjacentHTML('beforebegin',"<h3 id='error' style='color:red'>Error Fetching Google Maps Data: Please check your internet connection & ensure that your Google Maps API key is properly set and try again.</h3>")
         throw err;
     });
  }

  //Received resource assistance from CSS-Tricks @ https://css-tricks.com/forums/topic/clickable-page-links-to-open-markers-on-google-map/
  //Handle function for click events on list items
  showParkInfo = (event) =>{
    //Prevents refresh of page
    event.preventDefault();

    let titleToFind = event.target.parentNode.dataset.id;
    let markerToClick;

    //Finds the marker associated with the link id / name
    for(let i = 0; i < this.state.listArray.length; i++) {
        if(this.state.listArray[i].id === titleToFind) {
          markerToClick = this.state.markers[i];
        }
    }

    //Opens info window of the marker clicked
    new this.props.google.maps.event.trigger( markerToClick, 'click' );
    //Changes the color of the icon when this link is clicked
    markerToClick.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
  }

  //This is the main function to load the map on mount & on update
  loadMap() {
    if (this.props && this.props.google) {
      // google is available
      const {google} = this.props;
      const maps = google.maps;

      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);

      let zoom = 13;
      //Coordinates from App or User Generated
      let lat = this.props.location.lat;
      let lng = this.props.location.lng;

      const center = new maps.LatLng(lat, lng);
      const mapConfig = Object.assign({}, {
        center: center,
        zoom: zoom
      })
      this.map = new maps.Map(node, mapConfig);

      //Marker
      const marker = new google.maps.Marker({
        position: center,
        map: this.map,
        title: "Current Location",
        icon: "http://maps.google.com/mapfiles/ms/icons/blue.png"
      });

      //InfoWindow
      var infowindow = new google.maps.InfoWindow({
        content: `<h3>${marker.title}</h3>
        <h4>At position ${marker.position}</h4>`
      });
      marker.addListener('click', function(){
        infowindow.open(this.map, marker);
      });

      var service = new google.maps.places.PlacesService(this.map);
      service.nearbySearch({
        location: center,
        radius: this.props.distance,
        type: ['park']
      }, this.callback);
    }
  }

  render() {

    return (
      <div>
        <MediaQuery query="(max-device-width: 1224px)">
          <main id="map-main" role="application" ref="map" style={{width: '100%',height: '100vh'}}>
            loading map...
          </main>
        </MediaQuery>

        <MediaQuery query="(min-device-width: 1225px)">
          <main id="map-main" role="application" ref="map" style={{width: '100%',height: '100vh'}}>
            loading map...
          </main>
        </MediaQuery>
      </div>
    )


  }
}
//Sets ProtoTypes
Map.propTypes = {
  google: PropTypes.object,
  zoom: PropTypes.number,
  initialCenter: PropTypes.object
}

export default Map;
