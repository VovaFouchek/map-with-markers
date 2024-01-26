import { useEffect, useRef, useState } from 'react';

import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { Marker, useMap } from '@vis.gl/react-google-maps';
import type { Marker as TClustererMarker } from '@googlemaps/markerclusterer';

import { IQuest } from '@shared/interfaces';

interface MarkersProps {
  points: IQuest[];
}

const Markers: React.FC<MarkersProps> = ({ points }) => {
  const map = useMap();
  const [markers, setMarkers] = useState<Record<string, TClustererMarker>>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker: TClustererMarker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      }

      const newMarkers = { ...prev };
      delete newMarkers[key];
      return newMarkers;
    });
  };

  return (
    <>
      {points.map((point) => (
        <Marker
          position={point.location}
          key={point.id}
          ref={(marker) => setMarkerRef(marker, point.id)}
        />
      ))}
    </>
  );
};

export default Markers;
