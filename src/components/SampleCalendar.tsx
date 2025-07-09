import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment, { Moment } from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resourceId?: string;
}

interface Resource {
  resourceId: string;
  title: string;
}

interface Props {}

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

export const SampleCalendar: React.FC<Props> = () => {
  const [events, setEvents] = useState<Event[]>([
    {
        id: "1",
        title: 'Event 1',
        start: moment().toDate(),
        end: moment().add(1, 'hours').toDate(),
      },
      {
        id: "2",
        title: 'Event 2',
        start: moment().add(2, 'hours').toDate(),
        end: moment().add(3, 'hours').toDate(),
      },
      {
        id: "3",
        title: 'Event 3',
        start: moment().add(1, 'days').toDate(),
        end: moment().add(1, 'days').add(1, 'hours').toDate(),
      },
  ]);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedEvent, setDraggedEvent] = useState<Event | null>(null);

  const handleEventSelect = (args:any, e: any) => {
    let event = args;
    const id = event.id;

    if (e.ctrlKey || e.metaKey) {
      // If Ctrl/Cmd key is held down, add to selected events
      if (selectedEventIds.includes(id)) {
        setSelectedEventIds(selectedEventIds.filter((eventId) => eventId !== id));
      } else {
        setSelectedEventIds([...selectedEventIds, id]);
      }
    } else {
      // Otherwise, select only this event
      setSelectedEventIds([id]);
    }
  };

  const handleEventDragStart = (event: any) => {
    setIsDragging(true);
    setDraggedEvent(event);
  };

  const handleEventDragEnd = (event: any) => {
    setIsDragging(false);
    setDraggedEvent(null);
  };

  const handleEventDrop = (args:any) => {
    console.log(args)
    // If multiple events are selected, move all of them
    const eventsToMove = selectedEventIds.map((id) => events.find((event) => event.id === id));

    // Calculate the time difference between the dragged event's original start time and the new start time
    const timeDiff = moment(args.start).diff(moment(draggedEvent!.start), 'minutes');

    // Update the start and end times of each event to reflect the new drop position
    const updatedEvents = eventsToMove.map((eventToMove) => ({
      ...eventToMove!,
      start: moment(eventToMove!.start).add(timeDiff, 'minutes').toDate(),
      end: moment(eventToMove!.end).add(timeDiff, 'minutes').toDate(),
      resourceId :args.resourceId,
    }));

    console.log(updatedEvents)

    // Update the events array with the updated events
    const newEvents = events.map((event) =>
      updatedEvents.find((updatedEvent) => updatedEvent!.id == event.id) || event
    );
    setEvents(newEvents);

    // Deselect all events
    setSelectedEventIds([]);
  };

  const resources: Resource[] = [    
    { resourceId: '1', title: 'Doctor A' },    
    { resourceId: '2', title: 'Doctor B' },    
    { resourceId: '3', title: 'Doctor C' },
  ];


  return (
    <div style={{ height: '500px' }}>
      <DnDCalendar
        localizer={localizer}
        events={events}
        selectable="ignoreEvents"
        onSelectEvent={handleEventSelect}
        onDragStart={handleEventDragStart}
        onDragOver={handleEventDragEnd}
        onEventDrop={handleEventDrop}
        selected={selectedEventIds}
        onSelectSlot={(args) => {
            console.log(args)
          setEvents((prevEvents:any) => [
            ...prevEvents,
            { id: prevEvents.length + 1, title: 'New Appointment', start: args.start, end: args.end, resourceId: args.resourceId },
          ])
            }
        }
        view="day"
        views={['day']}
        step={15}
        timeslots={4}
        style={{ minWidth: '100%' }}
        resources={resources}
        resourceIdAccessor={(resources:any) => {return resources.resourceId}}
        resourceTitleAccessor={(resources:any) => {return resources.title}}
        eventPropGetter={(event: any) => ({
            style: {
              backgroundColor: event.resourceId === 1 ? 'red' : 'blue',
              opacity: selectedEventIds.includes(event.id) ? 0.5 : 1,
              cursor: 'move',
            },
          })}
        components={{
          event: ( event:any ) => (
            <div
              style={{
                backgroundColor: selectedEventIds.includes(event.id) ? 'red' : 'blue',
                color: 'white',
                padding: '5px',
                borderRadius: '3px',
                cursor: isDragging ? 'grabbing' : 'grab',
              }}
            >
              {event.title}
            </div>
          ),
        }}
      />
    </div>
  );
};

export default SampleCalendar;
