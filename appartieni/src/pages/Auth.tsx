// pages/AuthPage.tsx
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonInput, IonItem, IonLabel, IonButton, IonList,
  IonToast, IonSpinner, useIonRouter
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { pb } from '../lib/pb';
import { AuthProviderInfo } from 'pocketbase';


export default function Auth() {
  const router = useIonRouter();

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; text: string }>({ show: false, text: '' });

  const [providers, setProviders] = useState<AuthProviderInfo[]>([]);
  const [loadingProv, setLoadingProv] = useState(true);

  /* ------------------------------------------
   * 1. Load OAuth buttons once
   * ---------------------------------------- */
  useEffect(() => {
    pb.collection('_pb_users_auth_').listAuthMethods()
      .then(res => {
        setProviders(res.oauth2.providers);
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingProv(false));
  }, []);

  /* ------------------------------------------
   * 2. Unified email/pwd:  try login -> else register
   * ---------------------------------------- */
  const handleEmail = async () => {
    setBusy(true);
    try {
      // try sign‑in
      await pb.collection('_pb_users_auth_')
        .authWithPassword(email.trim(), pwd);
      return finish();
    } catch (err: any) {
      // invalid credentials? try to create
      if (err.status === 400) {
        try {
          await pb.collection('_pb_users_auth_')
            .create({ email: email.trim(), password: pwd, passwordConfirm: pwd });
          // immediate login (PB auto‑verifies if requireEmail=false)
          await pb.collection('_pb_users_auth_')
            .authWithPassword(email.trim(), pwd);
          return finish(true);
        } catch (e) {
          console.error(e);
          setToast({ show: true, text: 'Registrazione non riuscita' });
        }
      } else {
        setToast({ show: true, text: 'Credenziali errate' });
      }
    } finally {
      setBusy(false);
    }
  };

  const finish = (isNew = false) => {
    setToast({ show: true, text: isNew ? 'Benvenuto!' : 'Bentornato!' });
    router.push('/', 'root');       // never /undefined
  };

  /* ------------------------------------------
   * 3. Social click
   * ---------------------------------------- */
  const startOAuth = (p: AuthProviderInfo) => {
    sessionStorage.setItem('pb_oauth_provider', p.name);
    sessionStorage.setItem('pb_oauth_state', p.state);
    sessionStorage.setItem('pb_oauth_verifier', p.codeVerifier);
    window.location.href = p.authURL;
  };

  return (
    <IonPage>
      <IonHeader><IonToolbar><IonTitle>Accedi / Registrati</IonTitle></IonToolbar></IonHeader>

      <IonContent fullscreen className="ion-padding">

        {/* email + password */}
        <IonItem>
          <IonLabel position="stacked">Email</IonLabel>
          <IonInput type="email" value={email} onIonInput={e => setEmail(e.detail.value!)} />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Password</IonLabel>
          <IonInput type="password" value={pwd} onIonInput={e => setPwd(e.detail.value!)} />
        </IonItem>
        <IonButton expand="block" onClick={handleEmail} disabled={busy || !email || !pwd}>
          {busy ? <IonSpinner name="dots" /> : 'Entra / Regìstrati'}
        </IonButton>

        <div className="ion-text-center ion-margin-vertical">oppure</div>

        {/* OAuth buttons */}
        {loadingProv
          ? <IonSpinner />
          : (
            <IonList lines="none">
              {providers.map(p => (
                <IonButton key={p.name} expand="block" fill="outline" onClick={() => startOAuth(p)}>
                  Accedi con {p.displayName}
                </IonButton>
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

