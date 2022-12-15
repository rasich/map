import React, { useState } from 'react';
import { 
  GoogleMap, 
  useLoadScript,
  MarkerClusterer,
  Marker,
  InfoWindow,
  GroundOverlay,
} from '@react-google-maps/api';

import './App.css';

const Carousel = require('nuka-carousel');

function App() {
  const mapRef = React.useRef();
  const onMapLoad = (map) => {
    mapRef.current = map;
    fitBounds(map);
  }

  const [mapKey] = useState(process.env.REACT_APP_GOOGLE_API_KEY)
  // eslint-disable-next-line no-unused-vars
  const [mapCenter, setMapCenter] = useState({ lat: +process.env.REACT_APP_GMAP_DEFAULT_LAT, lng: +process.env.REACT_APP_GMAP_DEFAULT_LNG })
  // eslint-disable-next-line no-unused-vars
  const [mapType, setMapType] = useState('roadmap')
  // eslint-disable-next-line no-unused-vars
  const [mapMarkers, setMapMarkers] = useState([
    {
      'id': 1,
      'title': 'Кафе «Бауэр»',
      'latitude': 54.71271641821974,
      'longitude': 20.51103866041636,
      'imgs': [1,2],
    },
    {
      'id': 2,
      "title": 'Кафе-Альгамбра',
      'latitude': 54.71191518014186,
      'longitude': 20.506736528176404,
      'imgs': [1,2,3,4],
    },
    {
      'id': 3,
      "title": 'Ресторан «Блутгерихт»',
      'latitude': 54.71054628804002,
      'longitude': 20.509596986047494,
      'imgs': [1,2],
    },
    {
      'id': 4,
      "title": 'Кафе-терраса « Швермер»',
      'latitude': 54.714550023996075,
      'longitude': 20.515178198583047,
      'imgs': [1,2],
    },
    {
      'id': 5,
      'title': 'Ресторан «Бельвю»',
      'latitude': 54.71329797948661,
      'longitude': 20.517352983363896,
      'imgs': [1,2],
    },
    {
      'id': 6,
      'title': 'Ресторан «Виктория»',
      'latitude': 54.71631425778544,
      'longitude': 20.523354419579764,
      'imgs': [1,2],
    },
  ])

  // eslint-disable-next-line no-unused-vars
  const [infoBlock, setInfoBlock] = useState(false)

  const {isLoaded, loadError} = useLoadScript({
    googleMapsApiKey: mapKey,
  })

  const fitBounds = map => {
    const bounds = new window.google.maps.LatLngBounds();
    mapMarkers.map(marker => {
      bounds.extend({ lat: marker.latitude, lng: marker.longitude });
      return marker;
    });
    map.fitBounds(bounds);
  };


  if (loadError) return <div>Error</div>
  if (!isLoaded) return <section className="map">Loading...</section>

  return(<>
    <section className="map">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        zoom={12}
        center={mapCenter}
        options={{
          disableDefaultUI: true,
          zoomControl: false,
          streetViewControl: false,
          mapTypeId: mapType
        }}
        onLoad={onMapLoad}
        mapTypeControlOptions={{
          mapTypeId: ['satellite']
        }}
        defaultMapTypeId={false}
      >
        <GroundOverlay
          url="./img/map/map.jpg"
          // opacity={0.35}
          opacity={0.45}
          bounds={{
            // север
            north: 54.71725,
            // юг
            south: 54.7037,
            // запад
            west: 20.4934,
            // восток
            east: 20.52835,
          }}
          defaultOpacity={.5}
        />

        <MarkerClusterer 
          options={{
            imagePath: '/img/map/cluster',
            imageSizes: [58],
            clusterClass: 'map-cluster',
            textColor: 'red'
          }}
          averageCenter={true}
          gridSize={40}
          maxZoom={18}
        >
          {(clusterer) => 
            mapMarkers.map((marker, i) => (
              <Marker 
                key={i} 
                position={{ lat: marker.latitude, lng: marker.longitude }} 
                fixedRotation={true}
                icon={{ 
                  url: './img/map/cup.svg',
                  scaledSize: { width: 60, height: 60},
                  // anchor: { x: 15, y: 15 },
                  fillColor: 'black',
                  fillOpacity: 1,
                  zIndex: 200
                }}
                clusterer={clusterer} 
                onClick={() => {
                  if (infoBlock === marker.id)
                    setInfoBlock(null)
                  else 
                    setInfoBlock(marker.id)
                }}
              >
                {(infoBlock === marker.id) && (

                <InfoWindow 
                  position={{ lat: marker.latitude, lng: marker.longitude }} 
                  options={{
                    disableAutoPan: true,
                    pane: "floatPane"
                  }}
                  onLoad={function() {}}
                  onCloseClick={() => setInfoBlock(null)}
                >
                  <div 
                    className='map-cluster__title'
                  >
                    <h5>{marker.title}</h5>
                    <div className="container">
                      <Carousel>
                        {marker.imgs.map(img => (
                          <img src={`./img/slider/${marker.id}/${img}.jpg`} alt='img'/>
                        ))}
                      </Carousel>
                    </div>
                  </div>
                </InfoWindow>
                )}

              </Marker>
            ))
          }
        </MarkerClusterer>
      </GoogleMap>
    </section>
  </>)
}

export default App;
