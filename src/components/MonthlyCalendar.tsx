import React, { forwardRef } from "react";
import {DayPilot, DayPilotCalendar, DayPilotNavigator, DayPilotMonth} from "@daypilot/daypilot-lite-react";
// import { SchedulerProvider, useScheduler } from "@src/hooks/useScheduler";

import { RootState } from "@src/redux/features";
import { useDispatch, useSelector } from "react-redux/es/exports";


type CalendarProps = {
    viewType?: any,
    columns?: any,
    events?: any,
    contextMenu?: any,
    onTimeRangeSelected?: any,
    onBeforeEventDomAdd?: any,
    onBeforeResHeaderRender?: any,
    onBeforeEventRender?: any,
    onEventClicked?: any,
    onEventMove?: any,
    forwardedRef?: any
};

const styles = {
    wrap: {
      display: "flex"
    },
    right: {
      marginLeft: "10px"
    },
    main: {
      flexGrow: "1"
    }
  };



const dp = new DayPilot.Calendar("dp");


const MonthlyCalendar = (props: CalendarProps) => {

    // const {calendarCurrentDate} = useScheduler();

    // const [calendarDate, setCalendarDate] = React.useState(new DayPilot.Date(new Date()).toString("yyyy-MM-dd"));
    // const []
    const calendarCurrentDate: any = useSelector(
        (state: RootState) => state.calendar.value
      );
    
    const calendarDefaultProps = {
        ID: 'dp_calendar',
        startDate: calendarCurrentDate,
        eventClickHandling: "Select",
        cellDuration: 45,
        minCellHeight: 500,
     }
       
    const allProps = {...props, ...calendarDefaultProps} 
    return (
        <div style={styles.wrap}>            
            <div id='dp_calendar' style={styles.main}>
                <DayPilotMonth ref={props.forwardedRef}
                    {...allProps}
                    
                />
            </div>
            {/* <div style={styles.right}>
                <DayPilotNavigator
                    selectMode={"day"}
                    showMonths={1}
                    onTimeRangeSelected={ (args:any) => {
                        setCalendarDate(args.day)
                        // allProps
                        // dp.update({
                        //     startDate: args.day
                        // });
                    }}
                />
            </div> */}
        </div>
    );

}

export default MonthlyCalendar;