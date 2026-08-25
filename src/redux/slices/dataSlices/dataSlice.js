import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import eventsData from "../../../data/Events.json";
import initialCommunitiesData from "../../../data/Communities.json";
import { logout } from "../authSlices/authSlice";

export const fetchEvents = createAsyncThunk(
  "data/fetchEvents",
  async (_, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return eventsData;
    } catch {
      return rejectWithValue("Gagal mengambil data events");
    }
  },
);

export const fetchCommunities = createAsyncThunk(
  "data/fetchCommunities",
  async (_, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return initialCommunitiesData;
    } catch {
      return rejectWithValue("Gagal mengambil data communities");
    }
  },
);

const dataSlice = createSlice({
  name: "data",
  initialState: {
    // events: eventsData,
    // communities: initialCommunitiesData,
    events: [],
    communities: [],
    userRegistrations: {},
    userBookmarks: {},
    userCommunities: {},
    loadingEvents: false,
    loadingCommunities: false,
    errorEvents: null,
    errorCommunities: null,
  },
  reducers: {
    addEvent: (state, action) => {
      const form = action.payload;

      let imageUrl = form.coverImage;
      // Cegah QuotaExceededError pada LocalStorage akibat gambar Base64 terlalu besar
      if (
        !imageUrl ||
        (typeof imageUrl === "string" && imageUrl.length > 500000)
      ) {
        imageUrl =
          "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80";
      }

      const newEvent = {
        id: `e-${Date.now()}`,
        community_id: form.community || "c1",
        title: form.title || "Untitled Event",
        slug: (form.title || "untitled-event")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-"),
        overview: form.description || "",
        description: form.description || "",

        // Kompatibilitas gambar Dashboard & EventsCard
        image: imageUrl,
        media: {
          thumbnail_url: imageUrl,
          cover_url: imageUrl,
        },

        // Kompatibilitas tanggal dan lokasi Dashboard & EventsCard
        dateLocation: `${form.eventDate || "TBD"} · ${form.location || "Online"}`,
        schedule: {
          date: form.eventDate || "",
          start_time: form.startTime || "09:00",
          end_time: form.endTime || "17:00",
          timezone: "WIB",
        },
        location: {
          type: form.format === "In Person" ? "offline" : "online",
          city: form.format === "Online" ? "Online" : form.location || "Online",
          address: form.format === "In Person" ? form.location : null,
        },

        // Kompatibilitas pendaftaran & kapasitas
        attendees: 0,
        capacity: parseInt(form.capacity, 10) || 100,
        tickets: {
          capacity: parseInt(form.capacity, 10) || 100,
          registered: 0,
          is_full: false,
        },

        // Kategori & Pembicara
        tags:
          Array.isArray(form.categories) && form.categories.length > 0
            ? form.categories
            : ["Technology"],
        speakers: form.speakers || [],

        status: "Active",
        organizer: {
          id: "u-myuser",
          name: "User Organizer",
          community_name: form.community || "General Community",
          avatar_url:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
        },
        created_at: new Date().toISOString().split("T")[0],
      };

      state.events.unshift(newEvent);
    },

    joinEvent: (state, action) => {
      const payload =
        typeof action.payload === "object" && action.payload !== null
          ? action.payload
          : { eventId: action.payload, userEmail: "guest" };

      const { eventId, userEmail } = payload;
      const event = state.events.find((e) => e.id === eventId);
      if (!event) return;

      if (!state.userRegistrations[userEmail]) {
        state.userRegistrations[userEmail] = [];
      }

      const registeredList = state.userRegistrations[userEmail];
      const index = registeredList.indexOf(eventId);

      if (index > -1) {
        state.userRegistrations[userEmail] = registeredList.filter(
          (id) => id !== eventId,
        );
        if (event.tickets) {
          event.tickets.registered = Math.max(0, event.tickets.registered - 1);
          event.tickets.is_full = false;
        }
        event.attendees = Math.max(0, (event.attendees || 0) - 1);
      } else {
        if (event.tickets?.is_full) return;
        state.userRegistrations[userEmail].push(eventId);
        if (event.tickets) {
          event.tickets.registered += 1;
          if (event.tickets.registered >= event.tickets.capacity) {
            event.tickets.is_full = true;
          }
        }
        event.attendees = (event.attendees || 0) + 1;
      }
    },

    toggleBookmarkEvent: (state, action) => {
      const payload =
        typeof action.payload === "object" && action.payload !== null
          ? action.payload
          : { eventId: action.payload, userEmail: "guest" };

      const { eventId, userEmail } = payload;
      const event = state.events.find((e) => e.id === eventId);
      if (!event) return;

      if (!state.userBookmarks[userEmail]) {
        state.userBookmarks[userEmail] = [];
      }

      const bookmarkList = state.userBookmarks[userEmail];
      const index = bookmarkList.indexOf(eventId);

      if (index > -1) {
        state.userBookmarks[userEmail] = bookmarkList.filter(
          (id) => id !== eventId,
        );
      } else {
        state.userBookmarks[userEmail].push(eventId);
      }
    },

    toggleJoinCommunity: (state, action) => {
      const payload =
        typeof action.payload === "object" && action.payload !== null
          ? action.payload
          : { communityId: action.payload, userEmail: "guest" };

      const { communityId, userEmail } = payload;
      const community = state.communities.find((c) => c.id === communityId);
      if (!community) return;

      if (!state.userCommunities[userEmail]) {
        state.userCommunities[userEmail] = [];
      }

      const communityList = state.userCommunities[userEmail];
      const index = communityList.indexOf(communityId);

      if (index > -1) {
        state.userCommunities[userEmail] = communityList.filter(
          (id) => id !== communityId,
        );
        community.members_count = Math.max(0, community.members_count - 1);
      } else {
        state.userCommunities[userEmail].push(communityId);
        community.members_count += 1;
      }
    },

    addEventDiscussion: (state, action) => {
      const { eventId, discussion } = action.payload;
      const event = state.events.find((e) => String(e.id) === String(eventId));
      if (event) {
        if (!event.discussions) {
          event.discussions = [];
        }
        event.discussions.push(discussion);
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(logout, (state) => {
        state.userRegistrations = {};
        state.userBookmarks = {};
        state.userCommunities = {};
      })
      .addCase(fetchEvents.pending, (state) => {
        state.loadingEvents = true;
        state.errorEvents = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loadingEvents = false;

        // Jika state.events kosong (pertama kali aplikasi dibuka/belum ada cache)
        if (state.events.length === 0) {
          state.events = action.payload;
        } else {
          // Jika sudah ada data (termasuk event baru buatan user),
          // hanya tambahkan event dari JSON yang belum ada ID-nya di state
          const existingIds = new Set(state.events.map((e) => String(e.id)));
          const newJsonEvents = action.payload.filter(
            (e) => !existingIds.has(String(e.id)),
          );
          state.events = [...state.events, ...newJsonEvents];
        }
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loadingEvents = false;
        state.errorEvents = action.payload;
      })
      .addCase(fetchCommunities.pending, (state) => {
        state.loadingCommunities = true;
        state.errorCommunities = null;
      })
      .addCase(fetchCommunities.fulfilled, (state, action) => {
        state.loadingCommunities = false;
        if (state.communities.length === 0) {
          state.communities = action.payload;
        }
      })
      .addCase(fetchCommunities.rejected, (state, action) => {
        state.loadingCommunities = false;
        state.errorCommunities = action.payload;
      });
  },
});

export const {
  addEvent,
  joinEvent,
  toggleJoinCommunity,
  toggleBookmarkEvent,
  addEventDiscussion,
} = dataSlice.actions;

export default dataSlice.reducer;
