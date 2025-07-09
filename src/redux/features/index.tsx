import { configureStore } from "@reduxjs/toolkit";
// This is how you import a reducer, based on the prior export.
import calendarReducer from "@src/redux/features/slices/calendarSlice";

const store = configureStore({
  reducer: {
    // You are free to call the LHS what you like, but it must have a reducer on the RHS.
    calendar: calendarReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;