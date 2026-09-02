import { useState, useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  MdOutlineDarkMode,
  MdOutlineLightMode,
  MdOutlineNotificationsNone,
  MdMenu,
  MdClose,
  MdOutlineGridView,
} from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify"; 
import { logout, openAuthModal } from "../../redux/slices/authSlices/authSlice";
import { ThemeContext } from "../../context/theme/themeContext";
import { DEFAULT_AVATAR } from "../../utils/constants";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const isGuest = !currentUser;
  const user = currentUser;

  const isAdmin = user?.role === "admin";
  const isOrganizer = user?.role === "organizer";

  const { theme, toggleTheme } = useContext(ThemeContext);

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutClick = (e) => {
    if (e) e.stopPropagation();
    setProfileOpen(false);
    setMobileMenuOpen(false);
    setIsLogoutModalOpen(true);
  };

  // Konfirmasi Logout
  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    navigate("/explore", { replace: true });
    dispatch(logout());
    
    toast.success("Anda berhasil keluar!", {
      autoClose: 1000,
    });
  };

  const handleCancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  const handleNavClick = (path, e) => {
    if (isGuest) {
      e.preventDefault();
      setMobileMenuOpen(false);
      dispatch(openAuthModal(path));
    }
  };

  const navLinkStyle = ({ isActive }) =>
    `font-inter font-medium text-sm py-1.5 px-3 rounded-md transition-colors ${
      isActive
        ? "bg-orange-50 text-orange-600 font-semibold"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
    }`;

  const dropdownLinkStyle = ({ isActive }) =>
    `block px-4 py-2.5 font-inter text-sm transition-colors ${
      isActive
        ? "bg-orange-50 text-orange-600 font-semibold"
        : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
    }`;

  const avatarUrl = user?.avatarUrl || DEFAULT_AVATAR;

  const dashboardPath = isAdmin
    ? "/dashboard/overview"
    : isOrganizer
      ? "/organizer"
      : null;

  return (
    <>
      <header className="px-4 sm:px-6 py-3 border-b border-gray-200 bg-[#f3f4f6] dark:bg-gray-900 dark:border-gray-800 dark:text-white relative z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/explore" className="flex items-center space-x-2">
              <span className="w-8 h-8 bg-[#ff5722] rounded-lg flex items-center justify-center font-bold font-jakarta text-white shadow-sm">
                E
              </span>
              <span className="font-bold text-lg font-jakarta text-gray-900 dark:text-white">
                EventHub
              </span>
            </Link>

            <nav className="hidden md:block">
              <ul className="flex gap-1 items-center">
                <li>
                  <NavLink to="/explore" className={navLinkStyle}>
                    Explore
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/events"
                    className={navLinkStyle}
                    onClick={(e) => handleNavClick("/events", e)}
                  >
                    Events
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/communities"
                    className={navLinkStyle}
                    onClick={(e) => handleNavClick("/communities", e)}
                  >
                    Communities
                  </NavLink>
                </li>
                {!isGuest && (
                  <li>
                    <NavLink
                      to="/my-events"
                      className={navLinkStyle}
                      onClick={(e) => handleNavClick("/my-events", e)}
                    >
                      My Events
                    </NavLink>
                  </li>
                )}
              </ul>
            </nav>
          </div>

          <div className="flex gap-2 sm:gap-3 items-center relative">
            <div className="hidden md:flex items-center gap-3">
              {isGuest ? (
                <>
                  <p className="text-gray-500 text-sm font-normal font-inter hidden lg:block">
                    Browsing as guest
                  </p>

                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition cursor-pointer dark:text-gray-300 dark:hover:bg-gray-700"
                    aria-label="Toggle Dark Mode"
                  >
                    {theme === "dark" ? (
                      <MdOutlineLightMode className="w-5 h-5" />
                    ) : (
                      <MdOutlineDarkMode className="w-5 h-5" />
                    )}
                  </button>
                  <Link
                    to="/login"
                    className="bg-[#ff5722] hover:bg-orange-700 transition text-white font-inter font-semibold text-sm px-4 py-2 rounded-lg shadow-sm"
                  >
                    Sign In
                  </Link>
                </>
              ) : (
                <>
                  {dashboardPath && (
                    <NavLink
                      to={dashboardPath}
                      className={({ isActive }) =>
                        `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium font-inter transition ${
                          isActive
                            ? "bg-orange-100 text-[#ff5722] font-semibold dark:bg-orange-950/40"
                            : "text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-800"
                        }`
                      }
                    >
                      <MdOutlineGridView className="w-4 h-4 text-[#ff5722]" />
                      <span>{isAdmin ? "Admin" : "Dashboard"}</span>
                    </NavLink>
                  )}

                  <Link
                    to="/notifications"
                    className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition cursor-pointer dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <MdOutlineNotificationsNone className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-4 h-4 bg-[#ff5722] text-white rounded-full flex items-center justify-center text-[9px] font-bold font-inter leading-none">
                      3
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition cursor-pointer dark:text-gray-300 dark:hover:bg-gray-700"
                    aria-label="Toggle Dark Mode"
                  >
                    {theme === "dark" ? (
                      <MdOutlineLightMode className="w-5 h-5" />
                    ) : (
                      <MdOutlineDarkMode className="w-5 h-5" />
                    )}
                  </button>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setProfileOpen((v) => !v)}
                      className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 cursor-pointer border-2 border-white shadow-sm hover:opacity-90 transition"
                    >
                      <img
                        src={avatarUrl}
                        alt={user?.fullName || "User Avatar"}
                        className="w-full h-full object-cover"
                      />
                    </button>

                    {profileOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden z-50">
                        <div className="px-4 py-3.5 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3 bg-gray-50/50 dark:bg-gray-800/50">
                          <img
                            src={avatarUrl}
                            alt={user?.fullName}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-inter font-bold text-sm text-gray-900 dark:text-white leading-tight truncate">
                              {user.fullName}
                            </p>
                            <p className="font-inter text-xs text-gray-400 truncate mt-0.5">
                              {user.email}
                            </p>
                            <p className="font-inter text-[10px] uppercase tracking-wide text-orange-600 font-semibold mt-0.5">
                              {user.role}
                            </p>
                          </div>
                        </div>

                        <div className="py-1 border-b border-gray-100 dark:border-gray-700">
                          <NavLink
                            to="/profile"
                            onClick={() => setProfileOpen(false)}
                            className={dropdownLinkStyle}
                          >
                            My Profile
                          </NavLink>
                        </div>

                        <div className="py-1">
                          <button
                            type="button"
                            onClick={handleLogoutClick}
                            className="w-full text-left px-4 py-2.5 font-inter text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition cursor-pointer"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition cursor-pointer md:hidden"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? (
                <MdClose className="w-6 h-6" />
              ) : (
                <MdMenu className="w-6 h-6" />
              )}
            </button>

            {mobileMenuOpen && (
              <div className="md:hidden absolute right-0 top-12 w-70 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-50">
                {!isGuest ? (
                  <div className="px-4 py-3.5 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3 bg-gray-50/50 dark:bg-gray-800/50">
                    <img
                      src={avatarUrl}
                      alt={user.fullName}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-inter font-bold text-sm text-gray-900 dark:text-white leading-tight truncate">
                        {user.fullName}
                      </p>
                      <p className="font-inter text-xs text-gray-400 truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                    <p className="font-inter font-semibold text-xs text-gray-500">
                      Browsing as Guest
                    </p>
                  </div>
                )}

                <div className="py-1 border-b border-gray-100 dark:border-gray-700">
                  <NavLink
                    to="/explore"
                    className={dropdownLinkStyle}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Explore
                  </NavLink>
                  <NavLink
                    to="/events"
                    className={dropdownLinkStyle}
                    onClick={(e) => handleNavClick("/events", e)}
                  >
                    Events
                  </NavLink>
                  <NavLink
                    to="/communities"
                    className={dropdownLinkStyle}
                    onClick={(e) => handleNavClick("/communities", e)}
                  >
                    Communities
                  </NavLink>
                  {!isGuest && (
                    <NavLink
                      to="/my-events"
                      className={dropdownLinkStyle}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Events
                    </NavLink>
                  )}
                  {dashboardPath && (
                    <NavLink
                      to={dashboardPath}
                      className={dropdownLinkStyle}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {isAdmin ? "Admin" : "Dashboard"}
                    </NavLink>
                  )}
                </div>

                <div className="py-1">
                  {!isGuest ? (
                    <>
                      <NavLink
                        to="/notifications"
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-4 py-2.5 font-inter text-sm transition-colors ${
                            isActive
                              ? "bg-orange-50 text-orange-600 font-semibold"
                              : "text-gray-700 dark:text-gray-200 hover:bg-gray-50"
                          }`
                        }
                      >
                        <span>Notifications</span>
                        <span className="w-4 h-4 bg-[#ff5722] text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                          3
                        </span>
                      </NavLink>

                      <button
                        type="button"
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-between px-4 py-2.5 font-inter text-sm text-gray-700 hover:bg-gray-50 transition cursor-pointer dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        <span>Dark Mode</span>
                        {theme === "dark" ? (
                          <MdOutlineLightMode className="w-4 h-4 text-gray-500" />
                        ) : (
                          <MdOutlineDarkMode className="w-4 h-4 text-gray-500" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleLogoutClick}
                        className="w-full text-left px-4 py-2.5 font-inter text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-between px-4 py-2.5 font-inter text-sm text-gray-700 hover:bg-gray-50 transition cursor-pointer dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        <span>Dark Mode</span>
                        {theme === "dark" ? (
                          <MdOutlineLightMode className="w-4 h-4 text-gray-500" />
                        ) : (
                          <MdOutlineDarkMode className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block mx-3 my-2 text-center bg-[#ff5722] hover:bg-orange-700 transition text-white font-inter font-semibold text-sm py-2 rounded-xl shadow-sm"
                      >
                        Sign In
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MODAL KONFIRMASI LOGOUT */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-sm shadow-xl border border-gray-100 dark:border-gray-700 font-inter">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Konfirmasi Keluar
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Apakah Anda yakin ingin keluar dari akun Anda?
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 rounded-xl transition cursor-pointer"
                onClick={handleCancelLogout}
              >
                Batal
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-xl transition cursor-pointer shadow-sm"
                onClick={handleConfirmLogout}
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
