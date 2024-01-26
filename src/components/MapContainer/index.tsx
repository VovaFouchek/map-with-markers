/* eslint-disable prettier/prettier */
/* eslint-disable no-plusplus */
import { useState } from 'react';

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { nanoid } from 'nanoid';
import { IQuest } from '@shared/interfaces';

const INITIAL_POSITION = { lat: 43.64, lng: -79.41 };
const INITIAL_ZOOM = 8;
const styleContainer = { width: '100%', height: '90vh' };
let labelIndex = 1;

const MapContainer = () => {
  const [markers, setMarkers] = useState<IQuest[]>([]);

  const getNextLabel = () => {
    const label = labelIndex++;
    return label.toString();
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    const newMarker: IQuest = {
      id: nanoid(),
      location: {
        lat: event.latLng!.lat(),
        lng: event.latLng!.lng(),
      },
      label: getNextLabel(),
      timeStamp: new Date().toISOString(),
    };

    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
  };

  const handleMarkerDragEnd = (
    id: string,
    event: google.maps.MapMouseEvent
  ) => {
    const newMarkers = markers.map((marker) =>
      marker.id === id
        ? {
          ...marker,
          location: {
            lat: event.latLng!.lat(),
            lng: event.latLng!.lng(),
          },
        }
        : marker
    );

    setMarkers(newMarkers);
  };

  const handleDeleteMarker = (id: string) => {
    const newMarkers = markers.filter((marker) => marker.id !== id);

    setMarkers(newMarkers);
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_PUBLIC_GOOGLE_MAPS_API_KEY}
    >
      <GoogleMap
        onClick={handleMapClick}
        mapContainerStyle={styleContainer}
        center={INITIAL_POSITION}
        zoom={INITIAL_ZOOM}
      >
        {/* <MarkerClusterer averageCenter enableRetinaIcons gridSize={60}>
          {(clusterer) =>
            markers?.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.location}
                label={marker.label}
                clusterer={clusterer}
                draggable
                onClick={() => handleDeleteMarker(marker.id)}
                onDragEnd={(event) => handleMarkerDragEnd(marker.id, event)}
              />
            ))
          }
        </MarkerClusterer> */}
        {markers?.map((marker, index) => (
          <Marker
            key={marker.id}
            position={marker.location}
            label={(index + 1).toString()}
            // clusterer={clusterer}
            draggable
            onClick={() => handleDeleteMarker(marker.id)}
            onDragEnd={(event) => handleMarkerDragEnd(marker.id, event)}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapContainer;
