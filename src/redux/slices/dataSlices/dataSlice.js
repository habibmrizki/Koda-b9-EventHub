import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import eventsData from "../../../data/Events.json";
import initialCommunitiesData from "../../../data/Communities.json";

const defaultFallback =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80";

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
      const newEventData = action.payload;

      const finalImageUrl =
        newEventData.coverImage && newEventData.coverImage.trim() !== ""
          ? newEventData.coverImage
          : defaultFallback;

      const newEvent = {
        id: `e-${Date.now()}`,
        community_id: newEventData.community || "c1",
        title: newEventData.title || "Untitled Event",
        slug: (newEventData.title || "untitled-event")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-"),
        overview: newEventData.description || "",
        description: newEventData.description || "",
        image: finalImageUrl,
        coverImage: finalImageUrl,
        media: {
          thumbnail_url: finalImageUrl,
          cover_url: finalImageUrl,
        },

        dateLocation: `${newEventData.eventDate || "TBD"} · ${newEventData.location || "Online"}`,
        schedule: {
          date: newEventData.eventDate || "",
          start_time: newEventData.startTime || "09:00",
          end_time: newEventData.endTime || "17:00",
          timezone: "WIB",
        },
        location: {
          type: newEventData.format === "In Person" ? "offline" : "online",
          city:
            newEventData.format === "Online"
              ? "Online"
              : newEventData.location || "Online",
          address:
            newEventData.format === "In Person" ? newEventData.location : null,
        },

        attendees: 0,
        attendees_count: 0,
        capacity: parseInt(newEventData.capacity, 10) || 100,
        tickets: {
          capacity: parseInt(newEventData.capacity, 10) || 100,
          registered: 0,
          is_full: false,
        },

        tags:
          Array.isArray(newEventData.categories) &&
          newEventData.categories.length > 0
            ? newEventData.categories
            : ["Technology"],
        speakers: newEventData.speakers || [],
        status: "Active",
        organizer: {
          id: "u-myuser",
          name: "User Organizer",
          community_name: newEventData.community || "General Community",
          avatar_url:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
        },
        created_at: new Date().toISOString().split("T")[0],
      };

      state.events.unshift(newEvent);
    },

    updateEvent: (state, action) => {
      const updatedData = action.payload;
      const index = state.events.findIndex(
        (e) => String(e.id) === String(updatedData.id),
      );

      if (index !== -1) {
        const currentEvent = state.events[index];

        const finalImageUrl =
          updatedData.coverImage && updatedData.coverImage.trim() !== ""
            ? updatedData.coverImage
            : currentEvent.coverImage ||
              currentEvent.image ||
              currentEvent.media?.cover_url ||
              defaultFallback;

        state.events[index] = {
          ...currentEvent,
          title: updatedData.title || currentEvent.title,
          overview: updatedData.description || currentEvent.overview,
          description: updatedData.description || currentEvent.description,

          image: finalImageUrl,
          coverImage: finalImageUrl,
          media: {
            ...currentEvent.media,
            thumbnail_url: finalImageUrl,
            cover_url: finalImageUrl,
          },

          dateLocation: `${updatedData.eventDate || "TBD"} · ${updatedData.location || "Online"}`,
          schedule: {
            ...currentEvent.schedule,
            date: updatedData.eventDate || currentEvent.schedule?.date || "",
            start_time:
              updatedData.startTime ||
              currentEvent.schedule?.start_time ||
              "09:00",
            end_time:
              updatedData.endTime || currentEvent.schedule?.end_time || "17:00",
          },
          location: {
            type: updatedData.format === "In Person" ? "offline" : "online",
            city:
              updatedData.format === "Online"
                ? "Online"
                : updatedData.location || "Online",
            address:
              updatedData.format === "In Person" ? updatedData.location : null,
          },
          capacity:
            parseInt(updatedData.capacity, 10) || currentEvent.capacity || 100,
          tickets: {
            ...currentEvent.tickets,
            capacity: parseInt(updatedData.capacity, 10) || 100,
          },
          tags:
            Array.isArray(updatedData.categories) &&
            updatedData.categories.length > 0
              ? updatedData.categories
              : currentEvent.tags,
          speakers: updatedData.speakers || currentEvent.speakers,
        };
      }
    },

    joinEvent: (state, action) => {
      const payload =
        typeof action.payload === "object" && action.payload !== null
          ? action.payload
          : { eventId: action.payload, userEmail: "guest" };

      const { eventId, userEmail } = payload;
      const event = state.events.find((e) => String(e.id) === String(eventId));
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
      const event = state.events.find((e) => String(e.id) === String(eventId));
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
      const community = state.communities.find(
        (c) => String(c.id) === String(communityId),
      );
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
      .addCase(fetchEvents.pending, (state) => {
        state.loadingEvents = true;
        state.errorEvents = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loadingEvents = false;
        if (state.events.length === 0) {
          state.events = action.payload;
        } else {
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
  updateEvent,
  joinEvent,
  toggleJoinCommunity,
  toggleBookmarkEvent,
  addEventDiscussion,
} = dataSlice.actions;

export default dataSlice.reducer;
