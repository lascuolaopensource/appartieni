import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonList, IonItem, IonLabel,
  IonNote, IonButton, IonSpinner, IonToast
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { pb } from '../lib/pb';
import { Venue } from '../data/types';
import { haversine } from '../lib/haversine';   // già creato prima
import { getCurrentLocation } from '../lib/getLocation';

const MAX_RADIUS_KM = 0.5;   // 500 m

export default function CheckinPage() {
  const [userPos, setUserPos] = useState<[number, number]>();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ show: boolean; text: string }>({ show: false, text: '' });

  /* 1. prendi GPS + venue */

  useEffect(() => {
    const run = async () => {
      const pos = await getCurrentLocation();
      const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
      setUserPos(coords);

      // prendi venue (potresti filtrare per città se grande)
      const list = await pb.collection('venues').getFullList<Venue>();
      setVenues(list);
      setLoading(false);
    }
    run();
  }, []);

  const handleCheckin = async (v: Venue) => {
    try {
      await pb.collection('checkins').create({
        venue_id: v.id,
        geo: { lat: userPos![0], lon: userPos![1] }
      });
      setToast({ show: true, text: `Check‑in registrato (+Puria Points!)` });
    } catch (e) {
      console.error(e);
      setToast({ show: true, text: 'Errore check‑in' });
    }
  };

  if (loading) return (
    <IonPage><IonContent className="ion-padding"><IonSpinner /></IonContent></IonPage>
  );

  if (!userPos) return (
    <IonPage><IonContent className="ion-padding">GPS necessario per il check‑in.</IonContent></IonPage>
  );

  /* 2. calcola distanze e filtra entro raggio */
  const near = venues
    .map(v => ({
      venue: v,
      km: haversine(userPos, v.geo!)
    }))
    .filter(x => x.km <= MAX_RADIUS_KM)
    .sort((a, b) => a.km - b.km);

  return (
    <IonPage>
      <IonHeader><IonToolbar><IonTitle>Check‑in</IonTitle></IonToolbar></IonHeader>

      <IonContent fullscreen>
        {near.length === 0
          ? <p className="ion-padding">Nessun locale nel raggio di {MAX_RADIUS_KM * 1000} m.</p>
          : (
            <IonList>
              {near.map(({ venue, km }) => (
                <IonItem key={venue.id}>
                  <IonLabel>
                    <h2>{venue.name}</h2>
                    <p>{venue.address}</p>
                  </IonLabel>
                  <IonNote slot="end">{(km * 1000).toFixed(0)} m</IonNote>
                  <IonButton
                    slot="end"
                    onClick={() => handleCheckin(venue)}
                  >
                    Check‑in
                  </IonButton>
                </IonItem>
              ))}
            </IonList>
          )}

        <IonToast
          isOpen={toast.show}
          message={toast.text}
          duration={2000}
          onDidDismiss={() => setToast({ show: false, text: '' })}
        />
      </IonContent>
    </IonPage>
  );
}

