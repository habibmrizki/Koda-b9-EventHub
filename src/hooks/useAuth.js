import { useSelector, useDispatch } from "react-redux";
import {
  loginUser,
  logout,
  updateCurrentUser,
  openAuthModal,
  closeAuthModal,
} from "../redux/slices/authSlices/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth?.currentUser);
  const status = useSelector((state) => state.auth?.status);
  const error = useSelector((state) => state.auth?.error);
  const isAuthModalOpen = useSelector((state) => state.auth?.isAuthModalOpen);
  const authModalRedirectPath = useSelector(
    (state) => state.auth?.authModalRedirectPath,
  );

  const isGuest = !currentUser;
  const userEmail = currentUser?.email || "guest";

  const handleLogin = (email, password) => {
    const credentials = typeof email === "object" ? email : { email, password };
    return dispatch(loginUser(credentials));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleOpenAuthModal = (redirectPath) => {
    dispatch(openAuthModal(redirectPath));
  };

  const handleCloseAuthModal = () => {
    dispatch(closeAuthModal());
  };

  const handleUpdateProfile = (payload) => {
    dispatch(updateCurrentUser(payload));
  };

  return {
    currentUser,
    user: currentUser,
    isGuest,
    userEmail,
    status,
    error,
    isAuthModalOpen,
    authModalRedirectPath,
    login: handleLogin,
    logout: handleLogout,
    openAuthModal: handleOpenAuthModal,
    closeAuthModal: handleCloseAuthModal,
    updateProfile: handleUpdateProfile,
  };
};

export default useAuth;
