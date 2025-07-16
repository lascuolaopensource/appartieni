import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface Props {
  coords: [number, number][];   // [[lat, lng], …]
}

const FitBounds: React.FC<Props> = ({ coords }) => {
  const map = useMap();

  useEffect(() => {
    if (coords.length) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, {
        padding: [20, 20], // pixel margin around pins
        maxZoom: 24,
      });
    }
  }, [coords, map]);

  return null;
};

export default FitBounds;

