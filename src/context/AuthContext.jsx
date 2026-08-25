import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error("Failed to parse currentUser from localStorage", e);
      }
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalRedirectPath, setAuthModalRedirectPath] = useState(null);

  const openAuthModal = (redirectPath = null) => {
    setAuthModalRedirectPath(redirectPath);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthModalRedirectPath(null);
  };

  const login = (email, password) => {
    const usersStr = localStorage.getItem("registeredUsers") || "[]";
    const users = JSON.parse(usersStr);

    const foundUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );

    if (!foundUser) {
      return { success: false, error: "Email tidak terdaftar" };
    }

    if (foundUser.password !== password) {
      return { success: false, error: "Password salah" };
    }

    const loggedInUser = {
      fullName: foundUser.fullName,
      email: foundUser.email,
      location: foundUser.location || "Bandung, Indonesia",
      bio: foundUser.bio || "Backend engineer & community builder.",
      joinedDate: foundUser.joinedDate || "March 2025",
      role: foundUser.role || "Attendee",
      avatarUrl:
        foundUser.avatarUrl ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    };

    localStorage.setItem("currentUser", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return { success: true };
  };

  const register = (fullName, email, password) => {
    const usersStr = localStorage.getItem("registeredUsers") || "[]";
    const users = JSON.parse(usersStr);

    const emailExists = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );

    if (emailExists) {
      return { success: false, error: "Email sudah digunakan" };
    }

    const newUser = {
      fullName,
      email,
      password,
      location: "Bandung, Indonesia",
      bio: "Tell the community a little about yourself...",
      joinedDate: "March 2025",
      role: "Attendee",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    };

    users.push(newUser);
    localStorage.setItem("registeredUsers", JSON.stringify(users));

    return { success: true };
  };

  // Fungsi memperbarui profil di state & localStorage
  const updateProfile = (updatedData) => {
    const newUserData = { ...user, ...updatedData };
    setUser(newUserData);
    localStorage.setItem("currentUser", JSON.stringify(newUserData));

    // Update data di registeredUsers
    const usersStr = localStorage.getItem("registeredUsers") || "[]";
    const users = JSON.parse(usersStr);
    const updatedUsers = users.map((u) =>
      u.email.toLowerCase() === newUserData.email.toLowerCase()
        ? { ...u, ...updatedData }
        : u,
    );
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest: !user,
        login,
        register,
        updateProfile,
        logout,
        isAuthModalOpen,
        authModalRedirectPath,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
