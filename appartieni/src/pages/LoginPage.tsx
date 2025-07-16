import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonInput, IonItem, IonLabel, IonButton, IonList, IonSpinner,
  IonToast, IonIcon
} from '@ionic/react';
import { logoGoogle } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useIonRouter } from '@ionic/react';
import { pb } from '../lib/pb';

interface OAuth2Provider {
  name: string;
  displayName: string;
  authUrl: string;          // alias authURL
  codeVerifier: string;
  state: string;
}

interface AuthMethods {
  password: { enabled: boolean };
  oauth2: { enabled: boolean; providers: OAuth2Provider[] };
}


export default function LoginPage() {
  const router = useIonRouter();
  const [methods, setMethods] = useState<AuthMethods | null>(null);
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; text: string }>({ show: false, text: '' });

  /* 1. Load available auth providers once */
  useEffect(() => {
    pb.collection('users')     // o 'users'
      .listAuthMethods()
      .then(res => setMethods(res as AuthMethods))
      .catch(err => console.error(err));
  }, []);


  /* 2. Classic login */
  const handleEmailLogin = async () => {
    setBusy(true);
    try {
      await pb.collection('users').authWithPassword(email.trim(), pwd);
      router.push('/', 'root');
    } catch (err) {
      setToast({ show: true, text: 'Credenziali errate' });
    } finally {
      setBusy(false);
    }
  };


  const handleOAuth = (prov: OAuth2Provider) => {
    sessionStorage.setItem('pb_oauth_state', prov.state);
    sessionStorage.setItem('pb_oauth_verifier', prov.codeVerifier);
    sessionStorage.setItem('pb_oauth_provider', prov.name);
    window.location.href = prov.authUrl;        // redirect
  };


  if (!methods) {
    return (<IonPage><IonContent className="ion-padding"><IonSpinner /></IonContent></IonPage>);
  }

  return (
    <IonPage id="login-page">
      <IonHeader>
        <IonToolbar><IonTitle>Login</IonTitle></IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">

        {/* -------- Email / Password -------- */}
        {methods.emailPassword && (
          <>
            <IonItem>
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput type="email" value={email} onIonInput={e => setEmail(e.detail.value!)} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Password</IonLabel>
              <IonInput type="password" value={pwd} onIonInput={e => setPwd(e.detail.value!)} />
            </IonItem>
            <IonButton expand="block" onClick={handleEmailLogin} disabled={busy}>
              {busy ? <IonSpinner name="dots" /> : 'Entra'}
            </IonButton>
            <div className="ion-text-center ion-padding-vertical">oppure</div>
          </>
        )}

        {/* -------- Dynamic OAuth buttons -------- */}
        <IonList lines="none">
          {methods?.oauth2.enabled && methods?.oauth2?.providers.map(p => (
            <IonButton
              key={p.name}
              expand="block"
              fill="outline"
              onClick={() => handleOAuth(p.name)}
            >
              <IonIcon slot="start" icon={
                p.name === 'google' ? logoGoogle :
                  p.name === 'github' ? logoGithub : undefined
              } />
              Accedi con {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
            </IonButton>
          ))}
        </IonList>

        <IonToast
          isOpen={toast.show}
          message={toast.text}
          duration={2500}
          onDidDismiss={() => setToast({ show: false, text: '' })}
        />
      </IonContent>
    </IonPage>
  );
}

