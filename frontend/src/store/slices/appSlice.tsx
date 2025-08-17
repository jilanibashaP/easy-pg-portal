// store/slices/appSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPage: 'dashboard',
  isLoading: false,
  notifications: [],
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
  },
});

export const { setCurrentPage, setLoading, addNotification, removeNotification } = appSlice.actions;
export default appSlice.reducer;