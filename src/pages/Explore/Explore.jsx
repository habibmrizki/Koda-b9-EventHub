import { useState, useMemo, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../redux/slices/dataSlices/eventSlice";
import {
  fetchCommunities,
  toggleJoinCommunity,
} from "../../redux/slices/dataSlices/communitiesSlice";
import useAuth from "../../hooks/useAuth";

import EventCard from "../../components/events/EventsCard";
import CommunityCard from "../../components/communities/CommunitiesCard";

function LandingPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  // Redux & Auth Hook
  const { isGuest, openAuthModal } = useAuth();

  const {
    items: events = [],
    loading: loadingEvents,
    error: errorEvents,
  } = useSelector((state) => state.events || {});
  const {
    items: communities = [],
    loading: loadingCommunities,
    error: errorCommunities,
  } = useSelector((state) => state.communities || {});

  useEffect(() => {
    if (events.length === 0) {
      dispatch(fetchEvents());
    }
    if (communities.length === 0) {
      dispatch(fetchCommunities());
    }
  }, [dispatch, events.length, communities.length]);

  const querySearch = searchParams.get("search") || "";
  const queryTopicsString = searchParams.get("topics");

  const queryTopics = useMemo(() => {
    return queryTopicsString ? queryTopicsString.split(",") : ["All"];
  }, [queryTopicsString]);

  const [searchInput, setSearchInput] = useState(querySearch);
  const [debouncedSearch, setDebouncedSearch] = useState(querySearch);
  const [selectedTopics, setSelectedTopics] = useState(queryTopics);

  const searchParamsString = searchParams.toString();
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchInput(querySearch);
    setDebouncedSearch(querySearch);
    setSelectedTopics(queryTopics);
  }, [searchParamsString, querySearch, queryTopics]);

  // Pemicu Modal Instan
  const triggerAuthModalInstantly = (targetPath, e) => {
    if (isGuest) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      openAuthModal(targetPath);
      return true;
    }
    return false;
  };

  const handleToggleJoin = (id) => {
    if (isGuest) {
      openAuthModal("/communities");
      return;
    }
    dispatch(toggleJoinCommunity(id));
  };

  const updateUrlParams = useCallback(
    (newSearch, newTopics) => {
      const params = new URLSearchParams();
      if (newSearch.trim()) params.set("search", newSearch.trim());
      if (newTopics.length > 0 && !newTopics.includes("All")) {
        params.set("topics", newTopics.join(","));
      }
      setSearchParams(params, { replace: true });
    },
    [setSearchParams],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      updateUrlParams(searchInput, selectedTopics);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, selectedTopics, updateUrlParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setDebouncedSearch(searchInput);
    updateUrlParams(searchInput, selectedTopics);
  };

  const handleTopicClick = (topic) => {
    // eslint-disable-next-line no-useless-assignment
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
    <div className="bg-black dark:bg-black min-h-screen text-white transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-20 px-4">
        {/* Orange Radial Glow Ambient Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-87.5 bg-orange-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
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
        <div className="space-y-16">
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

              {/* Testimonials Section */}
              <div className="pt-8">
                <h2 className="font-jakarta font-bold text-2xl md:text-3xl text-gray-900 dark:text-white mb-8">
                  What the community says
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-2xl flex flex-col justify-between shadow-xs">
                    <div>
                      <span className="text-orange-500 text-2xl font-serif font-bold leading-none select-none">
                        “
                      </span>
                      <p className="font-inter text-gray-600 dark:text-gray-300 text-xs md:text-sm leading-relaxed mt-2 mb-6">
                        EventHub completely changed how I network. I met my
                        current co-founder at a Jakarta AI meetup I found here.
                        The community pages make it so easy to find people who
                        are into the same things.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-semibold text-xs flex items-center justify-center shrink-0">
                        RN
                      </div>
                      <div>
                        <h4 className="font-jakarta font-bold text-sm text-gray-900 dark:text-white leading-tight">
                          Raisa Nurdiana
                        </h4>
                        <p className="font-inter text-xs text-gray-400">
                          Frontend Engineer · Cakrawala Digital
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-2xl flex flex-col justify-between shadow-xs">
                    <div>
                      <span className="text-orange-500 text-2xl font-serif font-bold leading-none select-none">
                        “
                      </span>
                      <p className="font-inter text-gray-600 dark:text-gray-300 text-xs md:text-sm leading-relaxed mt-2 mb-6">
                        We used to manage event registrations over WhatsApp
                        groups. Switching to EventHub as our organizer platform
                        cut our admin overhead in half and attendance actually
                        went up.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center shrink-0">
                        BH
                      </div>
                      <div>
                        <h4 className="font-jakarta font-bold text-sm text-gray-900 dark:text-white leading-tight">
                          Bimo Hartanto
                        </h4>
                        <p className="font-inter text-xs text-gray-400">
                          Product Manager · Nusantara Labs
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-2xl flex flex-col justify-between shadow-xs">
                    <div>
                      <span className="text-orange-500 text-2xl font-serif font-bold leading-none select-none">
                        “
                      </span>
                      <p className="font-inter text-gray-600 dark:text-gray-300 text-xs md:text-sm leading-relaxed mt-2 mb-6">
                        I love that I can filter by city and category in one
                        place. Found a design sprint workshop in Bandung I never
                        would have discovered otherwise — ended up being one of
                        the best events I've attended.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-orange-600 text-white font-semibold text-xs flex items-center justify-center shrink-0">
                        IK
                      </div>
                      <div>
                        <h4 className="font-jakarta font-bold text-sm text-gray-900 dark:text-white leading-tight">
                          Indira Kusuma
                        </h4>
                        <p className="font-inter text-xs text-gray-400">
                          UX Designer · Aruna Kreasi Studio
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom CTA Banner */}
              <div className="bg-[#18181b] dark:bg-black rounded-3xl p-8 md:p-14 text-center border border-gray-800/60 mt-12">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <span className="px-3 py-1 bg-white text-blue-600 font-semibold text-xs rounded-full">
                    Technology
                  </span>
                  <span className="px-3 py-1 bg-white text-purple-600 font-semibold text-xs rounded-full">
                    AI
                  </span>
                  <span className="px-3 py-1 bg-white text-pink-600 font-semibold text-xs rounded-full">
                    Design
                  </span>
                </div>

                <h2 className="font-jakarta font-extrabold text-3xl md:text-4xl text-white mb-4">
                  Ready to find your community?
                </h2>

                <p className="font-inter text-gray-400 text-sm md:text-base max-w-xl mx-auto mb-8">
                  Join thousands of developers, designers, and makers in
                  Indonesia's most active tech communities.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link
                    to="/events"
                    onClick={(e) => triggerAuthModalInstantly("/events", e)}
                    className="bg-[#ff5522] hover:bg-orange-600 text-white font-inter text-sm font-semibold px-6 py-3 rounded-xl transition cursor-pointer"
                  >
                    Explore Events
                  </Link>
                  <Link
                    to="/communities"
                    onClick={(e) =>
                      triggerAuthModalInstantly("/communities", e)
                    }
                    className="bg-transparent hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-700 font-inter text-sm font-semibold px-6 py-3 rounded-xl transition cursor-pointer"
                  >
                    Browse Communities
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
