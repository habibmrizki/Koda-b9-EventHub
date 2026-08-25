import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  fetchCommunities,
  toggleJoinCommunity,
} from "../../redux/slices/dataSlices/dataSlice";
import CommunityCard from "../../components/communities/CommunitiesCard";
import { FaSearch } from "react-icons/fa";

export default function Communities() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  // Ambil state communities dan user info dari Redux
  const { communities, loadingCommunities, errorCommunities, userCommunities } =
    useSelector((state) => state.data);
  const currentUser = useSelector((state) => state.auth?.currentUser);
  const userEmail = currentUser?.email || "guest";

  // Read Parameters dari URL
  const querySearch = searchParams.get("search") || "";
  const queryStatus = searchParams.get("status") || "All";
  const queryCategories = searchParams.get("categories")
    ? searchParams.get("categories").split(",")
    : ["All Categories"];

  const [searchQuery, setSearchQuery] = useState(querySearch);
  const [statusFilter, setStatusFilter] = useState(queryStatus);
  const [categoryFilter, setCategoryFilter] = useState(queryCategories);

  // Sync state lokal saat URL berubah
  useEffect(() => {
    setSearchQuery(querySearch);
    setStatusFilter(queryStatus);
    setCategoryFilter(queryCategories);
  }, [searchParams.toString()]);

  // Fetch communities saat dimuat
  useEffect(() => {
    dispatch(fetchCommunities());
  }, [dispatch]);

  // Helper Sync Filter ke URL Param
  const updateUrlParams = (newSearch, newStatus, newCategories) => {
    const params = new URLSearchParams();
    if (newSearch.trim()) params.set("search", newSearch.trim());
    if (newStatus !== "All") params.set("status", newStatus);
    if (newCategories.length > 0 && !newCategories.includes("All Categories")) {
      params.set("categories", newCategories.join(","));
    }
    setSearchParams(params, { replace: true });
  };

  // Handler Multi-select Category
  const handleCategoryClick = (cat) => {
    let updatedCategories = [];
    if (cat === "All Categories") {
      updatedCategories = ["All Categories"];
    } else {
      const exists = categoryFilter.includes(cat);
      if (exists) {
        updatedCategories = categoryFilter.filter((c) => c !== cat);
        if (updatedCategories.length === 0)
          updatedCategories = ["All Categories"];
      } else {
        updatedCategories = [
          ...categoryFilter.filter((c) => c !== "All Categories"),
          cat,
        ];
      }
    }
    setCategoryFilter(updatedCategories);
    updateUrlParams(searchQuery, statusFilter, updatedCategories);
  };

  // Handler Status Filter
  const handleStatusChange = (st) => {
    setStatusFilter(st);
    updateUrlParams(searchQuery, st, categoryFilter);
  };

  // Handler Search Query
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    updateUrlParams(val, statusFilter, categoryFilter);
  };

  const handleToggleJoin = (id) => {
    dispatch(toggleJoinCommunity({ communityId: id, userEmail }));
  };

  // Filtering Data berdasarkan URL / Filter
  const filteredCommunities = (communities || []).filter((item) => {
    const joinedList = userCommunities[userEmail] || [];
    const isUserJoined = joinedList.includes(item.id);

    // PENCARIAN UNTUK NAMA/JUDUL
    const matchesSearch = item.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase().trim());

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Joined" && isUserJoined) ||
      (statusFilter === "Not Joined" && !isUserJoined);

    const matchesCategory =
      categoryFilter.includes("All Categories") ||
      (Array.isArray(item.categories) &&
        item.categories.some((cat) => categoryFilter.includes(cat)));

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="bg-black min-h-screen text-white">
      <section className="relative overflow-hidden py-12 md:py-20 px-4">
        {/* Ambient Orange Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-orange-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="px-3.5 py-1.5 mb-6 bg-[#FF5F221A] border border-[#FF5F2233] w-fit mx-auto text-orange-500 font-medium text-xs font-inter rounded-full">
            Discover · Connect · Participate
          </div>
          <h1 className="font-jakarta font-extrabold text-4xl md:text-6xl text-white mb-6 leading-tight">
            Explore Communities
          </h1>
          <p className="font-inter text-gray-400 font-normal text-base md:text-lg mb-8 max-w-2xl mx-auto">
            Join communities that match your interests and get personalized
            event recommendations.
          </p>

          <div className="relative max-w-xl mx-auto flex items-center mb-6">
            <FaSearch className="absolute left-4 text-gray-500 text-sm" />
            <input
              type="text"
              placeholder="Search communities, topics, or locations..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-11 pr-4 py-3.5 bg-gray-900 border border-gray-800 text-white placeholder-gray-500 rounded-xl font-inter text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            />
          </div>
        </div>
      </section>
      <section className="bg-gray-50 text-gray-900 min-h-screen py-8 px-4 md:px-8 lg:px-12 rounded-t-3xl">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center gap-3 border-b border-gray-200/80 pb-4">
            {/* Filter Status */}
            <div className="flex gap-1 bg-white p-1 rounded-xl text-xs font-semibold text-gray-600">
              {["All", "Joined", "Not Joined"].map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    statusFilter === st
                      ? "bg-orange-600 text-white shadow-xs"
                      : "hover:text-gray-900"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="h-5 w-px bg-gray-300 hidden sm:block" />

            {/* Filter Kategori Multi-Select */}
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                "All Categories",
                "Technology",
                "Design",
                "Business",
                "Career",
                "AI",
                "Programming",
                "Music",
              ].map((cat) => {
                const isActive = categoryFilter.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`px-3 py-1.5 rounded-full border transition cursor-pointer ${
                      isActive
                        ? "bg-[#FF5F22] text-white border-transparent"
                        : "bg-white border-gray-300 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-gray-500 font-medium">
            {filteredCommunities.length} communities found
          </p>

          {loadingCommunities ? (
            <div className="text-center py-16">
              <p className="text-orange-500 font-semibold animate-pulse">
                Fetching communities...
              </p>
            </div>
          ) : errorCommunities ? (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl text-center my-8">
              {errorCommunities}
            </div>
          ) : filteredCommunities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCommunities.map((item) => (
                <CommunityCard
                  key={item.id}
                  community={item}
                  onToggleJoin={handleToggleJoin}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center my-8">
              <p className="text-gray-500 font-medium">
                Tidak ada komunitas yang ditemukan.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
