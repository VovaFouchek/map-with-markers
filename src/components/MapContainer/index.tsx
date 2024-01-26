/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable prettier/prettier */
/* eslint-disable no-plusplus */

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { nanoid } from 'nanoid';
import { IQuest } from '@shared/interfaces';
import useFirestoreMarkers from '../../hook/useMarkersStore';

const INITIAL_POSITION = { lat: 43.64, lng: -79.41 };
const INITIAL_ZOOM = 8;
const styleContainer = { width: '90vw', height: '90vh', margin: 'auto' };
let labelIndex = 1;

const MapContainer = () => {
  const { markers, setMarkers, addQuestMarker, updateQuestMarker, deleteQuestMarker } = useFirestoreMarkers();

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

    // addQuestMarker(newMarker)
    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
  };

  const handleMarkerDragEnd = (
    id: string,
    event: google.maps.MapMouseEvent
  ) => {
    const updatedData = {
      location: {
        lat: event.latLng!.lat(),
        lng: event.latLng!.lng(),
      },
      timeStamp: new Date().toISOString(),
    }

    const newMarkers = markers.map((marker) =>
      marker.id === id
        ? {
          ...marker,
          updatedData
        }
        : marker
    );

    updateQuestMarker(id, updatedData);
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

        {markers?.map((marker, index) => (
          <Marker
            key={marker.id}
            position={marker.location}
            label={(index + 1).toString()}
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
