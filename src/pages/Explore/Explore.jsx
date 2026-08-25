import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEvents,
  fetchCommunities,
  toggleJoinCommunity,
} from "../../redux/slices/dataSlices/dataSlice";
import { openAuthModal } from "../../redux/slices/authSlices/authSlice";

import EventCard from "../../components/events/EventsCard";
import CommunityCard from "../../components/communities/CommunitiesCard";

function LandingPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  // Redux Selectors
  const currentUser = useSelector((state) => state.auth.currentUser);
  const isGuest = !currentUser;

  const {
    events,
    communities,
    loadingEvents,
    loadingCommunities,
    errorEvents,
    errorCommunities,
  } = useSelector((state) => state.data);

  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchCommunities());
  }, [dispatch]);

  // Read URL params
  const querySearch = searchParams.get("search") || "";
  const queryTopics = searchParams.get("topics")
    ? searchParams.get("topics").split(",")
    : ["All"];

  const [searchInput, setSearchInput] = useState(querySearch);
  const [debouncedSearch, setDebouncedSearch] = useState(querySearch);
  const [selectedTopics, setSelectedTopics] = useState(queryTopics);

  useEffect(() => {
    setSearchInput(querySearch);
    setDebouncedSearch(querySearch);
    setSelectedTopics(queryTopics);
  }, [searchParams.toString()]);

  // Pemicu Modal Instan
  const triggerAuthModalInstantly = (targetPath, e) => {
    if (isGuest) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      dispatch(openAuthModal(targetPath));
      return true;
    }
    return false;
  };

  const handleToggleJoin = (id) => {
    if (isGuest) {
      dispatch(openAuthModal("/communities"));
      return;
    }
    dispatch(toggleJoinCommunity(id));
  };

  const updateUrlParams = (newSearch, newTopics) => {
    const params = new URLSearchParams();
    if (newSearch.trim()) params.set("search", newSearch.trim());
    if (newTopics.length > 0 && !newTopics.includes("All")) {
      params.set("topics", newTopics.join(","));
    }
    setSearchParams(params, { replace: true });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      updateUrlParams(searchInput, selectedTopics);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setDebouncedSearch(searchInput);
    updateUrlParams(searchInput, selectedTopics);
  };

  const handleTopicClick = (topic) => {
    let updatedTopics = [];
    if (topic === "All") {
      updatedTopics = ["All"];
    } else {
      const exists = selectedTopics.includes(topic);
      if (exists) {
        updatedTopics = selectedTopics.filter((t) => t !== topic);
        if (updatedTopics.length === 0) updatedTopics = ["All"];
      } else {
        updatedTopics = [...selectedTopics.filter((t) => t !== "All"), topic];
      }
    }
    setSelectedTopics(updatedTopics);
    updateUrlParams(debouncedSearch, updatedTopics);
  };

  // Filter Events
  const filteredEvents = useMemo(() => {
    return (events || []).filter((event) => {
      const query = debouncedSearch.toLowerCase().trim();
      if (query) {
        const titleMatch = event.title?.toLowerCase().includes(query);
        const overviewMatch = event.overview?.toLowerCase().includes(query);
        const cityMatch = event.location?.city?.toLowerCase().includes(query);
        if (!titleMatch && !overviewMatch && !cityMatch) return false;
      }

      if (!selectedTopics.includes("All")) {
        const matchTag =
          Array.isArray(event.tags) &&
          event.tags.some((tag) =>
            selectedTopics.some((st) => st.toLowerCase() === tag.toLowerCase()),
          );
        const matchTitle = selectedTopics.some((st) =>
          event.title?.toLowerCase().includes(st.toLowerCase()),
        );
        if (!matchTag && !matchTitle) return false;
      }

      return true;
    });
  }, [debouncedSearch, selectedTopics, events]);

  // Filter Communities
  const filteredCommunities = useMemo(() => {
    return (communities || []).filter((item) => {
      const query = debouncedSearch.toLowerCase().trim();
      if (query) {
        const nameMatch = item.name?.toLowerCase().includes(query);
        const descMatch = item.description?.toLowerCase().includes(query);
        if (!nameMatch && !descMatch) return false;
      }

      if (!selectedTopics.includes("All")) {
        const matchCat =
          Array.isArray(item.categories) &&
          selectedTopics.some((st) => item.categories.includes(st));
        if (!matchCat) return false;
      }

      return true;
    });
  }, [debouncedSearch, selectedTopics, communities]);

  const isLoading = loadingEvents || loadingCommunities;
  const hasNoResults =
    !isLoading &&
    filteredEvents.length === 0 &&
    filteredCommunities.length === 0;

  return (
    <div className="bg-gray-900 dark:bg-black min-h-screen text-white transition-colors duration-200">
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="px-3.5 py-1.5 mb-6 bg-[#FF5F221A] border border-[#FF5F2233] w-fit mx-auto text-orange-500 font-medium text-xs font-inter rounded-full">
            Discover · Connect · Participate
          </div>

          <h1 className="font-jakarta font-extrabold text-4xl md:text-6xl text-white mb-6 leading-tight">
            Find events that{" "}
            <span className="text-orange-600">actually matter</span> to you
          </h1>

          <p className="font-inter text-gray-400 font-normal text-base md:text-lg mb-8 max-w-2xl mx-auto">
            Join workshops, conferences, and meetups in Indonesia's best tech
            communities — or create your own.
          </p>

          <form
            onSubmit={handleSearchSubmit}
            className="relative max-w-xl mx-auto flex items-center mb-6"
          >
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search events, topics, or locations..."
              className="w-full pl-4 pr-32 py-3.5 bg-gray-800 dark:bg-gray-900 border border-gray-700 dark:border-gray-800 text-white placeholder-gray-400 rounded-xl font-inter text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            />
            <div className="absolute right-2 flex items-center gap-1">
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    setDebouncedSearch("");
                    updateUrlParams("", selectedTopics);
                  }}
                  className="text-xs text-gray-400 hover:text-white cursor-pointer px-2 py-1.5 bg-gray-700/50 rounded-md"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-500 text-white font-inter text-xs font-semibold px-3 py-2 rounded-lg transition cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex flex-wrap items-center gap-2 justify-center">
            {[
              "All",
              "Technology",
              "AI",
              "Design",
              "Business",
              "Programming",
              "Music",
            ].map((topic) => {
              const isActive = selectedTopics.includes(topic);
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => handleTopicClick(topic)}
                  className={`px-3.5 py-1.5 border text-xs font-inter rounded-full transition cursor-pointer ${
                    isActive
                      ? "bg-orange-600 border-orange-600 text-white"
                      : "border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600 hover:text-white"
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white py-12 px-4 md:px-8 lg:px-12 rounded-t-3xl transition-colors duration-200">
        <div className="max-w-7xl mx-auto space-y-16">
          {isLoading && (
            <div className="text-center py-12">
              <p className="text-orange-500 font-semibold animate-pulse">
                Fetching data via Redux Thunk...
              </p>
            </div>
          )}

          {(errorEvents || errorCommunities) && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl text-center">
              {errorEvents || errorCommunities}
            </div>
          )}

          {hasNoResults && (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-12 text-center my-4">
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Tidak ada event maupun komunitas yang cocok dengan kriteria
                pencarian.
              </p>
            </div>
          )}

          {!isLoading && !hasNoResults && (
            <>
              {filteredEvents.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="font-jakarta font-bold text-2xl md:text-3xl text-gray-900 dark:text-white">
                      Because you joined{" "}
                      <span className="text-amber-500">
                        Bandung Go Community
                      </span>
                    </h2>
                    <Link
                      to="/events"
                      onClick={(e) => triggerAuthModalInstantly("/events", e)}
                      className="font-inter text-sm font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-500 transition"
                    >
                      See all &rarr;
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.slice(0, 6).map((event) => (
                      <div
                        key={event.id}
                        onClickCapture={(e) =>
                          triggerAuthModalInstantly(`/events/${event.id}`, e)
                        }
                      >
                        <EventCard event={event} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredCommunities.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="font-jakarta font-bold text-2xl md:text-3xl text-gray-900 dark:text-white">
                      Popular Communities
                    </h2>
                    <Link
                      to="/communities"
                      onClick={(e) =>
                        triggerAuthModalInstantly("/communities", e)
                      }
                      className="font-inter text-sm font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-500 transition"
                    >
                      See all &rarr;
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredCommunities.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        onClickCapture={(e) =>
                          triggerAuthModalInstantly(
                            `/communities/${item.id}`,
                            e,
                          )
                        }
                      >
                        <CommunityCard
                          community={item}
                          onToggleJoin={handleToggleJoin}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
