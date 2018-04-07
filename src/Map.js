import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { MAP_KEY, CLIENT_ID , CLIENT_SECRET } from './Credentials';
// import Geocode from "react-geocode";
import ListView from './ListView'

//Component set up with the help a couple articles on :   https://www.fullstackreact.com/articles/how-to-write-a-google-maps-react-component/ & https://medium.com/front-end-hacking/using-the-google-maps-javascript-api-in-a-react-project-b3ed734375c6
export class Map extends Component {

  state = {
    markers: [],
    listArray: [],
    parks: [],
  }

  //Will handle updates to the map
  componentDidUpdate(prevProps, prevState) {
    console.log("Inside the componentDidUpdate");
    console.log(prevProps);
    console.log(this.props);

    if(prevProps != this.props){
      this.loadMap();
      // prevProps = this.props;
    }
    else {
      console.log("Not loading map from update comp")
      // return
    }


  }

  //Will handle inital load
  componentDidMount(){
    console.log("Inside the componentDidMound");
    this.loadMap();
  }

  callback = (results, status) => {
    console.log("RESULTS FROM CALLBACK",results);
    let resultsArray=[];
    let markers=[];
    if (status === "OK") {
      for (var i = 0; i < results.length; i++) {
      markers.push(this.createMarker(results[i]));
      //Just gather 5 of the parks
      // if(resultsArray.length<5){
      //   //Ratings > 4 will be included
      //   if(results[i].rating > 4){
          //create array that will send to list view
          resultsArray.push(results[i]);

      //   }
      //
      // }

      }
      console.log("Markers Array is ",markers);
      this.setState({markers:markers})
      console.log("Markers Array from state is ",this.state)

      // window.setTimeout(()=>{

        const resultsObj = {resultsArray,update:true};
        console.log("results object is ",resultsObj);
        console.log("results Array is ",resultsArray);
        //Send to list view
        this.props.updateListView(resultsArray);
        this.setState({listArray:resultsArray});
        console.log("ListArray From State is ",resultsArray)

      // },2000);

      for(let x = 1; x <= resultsArray.length; x++){
        document.getElementById('park-'+x).addEventListener('click', this.showParkInfo);
      }


    }
    else {
      console.log("Error has occured")
      console.log(status)
    }
  }

  createMarker = (place) => {
    console.log("WITHIN CREATE MARKER, place is ",place);
    var placeLoc = place.geometry.location;
    var marker = new this.props.google.maps.Marker({
      map: this.map,
      position: placeLoc
    });

    console.log("<<Handling FourSquare>>")
    //Handle FourSquare
    // console.log(this.getLatLong(place.vicinity));
    // console.log("From inside STATE",this.state.latLong);


    // Get latidude & longitude from address.
    const latLongPromise = this.getLatLong(place.vicinity)
    console.log("Promise from geocode is ",latLongPromise)
    latLongPromise.then((latLong)=>{
      console.log(latLong);

    //Uncomment this step when ready
      const returnedPromise = this.fetchFourSquare(latLong);

      returnedPromise.then((item)=>{
        console.log("item is ",item);

        if(item.response.groups && item.response.groups.length > 0){
          const venues = item.response.groups[0].items;
          if(venues.length > 0){
            //Venues are found so we can evaluate
            console.log("Venues array is ",venues)
            console.log("Marker is still ",marker);
            console.log("Place is still ",place);

            const venuesToCompare = venues.map((arrayItem)=>{
              console.log(arrayItem.venue.name.toUpperCase());
              console.log(place.name.toUpperCase())
              if(arrayItem.venue.name.toUpperCase() === place.name.toUpperCase()){
                return arrayItem;
              }
            })

            const venueMatch = venuesToCompare.filter((item)=>{
              if(item != undefined)
                return item;
            })

            console.log("After Filtered (Venues Array)",venuesToCompare);

            console.log("VenueMatch ",venueMatch);

            //If a successful venue match was made
            if(venueMatch.length > 0) {
              const venue = venueMatch[0];
              console.log("CHECKING FOR SCOPE")
              console.log("Venue within if statement is ",venue);
              console.log("Marker is still ",marker);
              console.log("Place is still ",place);
              let rating;
              if(venue.venue.rating){
                rating = venue.venue.rating.toString()+'/10';
              }else{
                rating = 'N/A';
              }

              console.log("Rating is ",rating);

              let url, urlLink;
              if(venue.venue.url){
                url = venue.venue.url;
                urlLink = venue.venue.url;
              }else{
                url = 'N/A';
                urlLink = '#';
              }

              console.log("URL is ",url);

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
          else {
            //Venues are not found and array length is 0
            console.log("Venues array is EMPTY")
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
          //No venues found
          console.log("no venues found for ", item);
        }
      })
    })

    console.log("FROM  Outside Functions");


    return marker;
  }

  fetchFourSquare = (latLong) => {
    console.log("INSIDE THE CALL BACK funNTION",this.state)

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
           console.log(myJson);
           return myJson;
         })
         .catch((err)=>{
           //alert("Error happened when fetching from FourSquare",err);
           if(!document.querySelector('#error')){


             if(err.status === 429){
               document.querySelector('#root').insertAdjacentHTML('beforebegin',"<h3 id='error' style='color:red'>Error Fetching FourSquare Data: You have exceeded the API query limit, please try again with a fresh FourSquare client & secret key credentials.</h3>")
               throw err;
             }
             else{
               document.querySelector('#root').insertAdjacentHTML('beforebegin',"<h3 id='error' style='color:red'>Error Fetching FourSquare Data: Please check your internet connection & ensure that your client/secret key is properly set and try again.</h3>")
             }
           }
           throw err;
         });

    console.log(this.state.venue);
  }

  getLatLong = (address) =>{
    const apiKey = MAP_KEY;
    const formattedAddress = address.split(' ').join('+');
    const preURL = 'https://maps.googleapis.com/maps/api/geocode/json?';


    const formattedURL = `${preURL}address=${formattedAddress}&key=${apiKey}`
    console.log("fetch url is ",formattedURL);

    return fetch(formattedURL)
      .then((response)=>{
        console.log("Success")
        console.log(response)
        return response.json()
      })
      .then((myJSON)=>{
        console.log("My JSON is ",myJSON);
        if(myJSON.status === 'REQUEST_DENIED'){
          throw Error;
          return;
        }
        const toPassIntoState = myJSON.results[0].geometry.location;
        return toPassIntoState;
        // this.setState({location:toPassIntoState})
      })
      .catch((err)=>{
        console.log("Failed")
        console.log(err)
        //Notifies user that the API key may be the problem.
        // if(!document.querySelector('#error'))
          document.querySelector('#root').insertAdjacentHTML('beforebegin',"<h3 id='error' style='color:red'>Error Fetching Google Maps Data: Please check your internet connection & ensure that your Google Maps API key is properly set and try again.</h3>")
       throw err;
     });

    // Get latidude & longitude from address.
    // Geocode.fromAddress(address).then(
    //   response => {
    //     const { lat, lng } = response.results[0].geometry.location;
    //     console.log(lat, lng);
    //     let latLong = { lat, lng };
    //     console.log(latLong);
    //     // this.setState({latLong: latLong});
    //     return latLong;
    //   },
    //   error => {
    //     console.error(error);
    //   }
    // );
  }

  //Received resource assistance from CSS-Tricks @ https://css-tricks.com/forums/topic/clickable-page-links-to-open-markers-on-google-map/
  showParkInfo = (event) =>{
    console.log("This was clicked");
    console.log(event);

    event.preventDefault();

    let titleToFind = event.target.parentNode.dataset.id;
    console.log("Title to find is set as ",titleToFind)
    let markerToClick;
    console.log(this.state)
    // this.manageMarker(titleToFind);

    for(let i = 0; i < this.state.listArray.length; i++) {
        if(this.state.listArray[i].id === titleToFind) {
          markerToClick = this.state.markers[i];
        }
    }
    console.log("Marker to click is set as ",markerToClick);

    //Opens info window of the marker clicked
    new this.props.google.maps.event.trigger( markerToClick, 'click' );

    markerToClick.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
  }

  // manageMarker(id){
  //   console.log(this);
  // }

  loadMap() {
    console.log("loading the map")
    if (this.props && this.props.google) {
      // google is available
      const {google} = this.props;
      const maps = google.maps;

      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);

      let zoom = 13;
      // let lat = 28.529270;
      // let lng = -81.276423;
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

      console.log("Meters passed in is ",this.props.distance);

      var service = new google.maps.places.PlacesService(this.map);
      service.nearbySearch({
        location: center,
        radius: this.props.distance,
        type: ['park']
      }, this.callback);
    }
  }

  render() {

    // const style = {
    //   width: '70vw',
    //   height: '100vh'
    // }

    return (
      <div>
        <MediaQuery query="(max-device-width: 1224px)">
          <main id="map-main" role="application" ref="map" style={{width: '100%',height: '100vh'}}>
            loading map...
          </main>
        </MediaQuery>

        {/* <MediaQuery         query="(min-device-width: 426px)"
        query="(max-device-width: 1224px)"
          >
          <main id="map-main" role="application" ref="map" style={{width: '70vw',height: '100vh'}}>
            loading map...
          </main>
        </MediaQuery> */}

        <MediaQuery query="(min-device-width: 1225px)">
          <main id="map-main" role="application" ref="map" style={{width: '100%',height: '100vh'}}>
            loading map...
          </main>
        </MediaQuery>
      </div>
    )


  }
}

Map.propTypes = {
  google: PropTypes.object,
  zoom: PropTypes.number,
  initialCenter: PropTypes.object
}

export default Map;
