import {
  IonItem,
  IonLabel,
  IonBadge,
  IonNote,
  IonIcon
} from '@ionic/react';
import { pin } from 'ionicons/icons';
import { Venue } from '../data/types';

interface Props {
  venue: Venue;
  index: number;       // 1‑based ↔ pin label
  distanceKm?: number; // opzionale (es. calcolato lato client)
}

const VenueListItem: React.FC<Props> = ({ venue, index, distanceKm }) => (
  <IonItem routerLink={`/venues/${venue.id}`} detail>
    {/* numero/marker */}
    <IonIcon icon={pin} slot="start" color="primary" />

    <IonLabel>
      <h2>{index}. {venue.name}</h2>
      {venue.address && <p>{venue.address}</p>}
    </IonLabel>

    {/* distanza */}
    {distanceKm !== undefined && (
      <IonNote slot="end">
        {distanceKm.toFixed(1)} km
      </IonNote>
    )}

    {/* puoi aggiungere badge “vendite” o altro */}
    <IonBadge color="tertiary" slot="end">Promo</IonBadge>
  </IonItem>
);

export default VenueListItem;

