import * as React from 'react';
import {useState, useRef} from 'react';
import MapGL from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css'
import Geocoder from "react-map-gl-geocoder";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

function Map() {
  const [viewport, setViewport] = useState({
    latitude: 37.8,
    longitude: -122.4,
    zoom: 14,
    bearing: 0,
    pitch: 0
  });
  const mapRef = useRef();

  return (
    <MapGL
      {...viewport}
      ref={mapRef}
      width="100vw"
      height="100vh"
      mapStyle="mapbox://styles/mapbox/dark-v9"
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
    >
      <Geocoder
        {...viewport}
        mapRef={mapRef}
        onViewportChange={nextViewport => setViewport(nextViewport)}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        position="top-right"
        countries='us'
      />
    </MapGL>
  );
}

export default Map;