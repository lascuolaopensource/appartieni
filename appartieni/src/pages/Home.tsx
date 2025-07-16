import { useEffect, useState, useCallback } from 'react';
import {
  IonContent, IonHeader, IonList, IonPage,
  IonRefresher, IonRefresherContent,
  IonTitle, IonToolbar, useIonViewWillEnter
} from '@ionic/react';

import { Service } from '../data/types';
import { pb } from '../lib/pb';
import ServiceListItem from '../components/ServiceListItem'; // cambia nome
import './Home.css';

const Home: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch function riusabile
  const loadServices = useCallback(async () => {
    setLoading(true);
    try {
      const records = await pb.collection('services').getFullList({ sort: '-created' });
      setServices(records as unknown as Service[]);
    } catch (err) {
      console.error('Fetching services failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // on view enter
  useIonViewWillEnter(loadServices);

  // pull‑to‑refresh handler
  const refresh = async (e: CustomEvent) => {
    await loadServices();
    e.detail.complete();
  };

  return (
    <IonPage id="home-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Servizi</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent />
        </IonRefresher>

        {loading && <p className="ion-padding">Caricamento…</p>}

        <IonList>
          {services.map(s => (
            <ServiceListItem key={s.id} service={s} />
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;

