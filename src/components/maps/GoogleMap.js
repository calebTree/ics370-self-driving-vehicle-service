import React, { useState, useEffect } from 'react';

// firebase
import { withFirebase } from "../firebase";

// google maps
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import googleMapsApiKey from './';

const containerStyle = {
  width: '450px',
  height: '350px'
};

// MN
const INITIAL_CENTER = {
  lat: 44.986656,
  lng: -93.258133
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

  const setMarkers = (origin, destination) => {
    try {
      const geocoder = new google.maps.Geocoder();
      const bounds = new google.maps.LatLngBounds();
  
      const showGeocodedAddressOnMap = (asDestination) => {
        const handler = ({ results }) => {
          map.fitBounds(bounds.extend(results[0].geometry.location));
          if(asDestination)
            setMarkerA(
              <Marker
                position={results[0].geometry.location}
                label={asDestination ? "D" : "O"}
              />
            );
          else
            setMarkerB(
              <Marker
                position={results[0].geometry.location}
                label={asDestination ? "D" : "O"}
              />
            );
        };
        return handler;
      };
      geocoder
        .geocode({ address: origin })
        .then(showGeocodedAddressOnMap(false));  
      geocoder
        .geocode({ address: destination })
        .then(showGeocodedAddressOnMap(true));
    } catch(err) {
      console.error(err.message);
    }
  }

  // HTML5 geolocate
  const geoLocate = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
      function(position) {
        const center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        // to-do: fix async set center if there are already markers
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
    // geoLocate();
  }, [])

  useEffect(
    () => {
      if(props.markers && isLoaded && map) {
        setMarkers(props.markers.origin, props.markers.destination);
      } else {
        setCenter(INITIAL_CENTER);
        setMarkerA(null);
        setMarkerB(null);
        // geoLocate();
      }
    },
    [props.markers, isLoaded, map],
  );
  
  const onUnmount = React.useCallback(function callback() {
    setMap(null);
  }, [])

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={5}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {markerA}
        {markerB}
        <></>
      </GoogleMap>
  ) : <></>
}

export default withFirebase(React.memo(MyGoogleMap));
