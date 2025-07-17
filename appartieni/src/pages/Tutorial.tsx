// pages/TutorialPage.tsx
import {
  IonPage, IonContent, IonButton, IonIcon, useIonRouter
} from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { chevronForwardOutline } from 'ionicons/icons';

export default function TutorialPage() {
  const router = useIonRouter();

  const finish = () => {
    localStorage.setItem('tutorialSeen', '1');
    router.push('/', 'root', 'replace');
  };

  return (
    <IonPage id="tutorial-page">
      <IonContent fullscreen className="ion-padding">

        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          style={{ height: '100%' }}
        >
          <SwiperSlide>
            <img src="/assets/tutorial/step1.jpg" slot="fixed" style={{ width: '100%' }} />
            <h2 className="ion-text-center ion-padding">Guadagna PuriaPoints</h2>
          </SwiperSlide>

          <SwiperSlide>
            <img src="/assets/tutorial/step2.jpg" style={{ width: '100%' }} />
            <h2 className="ion-text-center ion-padding">Richiedi micro‑servizi</h2>
          </SwiperSlide>

          <SwiperSlide>
            <img src="/assets/tutorial/step3.png" style={{ width: '100%' }} />
            <h2 className="ion-text-center ion-padding">Check‑in con QR o GPS</h2>

            <IonButton expand="block" className="ion-margin-top" onClick={finish}>
              Inizia <IonIcon icon={chevronForwardOutline} slot="end" />
            </IonButton>
          </SwiperSlide>
        </Swiper>

      </IonContent>
    </IonPage>
  );
}

