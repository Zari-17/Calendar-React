import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {DayPilot, DayPilotCalendar, DayPilotNavigator} from "@daypilot/daypilot-lite-react";


const CalendarContext = createContext({
  calendarCurrentDate: null
})

type contextProps = {
  children?: ReactNode,
}

export const SchedulerProvider = (props: contextProps) => {
  const [calendarCurrentDate, setCalendarCurrentDate] = React.useState(new DayPilot.Date(new Date()).toString("yyyy-MM-dd"))
  const navigate = useNavigate();

  

  const value = useMemo(
    () => ({
      calendarCurrentDate
    }),
    []
  );
  return <CalendarContext.Provider value={value}>{props.children}</CalendarContext.Provider>;
};

export const useScheduler = () => {
  return useContext(CalendarContext);
};