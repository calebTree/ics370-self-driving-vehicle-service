import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import googleMapsApiKey from './index'

const containerStyle = {
  width: '450px',
  height: '350px'
};

const INITIAL_CENTER = {
  lat: -3.745,
  lng: -38.523
};

function MyGoogleMap() {
	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: googleMapsApiKey
	})  
	
	const [center, setCenter] = useState(INITIAL_CENTER);

  const [map, setMap] = useState(null);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
		// get geolocation
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
  }, [])

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
        <></>
      </GoogleMap>
  ) : <></>
}

export default React.memo(MyGoogleMap)