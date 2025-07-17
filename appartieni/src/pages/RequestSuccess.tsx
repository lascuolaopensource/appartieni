import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonBadge,
  IonList, IonIcon, IonLabel, IonNote, IonSpinner, useIonRouter
} from '@ionic/react';
import { checkmarkCircle } from 'ionicons/icons';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { pb } from '../lib/pb';

interface Req {
  id: string;
  status: string;
  service: string;
  expand?: { service: { name: string }, venue: { name: string } };
}

interface Params { reqId: string }

const statusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'warning';
    case 'accepted': return 'primary';
    case 'done': return 'success';
    case 'rejected': return 'danger';
    default: return 'medium';
  }
};

export default function RequestSuccessPage() {
  const { reqId } = useParams<Params>();
  const router = useIonRouter();

  const [thisReq, setThisReq] = useState<Req | null>(null);
  const [pending, setPending] = useState<Req[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const userId = JSON.parse(atob(pb.authStore.token.split('.')[1])).id;

        const r = await pb.collection('service_requests')
          .getOne<Req>(reqId, { expand: 'service' });
        setThisReq(r);

        const list = await pb.collection('service_requests').getFullList<Req>({
          filter: `user="${userId}"`,
          expand: 'service,user,venue',
          sort: '-created'
        });
        setPending(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [reqId]);

  if (loading) return (
    <IonPage><IonContent className="ion-padding"><IonSpinner /></IonContent></IonPage>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Richiesta inviata</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">

        {/* Success card */}
        {thisReq && (
          <IonCard color="success">
            <IonCardHeader className="ion-text-center">
              <IonIcon name="checkmark-circle" style={{ fontSize: 48, color: '#fff' }} />
              <IonCardTitle>Richiesta salvata!</IonCardTitle>
              <IonCardSubtitle>
                Servizio: {thisReq.expand?.service.name}
              </IonCardSubtitle>
            </IonCardHeader>
          </IonCard>
        )}

        {/* Pending list */}
        <h2 className="ion-padding-start ion-margin-top">Richieste in attesa</h2>

        {pending.length === 0
          ? <p className="ion-padding">Nessuna richiesta pendente.</p>
          : (
            <IonList>
              {pending.map(req => (
                <IonCard key={req.id}>
                  <IonCardHeader>
                    <IonCardTitle>{req.expand?.venue?.name}</IonCardTitle>
                    <IonCardSubtitle>{req.expand?.service?.name}</IonCardSubtitle>
                  </IonCardHeader>

                  <IonCardContent className="ion-text-end">
                    <IonBadge color={statusColor(req.status)}>
                      {req.status.toUpperCase()}
                    </IonBadge>
                  </IonCardContent>
                </IonCard>
              ))}
            </IonList>
          )}
      </IonContent>
    </IonPage>
  );
}

