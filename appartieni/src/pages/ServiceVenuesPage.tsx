import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonSpinner
} from '@ionic/react';
import { useEffect, useState, useMemo } from 'react';
import { useParams, useHistory } from 'react-router';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import { pb } from '../lib/pb';
import { ServiceRecord, Venue } from '../data/types';
import "./ServiceVenuesPage.css";
import { useCallback } from 'react';
import FitBounds from '../components/FitBounds';
import { s } from 'vite/dist/node/types.d-aGj9QkWt';


interface Params { serviceId: string }

const ServiceVenuesPage: React.FC = () => {
  const { serviceId } = useParams<Params>();
  const history = useHistory();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  const loadVenues = useCallback(async () => {
    setLoading(true);

    try {
      const s: ServiceRecord = await pb.collection('services').getOne(serviceId, { expand: 'venue' });
      setVenues(s.expand.venue);
      console.log(s.expand?.venue)
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    loadVenues();
  }, [serviceId]);

  // icona numerata (1,2,3…)
  const makeIcon = (n: number) =>
    L.divIcon({
      className: 'venue-pin',
      html: `<div class="pin">${n}</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 24]
    });

  // centro mappa → media delle coordinate
  const center = useMemo(() => {
    if (!venues.length) return [41.1, 16.86];
    const lat = venues.reduce((s, v) => s + (v.geo?.lat ?? 0), 0) / venues.length;
    const lng = venues.reduce((s, v) => s + (v.geo?.lon ?? 0), 0) / venues.length;
    return [lat, lng];
  }, [venues]);

  return (
    <IonPage id="venues-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Scegli il locale</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {/* Mappa compatta: altezza 40% */}
        <div style={{ height: '40vh' }}>
          <MapContainer center={center as L.LatLngTuple} zoom={14} style={{ height: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; Bari Città Aperta" />

            {venues.map((v, idx) => v.geo && (
              <Marker
                key={v.id}
                position={[v.geo.lat, v.geo.lon] as L.LatLngTuple}
                icon={makeIcon(idx + 1)}
                eventHandlers={{
                  click: () => history.push(`/venues/${v.id}/services/${serviceId}`)
                }}
              >
                <Popup>{v.name}</Popup>
              </Marker>
            ))}
            <FitBounds coords={venues.map(v => v.geo)} />
          </MapContainer>

        </div>

        {/* Lista venue */}
        {loading
          ? <IonSpinner className="ion-padding" />
          : (
            <IonList>
              {venues.map((v, idx) => (
                <IonItem key={v.id} routerLink={`/venues/${v.id}/services/${serviceId}`}>
                  <IonLabel>
                    <h2>{idx + 1}. {v.name}</h2>
                    <p>{v.address}</p>
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          )}
      </IonContent>
    </IonPage>
  );
};

export default ServiceVenuesPage;

