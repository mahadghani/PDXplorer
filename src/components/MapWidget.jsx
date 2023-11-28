import React, { useEffect, useRef, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayerGroup, useMap,
} from 'react-leaflet'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapWidget.css';
/* Adding layers: https://leafletjs.com/examples/layers-control/ */
// want to be able to import layers as a prop
const useMapEffect = (map,position) => {
  useEffect(() => {
    if(map && position) {
      map.setView(position, 13);
    }
  },[map,position]);
};

const MapWidget = ({eventsLayer,trimetLayer,biketownLayer, destination}) => {
  const portlandPosition = [45.5051, -122.6750]; // Portland Coordinates
  const [position, setPosition] = useState(portlandPosition); // set initial position
  const mapRef = useRef(null);

  useEffect(() => {
    const handleLocationInput = async () => {
      if(destination){
        const coordinates = await getCoordinatesFromGeocoding(destination);
        if (isWithinPortland(coordinates)){
          setPosition(coordinates);
        }
      }
          };
    handleLocationInput().then( );
  },[destination])

  const MapComponent = () => {
    const map = useMap();
    useMapEffect(map,position);
    return null;
  }

  // useEffect(() => {
  //   const handleLocationInput = async (locationText) => {
  //     const coordinates = await getCoordinatesFromGeocoding(locationText);
  //     if(isWithinPortland(coordinates)){
  //       setPosition(coordinates);
  //       if(mapRef.current){
  //         mapRef.current.setView(coordinates, 13);
  //       }
  //     }else {
  //       setPosition([45.5051,-122.6750]);
  //       if(mapRef.current){
  //         mapRef.current.setView(portlandPosition, 13);
  //       }
  //     }
  //   };
  //   if(destination) {
  //     handleLocationInput(destination).then(() => {});
  //   }
  // },[destination]);
  //webpack icon fix from leaflet.js documentation
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
  });

  return (

      <MapContainer center={position} zoom={13} className='map-container' whenCreated={(map) => {mapRef.current = map;}} >
        <MapComponent />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            <h3>{destination}</h3>
          </Popup>
        </Marker>
        {eventsLayer && <LayerGroup>{eventsLayer}</LayerGroup>}
        {trimetLayer && <LayerGroup>{trimetLayer}</LayerGroup>}
        {biketownLayer && <LayerGroup>{biketownLayer}</LayerGroup>}
      </MapContainer>
  );
};

export default MapWidget;

const getCoordinatesFromGeocoding = async (locationText) => {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  const params = {
    q: locationText,
    format: 'json',
    limit: 1
  };
  url.search = new URLSearchParams(params).toString();

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.length > 0)  {
      const {lat,lon} = data[0];
      return [parseFloat(lat),parseFloat(lon)];
    }
    return null;
  } catch(error) {
    console.error('Error fetching geocoding data: ', error);
    return null;
  }
}

const isWithinPortland = (coordinates) => {
  //check if coordinates are within 20 miles of Portland
  return true;
}