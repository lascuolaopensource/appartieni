import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import { ProtectedRoute } from './components/ProtectedRoute';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import 'leaflet/dist/leaflet.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import ServiceVenuesPage from './pages/ServiceVenuesPage';
import ServiceBookingPage from './pages/ServiceBookingPage';
import OAuthCallback from './pages/OAuthCallbackPage';
import Auth from './pages/Auth';
import Checkin from './pages/CheckinPage';
import TutorialPage from './pages/Tutorial';
import RequestSuccessPage from './pages/RequestSuccess'


setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/auth" component={Auth} />
        <Route exact path="/oauth-callback" component={OAuthCallback} />
        <Route path="/tutorial" component={TutorialPage} />
        <Route path="/" exact={true}>
          <Redirect to="/home" />
        </Route>
        <Route path="/home" exact={true}>
          <Home />
        </Route>

        <ProtectedRoute
          exact
          path="/services/:serviceId/venues"
          component={ServiceVenuesPage}
        />
        <ProtectedRoute
          exact
          path="/venues/:vid/services/:sid"
          component={ServiceBookingPage}
        />
        <ProtectedRoute exact path="/checkin" component={Checkin} />
        <ProtectedRoute exact path="/request-success/:reqId" component={RequestSuccessPage} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
