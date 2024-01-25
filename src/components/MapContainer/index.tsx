import { APIProvider, Map } from '@vis.gl/react-google-maps';

import { IQuest } from '@shared/interfaces';
import Markers from '../Markers';

const quests: IQuest[] = [
  {
    id: 'cwZ07CDmyl6Ln1z12J-CP',
    location: {
      lat: 43.64,
      lng: -79.41,
    },
    timeStamp: '',
  },
  {
    id: 'cwZ07CDmyl6Ln6z12J-CD',
    location: {
      lat: 43.74,
      lng: -79.71,
    },
    timeStamp: '',
  },
];
// const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
// const labelIndex = 0;

const MapContainer = () => {
  const initialPosition = { lat: 43.64, lng: -79.41 };
  const initialZoom = 10;

  // const [markers, setMarkers] = useState(points);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <APIProvider apiKey={import.meta.env.VITE_PUBLIC_GOOGLE_MAPS_API_KEY}>
        <Map center={initialPosition} zoom={initialZoom}>
          <Markers points={quests} />
        </Map>
      </APIProvider>
    </div>
  );
};
export default MapContainer;
