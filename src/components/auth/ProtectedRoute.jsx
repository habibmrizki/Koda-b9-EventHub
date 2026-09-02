import { useEffect, useRef } from "react";
import { useLocation, Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { currentUser, openAuthModal } = useAuth();
  const location = useLocation();

  const wasLoggedIn = useRef(Boolean(currentUser));

  useEffect(() => {
    if (!currentUser && !wasLoggedIn.current) {
      openAuthModal(location.pathname);
    }
  }, [currentUser, location.pathname, openAuthModal]);

  if (!currentUser) {
    return <Navigate to="/explore" replace />;
  }

  return children;
}
