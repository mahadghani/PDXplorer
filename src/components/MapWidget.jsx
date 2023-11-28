import React from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayerGroup,
} from 'react-leaflet'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapWidget.css';
/* Adding layers: https://leafletjs.com/examples/layers-control/ */
// want to be able to import layers as a prop

const MapWidget = ({eventsLayer,trimetLayer,biketownLayer}) => {
  const position = [45.5051, -122.6750]; // Porland Coordinates

  //webpack icon fix from leaflet.js documentation
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
  });

  return (

      <MapContainer center={position} zoom={13} className='map-container' >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            <h3>This is a sample popup. <br /> Replace this with user Destination.</h3>
          </Popup>
        </Marker>
        {eventsLayer && <LayerGroup>{eventsLayer}</LayerGroup>}
        {trimetLayer && <LayerGroup>{trimetLayer}</LayerGroup>}
        {biketownLayer && <LayerGroup>{biketownLayer}</LayerGroup>}
      </MapContainer>
  );
};

export default MapWidget;
