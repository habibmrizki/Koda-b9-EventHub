import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  // null = guest. isi: { fullName, email, role, location, bio }
  currentUser: null,
  status: "idle",
  error: null,
  isAuthModalOpen: false,
  authModalRedirectPath: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { getState, rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      let email = "";
      let password = "";

      if (typeof credentials === "object" && credentials !== null) {
        email = credentials.email || "";
        password = credentials.password || "";
      } else {
        email = String(credentials || "");
      }

      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
      const organizerEmail = import.meta.env.VITE_ORGANIZER_EMAIL;
      const organizerPassword = import.meta.env.VITE_ORGANIZER_PASSWORD;

      if (email === adminEmail && password === adminPassword) {
        return { fullName: "Admin EventHub", email, role: "admin" };
      }

      if (email === organizerEmail && password === organizerPassword) {
        return {
          fullName: "Organizer EventHub",
          email,
          role: "organizer",
        };
      }

      const { registeredUsers } = getState().users;
      const found = registeredUsers?.find(
        (u) => u.email.toLowerCase() === email?.toLowerCase(),
      );

      if (!found || found.password !== password) {
        return rejectWithValue("Email atau password salah");
      }

      return {
        fullName: found.fullName,
        email: found.email,
        role: "attendee",
        location: found.location || "",
        bio: found.bio || "",
        joinedDate: found.joinedDate || "March 2026",
        avatarUrl: found.avatarUrl || null,
      };
    } catch {
      return rejectWithValue("Terjadi kesalahan saat login");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
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
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "idle";
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout, updateCurrentUser, openAuthModal, closeAuthModal } =
  authSlice.actions;

export default authSlice.reducer;
