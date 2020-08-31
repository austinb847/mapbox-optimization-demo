import * as React from 'react';
import './Map.css';
import {useState, useRef} from 'react';
import MapGL, { Layer, Marker} from 'react-map-gl';
// import {Feature, Marker} from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'
import Geocoder from "react-map-gl-geocoder";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import Sidebar from './Sidebar';
import * as turf from '@turf/turf'

function Map() {
  const [viewport, setViewport] = useState({
    latitude: 37.0902,
    longitude: -95.7129,
    zoom: 3
  });
  const mapRef = useRef();
  const [startlocation, setStartLocation] = useState();


  const createStartLocation = () => {
    console.log(startlocation[1])
    console.log(startlocation[0])
  }

  return (
    <MapGL
      {...viewport}
      ref={mapRef}
      width="100vw"
      height="100vh"
      mapStyle='mapbox://styles/mapbox/streets-v11'
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
    >
      <Sidebar/>

      {startlocation &&
        <Marker className='start-location'latitude={startlocation[1]} longitude={startlocation[0]} offsetLeft={-20} offsetTop={-10}>
      </Marker>
      }
      <Geocoder
        {...viewport}
        mapRef={mapRef}
        onViewportChange={nextViewport => setViewport(nextViewport)}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        position="top-right"
        countries='us'
        limit={10}
        onResult={e => setStartLocation(e.result.geometry.coordinates)}
      />
    </MapGL>
  );
}

export default Map;