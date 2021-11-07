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

  const decode = (origin, destination) => {
    const service = new google.maps.DistanceMatrixService();
    const geocoder = new google.maps.Geocoder();
    const bounds = new google.maps.LatLngBounds();
    const request = {
      origins: [origin],
      destinations: [destination],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
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
      
    }).catch(() => {
      console.log("distance calc fail");
    });
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
        // setCenter(center);
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
    geoLocate();
  }, [])

  useEffect(
    () => {
      if(props.origin)
        decode(props.origin, props.destination);
    },
    [props.origin],
  );
  
  const onUnmount = React.useCallback(function callback() {
    setMap(null)
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

export default withFirebase(React.memo(MyGoogleMap))
