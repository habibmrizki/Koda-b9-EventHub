import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Bookmark,
  Share2,
  MessageSquare,
  Send,
  Check,
} from "lucide-react";
import {
  joinEvent,
  toggleBookmarkEvent,
  addEventDiscussion,
} from "../../redux/slices/dataSlices/dataSlice";
import EventCard from "../../components/events/EventsCard";

const EventDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Ambil data User & Redux State
  const currentUser = useSelector((state) => state.auth?.currentUser);
  const userEmail = currentUser?.email || "guest";

  const {
    events = [],
    userRegistrations = {},
    userBookmarks = {},
  } = useSelector((state) => state.data || {});

  // Cari event spesifik dari Redux state
  const event = events.find((item) => String(item.id) === String(id));

  // State internal untuk Form Komentar & Notifikasi Share
  const [commentText, setCommentText] = useState("");
  const [copied, setCopied] = useState(false);

  const discussions = event?.discussions || [];

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-inter space-y-4">
        <p className="text-gray-500 text-lg font-medium">
          Event tidak ditemukan.
        </p>
        <Link
          to="/events"
          className="px-4 py-2 bg-orange-600 text-white rounded-xl text-sm font-semibold hover:bg-orange-700 transition"
        >
          Kembali ke Daftar Events
        </Link>
      </div>
    );
  }

  // Pengecekan status spesifik pengguna
  const isRegistered = (userRegistrations[userEmail] || []).includes(event.id);
  const isBookmarked = (userBookmarks[userEmail] || []).includes(event.id);

  // Event terkait yang rekomendasi
  const relatedEvents = events
    .filter((item) => String(item.id) !== String(event.id))
    .slice(0, 3);

  // Hitung kapasitas
  const registered = event.tickets?.registered || 0;
  const capacity = event.tickets?.capacity || 1;
  const capacityPercentage = Math.min((registered / capacity) * 100, 100);

  const isFull = Boolean(event.tickets?.is_full || registered >= capacity);

  // Handler Join / Cancel Join
  const handleJoinToggle = () => {
    if (!isRegistered && isFull) return;
    dispatch(joinEvent({ eventId: event.id, userEmail }));
  };

  // Handler Bookmark Toggle
  const handleBookmarkToggle = () => {
    if (isFull) return;
    dispatch(toggleBookmarkEvent({ eventId: event.id, userEmail }));
  };

  // Handler Share
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Handler Submit Komentar
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      // eslint-disable-next-line react-hooks/purity
      id: `d-${Date.now()}`,
      user_id: currentUser?.id || "user-current",
      user_name: currentUser?.name || "Guest User",
      user_avatar: currentUser?.avatar || null,
      message: commentText,
      created_at: "Just now",
    };

    dispatch(addEventDiscussion({ eventId: event.id, discussion: newComment }));
    setCommentText("");
  };

  return (
    <div className="bg-white min-h-screen font-inter text-gray-900 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {/* Navigasi Back */}
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition font-medium"
        >
          <ArrowLeft size={16} /> Back to Events
        </Link>

        {/* Layout Utama */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-8">
            {/* Banner Event */}
            <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-gray-100">
              <img
                src={event.media?.thumbnail_url}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {event.tags?.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-50 text-blue-600 font-medium text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              <span
                className={`px-3 py-1 font-medium text-xs rounded-full ${
                  isFull
                    ? "bg-red-50 text-red-600"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                {isFull ? "Full" : "Available"}
              </span>
            </div>

            {/* Judul Event */}
            <h1 className="font-extrabold text-3xl sm:text-4xl text-gray-900">
              {event.title}
            </h1>

            {/* About Event Section */}
            <div>
              <h2 className="font-bold text-lg mb-3">About this event</h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {event.description || event.overview}
              </p>
            </div>

            {/* Speakers Section */}
            {event.speakers && event.speakers.length > 0 && (
              <div>
                <h2 className="font-bold text-lg mb-4">Speakers</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.speakers.map((speaker, idx) => {
                    const isObject =
                      typeof speaker === "object" && speaker !== null;

                    const name = isObject ? speaker.name : speaker;
                    const role = isObject ? speaker.role : "Guest Speaker";
                    const company = isObject ? speaker.company : "";
                    const avatar =
                      isObject && speaker.avatar_url
                        ? speaker.avatar_url
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            name || "Speaker",
                          )}&background=f97316&color=fff`;

                    return (
                      <div
                        key={isObject ? speaker.id || idx : idx}
                        className="p-4 border border-gray-200 rounded-2xl flex items-center gap-3 bg-white"
                      >
                        <img
                          src={avatar}
                          alt={name}
                          className="w-12 h-12 rounded-full object-cover bg-gray-100"
                        />
                        <div>
                          <h3 className="font-semibold text-sm text-gray-900">
                            {name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {role} {company ? `at ${company}` : ""}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Discussion Section */}
            <div className="space-y-6 pt-4 border-t border-gray-100">
              <h2 className="font-bold text-xl flex items-center gap-2">
                <MessageSquare size={20} className="text-gray-700" />
                Discussion ({discussions.length})
              </h2>

              {/* List Komentar */}
              <div className="space-y-4">
                {discussions.map((disc) => (
                  <div key={disc.id} className="flex gap-3 items-start">
                    {disc.user_avatar ? (
                      <img
                        src={disc.user_avatar}
                        alt={disc.user_name}
                        className="w-10 h-10 rounded-full object-cover bg-gray-100 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 shrink-0">
                        {disc.user_name.charAt(0)}
                      </div>
                    )}

                    <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm text-gray-900">
                          {disc.user_name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {disc.created_at}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{disc.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Form Input Komentar */}
              <form
                onSubmit={handleCommentSubmit}
                className="flex gap-3 items-center pt-2"
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 shrink-0">
                  {currentUser?.name ? currentUser.name.charAt(0) : "G"}
                </div>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full bg-gray-100 border border-transparent rounded-full px-5 py-3 pr-12 text-sm focus:outline-none focus:bg-white focus:border-gray-300 transition"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-600 hover:text-orange-700 p-1.5 cursor-pointer"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* SIDEBAR INFO */}
          <div className="space-y-6">
            <div className="p-6 border border-gray-200 rounded-2xl bg-white shadow-sm space-y-6">
              <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase">
                Event Info
              </h3>

              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-gray-400 shrink-0" />
                  <span>{event.schedule?.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-gray-400 shrink-0" />
                  <span>
                    {event.schedule?.start_time} - {event.schedule?.end_time}{" "}
                    {event.schedule?.timezone}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-gray-400 shrink-0" />
                  <span>{event.location?.city || "Online Event"}</span>
                </div>
              </div>

              {/* Progress Bar Status */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-600 mb-2">
                  <span>{registered} attendees</span>
                  <span>{capacity} capacity</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isFull ? "bg-red-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${capacityPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400">
                  {Math.round(capacityPercentage)}% full -{" "}
                  {Math.max(0, capacity - registered)} spots left
                </p>
              </div>

              {/* Action Button: Join / Registered */}
              {isRegistered ? (
                <button
                  type="button"
                  onClick={handleJoinToggle}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-emerald-500 hover:bg-red-600 text-white transition cursor-pointer group"
                >
                  <span className="group-hover:hidden">✓ Registered</span>
                  <span className="hidden group-hover:inline">Cancel Join</span>
                </button>
              ) : isFull ? (
                <button
                  disabled
                  className="w-full py-3 px-4 bg-gray-200 text-gray-400 rounded-xl font-semibold text-sm cursor-not-allowed"
                >
                  Full
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleJoinToggle}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-orange-600 hover:bg-orange-700 text-white transition cursor-pointer shadow-sm"
                >
                  Join Event
                </button>
              )}

              {/* Action Buttons: Save (Disabled saat Penuh) & Share */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleBookmarkToggle}
                  disabled={isFull}
                  className={`flex-1 py-2.5 border rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 ${
                    isFull
                      ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed"
                      : isBookmarked
                        ? "border-orange-500 bg-orange-50 text-orange-600 cursor-pointer"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer"
                  }`}
                >
                  <Bookmark
                    size={16}
                    className={
                      isFull
                        ? "text-gray-300"
                        : isBookmarked
                          ? "fill-orange-600"
                          : ""
                    }
                  />
                  <span>{isBookmarked ? "Saved" : "Save"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check size={16} className="text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 size={16} />
                      <span>Share</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Organizer Card */}
            {event.organizer && (
              <div className="p-5 border border-gray-200 rounded-2xl bg-white shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase">
                  Organized By
                </h3>
                <div className="flex items-center gap-3">
                  <img
                    src={event.organizer.avatar_url}
                    alt={event.organizer.name}
                    className="w-10 h-10 rounded-full object-cover bg-gray-100"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">
                      {event.organizer.name}
                    </h4>
                    <p className="text-xs text-blue-600 font-medium">
                      {event.organizer.community_name}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* You Might Also Like */}
        <div className="mt-16 border-t border-gray-100 pt-10">
          <h2 className="font-bold text-xl text-gray-900 mb-6">
            You might also like
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedEvents.map((item) => (
              <EventCard key={item.id} event={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
