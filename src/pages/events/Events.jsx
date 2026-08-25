// import { useState, useMemo, useEffect, useCallback } from "react";
// import { useSearchParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { FiSearch, FiSliders } from "react-icons/fi";
// import { fetchEvents } from "../../redux/slices/dataSlices/dataSlice";
// import EventCard from "../../components/events/EventsCard";

// const CATEGORIES = [
//   "All",
//   "Technology",
//   "Design",
//   "Business",
//   "Career",
//   "AI",
//   "Programming",
//   "Music",
// ];
// const LOCATIONS = [
//   "All Locations",
//   "Bandung",
//   "Jakarta",
//   "Surabaya",
//   "Yogyakarta",
//   "Online",
// ];
// const SORT_OPTIONS = [
//   "Upcoming",
//   "Most Popular",
//   "Almost Full",
//   "Recently Added",
// ];

// export default function Events() {
//   const dispatch = useDispatch();
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [showFilters, setShowFilters] = useState(false);

//   const { events, loadingEvents, errorEvents } = useSelector(
//     (state) => state.data,
//   );

//   // Fetch events via Redux Thunk
//   useEffect(() => {
//     dispatch(fetchEvents());
//   }, [dispatch]);

//   const rawCategoryParam = searchParams.get("category");
//   const selectedCategories = useMemo(() => {
//     return rawCategoryParam ? rawCategoryParam.split(",") : ["All"];
//   }, [rawCategoryParam]);

//   const selectedLocation = searchParams.get("location") || "All Locations";
//   const selectedSort = searchParams.get("sort") || "Upcoming";

//   const searchQuery = searchParams.get("search") || "";

//   const [searchInput, setSearchInput] = useState(searchQuery);

//   // Handler Multi-select Kategori
//   const toggleCategory = (category) => {
//     let updatedCategories;

//     if (category === "All") {
//       updatedCategories = ["All"];
//     } else {
//       const currentFiltered = selectedCategories.filter((c) => c !== "All");

//       if (currentFiltered.includes(category)) {
//         updatedCategories = currentFiltered.filter((c) => c !== category);
//       } else {
//         updatedCategories = [...currentFiltered, category];
//       }

//       if (updatedCategories.length === 0) {
//         updatedCategories = ["All"];
//       }
//     }

//     const newParams = new URLSearchParams(searchParams);
//     if (updatedCategories.includes("All")) {
//       newParams.delete("category");
//     } else {
//       newParams.set("category", updatedCategories.join(","));
//     }
//     setSearchParams(newParams, { replace: true });
//   };

//   const updateParam = useCallback(
//     (key, value, defaultValue) => {
//       const newParams = new URLSearchParams(searchParams);
//       if (!value || value === defaultValue) {
//         newParams.delete(key);
//       } else {
//         newParams.set(key, value);
//       }
//       setSearchParams(newParams, { replace: true });
//     },
//     [searchParams, setSearchParams],
//   );

//   // Debounce Search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (searchInput !== searchQuery) {
//         updateParam("search", searchInput, "");
//       }
//     }, 300);
//     return () => clearTimeout(timer);
//   }, [searchInput, searchQuery, updateParam]);

//   // Filtering & Sorting Logic
//   const filteredEvents = useMemo(() => {
//     return (events || [])
//       .filter((event) => {
//         const query = searchInput.toLowerCase().trim();
//         if (query) {
//           const titleMatch = event.title?.toLowerCase().includes(query);
//           const overviewMatch = event.overview?.toLowerCase().includes(query);
//           const cityMatch = event.location?.city?.toLowerCase().includes(query);
//           if (!titleMatch && !overviewMatch && !cityMatch) return false;
//         }

//         if (!selectedCategories.includes("All")) {
//           const matchesAnyCategory = selectedCategories.some((cat) => {
//             const catLower = cat.toLowerCase();
//             const matchTag =
//               Array.isArray(event.tags) &&
//               event.tags.some((tag) => tag.toLowerCase() === catLower);
//             const matchTitle = event.title?.toLowerCase().includes(catLower);
//             return matchTag || matchTitle;
//           });

//           if (!matchesAnyCategory) return false;
//         }

//         if (selectedLocation !== "All Locations") {
//           const locLower = selectedLocation.toLowerCase();
//           if (locLower === "online") {
//             const isOnline =
//               event.location?.type?.toLowerCase() === "online" ||
//               event.location?.city?.toLowerCase() === "online";
//             if (!isOnline) return false;
//           } else {
//             if (event.location?.city?.toLowerCase() !== locLower) return false;
//           }
//         }

//         return true;
//       })
//       .sort((a, b) => {
//         if (selectedSort === "Most Popular") {
//           return (b.tickets?.registered || 0) - (a.tickets?.registered || 0);
//         }

//         if (selectedSort === "Almost Full") {
//           const percentageA =
//             (a.tickets?.registered || 0) / (a.tickets?.capacity || 1);
//           const percentageB =
//             (b.tickets?.registered || 0) / (b.tickets?.capacity || 1);
//           return percentageB - percentageA;
//         }

//         if (selectedSort === "Recently Added") {
//           return (b.id || "").localeCompare(a.id || "", undefined, {
//             numeric: true,
//           });
//         }

//         return (
//           new Date(a.schedule?.date || 0) - new Date(b.schedule?.date || 0)
//         );
//       });
//   }, [events, searchInput, selectedCategories, selectedLocation, selectedSort]);

//   return (
//     <div className="bg-[#f8f9fa] dark:bg-gray-950 min-h-screen font-inter text-gray-900 dark:text-gray-100 pb-16 transition-colors duration-200">
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
//         <div className="flex items-center gap-3 mb-6">
//           <div className="relative flex-1">
//             <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-lg" />
//             <input
//               type="text"
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               placeholder="Search events..."
//               className="w-full bg-[#f1f3f5] dark:bg-gray-900 border border-transparent dark:border-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-900 focus:border-gray-300 dark:focus:border-gray-700 focus:outline-none transition"
//             />
//           </div>

//           <button
//             type="button"
//             onClick={() => setShowFilters((prev) => !prev)}
//             className={`flex items-center gap-2 border font-semibold text-sm px-4 py-3 rounded-xl transition shadow-sm cursor-pointer ${
//               showFilters
//                 ? "bg-white dark:bg-gray-900 border-[#ff5722] text-[#ff5722]"
//                 : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
//             }`}
//           >
//             <FiSliders className="text-base" />
//             <span>Filters</span>
//           </button>
//         </div>

//         {showFilters && (
//           <div className="space-y-5 mb-8 animate-fadeIn">
//             {/* CATEGORY */}
//             <div>
//               <span className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase mb-2">
//                 CATEGORY (Pilih lebih dari satu)
//               </span>
//               <div className="flex flex-wrap gap-2">
//                 {CATEGORIES.map((category) => {
//                   const isActive = selectedCategories.includes(category);
//                   return (
//                     <button
//                       key={category}
//                       type="button"
//                       onClick={() => toggleCategory(category)}
//                       className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
//                         isActive
//                           ? "bg-[#ff5722] text-white shadow-sm"
//                           : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
//                       }`}
//                     >
//                       {category} {isActive && category !== "All" && "✓"}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
//               <div>
//                 <span className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase mb-2">
//                   LOCATION
//                 </span>
//                 <div className="flex flex-wrap gap-2">
//                   {LOCATIONS.map((loc) => (
//                     <button
//                       key={loc}
//                       type="button"
//                       onClick={() =>
//                         updateParam("location", loc, "All Locations")
//                       }
//                       className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
//                         selectedLocation === loc
//                           ? "bg-[#ff5722] text-white shadow-sm"
//                           : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
//                       }`}
//                     >
//                       {loc}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <span className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase mb-2">
//                   SORT BY
//                 </span>
//                 <div className="flex flex-wrap gap-2">
//                   {SORT_OPTIONS.map((sort) => (
//                     <button
//                       key={sort}
//                       type="button"
//                       onClick={() => updateParam("sort", sort, "Upcoming")}
//                       className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
//                         selectedSort === sort
//                           ? "bg-[#ff5722] text-white shadow-sm"
//                           : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
//                       }`}
//                     >
//                       {sort}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-6">
//           {filteredEvents.length} events found
//         </div>

//         {loadingEvents ? (
//           <div className="text-center py-16">
//             <p className="text-orange-500 font-semibold animate-pulse">
//               Fetching events...
//             </p>
//           </div>
//         ) : errorEvents ? (
//           <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl text-center my-8">
//             {errorEvents}
//           </div>
//         ) : filteredEvents.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredEvents.map((event) => (
//               <EventCard key={event.id} event={event} />
//             ))}
//           </div>
//         ) : (
//           <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-12 text-center my-8">
//             <p className="text-gray-500 dark:text-gray-400 font-medium">
//               Tidak ada event yang ditemukan.
//             </p>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiSearch, FiSliders } from "react-icons/fi";
import { fetchEvents } from "../../redux/slices/dataSlices/dataSlice";
import EventCard from "../../components/events/EventsCard";

const CATEGORIES = [
  "All",
  "Technology",
  "Design",
  "Business",
  "Career",
  "AI",
  "Programming",
  "Music",
];

const LOCATIONS = [
  "All Locations",
  "Bandung",
  "Jakarta",
  "Surabaya",
  "Yogyakarta",
  "Online",
];

const SORT_OPTIONS = [
  "Upcoming",
  "Most Popular",
  "Almost Full",
  "Recently Added",
];

export default function Events() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const { events, loadingEvents, errorEvents } = useSelector(
    (state) => state.data,
  );

  // // Fetch events via Redux Thunk
  // useEffect(() => {
  //   dispatch(fetchEvents());
  // }, [dispatch]);

  useEffect(() => {
    if (events.length === 0) {
      dispatch(fetchEvents());
    }
  }, [dispatch, events.length]);

  const rawCategoryParam = searchParams.get("category");
  const selectedCategories = useMemo(() => {
    return rawCategoryParam ? rawCategoryParam.split(",") : ["All"];
  }, [rawCategoryParam]);

  const selectedLocation = searchParams.get("location") || "All Locations";
  const selectedSort = searchParams.get("sort") || "Upcoming";
  const searchQuery = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(searchQuery);

  // Handler Multi-select Kategori
  const toggleCategory = (category) => {
    let updatedCategories;

    if (category === "All") {
      updatedCategories = ["All"];
    } else {
      const currentFiltered = selectedCategories.filter((c) => c !== "All");

      if (currentFiltered.includes(category)) {
        updatedCategories = currentFiltered.filter((c) => c !== category);
      } else {
        updatedCategories = [...currentFiltered, category];
      }

      if (updatedCategories.length === 0) {
        updatedCategories = ["All"];
      }
    }

    const newParams = new URLSearchParams(searchParams);
    if (updatedCategories.includes("All")) {
      newParams.delete("category");
    } else {
      newParams.set("category", updatedCategories.join(","));
    }
    setSearchParams(newParams, { replace: true });
  };

  const updateParam = useCallback(
    (key, value, defaultValue) => {
      const newParams = new URLSearchParams(searchParams);
      if (!value || value === defaultValue) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchQuery) {
        updateParam("search", searchInput, "");
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, searchQuery, updateParam]);

  // Filtering & Sorting Logic
  const filteredEvents = useMemo(() => {
    const filtered = (events || []).filter((event) => {
      const query = searchInput.toLowerCase().trim();
      if (query) {
        const titleMatch = event.title?.toLowerCase().includes(query);
        const overviewMatch = event.overview?.toLowerCase().includes(query);
        const cityMatch = event.location?.city?.toLowerCase().includes(query);
        if (!titleMatch && !overviewMatch && !cityMatch) return false;
      }

      if (!selectedCategories.includes("All")) {
        const matchesAnyCategory = selectedCategories.some((cat) => {
          const catLower = cat.toLowerCase();
          const matchTag =
            Array.isArray(event.tags) &&
            event.tags.some((tag) => tag.toLowerCase() === catLower);
          const matchTitle = event.title?.toLowerCase().includes(catLower);
          return matchTag || matchTitle;
        });

        if (!matchesAnyCategory) return false;
      }

      if (selectedLocation !== "All Locations") {
        const locLower = selectedLocation.toLowerCase();
        if (locLower === "online") {
          const isOnline =
            event.location?.type?.toLowerCase() === "online" ||
            event.location?.city?.toLowerCase() === "online";
          if (!isOnline) return false;
        } else {
          if (event.location?.city?.toLowerCase() !== locLower) return false;
        }
      }

      return true;
    });

    const sorted = filtered.sort((a, b) => {
      if (selectedSort === "Most Popular") {
        return (b.tickets?.registered || 0) - (a.tickets?.registered || 0);
      }

      if (selectedSort === "Almost Full") {
        const percentageA =
          (a.tickets?.registered || 0) / (a.tickets?.capacity || 1);
        const percentageB =
          (b.tickets?.registered || 0) / (b.tickets?.capacity || 1);
        return percentageB - percentageA;
      }

      if (selectedSort === "Recently Added") {
        return (b.id || "").localeCompare(a.id || "", undefined, {
          numeric: true,
        });
      }

      return new Date(a.schedule?.date || 0) - new Date(b.schedule?.date || 0);
    });

    // Jika filter 'Almost Full' dipilih, ambil hanya 1 event paling penuh
    if (selectedSort === "Almost Full") {
      return sorted.slice(0, 1);
    }

    return sorted;
  }, [events, searchInput, selectedCategories, selectedLocation, selectedSort]);

  return (
    <div className="bg-[#f8f9fa] dark:bg-gray-950 min-h-screen font-inter text-gray-900 dark:text-gray-100 pb-16 transition-colors duration-200">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-lg" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search events..."
              className="w-full bg-[#f1f3f5] dark:bg-gray-900 border border-transparent dark:border-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-900 focus:border-gray-300 dark:focus:border-gray-700 focus:outline-none transition"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className={`flex items-center gap-2 border font-semibold text-sm px-4 py-3 rounded-xl transition shadow-sm cursor-pointer ${
              showFilters
                ? "bg-white dark:bg-gray-900 border-[#ff5722] text-[#ff5722]"
                : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <FiSliders className="text-base" />
            <span>Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="space-y-5 mb-8 animate-fadeIn">
            {/* CATEGORY */}
            <div>
              <span className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase mb-2">
                CATEGORY (Pilih lebih dari satu)
              </span>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => {
                  const isActive = selectedCategories.includes(category);
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        isActive
                          ? "bg-[#ff5722] text-white shadow-sm"
                          : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {category} {isActive && category !== "All" && "✓"}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div>
                <span className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase mb-2">
                  LOCATION
                </span>
                <div className="flex flex-wrap gap-2">
                  {LOCATIONS.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() =>
                        updateParam("location", loc, "All Locations")
                      }
                      className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        selectedLocation === loc
                          ? "bg-[#ff5722] text-white shadow-sm"
                          : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase mb-2">
                  SORT BY
                </span>
                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map((sort) => (
                    <button
                      key={sort}
                      type="button"
                      onClick={() => updateParam("sort", sort, "Upcoming")}
                      className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        selectedSort === sort
                          ? "bg-[#ff5722] text-white shadow-sm"
                          : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {sort}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-6">
          {filteredEvents.length} events found
        </div>

        {loadingEvents ? (
          <div className="text-center py-16">
            <p className="text-orange-500 font-semibold animate-pulse">
              Fetching events...
            </p>
          </div>
        ) : errorEvents ? (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl text-center my-8">
            {errorEvents}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-12 text-center my-8">
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Tidak ada event yang ditemukan.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
