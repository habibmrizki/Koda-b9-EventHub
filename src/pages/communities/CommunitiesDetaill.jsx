import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import communitiesData from "../../data/Communities.json";
import CommunityHeader from "../../components/communities/CommunitiesHeader";
import TabEvents from "../../components/communities/TabEvents";
import TabMembers from "../../components/communities/TabMembers";
import TabDiscussion from "../../components/communities/TabDiscussion";

export default function CommunitiesDetail() {
  const { id } = useParams();
  const currentUser = useSelector((state) => state.auth?.currentUser);

  // searchParams untuk membaca dan mengubah tab di URL
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "events";

  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  const [communities, setCommunities] = useState(() => {
    const saved = localStorage.getItem("communities");
    return saved ? JSON.parse(saved) : communitiesData;
  });

  const community = communities.find(
    (item) => String(item.id) === String(id) || item.slug === id,
  );

  const handleToggleJoin = () => {
    if (!community) return;
    setCommunities((prev) => {
      const updated = prev.map((item) =>
        String(item.id) === String(community.id)
          ? { ...item, is_joined: !item.is_joined }
          : item,
      );
      localStorage.setItem("communities", JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddDiscussion = (newText) => {
    if (!community) return;

    const authorName =
      currentUser?.fullName ||
      currentUser?.name ||
      currentUser?.email?.split("@")[0] ||
      "Guest User";

    const authorAvatar =
      currentUser?.avatarUrl ||
      currentUser?.avatar ||
      currentUser?.avatar_url ||
      null;

    const newDiscussion = {
      id: Date.now(),
      author: authorName,
      avatar: authorAvatar,
      timeAgo: "Just now",
      content: newText,
    };

    setCommunities((prev) => {
      const updated = prev.map((item) =>
        String(item.id) === String(community.id)
          ? {
              ...item,
              discussions: [newDiscussion, ...(item.discussions || [])],
            }
          : item,
      );
      localStorage.setItem("communities", JSON.stringify(updated));
      return updated;
    });
  };

  if (!community) {
    return (
      <div className="min-h-screen flex items-center justify-center font-inter bg-gray-50 text-gray-900">
        <p className="text-gray-500 text-sm">Community not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-inter text-gray-900">
      <CommunityHeader community={community} onToggleJoin={handleToggleJoin} />

      {/* Tabs Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => handleTabChange("events")}
              className={`shrink-0 border-b-2 py-4 px-1 text-xs font-semibold cursor-pointer transition ${
                activeTab === "events"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Events ({community.upcoming_events?.length || 0})
            </button>
            <button
              onClick={() => handleTabChange("members")}
              className={`shrink-0 border-b-2 py-4 px-1 text-xs font-semibold cursor-pointer transition ${
                activeTab === "members"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Members ({community.members?.length || 0})
            </button>
            <button
              onClick={() => handleTabChange("discussion")}
              className={`shrink-0 border-b-2 py-4 px-1 text-xs font-semibold cursor-pointer transition ${
                activeTab === "discussion"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Discussion ({community.discussions?.length || 0})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === "events" && (
            <TabEvents events={community.upcoming_events || []} />
          )}
          {activeTab === "members" && (
            <TabMembers members={community.members || []} />
          )}
          {activeTab === "discussion" && (
            <TabDiscussion
              discussions={community.discussions || []}
              onAddDiscussion={handleAddDiscussion}
            />
          )}
        </div>
      </div>
    </div>
  );
}
