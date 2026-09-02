import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaUsers, FaRegCalendar, FaCheck } from "react-icons/fa";
import { toggleJoinCommunity } from "../../redux/slices/dataSlices/communitiesSlice";
import useAuth from "../../hooks/useAuth";

const CommunityCard = memo(function CommunityCard({ community }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isGuest, userEmail, openAuthModal } = useAuth();

  const { userCommunities = {} } = useSelector(
    (state) => state.communities || {},
  );

  // Cek apakah user saat ini sudah join ke komunitas ini
  const isJoined = (userCommunities[userEmail] || []).includes(community?.id);

  const handleCardClick = (e) => {
    e.preventDefault();
    if (isGuest) {
      openAuthModal(`/communities/${community.id}`);
    } else {
      navigate(`/communities/${community.id}`);
    }
  };

  // Handler klik tombol Join / Leave
  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isGuest) {
      openAuthModal(`/communities/${community.id}`);
      return;
    }

    if (!community?.id) return;
    dispatch(toggleJoinCommunity({ communityId: community.id, userEmail }));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between h-full hover:shadow-md transition">
      <div
        onClick={handleCardClick}
        className="block cursor-pointer flex-1 flex flex-col justify-between"
      >
        <div className="relative h-40 w-full bg-gray-100">
          <img
            src={community.cover_image}
            alt={community.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {isJoined && (
            <span className="absolute top-3 right-3 px-3 py-1 bg-emerald-500/90 backdrop-blur-md text-white text-[11px] font-semibold rounded-full flex items-center gap-1">
              <FaCheck className="text-[10px]" /> Joined
            </span>
          )}
        </div>

        <div className="p-5">
          <h3 className="font-bold text-gray-900 text-base mb-1 hover:text-orange-600 transition">
            {community.name}
          </h3>
          <p className="text-gray-500 text-xs line-clamp-2 mb-4 leading-relaxed">
            {community.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-4 min-h-13 items-start">
            {community.categories?.map((cat, idx) => (
              <span
                key={idx}
                className={`px-2.5 py-0.5 text-[11px] font-medium rounded-md ${
                  cat === "Technology"
                    ? "bg-blue-50 text-blue-600"
                    : cat === "Programming"
                      ? "bg-emerald-50 text-emerald-600"
                      : cat === "AI"
                        ? "bg-purple-50 text-purple-600"
                        : "bg-orange-50 text-orange-600"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        <div className="px-5 pb-4 flex items-center gap-4 text-xs text-gray-500 font-inter">
          <div className="flex items-center gap-1.5">
            <FaUsers className="text-gray-400 shrink-0" />
            <span>
              {(community.members_count || 0).toLocaleString()} members
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaRegCalendar className="text-gray-400 shrink-0" />
            <span>{community.upcoming_events_count || 0} upcoming</span>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-0 relative z-10">
        <button
          type="button"
          onClick={handleToggle}
          className={`w-full py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 group ${
            isJoined
              ? "bg-emerald-500 hover:bg-red-600 text-white"
              : "bg-[#FF5F22] hover:bg-orange-600 text-white"
          }`}
        >
          {isJoined ? (
            <>
              <span className="flex items-center gap-1.5 group-hover:hidden">
                <FaCheck /> Joined
              </span>
              <span className="hidden group-hover:inline">Leave Community</span>
            </>
          ) : (
            "Join Community"
          )}
        </button>
      </div>
    </div>
  );
});

export default CommunityCard;
