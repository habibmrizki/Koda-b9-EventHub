import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // null = guest. isi: { fullName, email, role, location, bio }
  currentUser: null,
  status: "idle",
  error: null,
  isAuthModalOpen: false,
  authModalRedirectPath: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.status = "loading";
      state.error = null;
    },
    loginSuccess(state, action) {
      state.status = "idle";
      state.currentUser = action.payload;
    },
    loginFailed(state, action) {
      state.status = "failed";
      state.error = action.payload;
    },
    logout(state) {
      state.currentUser = null;
      state.status = "idle";
      state.error = null;
      state.isAuthModalOpen = false;
    },
    updateCurrentUser(state, action) {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    openAuthModal(state, action) {
      state.isAuthModalOpen = true;
      state.authModalRedirectPath = action.payload || null;
    },
    closeAuthModal(state) {
      state.isAuthModalOpen = false;
      state.authModalRedirectPath = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailed,
  logout,
  updateCurrentUser,
  openAuthModal,
  closeAuthModal,
} = authSlice.actions;
export default authSlice.reducer;

// LOGIN
export const loginUser = (email, password) => (dispatch, getState) => {
  dispatch(loginStart());

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
  const organizerEmail = import.meta.env.VITE_ORGANIZER_EMAIL;
  const organizerPassword = import.meta.env.VITE_ORGANIZER_PASSWORD;

  if (email === adminEmail && password === adminPassword) {
    dispatch(
      loginSuccess({ fullName: "Admin EventHub", email, role: "admin" }),
    );
    return { success: true };
  }

  if (email === organizerEmail && password === organizerPassword) {
    dispatch(
      loginSuccess({
        fullName: "Organizer EventHub",
        email,
        role: "organizer",
      }),
    );
    return { success: true };
  }

  const { registeredUsers } = getState().users;
  const found = registeredUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase(),
  );

  if (!found) {
    const errorMsg = "Email tidak terdaftar";
    dispatch(loginFailed(errorMsg));
    return { success: false, error: errorMsg };
  }

  if (found.password !== password) {
    const errorMsg = "Password salah";
    dispatch(loginFailed(errorMsg));
    return { success: false, error: errorMsg };
  }

  dispatch(
    loginSuccess({
      fullName: found.fullName,
      email: found.email,
      role: "attendee",
      location: found.location || "",
      bio: found.bio || "",
      joinedDate: found.joinedDate || "March 2026",
      avatarUrl: found.avatarUrl || null,
    }),
  );
  return { success: true };
};
