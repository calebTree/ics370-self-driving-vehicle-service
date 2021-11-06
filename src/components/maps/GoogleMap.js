import React, { useState, useEffect } from 'react';

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
  const [pickup, setPickup] = useState(null);
  const [dropoff, setdropoff] = useState(null);
  
  const [map, setMap] = useState(null);

  const decode = (pickup, dropoff) => {
    Geocode.setApiKey(googleMapsApiKey);
    // Geocode.enableDebug();

    // Get latitude & longitude from pickup.
    Geocode.fromAddress(pickup).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        const center = {
          lat: lat,
          lng: lng
        }
        setCenter(center);
        setPickup(center);
      },
      error => {
        console.error(error);
      }
    );

    // Get latitude & longitude from dropoff.
    Geocode.fromAddress(dropoff).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        const center = {
          lat: lat,
          lng: lng
        }
        setdropoff(center);
      },
      error => {
        console.error(error);
      }
    );

    const service = new DistanceMatrixService();
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
    const bounds = new window.google.maps.LatLngBounds();
    // bounds.extend(results[0].geometry.location);
    map.fitBounds(bounds);
    setMap(map);
  }, [])

  useEffect(
    () => {
      if(props.origin)
        decode(props.origin, props.destination);
      else {
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
        { /* Child components, such as markers, info windows, etc. */ }
        <Marker
          position={pickup}
        />
        <Marker
          position={dropoff}
        />
        <></>
      </GoogleMap>
  ) : <></>
}

export default React.memo(MyGoogleMap)
