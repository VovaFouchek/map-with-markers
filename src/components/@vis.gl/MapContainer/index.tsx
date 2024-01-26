/* eslint-disable no-plusplus */
import { useCallback, useState } from 'react';

import { APIProvider, Map, MapMouseEvent } from '@vis.gl/react-google-maps';
import { nanoid } from 'nanoid';

import { IQuest } from '@shared/interfaces';
import Markers from '../Markers';

const quests: IQuest[] = [
  {
    id: 'cwZ07CDmyl6Ln1z12J-CP',
    location: {
      lat: 43.64,
      lng: -79.41,
    },
    timeStamp: '2024-01-26T08:49:30.263Z',
    label: 'D',
  },
  {
    id: 'cwZ07CDmyl6Ln6z12J-CD',
    location: {
      lat: 43.74,
      lng: -79.71,
    },
    timeStamp: '2024-01-26T08:49:50.263Z',
    label: 'E',
  },

  {
    id: 'cwZ06CDmyl6Ln6z12J-CD',
    location: {
      lat: 45.74,
      lng: -79.71,
    },
    timeStamp: '2024-01-26T08:45:50.263Z',
    label: 'F',
  },
];

const INITIAL_POSITION = { lat: 43.64, lng: -79.41 };
const INITIAL_ZOOM = 10;
const LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let labelIndex = 0;

const MapContainer = () => {
  const [markers, setMarkers] = useState<IQuest[]>(quests);

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
