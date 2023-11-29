import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapWidget.css";
import haversine from "haversine"; //calculates distance between two points
/* Adding layers: https://leafletjs.com/examples/layers-control/ */
// want to be able to import layers as a prop
const useMapEffect = (map, position, layers) => {
  // layers is an array of
  // LayerGroup objects
  useEffect(() => {
    if (map && position) {
      map.setView(position, 13);
    }
    console.log("layer group: ", layers);
    if (map && layers && layers.Events) {
      const layerControl = L.control.layers(null, layers).addTo(map);
      return () => {
        layerControl.remove();
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
    const eventLayerGroup = createLayerGroup(eventsLayer);

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
    const trimetLayerGroup = () => {
      return null;
    };
    const biketownLayerGroup = () => {
      return null;
    };

    // layer groups
    const layerGroups = {
      Events: eventsLayer ? eventLayerGroup : null,
      // 'Trimet': trimetLayer? trimetLayerGroup:null,
      // 'Biketown': biketownLayer? biketownLayerGroup:null
    };
    console.log("layerGroups in map: ", eventsLayer);

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
