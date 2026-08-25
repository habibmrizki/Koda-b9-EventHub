import { useEffect } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Bookmark, Calendar, MapPin, Users } from "lucide-react";
import {
  fetchEvents,
  joinEvent,
  toggleBookmarkEvent,
} from "../../redux/slices/dataSlices/dataSlice";

const EventListContent = ({ list, userEmail }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!list || list.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-400">
          <Bookmark size={24} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            No events found
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            You haven't joined or saved any events yet.
          </p>
        </div>
        <button
          onClick={() => navigate("/events")}
          className="mt-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded-lg transition-colors shadow-sm cursor-pointer"
        >
          Explore Events
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
      {list.map(({ item, isRegistered, isBookmarked }) => {
        const registered = item.tickets?.registered || 0;
        const capacity = item.tickets?.capacity || 1;
        const percentage = Math.min(
          Math.round((registered / capacity) * 100),
          100,
        );

        return (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md"
          >
            <div className="relative h-40 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={item.media?.thumbnail_url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              {item.location?.type === "online" && (
                <span className="absolute top-2.5 right-2.5 bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                  Online
                </span>
              )}
              <div className="absolute bottom-2.5 left-2.5 flex flex-wrap gap-1">
                {item.tags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-indigo-600/90 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">
                  {item.title}
                </h3>

                <div className="space-y-1 text-[11px] text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-gray-400 shrink-0" />
                    <span>{item.schedule?.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-gray-400 shrink-0" />
                    <span>{item.location?.city || "Online Event"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={13} className="text-gray-400 shrink-0" />
                    <span>
                      {registered} / {capacity} attendees
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <div>
                  <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                    <span>{registered} attendees</span>
                    <span>{capacity} capacity</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isRegistered ? (
                    <button
                      onClick={() =>
                        dispatch(joinEvent({ eventId: item.id, userEmail }))
                      }
                      className="flex-1 py-2 bg-emerald-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer group transition-colors"
                    >
                      <span className="group-hover:hidden">✓ Registered</span>
                      <span className="hidden group-hover:inline">
                        Cancel Join
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/events/${item.id}`)}
                      className="flex-1 py-2 bg-orange-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      View Event
                    </button>
                  )}

                  <button
                    onClick={() =>
                      dispatch(
                        toggleBookmarkEvent({ eventId: item.id, userEmail }),
                      )
                    }
                    className={`p-2 border border-gray-200 dark:border-gray-800 rounded-lg transition-colors cursor-pointer ${
                      isBookmarked
                        ? "text-orange-500 bg-orange-50 dark:bg-orange-950/30"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <Bookmark
                      size={14}
                      fill={isBookmarked ? "currentColor" : "none"}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const MyEvents = () => {
  const dispatch = useDispatch();
  const { tab = "upcoming" } = useParams();

  const currentUser = useSelector((state) => state.auth?.currentUser);
  const userEmail = currentUser?.email || "guest";

  const {
    events = [],
    userRegistrations = {},
    userBookmarks = {},
  } = useSelector((state) => state.data || {});

  // useEffect(() => {
  //   if (events.length === 0) {
  //     dispatch(fetchEvents());
  //   }
  // }, [dispatch]);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const myRegisteredIds = userRegistrations[userEmail] || [];
  const myBookmarkedIds = userBookmarks[userEmail] || [];

  const mappedEvents = events.map((item) => ({
    item,
    isRegistered: myRegisteredIds.includes(item.id),
    isBookmarked: myBookmarkedIds.includes(item.id),
  }));

  const upcomingEvents = mappedEvents.filter((e) => e.isRegistered);
  const savedEvents = mappedEvents.filter((e) => e.isBookmarked);
  const pastEvents = [];

  const counts = {
    upcoming: upcomingEvents.length,
    past: pastEvents.length,
    saved: savedEvents.length,
  };

  const getListByTab = () => {
    if (tab === "past") return pastEvents;
    if (tab === "saved") return savedEvents;
    return upcomingEvents;
  };

  const navLinkStyle = ({ isActive }) =>
    `pb-3 text-xs font-medium border-b-2 transition-all ${
      isActive
        ? "border-orange-500 text-orange-500 font-semibold"
        : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
    }`;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 py-8 px-6 font-sans text-gray-800 dark:text-gray-100">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          My Events
        </h1>

        <div className="flex gap-6 border-b border-gray-200 dark:border-gray-800">
          <NavLink to="/my-events/upcoming" className={navLinkStyle}>
            Upcoming ({counts.upcoming})
          </NavLink>
          <NavLink to="/my-events/past" className={navLinkStyle}>
            Past ({counts.past})
          </NavLink>
          <NavLink to="/my-events/saved" className={navLinkStyle}>
            Saved ({counts.saved})
          </NavLink>
        </div>

        <EventListContent list={getListByTab()} userEmail={userEmail} />
      </div>
    </div>
  );
};

export default MyEvents;
