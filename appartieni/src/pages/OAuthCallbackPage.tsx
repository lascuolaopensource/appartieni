import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useIonRouter } from '@ionic/react';
import { pb } from '../lib/pb';

export default function OAuthCallback() {
  const loc = useLocation();
  const router = useIonRouter();

  useEffect(() => {
    (async () => {
      const urlParams = new URLSearchParams(loc.search);
      const code = urlParams.get('code');
      const incomingSt = urlParams.get('state');

      const provider = sessionStorage.getItem('pb_oauth_provider')!;
      const verifier = sessionStorage.getItem('pb_oauth_verifier')!;
      const storedSt = sessionStorage.getItem('pb_oauth_state');

      if (!code || incomingSt !== storedSt) {
        console.error('OAuth state mismatch');
        return router.push('/login');
      }

      try {
        await pb.collection('_pb_users_auth_').authWithOAuth2({
          provider,
          code,
          codeVerifier: verifier,
          redirectUrl: `${window.location.origin}/oauth-callback`,
          state: storedSt
        });
        router.push('/', 'root');
      } catch (err) {
        console.error(err);
        router.push('/auth');
      }
    })();
  }, [loc, router]);

  return <p>Completo login…</p>;
}

