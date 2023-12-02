import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapWidget.css";
import haversine from "haversine"; //calculates distance between two points
import bikeIconPath from "../Pictures/bike-icon.png";
/* Adding layers: https://leafletjs.com/examples/layers-control/ */
// want to be able to import layers as a prop
const bikeIcon = L.icon({
  iconUrl: bikeIconPath,
  iconSize: [50,50],
  iconAnchor: [12, 25],
  popupAnchor: [0, 0]
});

const createBiketownLayerGroup = (biketownLayer) => {
  if (!biketownLayer || biketownLayer.length === 0) {
    return null;
  }

  const markers = biketownLayer.map(coordinate => {
    return L.marker([coordinate[0], coordinate[1]], { icon: bikeIcon });
  });

  return L.layerGroup(markers);
};
const createTrimetLayerGroup = (trimetLayer) => {
  if (!trimetLayer || trimetLayer.length === 0) {
    return null;
  }

  const routeLines = trimetLayer.map(segment => {
    const from = [segment.fromLat, segment.fromLon];
    const to = [segment.destLat, segment.destLon];

    const line = L.polyline([from, to], { color: 'blue' }); // You can customize the color
    line.bindPopup(`Mode: ${segment.mode}, Duration: ${segment.duration} mins, Distance: ${segment.distance} km`);
    return line;
  });

  return L.layerGroup(routeLines);
};
const useMapEffect = (map, position, layers) => {
  useEffect(() => {
    if (map && position) {
      map.setView(position, 13);
    }

    if (map) {
      let layerControl;
      if (layers && Object.keys(layers).length > 0) {
        layerControl = L.control.layers(null, layers).addTo(map);
      }

      return () => {
        if (layerControl) {
          layerControl.remove();
        }
      };
    }
  }, [map, position, layers]);
};
const portlandPosition = [45.5051, -122.675]; // Portland Coordinates
const MapWidget = ({
  eventsLayer,
  trimetLayer,
  biketownLayer,
  destination,
  updateDestination,
  updateGeoCoord,
}) => {
  const [position, setPosition] = useState(portlandPosition); // set initial position
  const mapRef = useRef(null);

  useEffect(() => {
    const handleLocationInput = async () => {
      if (destination) {
        const coordinates = await getCoordinatesFromGeocoding(
          destination,
          updateDestination,
          updateGeoCoord
        );
        if (coordinates && isWithinPortland(coordinates)) {
          setPosition(coordinates);
        } else {
          const localizedCoordinates = await getCoordinatesFromGeocoding(
            destination + " Portland OR",
            updateDestination,
            updateGeoCoord
          );
          if (localizedCoordinates && isWithinPortland(localizedCoordinates)) {
            setPosition(localizedCoordinates);
          } else {
            setPosition(portlandPosition);
            updateDestination("Portland OR (City Center)");
            updateGeoCoord(portlandPosition);
          }
        }
      }
    };
    handleLocationInput().then();
  }, [destination, updateDestination, updateGeoCoord]); // useEffect

  const MapComponent = () => {
    const map = useMap();

    /* Functions to convert states to LayerGroup */
    const eventLayerGroup = eventsLayer ? createLayerGroup(eventsLayer): null;

    const trimetLayerGroup = trimetLayer ? createTrimetLayerGroup(trimetLayer) : null;
    const biketownLayerGroup = biketownLayer ? createBiketownLayerGroup(biketownLayer) : null;

       function createLayerGroup(rawLayer) {
      if (!rawLayer || rawLayer.length === 0) {
        return null;
      }
      function createMarker(event) {
        const lat = event[1];
        const lng = event[2];
        const name = event[0];
        // console.log('Mapped event: ', event);
        return L.marker([lat, lng]).bindPopup(name);
      }
      const markers = rawLayer.map((event) => {
        return createMarker(event);
      });

      return L.layerGroup(markers);
    }




    const layerGroups = {};
    if (eventLayerGroup) layerGroups["Events"] = eventLayerGroup;
    if (trimetLayerGroup) layerGroups["Trimet"] = trimetLayerGroup;
    if (biketownLayerGroup) layerGroups["Biketown"] = biketownLayerGroup;


    useMapEffect(map, position, layerGroups);
    return null;
  };

  //webpack icon fix from leaflet.js documentation
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  });

  return (
    <MapContainer
      center={position}
      zoom={13}
      className="map-container"
      whenCreated={(map) => {
        mapRef.current = map;
      }}
    >
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
      {/*Layers are controlled via the MapComponent*/}
      {/*{eventsLayer && <LayerGroup>{eventsLayer}</LayerGroup>}*/}
      {/*{trimetLayer && <LayerGroup>{trimetLayer}</LayerGroup>}*/}
      {/*{biketownLayer && <LayerGroup>{biketownLayer}</LayerGroup>}*/}
    </MapContainer>
  );
};

export default MapWidget;
function removeAddressSuffix(inString) {
  const pattern = /, Portland, Multnomah County, Oregon \d{5}, United States$/;
  return inString.replace(pattern, ", Portland OR");
}
const getCoordinatesFromGeocoding = async (
  locationText,
  updateDestination,
  updateGeoCoord
) => {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  const params = {
    q: locationText,
    format: "json",
    limit: 1,
    namedetails: 1,
  };
  url.search = new URLSearchParams(params).toString();

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.length > 0) {
      const { lat, lon } = data[0];
      updateDestination(removeAddressSuffix(data[0].display_name));
      updateGeoCoord([parseFloat(lat), parseFloat(lon)]);
      return [parseFloat(lat), parseFloat(lon)];
    }
    return null;
  } catch (error) {
    console.error("Error fetching geocoding data: ", error);
    return null;
  }
};

const isWithinPortland = (coordinates) => {
  //check if coordinates are within 20 miles of Portland
  const portlandCoordinates = { latitude: 45.5051, longitude: -122.67 };
  const locationCoordinates = {
    latitude: coordinates[0],
    longitude: coordinates[1],
  };

  const distance = haversine(portlandCoordinates, locationCoordinates, {
    unit: "mile",
  });
  return distance <= 20;
};
