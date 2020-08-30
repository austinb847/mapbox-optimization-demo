import * as React from 'react';
import './Map.css';
import {useState, useRef} from 'react';
import MapGL from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css'
import Geocoder from "react-map-gl-geocoder";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import Sidebar from './Sidebar';

function Map() {
  const [viewport, setViewport] = useState({
    latitude: 37.0902,
    longitude: -95.7129,
    zoom: 3
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
      <Sidebar/>
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