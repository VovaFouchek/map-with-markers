/* eslint-disable @typescript-eslint/no-floating-promises */
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { nanoid } from 'nanoid';
import { IQuest } from '@shared/interfaces';
import useFirestoreMarkers from '@hooks/useMarkersStore';

const INITIAL_POSITION = { lat: 43.64, lng: -79.41 };
const INITIAL_ZOOM = 8;
const styleContainer = { width: '90vw', height: '100vh', margin: 'auto' };

const MapContainer = () => {
  const {
    markers,
    setMarkers,
    addQuestMarker,
    updateQuestMarker,
    deleteQuestMarker,
  } = useFirestoreMarkers();

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    const newMarker: IQuest = {
      id: nanoid(),
      location: {
        lat: event.latLng!.lat(),
        lng: event.latLng!.lng(),
      },
      label: (markers.length + 1).toString(),
      timeStamp: new Date().toISOString(),
    };
    addQuestMarker(newMarker);
    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
  };

  const handleMarkerDragEnd = (
    id: string,
    event: google.maps.MapMouseEvent
  ) => {
    const updatedMarker = {
      location: {
        lat: event.latLng!.lat(),
        lng: event.latLng!.lng(),
      },
      timeStamp: new Date().toISOString(),
    };

    const newMarkers = markers.map((marker) => {
      if (marker.id === id) {
        return {
          ...marker,
          updatedMarker,
        };
      }
      return marker;
    });
    updateQuestMarker(id, updatedMarker);
    setMarkers(newMarkers);
  };

  const handleDeleteMarker = (id: string) => {
    const newMarkers = markers.filter((marker) => marker.id !== id);
    deleteQuestMarker(id);
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
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.location}
            label={marker.label}
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
