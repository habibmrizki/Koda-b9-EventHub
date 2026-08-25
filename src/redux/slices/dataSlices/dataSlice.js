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
    events: eventsData,
    communities: initialCommunitiesData,
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

      const newEvent = {
        id: `e-${Date.now()}`,
        community_id: form.community || "c1",
        title: form.title,
        slug: form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        overview: form.description || "",
        description: form.description || "",
        schedule: {
          date: form.eventDate,
          start_time: form.startTime || "09:00",
          end_time: form.endTime || "17:00",
          timezone: "WIB",
        },
        location: {
          type: form.format === "In Person" ? "offline" : "online",
          city: form.format === "Online" ? "Online" : form.location,
          address: form.format === "In Person" ? form.location : null,
        },
        tickets: {
          capacity: parseInt(form.capacity, 10) || 100,
          registered: 0,
          is_full: false,
        },
        media: {
          thumbnail_url:
            form.coverImage ||
            "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
        },
        tags: form.category ? [form.category] : ["Technology"],
        organizer: {
          id: "u-myuser",
          name: "User Organizer",
          community_name: form.community || "General Community",
          avatar_url:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
        },
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
        // Cancel Join
        state.userRegistrations[userEmail] = registeredList.filter(
          (id) => id !== eventId,
        );
        if (event.tickets) {
          event.tickets.registered = Math.max(0, event.tickets.registered - 1);
          event.tickets.is_full = false;
        }
      } else {
        // Join Event
        if (event.tickets?.is_full) return;
        state.userRegistrations[userEmail].push(eventId);
        if (event.tickets) {
          event.tickets.registered += 1;
          if (event.tickets.registered >= event.tickets.capacity) {
            event.tickets.is_full = true;
          }
        }
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
        if (state.events.length === 0) {
          state.events = action.payload;
        } else {
          const currentIds = new Set(state.events.map((e) => e.id));
          const newEvents = action.payload.filter((e) => !currentIds.has(e.id));
          state.events = [...state.events, ...newEvents];
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
      }).addCase;
  },
});

export const { addEvent, joinEvent, toggleJoinCommunity, toggleBookmarkEvent } =
  dataSlice.actions;

export default dataSlice.reducer;
