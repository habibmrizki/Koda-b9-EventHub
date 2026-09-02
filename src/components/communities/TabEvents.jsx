import { useDispatch, useSelector } from "react-redux";
import {
  FaRegCalendar,
  FaMapMarkerAlt,
  FaUsers,
  FaCheck,
  FaRegBookmark,
  FaBookmark,
} from "react-icons/fa";
import {
  joinEvent,
  toggleBookmarkEvent,
} from "../../redux/slices/dataSlices/eventSlice";

import useAuth from "../../hooks/useAuth";

export default function TabEvents({ events = [] }) {
  const dispatch = useDispatch();

  const { userEmail } = useAuth();


  const { userRegistrations = {}, userBookmarks = {} } = useSelector(
    (state) => state.events || {},
  );

  // Normalisasi ID ke String agar pencocokan presisi
  const registeredIds = (userRegistrations[userEmail] || []).map(String);
  const bookmarkedIds = (userBookmarks[userEmail] || []).map(String);

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 text-xs font-inter">
        No upcoming events for this community.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-inter">
      {events.map((event) => {
        const eventIdStr = String(event.id);

        // Cek status berdasarkan Redux Store
        const isRegistered = registeredIds.includes(eventIdStr);
        const isBookmarked = bookmarkedIds.includes(eventIdStr);

        const baseRegistered =
          event.tickets?.registered ?? event.registered ?? 0;
        const registeredCount = isRegistered
          ? baseRegistered + 1
          : baseRegistered;
        const capacityCount = event.tickets?.capacity ?? event.capacity ?? 100;

        const capacityPercentage = Math.min(
          (registeredCount / capacityCount) * 100,
          100,
        );
        const isFull = registeredCount >= capacityCount && !isRegistered;

        // Dispatch langsung ke Redux
        const handleJoin = () => {
          dispatch(joinEvent({ eventId: event.id, userEmail }));
          dispatch(joinEvent({ eventId: eventIdStr, userEmail }));
        };

        const handleBookmark = () => {
          dispatch(toggleBookmarkEvent({ eventId: event.id, userEmail }));
          dispatch(toggleBookmarkEvent({ eventId: eventIdStr, userEmail }));
        };

        return (
          <div
            key={event.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition p-3"
          >
            <div>
              {/* Event Image & Badges */}
              <div className="h-40 w-full overflow-hidden rounded-xl relative bg-gray-100">
                <img
                  src={
                    event.image ||
                    event.media?.thumbnail_url ||
                    "https://images.unsplash.com/photo-1540575467063-178a50c2df87"
                  }
                  alt={event.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                  {(event.categories || event.tags)?.map((cat, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-black/40 backdrop-blur-md text-[10px] text-white rounded-md font-medium"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Event Details */}
              <div className="pt-3 pb-2 px-1">
                <h3 className="font-bold text-gray-900 text-sm mb-3 line-clamp-1">
                  {event.title}
                </h3>

                <div className="space-y-1.5 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <FaRegCalendar className="shrink-0 text-xs" />
                    <span>{event.date || event.schedule?.date || "TBA"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="shrink-0 text-xs" />
                    <span>
                      {event.location?.city || event.location || "Online"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUsers className="shrink-0 text-xs" />
                    <span>
                      {registeredCount} / {capacityCount} attendees
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress & Actions */}
            <div className="px-1 pt-2 pb-1">
              <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                <span>{registeredCount} attendees</span>
                <span>{capacityCount} capacity</span>
              </div>

              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-4">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isRegistered
                      ? "bg-emerald-500"
                      : capacityPercentage > 80
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                  }`}
                  style={{ width: `${capacityPercentage}%` }}
                ></div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleJoin}
                  disabled={isFull}
                  className={`flex-1 py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition cursor-pointer group ${
                    isRegistered
                      ? "bg-emerald-500 hover:bg-red-600 text-white"
                      : isFull
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-orange-500 hover:bg-orange-600 text-white"
                  }`}
                >
                  {isRegistered ? (
                    <>
                      <span className="flex items-center gap-1.5 group-hover:hidden">
                        <FaCheck className="text-xs" /> Registered
                      </span>
                      <span className="hidden group-hover:inline">
                        Cancel Join
                      </span>
                    </>
                  ) : isFull ? (
                    "Full"
                  ) : (
                    "Join Event"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBookmark}
                  className="p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:text-orange-500 hover:border-orange-500 transition cursor-pointer bg-white"
                  aria-label="Bookmark event"
                >
                  {isBookmarked ? (
                    <FaBookmark className="text-xs text-orange-500" />
                  ) : (
                    <FaRegBookmark className="text-xs" />
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
