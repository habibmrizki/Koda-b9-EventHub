import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import initialCommunitiesData from "../../../data/Communities.json";

export const fetchCommunities = createAsyncThunk(
  "communities/fetchCommunities",
  async (_, { rejectWithValue }) => {
    try {
      const data = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(initialCommunitiesData);
        }, 100);
      });
      return data;
    } catch {
      return rejectWithValue("Gagal mengambil data communities");
    }
  },
);

const communitiesSlice = createSlice({
  name: "communities",
  initialState: {
    items: [],
    userCommunities: {},
    loading: false,
    error: null,
  },
  reducers: {
    toggleJoinCommunity: (state, action) => {
      const payload =
        typeof action.payload === "object" && action.payload !== null
          ? action.payload
          : { communityId: action.payload, userEmail: "guest" };

      const { communityId, userEmail } = payload;
      const community = state.items.find(
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommunities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommunities.fulfilled, (state, action) => {
        state.loading = false;
        if (state.items.length === 0) {
          state.items = action.payload;
        }
      })
      .addCase(fetchCommunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { toggleJoinCommunity } = communitiesSlice.actions;

export default communitiesSlice.reducer;
