import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaRegCalendar,
  FaMapMarkerAlt,
  FaUsers,
  FaRegBookmark,
  FaBookmark,
} from "react-icons/fa";
import {
  joinEvent,
  toggleBookmarkEvent,
} from "../../redux/slices/dataSlices/dataSlice";
import { useAuth } from "../../context/AuthContext";

const EventCard = memo(function EventCard({ event }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openAuthModal } = useAuth();

  const currentUser = useSelector((state) => state.auth?.currentUser);
  const isGuest = !currentUser;
  const userEmail = currentUser?.email || "guest";

  const { userRegistrations = {}, userBookmarks = {} } = useSelector(
    (state) => state.data || {},
  );

  const isRegistered = (userRegistrations[userEmail] || []).includes(event?.id);
  const isBookmarked = (userBookmarks[userEmail] || []).includes(event?.id);

  const registered = event?.tickets?.registered || 0;
  const capacity = event?.tickets?.capacity || 1;
  const capacityPercentage = Math.min((registered / capacity) * 100, 100);

  const getProgressBarColor = () => {
    if (event?.tickets?.is_full || capacityPercentage >= 100)
      return "bg-red-500";
    if (capacityPercentage > 75) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const handleCardClick = (e) => {
    e.preventDefault();
    if (isGuest) {
      openAuthModal(`/events/${event.id}`);
    } else {
      navigate(`/events/${event.id}`);
    }
  };

  const handleJoin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isGuest) {
      openAuthModal(`/events/${event.id}`);
      return;
    }
    if (!event?.id) return;
    dispatch(joinEvent({ eventId: event.id, userEmail }));
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isGuest) {
      openAuthModal(`/events/${event.id}`);
      return;
    }
    if (!event?.id) return;
    dispatch(toggleBookmarkEvent({ eventId: event.id, userEmail }));
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-200">
      <div>
        {/* Gunakan handleCardClick di sini */}
        <div
          onClick={handleCardClick}
          className="block relative group cursor-pointer"
        >
          <div className="h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
            <img
              src={event.media?.thumbnail_url}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
              {event.tags && event.tags.length > 0 ? (
                event.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md text-gray-800 dark:text-gray-200 font-semibold text-[11px] rounded-full shadow-sm"
                  >
                    {tag}
                  </span>
                ))
              ) : event.location?.type === "online" ? (
                <span className="px-2.5 py-1 bg-blue-600 text-white font-semibold text-[11px] rounded-full shadow-sm">
                  Online
                </span>
              ) : null}
            </div>
          </div>

          <div className="p-5">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 line-clamp-1 group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors">
              {event.title}
            </h3>

            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300 font-medium">
              <div className="flex items-center gap-2">
                <FaRegCalendar className="text-gray-400 dark:text-gray-500 shrink-0 text-sm" />
                <span>
                  {event.schedule?.date}
                  {event.schedule?.start_time
                    ? ` · ${event.schedule.start_time} WIB`
                    : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-gray-400 dark:text-gray-500 shrink-0 text-sm" />
                <span>{event.location?.city || "Online Event"}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaUsers className="text-gray-400 dark:text-gray-500 shrink-0 text-sm" />
                <span>
                  {registered} / {capacity} attendees
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-0">
        <div className="flex justify-between text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
          <span>{registered} attendees</span>
          <span>{capacity} capacity</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden mb-5">
          <div
            className={`h-full rounded-full transition-all duration-300 ${getProgressBarColor()}`}
            style={{ width: `${capacityPercentage}%` }}
          ></div>
        </div>

        <div className="flex gap-2 relative z-10">
          {isRegistered ? (
            <button
              type="button"
              onClick={handleJoin}
              className="flex-1 py-2.5 px-4 bg-emerald-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer shadow-sm group"
            >
              <span className="group-hover:hidden">✓ Registered</span>
              <span className="hidden group-hover:inline">Cancel Join</span>
            </button>
          ) : event.tickets?.is_full ? (
            <button
              type="button"
              disabled
              className="flex-1 py-2.5 px-4 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-xl font-semibold text-sm text-center cursor-not-allowed"
            >
              Full
            </button>
          ) : (
            <button
              type="button"
              onClick={handleJoin}
              className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm text-center bg-orange-600 hover:bg-orange-700 text-white transition-colors shadow-sm cursor-pointer"
            >
              Join Event
            </button>
          )}

          <button
            type="button"
            onClick={handleBookmark}
            className="p-3 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Bookmark event"
          >
            {isBookmarked ? (
              <FaBookmark className="text-orange-600 dark:text-orange-500 text-sm" />
            ) : (
              <FaRegBookmark className="text-gray-400 text-sm" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

export default EventCard;
