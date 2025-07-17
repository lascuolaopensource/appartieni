// src/components/ProtectedRoute.tsx
import { Redirect, Route } from 'react-router-dom';
import { pb } from '../lib/pb';

interface ProtectedRouteProps {
  path: string;
  exact?: boolean;
  component: React.ComponentType<any>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {
  const isLoggedIn = pb.authStore.isValid;

  return (
    <Route
      {...rest}
      render={props =>
        isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect to="/auth" />
        )
      }
    />
  );
};

