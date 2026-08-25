import { useLocation, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { openAuthModal } from "../../redux/slices/authSlices/authSlice";

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const location = useLocation();

  if (!currentUser) {
    dispatch(openAuthModal(location.pathname));
    return <Navigate to="/explore" replace />;
  }

  return children;
}
