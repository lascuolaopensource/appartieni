// src/components/ServiceListItem.tsx
import { IonItem, IonLabel, IonNote, IonBadge } from '@ionic/react';
import { Service } from '../data/types';

interface Props { service: Service }

const ServiceListItem: React.FC<Props> = ({ service }) => (
  <IonItem detail routerLink={`/services/${service.id}/venues`}>
    <IonLabel>
      <h2>{service.name}</h2>
      <p>{service.description?.slice(0, 60)}…</p>
    </IonLabel>
    {/* Punti reward */}
    <IonBadge color="primary" slot="end">
      +{service.points_reward}
    </IonBadge>
    {/* Stock */}
    {service.stock === 0
      ? <IonNote color="danger" slot="end">Sold out</IonNote>
      : <IonNote slot="end">{service.stock} left</IonNote>}
  </IonItem>
);

export default ServiceListItem;

