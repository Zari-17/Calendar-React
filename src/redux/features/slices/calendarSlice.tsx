import InitialState, { UpdateCalendarAction } from "@src/@types/redux/store";
import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";
import {DayPilot, DayPilotCalendar, DayPilotNavigator} from "@daypilot/daypilot-lite-react";
import {PROVIDERS, EVENTS, WAITINGROOM, PATIENTS, ROOMS, SPECIALIZATIONS} from '@src/data'
import dayjs from 'dayjs'
import moment from 'moment'
import 'moment-timezone'
moment.tz.setDefault('America/New_York')


const initialState: InitialState = {
  value: moment().toString(),
  events: [],
  providers: [],
  patients: [],
  providerProducts: [],
  view: 'day',
  // rooms: ROOMS,
  // specilizations: SPECIALIZATIONS,
  // waitingroom: WAITINGROOM

};


export const calendarSlice = createSlice({
  name: UpdateCalendarAction,
  initialState: initialState,
  reducers: {
    currentDate: (state:any, action: PayloadAction<any>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = action.payload;
    },
    events: (state:any = initialState, action: PayloadAction<any>) => {
      let actionType = action.payload.type;
      let payload:any = action.payload.data;
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      // state.events = action.payload;
      switch (actionType) {
        case 'eventAdded': {
          // We need to return a new state object
          return {
            // that has all the existing state data
            ...state,
            // but has a new array for the `todos` field
            events: [
              // with all of the old todos
              ...state.events,
              // and the new todo object
              payload
            ]
          }
        }
        case 'eventsLoaded': {
          // We need to return a new state object
          return {
            // that has all the existing state data
            ...state,
            // but has a new array for the `todos` field
            events: payload
          }
        }
        case 'eventDeleted': {
          return {
            ...state,
            events: [
              ...state.events.filter((ev:any) => ev.id !== payload.id)
            ]
          }
          
        }
        case 'eventChanged': {
          let events = !!state && state.events.map((event:any) => {
            if (event.id !== payload.id) {
              return event
            }
    
            return {...event,...payload}
          })
          return {
            // that has all the existing state data
            ...state,
            // but has a new array for the `todos` field
            events: events
          }
        }
        case 'statusChanged': {
          let events = !!state && state.events.map((event:any) => {
            if (event.id !== payload.id) {
              return event
            }
    
            return {
              ...event,
                status: payload.status,
                statusChangedAt: payload.statusChangedAt
              
            }
          })
          return {
            // that has all the existing state data
            ...state,
            // but has a new array for the `todos` field
            events: events
          }
        }
        case 'filters/statusFilterChanged': {
          return [
            // Again, one less level of nesting to copy
            ...state,
            {status: action.payload}
          ]
        }
        // Do something here based on the different types of actions
        default:
          // If this reducer doesn't recognize the action type, or doesn't
          // care about this specific action, return the existing state unchanged
          return state
      }
    },

    providers: (state:any = initialState, action: PayloadAction<any>) => {
      let actionType = action.payload.type;
      let payload:any = action.payload.data;
      switch (actionType) {

        case 'list': {
          return {
            // that has all the existing state data
            ...state,
            // but has a new array for the `todos` field
            providers: [
              // with all of the old todos
              ...state.providers,
              // and the new todo object
              payload
            ]
          }
        }
        case 'providersLoaded': {
          // We need to return a new state object
          return {
            // that has all the existing state data
            ...state,
            // but has a new array for the `todos` field
            providers: payload
          }
        }
        default:
          return state;
        
      }
    },
    patients: (state:any = initialState, action: PayloadAction<any>) => {
      let actionType = action.payload.type;
      let payload:any = action.payload.data;
      switch (actionType) {
        case 'patientsLoaded': {
          // We need to return a new state object
          return {
            // that has all the existing state data
            ...state,
            // but has a new array for the `todos` field
            patients: payload
          }
        }
        case 'patientAdded': {
          // We need to return a new state object
          return {
            // that has all the existing state data
            ...state,
            // but has a new array for the `todos` field
            patients: [
              // with all of the old todos
              ...state.patients,
              // and the new todo object
              payload
            ]
          }
        }
      }
    },
    providerProducts: (state:any = initialState, action: PayloadAction<any>) => {
      let actionType = action.payload.type;
      let payload:any = action.payload.data;
      switch (actionType) {
        case 'prodviderProdLoaded': {
          // We need to return a new state object
          return {
            // that has all the existing state data
            ...state,
            // but has a new array for the `todos` field
            providerProducts: payload
          }
        }
        case 'providerProdAdded': {
          // We need to return a new state object
          return {
            // that has all the existing state data
            ...state,
            // but has a new array for the `todos` field
            providerProducts: [
              // with all of the old todos
              ...state.providerProducts,
              // and the new todo object
              payload
            ]
          }
        }
      }
    },
    calendarView: (state:any, action: PayloadAction<any>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.view = action.payload;
    },
    // providers: (state:any, action: PayloadAction<any>) => {
    //   // Redux Toolkit allows us to write "mutating" logic in reducers. It
    //   // doesn't actually mutate the state because it uses the Immer library,
    //   // which detects changes to a "draft state" and produces a brand new
    //   // immutable state based off those changes
    //   state.providers = action.payload;
    // },
    // patients: (state:any, action: PayloadAction<any>) => {
    //   // Redux Toolkit allows us to write "mutating" logic in reducers. It
    //   // doesn't actually mutate the state because it uses the Immer library,
    //   // which detects changes to a "draft state" and produces a brand new
    //   // immutable state based off those changes
    //   state.patients = action.payload;
    // },
    // rooms: (state:any, action: PayloadAction<any>) => {
    //   // Redux Toolkit allows us to write "mutating" logic in reducers. It
    //   // doesn't actually mutate the state because it uses the Immer library,
    //   // which detects changes to a "draft state" and produces a brand new
    //   // immutable state based off those changes
    //   state.rooms = action.payload;
    // },
    // specializations: (state:any, action: PayloadAction<any>) => {
    //   // Redux Toolkit allows us to write "mutating" logic in reducers. It
    //   // doesn't actually mutate the state because it uses the Immer library,
    //   // which detects changes to a "draft state" and produces a brand new
    //   // immutable state based off those changes
    //   state.specializations = action.payload;
    // },
    // waitingroom: (state:any, action: PayloadAction<any>) => {
    //   // Redux Toolkit allows us to write "mutating" logic in reducers. It
    //   // doesn't actually mutate the state because it uses the Immer library,
    //   // which detects changes to a "draft state" and produces a brand new
    //   // immutable state based off those changes
    //   state.waitingroom = action.payload;
    // },

  },
});

// Action creators are generated for each case reducer function
export const { currentDate, events, providers, patients, providerProducts, calendarView } =
  calendarSlice.actions;
// You must export the reducer as follows for it to be able to be read by the store.
export default calendarSlice.reducer;