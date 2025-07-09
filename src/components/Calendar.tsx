import React from 'react';
import { DayPilotCalendar } from '@daypilot/daypilot-lite-react';
// import { SchedulerProvider, useScheduler } from "@src/hooks/useScheduler";

import { RootState } from '@src/redux/features';
import { useSelector } from 'react-redux/es/exports';

type CalendarProps = {
  viewType?: any;
  columns?: any;
  events?: any;
  contextMenu?: any;
  contextMenuSelection?: any;
  onTimeRangeSelected?: any;
  onBeforeEventDomAdd?: any;
  onBeforeResHeaderRender?: any;
  onBeforeTimeHeaderRender?: any;
  onBeforeEventRender?: any;
  onEventRightClick?: any;
  onEventClicked?: any;
  onEventMove?: any;
  onBeforeCellRender?: any;
  forwardedRef?: any;
};

const styles = {
  wrap: {
    display: 'flex',
  },
  right: {
    marginLeft: '10px',
  },
  main: {
    flexGrow: '1',
  },
};

const Calendar = (props: CalendarProps) => {
  const calendarCurrentDate: any = useSelector(
    (state: RootState) => state.calendar.value,
  );

  const calendarDefaultProps = {
    ID: 'dp_calendar',
    startDate: calendarCurrentDate,
    eventClickHandling: 'Select',
    cellDuration: 15,
    minCellHeight: 500,
  };

  const allProps = { ...props, ...calendarDefaultProps };
  return (
    <div style={styles.wrap}>
      <div id='dp_calendar' style={styles.main}>
        <DayPilotCalendar ref={props.forwardedRef} {...allProps} />
      </div>
    </div>
  );
};

export default Calendar;
