import React from 'react';
import './App.css';
import './index.css';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf'
import { Button, Icon } from 'semantic-ui-react'
// import collegeData from './data/colleges-4.json'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';



mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

class App extends React.Component {

  componentDidMount() {

    const map = new mapboxgl.Map({
      container: this.mapWrapper,
      style: 'mapbox://styles/mapbox/streets-v11',  // light/dark function with lines works without this some of the time
      center: [-95.7129, 37.0902],
      zoom: 3
    });

    let startLocation = [];

    // for search bar function and marker
		const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      limit: 10,
			countries: 'us',
      placeholder: 'Enter City Here'
			//mapboxgl: mapboxgl
		});
    map.addControl(geocoder);

    geocoder.on('result', function(e) {
      console.log(e.result.geometry.coordinates);
      startLocation = e.result.geometry.coordinates;
      let el= document.createElement('div');
      el.id = 'marker';
      new mapboxgl.Marker(el)
      .setLngLat(startLocation)
      .addTo(map);
    })
  
    // Create an empty GeoJSON feature collection for drop-off locations
    const dropoffs = turf.featureCollection([]);

    // Create an empty GeoJSON feature collection, which will be used as the data source for the route before users add any new data
    const route = turf.featureCollection([]);

    function newDropoff(coords) {
      // Store the clicked point as a new GeoJSON feature with
      // two properties: `orderTime` and `key`
      const { location, btnClicked } = coords;
      let el = document.createElement('div');
      switch (btnClicked) {
        case 'college':
          el.id = 'college_icon';
          new mapboxgl.Marker(el)
          .setLngLat([location[0], location[1]])
          .addTo(map);
          break;  
        case 'restaurant':
          el.id = 'restaurant_icon';
          new mapboxgl.Marker(el)
          .setLngLat([location[0], location[1]])
          .addTo(map);
          break;  
        case 'hotel':
          el.id = 'hotel_icon';
          new mapboxgl.Marker(el)
          .setLngLat([location[0], location[1]])
          .addTo(map);
          break; 
        default:
          break;
      }
      let pt = turf.point(
        [location[0], location[1]],
        {
          orderTime: Date.now(),
          key: Math.random()
        }
      );
      dropoffs.features.push(pt); 
      console.log(dropoffs.features)
      console.log(coords)

      const overviewText = document.getElementById('overview');

      const setOverview = function (routeGeoJSON) {
        console.log(routeGeoJSON.trips[0].distance);
        const routeDistance = routeGeoJSON.trips[0].distance;
        const routeDuration = routeGeoJSON.trips[0].duration;
        console.log(routeDistance)
        console.log(routeDuration)
        overviewText.innerText = `${(routeDistance / 1609.344 ).toFixed(1)} miles | ${(routeDuration / 60 * .0167).toFixed(0)} hours`;
      };

      fetch(assembleQueryURL()).then((res) => res.json()).then((res) => {
        let routeGeoJSON = turf.featureCollection([turf.feature(res.trips[0].geometry)]);
        // If there is no route provided, reset
        if (!res.trips[0]) {
          routeGeoJSON = route;
        } else {
          // Update the `route` source by getting the route source
          // and setting the data equal to routeGeoJSON
          map.getSource('route').setData(routeGeoJSON);
          setOverview(res);
        }

        if (res.waypoints.length === 12) {
          window.alert('Maximum number of points reached. Read more at docs.mapbox.com/api/navigation/#optimization.');
        }
			
			});
    }

    function updateDropoffs(geojson) {
      map.getSource('dropoffs-symbol')
        .setData(geojson);    
    }

    function assembleQueryURL() {
      const coords = dropoffs.features.map(feature => feature.geometry.coordinates);
      return 'https://api.mapbox.com/optimized-trips/v1/mapbox/driving/' + 
              startLocation.join(',') + ';' + 
              coords.join(';') + 
              '?roundtrip=true&overview=full&steps=true&geometries=geojson&source=first&&access_token=' 
              + mapboxgl.accessToken;
    }

    map.on('load', () => {
            
      map.addLayer({
        id: 'dropoffs-symbol',
        type: 'symbol',
        source: {
          data: dropoffs,
          type: 'geojson'
        },
        layout: {
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
          'icon-image': 'marker-15',
        }
      });

      map.addSource('route', {
        type: 'geojson',
        data: route
      });
      
      map.addLayer({
        id: 'routeline-active',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': 'cornflowerblue',
          'line-width': [
            "interpolate",
            ["linear"],
            ["zoom"],
            16, 6,
            30, 15
          ]
        }
      }, 'waterway-label');

      map.addLayer({
        id: 'routearrows',
        type: 'symbol',
        source: 'route',
        layout: {
          'symbol-placement': 'line',
          'text-field': '▶',
          'text-size': [
            "interpolate",
            ["linear"],
            ["zoom"],
            12, 24,
            22, 60
          ],
          'symbol-spacing': [
            "interpolate",
            ["linear"],
            ["zoom"],
            12, 30,
            22, 160
          ],
          'text-keep-upright': false
        },
        paint: {
          'text-color': '#3887be',
          'text-halo-color': 'hsl(55, 11%, 96%)',
          'text-halo-width': 3
        }
      }, 'waterway-label');

      this.addLocation = (el) => {
        let clickedLocation = {
          location: el.target.value.split(',').map(e => parseFloat(e)),
          btnClicked: el.target.name
        };
        newDropoff(clickedLocation);
        updateDropoffs(dropoffs);
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        <div ref={el => (this.mapWrapper = el)} className="mapWrapper" />
        <div className='info-box'>
          <h1>Trip Optimizer</h1>
          <p>Click to add Locations to visit:</p>
          <Button icon labelPosition='left' value='-87.675171,42.055984' name='college' onClick={(e) => this.addLocation(e, 'value')}>  
            <Icon name='graduation cap' />
            Northwestern University
          </Button>
          <br/>
          <br/>
          <Button icon labelPosition='left' value='-87.681546, 42.046177' name='restaurant' onClick={(e) => this.addLocation(e, 'value')}>
            <Icon name='utensils' />
            Restaurant
          </Button>
          <br/>
          <br/>
          <Button icon labelPosition='left' value='-87.680730, 42.048753' name='hotel' onClick={(e) => this.addLocation(e, 'value')}>
            <Icon name='hotel' />
            Hotel
          </Button>
          <br/>
          <br/>
          <div class="map-overlay">
						<h4 id="overview">Trip Duration:</h4>
          </div>
        </div>
      </React.Fragment>
    );
  }
}


export default App;

