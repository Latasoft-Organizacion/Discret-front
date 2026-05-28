import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

import { getAdminSession } from '../services/api';

type Props = {
  children: ReactNode;
};

function AdminRoute({ children }: Props) {
  const adminSession = getAdminSession();

  if (!adminSession) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default AdminRoute;
