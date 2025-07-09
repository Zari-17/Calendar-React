import React from 'react';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import 'moment-timezone';

import { RootState } from '@src/redux/features';
import { useSelector } from 'react-redux/es/exports';

type CalendarProps = {
  forwardedRef?: any;
  onSelectSlot?: any;
  resources?: any;
  events?: any;
  onSelectEvent?: any;
  onEventDrop?: any;
  onDragStart?: any;
  onDragOver?: any;
  onEventResize?: any;
  components?: any;
  multipleEventSource?: any;
  eventMoving?: any;
  extraProps?: any;
};

moment.tz.setDefault('America/New_York');
const localizer = momentLocalizer(moment);

const DragAndDropCalendar = withDragAndDrop(Calendar);

const BigCalendar = (props: CalendarProps) => {
  const calendarCurrentDate: any = useSelector(
    (state: RootState) => state.calendar.value,
  );
  const calendarCurrentView: any = useSelector(
    (state: RootState) => state.calendar.view,
  );

  const [defaultDate, setDefaultDate] = React.useState(
    new Date(calendarCurrentDate),
  );

  return (
    <>
      <div style={{ height: 660, width: '100%' }}>
        <DragAndDropCalendar
          ref={props.forwardedRef}
          defaultDate={defaultDate}
          defaultView={calendarCurrentView}
          localizer={localizer}
          resourceIdAccessor={(resources: any) => {
            return resources?.resourceId?.toString();
          }}
          resourceTitleAccessor={(resources: any) => {
            return resources.name;
          }}
          toolbar={true}
          step={15}
          timeslots={1}
          resizable={true}
          longPressThreshold={0}
          views={{
            month: true,
            week: true,
            day: true,
          }}
          dayLayoutAlgorithm={'no-overlap'}
          selectable={true}
          {...props}
        />
      </div>
    </>
  );
};

export default BigCalendar;
