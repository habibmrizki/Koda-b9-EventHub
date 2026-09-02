import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  // { fullName, email, password, location: "", bio: "" }
  registeredUsers: [],
  status: "idle",
  error: null,
};

export const registerUser = createAsyncThunk(
  "register/registerUser",
  async (userData, { getState, dispatch, rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const { fullName, email, password } = userData || {};

      const { registeredUsers } = getState().users;
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      const organizerEmail = import.meta.env.VITE_ORGANIZER_EMAIL;

      const emailTaken =
        email === adminEmail ||
        email === organizerEmail ||
        registeredUsers.some(
          (u) => u.email?.toLowerCase() === email?.toLowerCase(),
        );

      if (emailTaken) {
        return rejectWithValue("Email sudah terdaftar");
      }

      const now = new Date();
      const joinedDate = now.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      const newUser = {
        fullName,
        email,
        password,
        location: "",
        bio: "",
        joinedDate,
      };

      dispatch(addRegisteredUser(newUser));
      return newUser;
    } catch {
      return rejectWithValue("Terjadi kesalahan saat pendaftaran");
    }
  },
);

const usersSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    addRegisteredUser(state, action) {
      state.registeredUsers.push(action.payload);
    },
    updateRegisteredUser(state, action) {
      const { email, data } = action.payload;
      const idx = state.registeredUsers.findIndex(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      );
      if (idx !== -1) {
        state.registeredUsers[idx] = { ...state.registeredUsers[idx], ...data };
      }
    },
    changePassword(state, action) {
      const { email, newPassword } = action.payload;
      const idx = state.registeredUsers.findIndex(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      );
      if (idx !== -1) {
        state.registeredUsers[idx].password = newPassword;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "idle";
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { addRegisteredUser, updateRegisteredUser, changePassword } =
  usersSlice.actions;
export default usersSlice.reducer;
