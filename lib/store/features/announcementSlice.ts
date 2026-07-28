import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  isAnnouncementVisible: boolean;
}

const initialState: UIState = {
  // We default to true. NextJS will hydrate this, and our useEffect will
  // safely check sessionStorage immediately after mounting to prevent SSR crashes.
  isAnnouncementVisible: true,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    hideAnnouncement: (state) => {
      state.isAnnouncementVisible = false;
    },
    setAnnouncementVisibility: (state, action: PayloadAction<boolean>) => {
      state.isAnnouncementVisible = action.payload;
    },
  },
});

export const { hideAnnouncement, setAnnouncementVisibility } = uiSlice.actions;
export default uiSlice.reducer;
