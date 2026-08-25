import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // { fullName, email, password, location: "", bio: "" }
  registeredUsers: [],
};

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
  },
});

export const { addRegisteredUser, updateRegisteredUser } = usersSlice.actions;
export default usersSlice.reducer;

// REGISTER
export const registerUser =
  (fullName, email, password) => (dispatch, getState) => {
    const { registeredUsers } = getState().users;
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    const organizerEmail = import.meta.env.VITE_ORGANIZER_EMAIL;

    const emailTaken =
      email === adminEmail ||
      email === organizerEmail ||
      registeredUsers.some(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      );

    if (emailTaken) {
      return { success: false, error: "Email sudah terdaftar" };
    }

    const now = new Date();
    const joinedDate = now.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    // Default location & bio kosong
    dispatch(
      addRegisteredUser({
        fullName,
        email,
        password,
        location: "",
        bio: "",
        joinedDate,
      }),
    );
    return { success: true };
  };
