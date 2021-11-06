import React, { useState, useEffect } from 'react';

// firebase
import { withFirebase } from "../firebase";

// google maps
import { GoogleMap, useJsApiLoader, Marker, DistanceMatrixService } from '@react-google-maps/api';
import googleMapsApiKey from './';
import Geocode from "react-geocode";

const containerStyle = {
  width: '450px',
  height: '350px'
};

const INITIAL_CENTER = {
  lat: -3.745,
  lng: -38.523
};

function MyGoogleMap(props) {
	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: googleMapsApiKey
	})
  	
  // setup state
	const [center, setCenter] = useState(INITIAL_CENTER);
  const [markerA, setMarkerA] = useState(null);
  const [markerB, setMarkerB] = useState(null);
  
  const [map, setMap] = useState(null);

  const calculateDistance = (origin, destination) => {
    const service = new google.maps.DistanceMatrixService();   
    const geocoder = new google.maps.Geocoder();
    const bounds = new google.maps.LatLngBounds();
    const request = {
      origins: [origin],
      destinations: [destination],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.IMPERIAL,
      avoidHighways: false,
      avoidTolls: false,
    };
    // get distance matrix response
    service.getDistanceMatrix(request).then((response) => {
      // show on map
      const originList = response.originAddresses;
      const destinationList = response.destinationAddresses;

      //  calculate price, distance, and store
      const distance = response.rows[0].elements[0].distance;
      props.firebase.doBookNow(originList[0], destinationList[0], distance.text, distance.value * .2);
  
      const showGeocodedAddressOnMap = (asDestination) => {
        const handler = ({ results }) => {
          map.fitBounds(bounds.extend(results[0].geometry.location));
          setMap(map);
          if(asDestination)
            setMarkerA(
              <Marker
                position={results[0].geometry.location}
                label={asDestination ? "D" : "O"}
              />
            );
          else {
            setMarkerB(
              <Marker
                position={results[0].geometry.location}
                label={asDestination ? "D" : "O"}
              />
            );
          }
        };
        return handler;
      };

      for (let i = 0; i < originList.length; i++) {
        const results = response.rows[i].elements;
  
        geocoder
          .geocode({ address: originList[i] })
          .then(showGeocodedAddressOnMap(false));
  
        for (let j = 0; j < results.length; j++) {
          geocoder
            .geocode({ address: destinationList[j] })
            .then(showGeocodedAddressOnMap(true));
        }
      }
      
    });
  }

  const decode = (origin, destination) => {
    // Geocode.setApiKey(googleMapsApiKey);
    // Geocode.enableDebug();
    calculateDistance(origin, destination);
  }

  const geoLocate = () => {
    // HTML5 geolocation
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
      function(position) {
        const center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        setCenter(center);
      },
      function(error) {
        console.error("Error Code = " + error.code + " - " + error.message);
      });
    } else {
      console.log("Geolocation not supported.");
    }
  }

  const onLoad = React.useCallback(function callback(map) {
    // const bounds = new window.google.maps.LatLngBounds();
    // map.fitBounds(bounds);
    setMap(map);

  }, [])

  useEffect(
    (map) => {
      if(props.origin) {
        decode(props.origin, props.destination);
        // console.log(distance[0]);
        // console.log(price[0]);
      } else {
        geoLocate();
      }
      return () => {
        setMap(null);
      };
    },
    [props.origin, props.destination],
  );
  
  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {markerA}
        {markerB}
        <></>
      </GoogleMap>
  ) : <></>
}

export default withFirebase(React.memo(MyGoogleMap))
