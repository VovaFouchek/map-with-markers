/* eslint-disable no-plusplus */
import { useCallback, useState } from 'react';

import { APIProvider, Map, MapMouseEvent } from '@vis.gl/react-google-maps';
import { nanoid } from 'nanoid';

import { IQuest } from '@shared/interfaces';
import Markers from '../Markers';

const INITIAL_POSITION = { lat: 43.64, lng: -79.41 };
const INITIAL_ZOOM = 10;
const LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let labelIndex = 0;

const MapContainer = () => {
  const [markers, setMarkers] = useState<IQuest[]>([]);

  const onMapClick = useCallback((event: MapMouseEvent) => {
    const location = event.detail.latLng!;

    const marker = {
      id: nanoid(),
      location,
      label: LABELS[labelIndex++ % LABELS.length],
      timeStamp: new Date().toISOString(),
    };

    setMarkers((prevMarkers) => [...prevMarkers, marker]);
  }, []);

  return (
    <div style={{ height: '90vh', width: '100%' }}>
      <APIProvider apiKey={import.meta.env.VITE_PUBLIC_GOOGLE_MAPS_API_KEY}>
        <Map center={INITIAL_POSITION} zoom={INITIAL_ZOOM} onClick={onMapClick}>
          <Markers points={markers} />
        </Map>
      </APIProvider>
    </div>
  );
};
export default MapContainer;
