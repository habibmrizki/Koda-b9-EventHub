import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateCurrentUser } from "../../redux/slices/authSlices/authSlice";
import {
  updateRegisteredUser,
  changePassword,
} from "../../redux/slices/authSlices/registerSlice";
import { toggleJoinCommunity } from "../../redux/slices/dataSlices/communitiesSlice";
import EventCard from "../../components/events/EventsCard";
import CommunityCard from "../../components/communities/CommunitiesCard";
import { DEFAULT_AVATAR } from "../../utils/constants";
import {
  FaMapMarkerAlt,
  FaRegCalendarAlt,
  FaPen,
  FaTimes,
  FaKey,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

function Profile() {
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth.currentUser);
  const registeredUsers = useSelector((state) => state.users.registeredUsers);
  const {
    items: events = [],
    userRegistrations = {},
    userBookmarks = {},
  } = useSelector((state) => state.events || {});
  const { items: communities = [], userCommunities = {} } = useSelector(
    (state) => state.communities || {},
  );

  const [activeTab, setActiveTab] = useState("Events");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [avatarError, setAvatarError] = useState("");

  // State Modal Change Password
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  // State Toggle Show/Hide Password
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const userEmail = currentUser?.email || "guest";

  const myRegisteredIds = userRegistrations[userEmail] || [];
  const myBookmarkedIds = userBookmarks[userEmail] || [];
  const myCommunityIds = userCommunities[userEmail] || [];

  const registeredEvents = events.filter((e) => myRegisteredIds.includes(e.id));
  const bookmarkedEvents = events.filter((e) => myBookmarkedIds.includes(e.id));
  const joinedCommunities = communities.filter((c) =>
    myCommunityIds.includes(c.id),
  );

  const profileData = currentUser || {
    fullName: "Guest User",
    email: "guest@example.com",
    location: "",
    joinedDate: "August 2026",
    role: "Attendee",
    bio: "",
    avatarUrl: DEFAULT_AVATAR,
  };

  const [formData, setFormData] = useState({ ...profileData });

  // Event listener ESC untuk kedua modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsEditOpen(false);
        setIsPasswordModalOpen(false);
      }
    };

    if (isEditOpen || isPasswordModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEditOpen, isPasswordModalOpen]);

  const handleOpenEdit = () => {
    setAvatarError("");
    setFormData({ ...profileData });
    setIsEditOpen(true);
  };

  const handleOpenPasswordModal = () => {
    setPasswordError("");
    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setIsPasswordModalOpen(true);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarError("");
      if (file.size > 2 * 1024 * 1024) {
        setAvatarError("Ukuran gambar terlalu besar! Maksimal 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          avatarUrl: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

    const updatedPayload = {
      fullName: formData.fullName,
      location: formData.location,
      bio: formData.bio,
      avatarUrl: formData.avatarUrl,
    };

    dispatch(updateCurrentUser(updatedPayload));
    if (currentUser?.email) {
      dispatch(
        updateRegisteredUser({
          email: currentUser.email,
          data: updatedPayload,
        }),
      );
    }

    toast.success("Profil berhasil diperbarui!");
    setIsEditOpen(false);
  };

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError("");

    const foundUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === currentUser?.email?.toLowerCase(),
    );

    if (foundUser && foundUser.password !== passwordData.oldPassword) {
      setPasswordError("Password lama tidak sesuai!");
      return;
    }

    if (passwordData.newPassword === passwordData.oldPassword) {
      setPasswordError("Password baru tidak boleh sama dengan password lama!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password baru minimal 6 karakter!");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Konfirmasi password baru tidak cocok!");
      return;
    }

    dispatch(
      changePassword({
        email: currentUser.email,
        newPassword: passwordData.newPassword,
      }),
    );

    toast.success("Password berhasil diperbarui!", {
      autoClose: 1500,
    });
    setIsPasswordModalOpen(false);
  };

  const handleCommunityToggle = (communityId) => {
    dispatch(toggleJoinCommunity({ communityId, userEmail }));
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <div className="bg-white dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700/80 transition-colors">
        <div className="max-w-6xl mx-auto p-6 pb-0">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex gap-4 items-start">
              <div className="relative shrink-0">
                <img
                  src={profileData.avatarUrl || DEFAULT_AVATAR}
                  alt={profileData.fullName}
                  className="w-16 h-16 rounded-2xl object-cover border border-gray-200 dark:border-gray-700"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-md"></span>
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-bold font-jakarta text-gray-900 dark:text-white leading-tight">
                  {profileData.fullName}
                </h2>
                <p className="text-xs font-inter text-gray-500 dark:text-gray-400">
                  {profileData.email}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs font-inter text-gray-500 dark:text-gray-400 py-1 font-medium">
                  <span className="flex items-center gap-1">
                    <FaMapMarkerAlt className="text-gray-400 dark:text-gray-500" />{" "}
                    {profileData.location || "-"}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaRegCalendarAlt className="text-gray-400 dark:text-gray-500" />{" "}
                    Joined {profileData.joinedDate || "August 2026"}
                  </span>
                  <span className="bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400 border border-orange-200 dark:border-orange-900/50 text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize">
                    {profileData.role || "Attendee"}
                  </span>
                </div>

                <p className="text-xs font-inter text-gray-600 dark:text-gray-300 max-w-lg pt-1 leading-relaxed">
                  {profileData.bio || "No bio added yet."}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleOpenEdit}
                className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xs text-xs font-semibold px-3.5 py-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer font-inter"
              >
                <FaPen className="text-gray-400 dark:text-gray-500 text-[10px]" />
                Edit Profile
              </button>

              <button
                type="button"
                onClick={handleOpenPasswordModal}
                className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xs text-xs font-semibold px-3.5 py-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer font-inter"
              >
                <FaKey className="text-gray-400 dark:text-gray-500 text-[10px]" />
                Change Password
              </button>
            </div>
          </div>

          {/* Dynamic Stats */}
          <div className="grid grid-cols-3 text-center my-6 py-4 border-y border-gray-100 dark:border-gray-700/60 max-w-xl mx-auto font-inter">
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {registeredEvents.length}
              </p>
              <p className="text-xs text-gray-400 font-medium">Events</p>
            </div>
            <div className="border-x border-gray-100 dark:border-gray-700/60">
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {joinedCommunities.length}
              </p>
              <p className="text-xs text-gray-400 font-medium">Communities</p>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {bookmarkedEvents.length}
              </p>
              <p className="text-xs text-gray-400 font-medium">Saved</p>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex gap-6 font-inter">
            {["Events", "Communities", "Saved"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`pb-2.5 text-xs font-semibold transition-colors relative cursor-pointer ${
                  activeTab === tab
                    ? "text-[#ff5722]"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ff5722] rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION BAWAH (Tab Content) */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === "Events" &&
          (registeredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registeredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-gray-400 dark:text-gray-500 font-inter">
              Belum ada event yang kamu ikuti.
            </div>
          ))}

        {activeTab === "Communities" &&
          (joinedCommunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {joinedCommunities.map((community) => (
                <CommunityCard
                  key={community.id}
                  community={community}
                  onToggleJoin={(id) => handleCommunityToggle(id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-gray-400 dark:text-gray-500 font-inter">
              Belum ada komunitas yang kamu ikuti.
            </div>
          ))}

        {activeTab === "Saved" &&
          (bookmarkedEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-gray-400 dark:text-gray-500 font-inter">
              Belum ada event yang kamu simpan (bookmark).
            </div>
          ))}
      </section>

      {/* MODAL EDIT PROFILE */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsEditOpen(false)}
          ></div>

          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-gray-700 z-10 font-inter">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white text-base font-jakarta">
                Edit Profile
              </h3>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition cursor-pointer p-1"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="flex flex-col items-center mb-2">
                <div className="relative group cursor-pointer">
                  <img
                    src={formData.avatarUrl || DEFAULT_AVATAR}
                    alt="Avatar Preview"
                    className="w-20 h-20 rounded-2xl object-cover border border-gray-200 dark:border-gray-700 shadow-xs"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-[11px] font-semibold"
                  >
                    Ubah Foto
                  </label>
                </div>

                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />

                {avatarError ? (
                  <p className="text-[11px] text-red-500 font-medium mt-1.5 animate-pulse">
                    {avatarError}
                  </p>
                ) : (
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5">
                    Klik foto di atas untuk memilih gambar baru (Maks. 2MB)
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#ff5722] transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bandung, Indonesia"
                  value={formData.location || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#ff5722] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Bio
                </label>
                <textarea
                  rows="3"
                  value={formData.bio || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder="Tell the community a little about yourself..."
                  className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#ff5722] transition resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold text-xs rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ff5722] hover:bg-orange-700 text-white font-semibold text-xs rounded-xl shadow-xs transition cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CHANGE PASSWORD */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsPasswordModalOpen(false)}
          ></div>

          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-gray-700 z-10 font-inter">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white text-base font-jakarta">
                Change Password
              </h3>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition cursor-pointer p-1"
              >
                <FaTimes />
              </button>
            </div>

            <form
              onSubmit={handleChangePasswordSubmit}
              className="p-6 space-y-4"
            >
              {passwordError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs rounded-xl border border-red-100 dark:border-red-900/50">
                  {passwordError}
                </div>
              )}

              {/* Old Password Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Old Password
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    value={passwordData.oldPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        oldPassword: e.target.value,
                      })
                    }
                    className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#ff5722] transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                  >
                    {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* New Password Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#ff5722] transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#ff5722] transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold text-xs rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ff5722] hover:bg-orange-700 text-white font-semibold text-xs rounded-xl shadow-xs transition cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
