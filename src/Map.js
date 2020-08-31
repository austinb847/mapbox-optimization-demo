import * as React from 'react';
import './Map.css';
import {useState, useRef} from 'react';
import MapGL, {Marker} from 'react-map-gl';
// import {Feature, Marker} from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'
import Geocoder from "react-map-gl-geocoder";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import Sidebar from './Sidebar';
import * as turf from '@turf/turf'

function Map() {
  const mapRef = useRef();
  const [viewport, setViewport] = useState({
    latitude: 37.0902,
    longitude: -95.7129,
    zoom: 3
  });
  const [startlocation, setStartLocation] = useState();
  const [destinations, setDestinations] = useState(turf.featureCollection([]));
  const [routes, setRoutes] = useState(turf.featureCollection([]));
  const [clickLocation, setClickLocation] = useState();
  
  return (
    <React.Fragment>
      <MapGL
        {...viewport}
        ref={mapRef}
        width="100vw"
        height="100vh"
        mapStyle='mapbox://styles/mapbox/streets-v11'
        onViewportChange={nextViewport => setViewport(nextViewport)}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
      >

        {startlocation &&
          <Marker className='start-location'
            latitude={startlocation[1]} 
            longitude={startlocation[0]}>
          </Marker>
        }
        <Geocoder
          // {...viewport}
          mapRef={mapRef}
          onViewportChange={nextViewport => setViewport(nextViewport)}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
          placeholder="Enter Location Here"
          position="top-right"
          countries='us'
          zoom={6}
          onResult={e => setStartLocation(e.result.geometry.coordinates)}
        />
      </MapGL>
      <Sidebar applyDestinations={setDestinations} handleClick={setClickLocation}/>
    </React.Fragment>
  );
}

export default Map;