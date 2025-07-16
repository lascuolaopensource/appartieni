// pages/ServiceBookingPage.tsx
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent,
  IonTextarea, IonButton, IonSpinner, IonToast, useIonRouter
} from '@ionic/react';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { pb } from '../lib/pb';
import { ServiceRecord, Venue } from '../data/types';

interface Params {
  sid: string;
  vid: string;
}

const ServiceBookingPage: React.FC = () => {
  const { sid, vid } = useParams<Params>();
  const router = useIonRouter();

  const [service, setService] = useState<ServiceRecord | null>(null);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [inserting, setInserting] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; text: string }>({ show: false, text: '' });

  /* -------------------------------------------------------- */
  /* 1. Load service + venue once                            */
  /* -------------------------------------------------------- */
  useEffect(() => {
    (async () => {
      try {
        const s = await pb.collection('services').getOne<ServiceRecord>(sid, {
          expand: 'venue'
        });
        setService(s);
        const vExp = s.expand?.venue as Venue | Venue[] | undefined;

        setVenue(
          Array.isArray(vExp) ? vExp[0] ?? null
            : vExp ?? null
        );
      } catch (err) {
        console.error(err);
        setToast({ show: true, text: 'Errore nel caricamento del servizio' });
      } finally {
        setLoading(false);
      }
    })();
  }, [sid]);

  /* -------------------------------------------------------- */
  /* 2. Handle booking (“Prenota”)                            */
  /* -------------------------------------------------------- */
  const handleBooking = async () => {
    if (!pb.authStore.isValid) {
      setToast({ show: true, text: 'Devi essere loggato per prenotare' });
      return;
    }
    setInserting(true);
    try {
      const record = await pb.collection('service_requests')
        .create({
          service_id: sid,
          user_id: pb.authStore.model?.id,
          remote: false,             // adjust if you have a toggle
          status: 'pending',
          message: message.trim()
        });

      // optional: decrement stock client‑side UI while backend hook does it server‑side
      router.push(`/requests/${record.id}`, 'forward', 'push');
    } catch (err) {
      console.error(err);
      setToast({ show: true, text: 'Prenotazione fallita' });
    } finally {
      setInserting(false);
    }
  };

  /* -------------------------------------------------------- */
  /* 3. Render                                                */
  /* -------------------------------------------------------- */
  if (loading) {
    return (
      <IonPage><IonContent className="ion-padding">
        <IonSpinner name="crescent" />
      </IonContent></IonPage>
    );
  }
  if (!service || !venue) return null;

  return (
    <IonPage id="booking-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>{service.name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>{venue.name}</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize('<em>Nessuna descrizione</em>')
              }}
            />
          </IonCardContent>
        </IonCard>

        {/* Textarea for custom note */}
        <IonTextarea
          label="Messaggio per l’esercente"
          placeholder="Scrivi qui la tua richiesta specifica…"
          value={message}
          onIonInput={e => setMessage(e.detail.value!)}
          autoGrow
        />

        <IonButton
          expand="block"
          className="ion-margin-top"
          onClick={handleBooking}
          disabled={inserting}
        >
          {inserting ? <IonSpinner name="dots" /> : 'Prenota'}
        </IonButton>

        <IonToast
          isOpen={toast.show}
          message={toast.text}
          duration={2500}
          onDidDismiss={() => setToast({ show: false, text: '' })}
        />
      </IonContent>
    </IonPage>
  );
};

export default ServiceBookingPage;

