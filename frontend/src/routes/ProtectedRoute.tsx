import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface Props {
  children: React.ReactNode;
  role?: 'CITIZEN' | 'DEPARTMENT' | 'ADMIN';
}

const ProtectedRoute = ({ children, role }: Props) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" />; // Not logged in
  if (role && user.role !== role) return <Navigate to="/" />; // Wrong role

  return <>{children}</>;
};

export default ProtectedRoute;
