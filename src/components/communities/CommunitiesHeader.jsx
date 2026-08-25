import { Link } from "react-router-dom";
import { FaArrowLeft, FaUsers, FaRegCalendar, FaCheck } from "react-icons/fa";

export default function CommunityHeader({ community, onToggleJoin }) {
  return (
    <div>
      <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/communities"
            className="inline-flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-gray-900 transition"
          >
            <FaArrowLeft className="text-xs" /> Back to Communities
          </Link>
        </div>
      </div>

      <div className="relative h-64 md:h-80 w-full overflow-hidden bg-gray-900">
        <img
          src={community.cover_image}
          alt={community.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex items-end">
          <div className="max-w-7xl w-full mx-auto px-4 md:px-8 pb-6 flex justify-between items-end">
            <div>
              <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-2">
                {community.name}
              </h1>
              <div className="flex items-center gap-4 text-xs md:text-sm text-gray-300">
                <span className="flex items-center gap-1.5">
                  <FaUsers /> {community.members_count.toLocaleString()} members
                </span>
                <span className="flex items-center gap-1.5">
                  <FaRegCalendar /> {community.upcoming_events_count} upcoming
                  events
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onToggleJoin}
              className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
                community.is_joined
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                  : "bg-[#FF5F22] hover:bg-orange-600 text-white"
              }`}
            >
              {community.is_joined ? (
                <>
                  <FaCheck /> Joined
                </>
              ) : (
                "Join Community"
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-3">
          <p className="text-xs md:text-sm text-gray-600 max-w-4xl leading-relaxed">
            {community.description}
          </p>
          <div className="flex gap-2">
            {community.categories.map((cat, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 bg-blue-50 text-blue-600 text-[11px] font-medium rounded-md"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
