import React, { useState } from 'react';
import BigCalendar from './BigCalendar';
import { STATION } from '@src/data';
import VisualForceRemotingManager from '@src/services/remotingManager.service';
import {
  Event,
  TimeSlot,
  TimeSlots,
  Station,
  TimeSlotProducts,
  TimeSlotChild,
  Appointment,
  Appointments,
} from '@src/models';
import { Modal } from '@daypilot/modal';
import { systemConfig } from '@src/config';
import helpers from '@src/services/helpers.service';
import dayjs from 'dayjs';
import moment from 'moment';
import 'moment-timezone';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { v4 as uuidv4 } from 'uuid';

import type { MenuProps } from 'antd';
import { Dropdown, theme, Space } from 'antd';

import { Menu, Item, Submenu, useContextMenu } from 'react-contexify';

import 'react-contexify/dist/ReactContexify.css';

import { RootState } from '@src/redux/features';
import { useDispatch, useSelector } from 'react-redux';
import {
  events as evPipline,
  calendarView as currentView,
  currentDate,
} from '@src/redux/features/slices/calendarSlice';

import { Button, Row, Col, Typography } from 'antd';
import TransferEventModal from '@src/components/Forms/TransferEventModal';
import CreateEventModal from '@src/components/Forms/CreateEventModal';
import UpdateEventModal from '@src/components/Forms/UpdateEventModal';
import CreateTimeSlotModal from '@src/components/Forms/CreateTimeSlotModal';
import UpdateTimeSlotModal from '@src/components/Forms/UpdateTimeSlotModal';

import {
  CaretLeftOutlined,
  CaretRightOutlined,
  DownOutlined,
} from '@ant-design/icons';

import _ from 'lodash';

type SchedulerProps = {
  activePatient?: any;
  specializationFilter?: any;
  providerFilter?: any;
};

const { Text } = Typography;

const Scheduler = (props: SchedulerProps) => {
  moment.tz.setDefault('America/New_York');
  let toastrDefaultOptions: any = {
    position: 'top-center',
    autoClose: 2000,
    hideProgressBar: true,
    theme: 'light',
  };

  const notify = (message: any, type: any = 'default', toastrID?: any) => {
    let toastID: any = toastrID ? { toastId: toastrID } : {};
    toastrDefaultOptions = { ...toastrDefaultOptions, ...toastID };
    switch (type) {
      case 'success':
        toast.success(message, toastrDefaultOptions);
        break;
      case 'warn':
        toast.warning(message, toastrDefaultOptions);
        break;
      case 'error':
        toast.error(message, toastrDefaultOptions);
        break;
      case 'default':
        toast.info(message, toastrDefaultOptions);
        break;
    }
  };

  const [dateSlots, setDateSlots] = React.useState<any>([]);
  const [selectedTSforAPT, setSelectedTSforAPT] = React.useState<any>();

  const handleFormDataChange = (data: any) => {
    setDateSlots(getDateTimeSlots(data.apptdate, data));
  };

  const getDateTimeSlots = (date: any, data: any) => {
    const events = calendarEvents;
    let filteredEvents = events
      .filter((event: any) => {
        return (
          new Date(event.start).toDateString() ==
            new Date(date).toDateString() &&
          new Date(event.end).toDateString() == new Date(date).toDateString() &&
          data.resource == event.resourceId &&
          event.type == 'timeslot' &&
          event.duration >= data.duration &&
          event.id != data.id
        );
      })
      .map((event: any) => event);
    let disabledTimes: any = [];
    let allTS: any = [];
    !!filteredEvents &&
      filteredEvents.map((event: any) => {
        let startHour: any = moment(event.start).format('H');
        let endHour: any = moment(event.end).format('H');
        allTS.push({
          id: event.id,
          start: moment(event.start).format('hh:mm'),
          end: moment(event.end).format('hh:mm'),
        });
        disabledTimes[startHour] = [];
        if (startHour !== endHour) disabledTimes[endHour] = [];
      });

    for (var hour in disabledTimes) {
      !!filteredEvents &&
        filteredEvents.map((event: any) => {
          let startHour: any = moment(event.start).format('H');
          let endHour: any = moment(event.end).format('H');
          hour == startHour
            ? disabledTimes[hour].push(Number(moment(event.start).format('mm')))
            : null;
        });
    }
    return allTS.sort();
  };

  const validateSlot = (date: any, data: any) => {
    const events = calendarEvents;
    let filteredEvents = events
      .filter((event: any) => {
        return (
          new Date(event.start).toDateString() ==
            new Date(date).toDateString() &&
          new Date(event.end).toDateString() == new Date(date).toDateString() &&
          data.resource == event.resourceId &&
          event.type == 'timeslot' &&
          event.id != data.id
        );
      })
      .map((event: any) => event);
    let disabledTimes: any = [];

    let allTS: any = [];
    !!filteredEvents &&
      filteredEvents.map((event: any) => {
        let startHour: any = moment(event.start).format('H');
        let endHour: any = moment(event.end).format('H');
        allTS.push({
          id: event.id,
          start: moment(event.start),
          end: moment(event.end),
        });
        disabledTimes[startHour] = [];
        if (startHour !== endHour) disabledTimes[endHour] = [];
      });

    for (var hour in disabledTimes) {
      !!filteredEvents &&
        filteredEvents.map((event: any) => {
          let startHour: any = moment(event.start).format('H');
          let endHour: any = moment(event.end).format('H');
          hour == startHour
            ? disabledTimes[hour].push(Number(moment(event.start).format('mm')))
            : null;
        });
    }
    return allTS.sort();
  };

  const calendarEvents: any = useSelector(
    (state: RootState) => state.calendar.events,
  );

  const calendarProviders: any = useSelector(
    (state: RootState) => state.calendar.providers,
  );

  const calendarCurrentDate: any = useSelector(
    (state: RootState) => state.calendar.value,
  );
  const calendarCurrentView: any = useSelector(
    (state: RootState) => state.calendar.view,
  );

  const calendarPatients: any = useSelector(
    (state: RootState) => state.calendar.patients,
  );

  const calendarProviderProducts: any = useSelector(
    (state: RootState) => state.calendar.providerProducts,
  );

  let providerProducts: any = [];
  providerProducts =
    calendarProviderProducts.length &&
    Object.entries(calendarProviderProducts[0].product).map((cpp: any) => {
      return { value: cpp[1].productID, label: cpp[1].productName };
    });

  const dispatch = useDispatch();

  const [events, setEvents] = React.useState<any>(calendarEvents);

  const [timeSlots, setTimeSlots] = React.useState<TimeSlot>();

  const [multipleEvents, setMultipleEvents] = React.useState([]);

  const [showTransfer, setShowTransfer] = React.useState(false);

  const [showCreateModal, setShowCreateModal] = React.useState(false);

  const [showCreateTSModal, setShowCreateTSModal] = React.useState(false);

  const [showUpdateModal, setShowUpdateModal] = React.useState(false);

  const [showUpdateTSModal, setShowUpdateTSModal] = React.useState(false);

  const [trasnferFromProvider, setTransferFromProvider] = React.useState();

  const [eventCreateArgs, setEventCreateArgs] = React.useState();

  const [eventUpdateArgs, setEventUpdateArgs] = React.useState<any>({});

  const calendarRef: any = React.useRef(null);

  const menuRef = React.useRef(null);

  const [moveStart, setMoveStart] = React.useState(false);

  const PROVIDERS: any = calendarProviders;

  const [resources, setResources] = React.useState(PROVIDERS);

  const [reduxCurrentDate, setReduxCurrentDate] =
    React.useState<any>(calendarCurrentDate);

  const handleProviderOutside = (setInnerProvider: any) => {
    setInnerProvider(providerProducts);
  };

  React.useEffect(() => {
    setReduxCurrentDate(calendarCurrentDate);
  }, [calendarCurrentDate]);

  const evWrapper = (props?: any) => {
    let multipleEventSource = calendarRef?.current?.props?.multipleEventSource;
    const {
      token: { colorBgLayout, colorTextTertiary },
    } = theme.useToken();

    const [openMenu, setOpenMenu] = React.useState(false);
    const [innerProvider, setInnerProvider] = React.useState<any>();

    const [dragging, setDragging] = useState<boolean>(false);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [groupPosition, setGroupPosition] = React.useState({ x: 0, y: 0 });
    React.useEffect(() => handleProviderOutside(setInnerProvider));

    const { show, hideAll } = useContextMenu();

    function displayContextMenu(e: React.MouseEvent, id: any) {
      show({
        event: e,
        id: id,
      });
    }

    const itemsTS: MenuProps['items'] = [
      {
        label: 'Edit',
        onClick: (args: any) => {
          setOpenMenu(false);
          renderUpdateTSModal(props.event);
        },
        key: 1,
      },
      {
        label: 'Cancel',
        onClick: (args: any) => {
          hideAll();
          setOpenMenu(false);
          handleEventStatusChange(props.event, 'cancelled');
        },
        key: 2,
      },
      {
        label: 'Create Appointment',
        onClick: (args: any) => {
          setOpenMenu(false);
          renderCreateModal(props.event);
        },
        key: 4,
      },
    ];
    const itemsAP: MenuProps['items'] = [
      {
        label: 'Edit',
        onClick: (args: any) => {
          setOpenMenu(false);
          renderUpdateModal(props.event);
        },
        key: 1,
      },
      {
        label: 'Cancel',
        onClick: (args: any) => {
          hideAll();
          setOpenMenu(false);
          handleEventStatusChange(props.event, 'cancelled', innerProvider);
        },
        key: 2,
      },
      {
        label: 'Transfer',
        onClick: (args: any) => {
          setOpenMenu(false);
          renderTransferModal(props.event);
        },
        key: 4,
      },
      {
        label: 'Status',
        children: [
          {
            label: 'No Show',
            icon: React.createElement('span', {
              className: 'icon icon-noshow',
            }),
            key: 5,
            onClick: (args: any) => {
              setOpenMenu(false);
              handleEventStatusChange(props.event, 'noshow', innerProvider);
            },
          },
          {
            label: 'Arrived',
            icon: React.createElement('span', {
              className: 'icon icon-arrived',
            }),
            onClick: (args: any) => {
              setOpenMenu(false);
              handleEventStatusChange(props.event, 'arrived', innerProvider);
            },
            key: 6,
          },
          {
            label: 'In Exam',
            icon: React.createElement('span', {
              className: 'icon icon-inexam',
            }),
            onClick: (args: any) => {
              setOpenMenu(false);
              handleEventStatusChange(props.event, 'inexam', innerProvider);
            },
            key: 7,
          },
          {
            label: 'Checked Out',
            icon: React.createElement('span', {
              className: 'icon icon-completed',
            }),
            onClick: (args: any) => {
              setOpenMenu(false);
              handleEventStatusChange(props.event, 'completed', innerProvider);
            },
            key: 8,
          },
        ],
        key: 9,
      },
    ];
    const itemsCC: MenuProps['items'] = [
      {
        label: 'Delete',
        onClick: (args: any) => {
          setOpenMenu(false);
          handleEventDelete(props.event);
        },
        key: 1,
      },
    ];

    const items =
      props.event.status == 'cancelled'
        ? itemsCC
        : props.event.type == 'timeslot'
        ? itemsTS
        : itemsAP;
    let selectedClass: any = '';
    if (!!multipleEventSource && multipleEventSource.length) {
      multipleEventSource.map(function (evObj: any) {
        if (evObj.id === props.event.id) {
          selectedClass = ' ev-selected';
        }
      });
    }

    const handleMouseDown = (e: any) => {
      console.log('handleMouseDown');
      e.preventDefault();
      setDragging(true);
      setGroupPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: any) => {
      if (!dragging) return;

      const dx = e.clientX - groupPosition.x;
      const dy = e.clientY - groupPosition.y;

      setPosition({
        x: position.x + dx,
        y: position.y + dy,
      });

      setGroupPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      console.log('handleMouseUp');
      setDragging(true);
    };

    React.useEffect(() => {
      if (!!menuRef && !!menuRef.current) {
        menuRef.current.addEventListener('mousemove', handleMouseMove, true);
      }
    });

    const [singleClickTimer, setSingleClickTimer] = useState(null);

    const handleSingleClick = () => {
      console.log('handleDoubleClick!');
      if (props.event.status === 'available') {
        renderCreateModal(props.event);
      } else {
        renderUpdateModal(props.event);
      }
      // Implement the single-click functionality here
    };

    const handleDoubleClick = () => {
      console.log('handleSingleClick!');
      // Implement the double-click functionality here
    };

    const handleClick = () => {
      // If a single click has already occurred, handle it here
      if (singleClickTimer) {
        clearTimeout(singleClickTimer);
        setSingleClickTimer(null);
        handleSingleClick();
      } else {
        // Set a timer for double click
        setSingleClickTimer(
          setTimeout(() => {
            setSingleClickTimer(null);
            handleDoubleClick();
          }, 300),
        ); // Adjust this time based on your preference (milliseconds)
      }
    };

    return (
      <div
        ref={menuRef}
        onMouseDown={handleMouseDown}
        onMouseUp={() => handleMouseUp()}
        className={`ev-${props.event.status}${selectedClass} ${
          dragging === true && 'ev-component'
        }`}
        onContextMenu={(e) => {
          displayContextMenu(e, props.event.id);
        }}
        onClick={() => {
          handleClick();
        }}
      >
        {props.children}
        <Menu style={{ zIndex: '99999' }} id={props.event.id}>
          {items.map((menuItem: any) => {
            return (
              <>
                {!menuItem.children && (
                  <Item
                    key={menuItem.key}
                    onClick={menuItem.onClick}
                    data={{ action: menuItem.label.toLowerCase() }}
                  >
                    {menuItem.label}
                  </Item>
                )}
                {!!menuItem.children && (
                  <Submenu label={menuItem.label}>
                    {!!menuItem.children &&
                      menuItem.children.map((childMenu: any) => (
                        <Item
                          key={childMenu.key}
                          onClick={childMenu.onClick}
                          className={childMenu.className}
                        >
                          {childMenu.icon}
                          <span
                            style={{ marginLeft: '20px', marginTop: '3px' }}
                          >
                            {childMenu.label}
                          </span>
                        </Item>
                      ))}
                  </Submenu>
                )}
              </>
            );
          })}
        </Menu>
      </div>
    );
  };

  React.useEffect(() => {
    if (!!props.specializationFilter || !!props.providerFilter) {
      if (props.specializationFilter && props.providerFilter) {
        setResources(
          PROVIDERS.filter((provider: any) => {
            return (
              provider.speciality.toLowerCase() ==
                props.specializationFilter.toLowerCase() &&
              provider.resourceId == props.providerFilter
            );
          }),
        );
      }
      if (!props.specializationFilter && props.providerFilter) {
        setResources(
          PROVIDERS.filter((provider: any) => {
            return provider.resourceId == props.providerFilter;
          }),
        );
      }
      if (props.specializationFilter && !props.providerFilter) {
        setResources(
          PROVIDERS.filter((provider: any) => {
            return (
              provider.speciality.toLowerCase() ==
              props.specializationFilter.toLowerCase()
            );
          }),
        );
      }
    } else {
      setResources(PROVIDERS);
      setEvents(
        calendarEvents
          .filter((ev: any) =>
            PROVIDERS.find((rc: any) => {
              return rc.resourceId == ev.resourceId;
            }),
          )
          .map((ev: any) => ev),
      );
    }

    if (
      typeof timeSlots !== 'undefined' &&
      typeof timeSlots == 'object' &&
      timeSlots.hasOwnProperty('TimeSlot')
    ) {
      timeSlots.TimeSlot.forEach(function (ts: TimeSlotChild, index) {
        let event: Event = {
          id: ts.timeslotId,
          patientID: ts.Appointment[0].patient[0].PatientId.toString(),
          title:
            ts.Appointment[0].patient[0].FirstName.toString() +
            ts.Appointment[0].patient[0].LastName.toString(),
          start: dayjs(
            new Date(ts.appointmentDate + ' ' + ts.startTime),
          ).toDate(),
          end: dayjs(new Date(ts.appointmentDate + ' ' + ts.endtime)).toDate(),
          resourceId: ts.providerId.toString(),
        };
        let eventsLocal = [];
        eventsLocal.push(event);
        setEvents(eventsLocal);
      });
    }
  }, [timeSlots, multipleEvents, props]);

  React.useEffect(() => {
    setEvents(
      calendarEvents
        .filter((ev: any) =>
          resources.find((rc: any) => {
            return rc.resourceId == ev.resourceId;
          }),
        )
        .map((ev: any) => ev),
    );
  }, resources);

  const handleEventDelete = (args: any) => {
    let timeSlotsToDelete: any = [];
    let id = args.type == 'timeslot' ? args.id : args.appointmentID;
    timeSlotsToDelete.push(id.toString());
    let method =
      args.type == 'timeslot' ? 'DeleteTimeslots' : 'DeleteAppointments';
    callMyRemoteAction(timeSlotsToDelete, method).then((res) => {
      if (res.success) {
        if (args.type == 'timeslot') {
          setEvents((prev: any) => {
            return prev.filter((ev: any) => ev.id !== args.id);
          });
          dispatch(evPipline({ type: 'eventDeleted', data: { id: args.id } }));
        }
        if (args.type == 'appointment') {
          setEvents((prev: any) => {
            const existing = prev.find((ev: any) => ev.id === args.id) ?? {};
            const filtered = prev.filter((ev: any) => ev.id !== args.id);
            return [
              ...filtered,
              {
                ...existing,
                appointmentID: null,
                type: 'timeslot',
                title: 'Available',
                patientID: null,
                status: 'available',
                treatment: args.treatmentProducts,
              },
            ];
          });
          dispatch(
            evPipline({
              type: 'eventChanged',
              data: {
                id: args.id,
                appointmentID: null,
                type: 'timeslot',
                patientID: null,
                title: 'Available',
                status: 'available',
                treatment: args.treatmentProducts,
              },
            }),
          );
        }
        notify('Request ' + args.type + ' deleted successfully', 'success');
      }
    });
  };

  const handleTimeRangeSelection = (args: any) => {
    if (args.action == 'select')
      (calendarCurrentView == 'day' || calendarCurrentView == 'week') &&
        renderCreateTSModal(args);
  };

  const handleEventClicked = (args: any, ev: any) => {
    if (ev.ctrlKey || ev.metaKey || ev.shiftKey) {
      let event = args;
      let resource = event.resourceId;
      let eventID = event.id;
      if (!!multipleEvents && multipleEvents.length) {
        if (multipleEvents.some((event) => event.resourceID != resource)) {
          notify('Events from same providers can be selected');
          return false;
        } else if (multipleEvents.some((event) => event.id == eventID)) {
          setMultipleEvents(
            multipleEvents.filter(function (event) {
              return event.id !== eventID;
            }),
          );
        } else {
          setMultipleEvents([
            ...multipleEvents,
            {
              resourceID: resource,
              id: eventID,
              start: moment(event.start),
              end: moment(event.end),
              duration: moment(event.end).diff(event.start, 'minutes'),
            },
          ]);
        }
      } else {
        console.log('handleEventClicked Else==>');
        setMultipleEvents([
          ...multipleEvents,
          {
            resourceID: resource,
            id: eventID,
            start: moment(event.start),
            end: moment(event.end),
            duration: moment(event.end).diff(event.start, 'minutes'),
          },
        ]);
      }
    } else {
      if (calendarCurrentView == 'month') {
        dispatch(
          currentDate(
            moment(moment(args.start).format('YYYY-MM-DD')).toString(),
          ),
        );
        dispatch(currentView('day'));
      }
    }
  };

  const handleEventMove = (args: any) => {
    console.log('handleEventMove');
    let finalSlot: any;
    if (args.event.type == 'appointment') {
      let availableSlots = validateSlot(moment(args.start).toDate(), {
        resource: args.resourceId,
        id: args.event.id,
      });
      finalSlot =
        availableSlots &&
        availableSlots
          .filter((slot: any) => {
            return (
              moment(slot.start).isSameOrBefore(moment(args.start).toDate()) &&
              moment(slot.end).isSameOrAfter(moment(args.end).toDate())
            );
          })
          .map((slot: any) => slot);
      if (!finalSlot.length) {
        notify(
          'Sorry, there is no timeslot booked at the dragged position. Please book a timeslot first.',
          'error',
        );
        return;
      }
    }

    setMoveStart(false);
    let event = args.event;
    let start = args.start;
    let end = args.end;
    let resourceId = args.resourceId;
    let eventIds: any = [];

    console.log('start ===>', start);
    console.log('end ===>', end);

    if (
      resourceId == event.resourceId &&
      moment(start).isSame(moment(event.start)) &&
      moment(end).isSame(moment(event.end))
    ) {
      return false;
    }

    let eventID = event.id;
    let statusChangedAt = moment().toDate();
    let timeslot: TimeSlot = {
      TimeSlot: [],
    };

    if (!!multipleEvents && multipleEvents.length) {
      if (multipleEvents.some((event) => event.id == eventID)) {
        multipleEvents.forEach((event: any, i: any) => {
          console.log(i);
          let id = event.id;

          setEvents((prev: any) => {
            const existing = prev.find((ev: any) => ev.id === event.id) ?? {};
            const filtered = prev.filter((ev: any) => ev.id !== event.id);
            return [...filtered, { ...existing, resourceId: resourceId }];
          });

          let searchEvent = calendarEvents.find((ev: any) => ev.id == event.id);
          console.log('searchEvent  ===>', searchEvent);

          let startTime = moment(start)
            .add(i * 15, 'minutes')
            .toDate();
          let endTime = moment(end)
            .add(i * 15, 'minutes')
            .toDate();

          console.log('startTime ===>', startTime);
          console.log('endTime ===>', endTime);

          let station: Station = Object.assign({}, STATION);
          !!station ? (station.DMLOperationStation = null) : null;

          let timeslotchild: TimeSlotChild = {
            timeslotId: id,
            correlationIds: searchEvent.correlationID,
            TotalDuration: dayjs(searchEvent.end).diff(
              searchEvent.start,
              'minute',
            ),
            status: searchEvent.status,
            startTime:
              moment(startTime).format('HH:mm:ss.sss').toString() + 'Z',
            endtime: moment(endTime).format('HH:mm:ss.sss').toString() + 'Z',
            providerId: resourceId.toString(),
            deliveryChannel: searchEvent.deliveryChannel,
            appointmentDate: moment(searchEvent.start)
              .format('YYYY-MM-DD')
              .toString(),
            city: station?.city || '',
            recordType: 'Available',
            station: station,
            Appointment: [],
            timeSlotProducts: [],
            DMLOperationTimeSlot: 'Edit',
          };

          console.log('timeslotchild ===>', timeslotchild);

          searchEvent.treatment && Array.isArray(searchEvent.treatment)
            ? searchEvent.treatment.map((product: any) => {
                providerProducts.filter((treatment: any) => {
                  if (treatment.value == product) {
                    let tsProduct: TimeSlotProducts = {
                      productId: treatment.value.toString(),
                      Name: treatment.label.toString(),
                      ProductDuration: dayjs(event.end)
                        .diff(event.start, 'minute')
                        .toString(),
                      DMLOperationTimeslotProducts: 'Create',
                    };
                    timeslotchild.timeSlotProducts.push(tsProduct);
                  }
                });
              })
            : providerProducts.filter((treatment: any) => {
                if (treatment.value == searchEvent.treatment) {
                  let tsProduct: TimeSlotProducts = {
                    productId: treatment.value.toString(),
                    Name: treatment.label.toString(),
                    ProductDuration: dayjs(event.end)
                      .diff(event.start, 'minute')
                      .toString(),
                    DMLOperationTimeslotProducts: 'Create',
                  };
                  timeslotchild.timeSlotProducts.push(tsProduct);
                }
              });

          timeslot.TimeSlot.push(timeslotchild);
          eventIds.push({ eventId: id, finalResourceId: resourceId });
          console.log('eventIds ===>', eventIds);
          console.log('timeslot ====>', timeslot);
        });
        callMyRemoteAction(timeslot, 'EditTSandAppt');
        eventIds.forEach((timeslot: any) => {
          let id = timeslot.eventId;
          let resourceId = timeslot.finalResourceId;
          dispatch(
            evPipline({
              type: 'eventChanged',
              data: { id, resourceId, statusChangedAt },
            }),
          );
        });

        setMultipleEvents([]);
        notify(
          'Timeslots transferred to requested provider successfully.',
          'success',
        );
      }
    } else {
      console.log('Single Drag');
      // window.location.reload();
      if (args.event.type == 'timeslot') {
        let event = args.event;
        let start = moment(args.start).toDate();
        let end = moment(args.end).toDate();
        let resourceId = args.resourceId;

        let timeslot: TimeSlot = {
          TimeSlot: [],
        };

        let station: Station = Object.assign({}, STATION);
        !!station ? (station.DMLOperationStation = null) : null;

        let timeslotchild: TimeSlotChild = {
          timeslotId: event.id,
          correlationIds: event.correlationID || '',
          TotalDuration: dayjs(args.end).diff(args.start, 'minute'),
          status: event.status,
          startTime: moment(start).format('HH:mm:ss.sss').toString() + 'Z',
          endtime: moment(end).format('HH:mm:ss.sss').toString() + 'Z',
          providerId: resourceId.toString(),
          deliveryChannel: event.deliveryChannel,
          appointmentDate: moment(args.start).format('YYYY-MM-DD').toString(),
          city: station?.city || '',
          recordType: 'Available',
          station: station,
          Appointment: [],
          timeSlotProducts: [],
          DMLOperationTimeSlot: 'Edit',
        };

        Array.isArray(event.treatment)
          ? event.treatment.map((product: any) => {
              providerProducts.filter((treatment: any) => {
                if (treatment.value == product) {
                  let tsProduct: TimeSlotProducts = {
                    productId: treatment.value.toString(),
                    Name: treatment.label.toString(),
                    ProductDuration: dayjs(event.end)
                      .diff(event.start, 'minute')
                      .toString(),
                    DMLOperationTimeslotProducts: 'Create',
                  };
                  timeslotchild.timeSlotProducts.push(tsProduct);
                }
              });
            })
          : providerProducts.filter((treatment: any) => {
              if (treatment.value == event.treatment) {
                let tsProduct: TimeSlotProducts = {
                  productId: treatment.value.toString(),
                  Name: treatment.label.toString(),
                  ProductDuration: dayjs(event.end)
                    .diff(event.start, 'minute')
                    .toString(),
                  DMLOperationTimeslotProducts: 'Create',
                };
                timeslotchild.timeSlotProducts.push(tsProduct);
              }
            });

        timeslot.TimeSlot.push(timeslotchild);
        console.log('timeslot ===>', timeslot);

        setEvents((prev: any) => {
          const existing = prev.find((ev: any) => ev.id === event.id) ?? {};
          const filtered = prev.filter((ev: any) => ev.id !== event.id);
          return [
            ...filtered,
            { ...existing, resourceId: resourceId, start, end },
          ];
        });

        callMyRemoteAction(timeslot, 'EditTSandAppt').then((res) => {
          // console.log(res)
          if (res.success) {
            let data: any = JSON.parse(res.data);
            // console.log(data)
            Object.entries(data).map((result: any) => {
              let id = result[1] || event.id;

              dispatch(
                evPipline({
                  type: 'eventChanged',
                  data: { id, start, end, resourceId, statusChangedAt },
                }),
              );
              notify(
                'Timeslot transferred to requested provider successfully.',
                'success',
              );
            });
          }
        });
      }
      if (!!finalSlot && finalSlot.length) {
        let selectedEvent = calendarEvents.filter((event: any) => {
          return event.id == finalSlot[0].id;
        });
        let searchProds =
          selectedEvent[0].treatmentProducts &&
          selectedEvent[0].treatmentProducts.find((prod: any) => {
            return prod == event.treatment;
          });
        if (!searchProds || typeof searchProds == 'undefined') {
          notify(
            'Treatment not available in the selected timeslot. Please select a different timeslot.',
            'error',
          );
          return false;
        }
        // console.log(selectedEvent);return;
        let updatedEvent;
        let id = event.id;
        let resourceId = selectedEvent[0].resourceId;
        let location = event.location;
        let patientID = event.patientID;
        let treatment = event.treatment;
        let status = event.status;
        let type = event.type;
        let reasonToVisit = event.visitReason;
        let deliveryChannel = event.deliveryChannel;
        let start = moment(selectedEvent[0].start).toDate();
        let end = moment(selectedEvent[0].start)
          .add(moment(event.end).diff(event.start, 'minutes'), 'minutes')
          .toDate();
        let title = calendarPatients
          .filter((patient: any) => {
            return patient.PatientId.toString() == event.patientID.toString();
          })
          .map((patient: any) => {
            return `${patient.FirstName} ${patient.LastName || ''}`.trim();
          });
        let statusChangedAt = dayjs();
        let timeslot: TimeSlot = {
          TimeSlot: [],
        };
        updatedEvent = [
          ...selectedEvent,
          { start: end, end: selectedEvent[0].end },
        ];

        let patientObj: any = calendarPatients
          .filter((patient: any) => patient.PatientId == patientID)
          .map((patient: any) => {
            return patient;
          });
        let station: Station = Object.assign({}, STATION);
        !!station ? (station.DMLOperationStation = null) : null;
        let appointment: any = [];
        let app: Appointment = {
          status: 'Booked',
          timeslotId: args.id,
          correlationId: event.correlationID || '',
          providerId: resourceId,
          product: treatment.isArray ? treatment[0] : treatment,
          description: reasonToVisit,
          patient: patientObj,
          appointmentId: event.appointmentID || '',
          conferencePhoneNumber: null,
          conferenceLink: null,
          conferenceId: null,
          DMLOperationAppointment: 'Edit',
        };

        appointment.push(app);

        let timeslotchild: TimeSlotChild = {
          timeslotId: selectedEvent[0].id,
          correlationIds: selectedEvent[0].correlationID || '',
          TotalDuration: dayjs(selectedEvent[0].end).diff(
            selectedEvent[0].start,
            'minute',
          ),
          status: selectedEvent[0].status,
          startTime:
            moment(selectedEvent[0].start).format('HH:mm:ss.sss').toString() +
            'Z',
          endtime:
            moment(selectedEvent[0].end).format('HH:mm:ss.sss').toString() +
            'Z',
          providerId: resourceId.toString(),
          deliveryChannel: deliveryChannel,
          appointmentDate: moment(selectedEvent[0].start)
            .format('YYYY-MM-DD')
            .toString(),
          city: station?.city || '',
          recordType: 'Available',
          station: station,
          Appointment: appointment,
          timeSlotProducts: [],
          DMLOperationTimeSlot: 'Edit',
        };

        selectedEvent[0].treatment.isArray &&
          selectedEvent[0].treatment.map((product: any) => {
            providerProducts.filter((treatment: any) => {
              // console.log(treatment,product)
              if (treatment.value == product) {
                let tsProduct: TimeSlotProducts = {
                  productId: treatment.value.toString(),
                  Name: treatment.label.toString(),
                  ProductDuration: dayjs(event.end)
                    .diff(event.start, 'minute')
                    .toString(),
                  DMLOperationTimeslotProducts: 'Create',
                };
                timeslotchild.timeSlotProducts.push(tsProduct);
              }
            });
          });

        timeslot.TimeSlot.push(timeslotchild);

        setEvents((prev: any) => {
          const existing =
            prev.find((ev: any) => ev.id === selectedEvent[0].id) ?? {};
          const filtered = prev.filter(
            (ev: any) => ev.id !== selectedEvent[0].id,
          );
          return [
            ...filtered,
            {
              ...existing,
              start: selectedEvent[0].start,
              end: selectedEvent[0].end,
              location,
              patientID,
              treatment,
              status,
              type,
              reasonToVisit,
              deliveryChannel,
              title,
              resourceId,
              appointmentID: event.appointmentID,
            },
          ];
        });
        setEvents((prev: any) => {
          const existing = prev.find((ev: any) => ev.id === id) ?? {};
          const filtered = prev.filter((ev: any) => ev.id !== id);
          return [
            ...filtered,
            {
              ...existing,
              start: moment(event.start).toDate(),
              end: moment(event.end).toDate(),
              location,
              status: 'available',
              type: 'timeslot',
              reasonToVisit: null,
              title: 'Available',
              resourceId: event.resourceId,
              statusChangedAt,
              treatment: event.treatmentProducts,
              deliveryChannel,
              appointmentID: '',
            },
          ];
        });

        callMyRemoteAction(timeslot, 'EditTSandAppt').then((res) => {
          if (res.success) {
            let data: any = JSON.parse(res.data);
            Object.entries(data).map((result: any) => {
              let id = result[1][0];

              dispatch(
                evPipline({
                  type: 'eventChanged',
                  data: {
                    id: selectedEvent[0].id,
                    start: selectedEvent[0].start,
                    end: selectedEvent[0].end,
                    location,
                    patientID,
                    treatment,
                    status,
                    type,
                    reasonToVisit,
                    deliveryChannel,
                    title,
                    resourceId,
                    correlationID: result[0],
                    appointmentID: id,
                    statusChangedAt,
                  },
                }),
              );
              dispatch(
                evPipline({
                  type: 'eventChanged',
                  data: {
                    id: event.id,
                    start: moment(event.start).toDate(),
                    end: moment(event.end).toDate(),
                    location,
                    status: 'available',
                    type: 'timeslot',
                    reasonToVisit: null,
                    title: 'Available',
                    resourceId: event.resourceId,
                    statusChangedAt,
                    treatment: event.treatmentProducts,
                    appointmentID: '',
                    deliveryChannel,
                  },
                }),
              );
            });
          }
        });
      }
    }
  };

  const handleEventMoving = (ev: any) => {
    setMoveStart(true);
  };

  const handleEventDragOver = (ev: any) => {
    console.log('handleEventDragOver ==>', ev);
  };

  const handleEventResize = (args: any) => {
    if (args.event.type == 'appointment') {
      notify('Appointments cannot be extended.', 'error');
      return false;
    }
    let event = args.event;
    let start = moment(args.start);
    let end = moment(args.end);
    let duration = end.diff(start, 'minutes');
    let eventDuration = moment(event.end).diff(moment(event.start), 'minutes');
    if (eventDuration == duration || duration < systemConfig.minimumDuration) {
      return false;
    }
    setEvents((prev: any) => {
      const existing = prev.find((ev: any) => ev.id === args.event.id) ?? {};
      const filtered = prev.filter((ev: any) => ev.id !== args.event.id);
      return [
        ...filtered,
        {
          ...existing,
          start: moment(args.start).toDate(),
          end: moment(args.end).toDate(),
        },
      ];
    });

    let station: Station = Object.assign({}, STATION);
    !!station ? (station.DMLOperationStation = null) : null;
    let timeslot: TimeSlot = {
      TimeSlot: [],
    };
    let timeslotchild: TimeSlotChild = {
      timeslotId: event.id,
      correlationIds: event.correlationID,
      TotalDuration: dayjs(args.end).diff(args.start, 'minute'),
      status: event.status,
      startTime: moment(args.start).format('HH:mm:ss.sss').toString() + 'Z',
      endtime: moment(args.end).format('HH:mm:ss.sss').toString() + 'Z',
      providerId: event.resourceId.toString(),
      deliveryChannel: event.deliveryChannel,
      appointmentDate: moment(args.start).format('YYYY-MM-DD').toString(),
      city: station?.city || '',
      recordType: 'Available',
      station: station,
      Appointment: [],
      timeSlotProducts: [],
      DMLOperationTimeSlot: 'Edit',
    };
    event.treatment && Array.isArray(event.treatment)
      ? event.treatment.map((product: any) => {
          providerProducts.filter((treatment: any) => {
            if (treatment.value == product) {
              let tsProduct: TimeSlotProducts = {
                productId: treatment.value.toString(),
                Name: treatment.label.toString(),
                ProductDuration: dayjs(args.end)
                  .diff(args.start, 'minute')
                  .toString(),
                DMLOperationTimeslotProducts: 'Create',
              };
              timeslotchild.timeSlotProducts.push(tsProduct);
            }
          });
        })
      : providerProducts.filter((treatment: any) => {
          if (treatment.value == event.treatment) {
            let tsProduct: TimeSlotProducts = {
              productId: treatment.value.toString(),
              Name: treatment.label.toString(),
              ProductDuration: dayjs(args.end)
                .diff(args.start, 'minute')
                .toString(),
              DMLOperationTimeslotProducts: 'Create',
            };
            timeslotchild.timeSlotProducts.push(tsProduct);
          }
        });

    timeslot.TimeSlot.push(timeslotchild);

    let postToApex: any = callMyRemoteAction(timeslot, 'EditTSandAppt');
    if (postToApex.success) {
    }

    dispatch(
      evPipline({
        type: 'eventChanged',
        data: {
          id: args.event.id,
          start: moment(args.start).toDate(),
          end: moment(args.end).toDate(),
          duration: dayjs(args.end).diff(args.start, 'minute'),
        },
      }),
    );
  };

  const processTransferRequest = (provider: any) => {
    if (!!multipleEvents && multipleEvents.length) {
      setMultipleEvents([]);
      notify(
        'Appointments transferred to requested provider successfully.',
        'success',
      );
    }
  };

  const processUpdateRequest = (event: any, data: any) => {
    let selectedEvent = calendarEvents.filter((event: any) => {
      return event.id == selectedTSforAPT;
    });
    let id = event.id;
    let resourceId = data.resource;
    let location = event.location;
    let patientID = event.patientID;
    let treatment = event.treatment;
    let status = event.status;
    let type = event.type;
    let reasonToVisit = event.visitReason;
    let deliveryChannel = event.deliveryChannel;
    let start = moment(selectedEvent[0].start).toDate();
    let end = moment(selectedEvent[0].end).toDate();
    let title = calendarPatients
      .filter((patient: any) => {
        return patient.PatientId.toString() == event.patientID.toString();
      })
      .map((patient: any) => {
        return `${patient.FirstName} ${patient.LastName || ''}`.trim();
      });
    let statusChangedAt = dayjs();
    let timeslot: TimeSlot = {
      TimeSlot: [],
    };
    setEvents((prev: any) => {
      const existing = prev.find((ev: any) => ev.id === event.id) ?? {};
      const filtered = prev.filter((ev: any) => ev.id !== event.id);
      return [
        ...filtered,
        {
          ...existing,
          start,
          end,
          location,
          patientID,
          treatment,
          status,
          type,
          reasonToVisit,
          deliveryChannel,
          title,
          resourceId,
          statusChangedAt,
        },
      ];
    });

    let patientObj: any = calendarPatients
      .filter((patient: any) => patient.PatientId == patientID)
      .map((patient: any) => {
        return patient;
      });
    let station: Station = Object.assign({}, STATION);
    !!station ? (station.DMLOperationStation = null) : null;
    let appointment: any = [];
    let app: Appointment = {
      status: 'Booked',
      timeslotId: data.id,
      correlationId: event.correlationID || '',
      providerId: resourceId,
      product: treatment.isArray ? treatment[0] : treatment,
      description: reasonToVisit,
      patient: patientObj,
      appointmentId: event.appointmentID || '',
      conferencePhoneNumber: null,
      conferenceLink: null,
      conferenceId: null,
      DMLOperationAppointment: 'Edit',
    };

    appointment.push(app);

    let timeslotchild: TimeSlotChild = {
      timeslotId: selectedEvent[0].id,
      correlationIds: selectedEvent[0].correlationID || '',
      TotalDuration: dayjs(selectedEvent[0].end).diff(
        selectedEvent[0].start,
        'minute',
      ),
      status: selectedEvent[0].status,
      startTime:
        moment(selectedEvent[0].start).format('HH:mm:ss.sss').toString() + 'Z',
      endtime:
        moment(selectedEvent[0].end).format('HH:mm:ss.sss').toString() + 'Z',
      providerId: resourceId.toString(),
      deliveryChannel: deliveryChannel,
      appointmentDate: moment(selectedEvent[0].start)
        .format('YYYY-MM-DD')
        .toString(),
      city: station?.city || '',
      recordType: 'Available',
      station: station,
      Appointment: appointment,
      timeSlotProducts: [],
      DMLOperationTimeSlot: 'Edit',
    };

    selectedEvent[0].treatment.isArray &&
      selectedEvent[0].treatment.map((product: any) => {
        providerProducts.filter((treatment: any) => {
          if (treatment.value == product) {
            let tsProduct: TimeSlotProducts = {
              productId: treatment.value.toString(),
              Name: treatment.label.toString(),
              ProductDuration: dayjs(event.end)
                .diff(event.start, 'minute')
                .toString(),
              DMLOperationTimeslotProducts: 'Create',
            };
            timeslotchild.timeSlotProducts.push(tsProduct);
          }
        });
      });

    timeslot.TimeSlot.push(timeslotchild);
    dispatch(
      evPipline({
        type: 'eventChanged',
        data: {
          id: selectedEvent[0].id,
          start,
          end,
          location,
          patientID,
          treatment,
          status,
          type,
          reasonToVisit,
          deliveryChannel,
          title,
          resourceId,
          statusChangedAt,
        },
      }),
    );
    dispatch(
      evPipline({
        type: 'eventChanged',
        data: {
          id,
          start: moment(event.start).toDate(),
          end: moment(event.end).toDate,
          location,
          type: 'timeslot',
          reasonToVisit: null,
          title: 'Available',
          resourceId,
          statusChangedAt,
        },
      }),
    );

    callMyRemoteAction(timeslot, 'EditTSandAppt');

    notify('Requested appointment updated successfully', 'success');
  };

  const processUpdateTSRequest = (event: any, data: any) => {
    let resourceId = event.resourceId;
    let treatment = data.treatment;
    let deliveryChannel = data.deliveryChannel;
    let start = new Date(
      dayjs(data.start).format('YYYY-MM-DDTHH:mm:ss.sss') + 'Z',
    );
    let end = new Date(dayjs(data.end).format('YYYY-MM-DDTHH:mm:ss.sss') + 'Z');
    let id = event.id;
    let statusChangedAt = moment();
    setEvents((prev: any) => {
      const existing = prev.find((ev: any) => ev.id === event.id) ?? {};
      const filtered = prev.filter((ev: any) => ev.id !== event.id);
      return [
        ...filtered,
        {
          ...existing,
          start,
          end,
          treatment: treatment,
          deliveryChannel,
          resourceId,
        },
      ];
    });
    let station: Station = Object.assign({}, STATION);
    !!station ? (station.DMLOperationStation = null) : null;
    let timeslot: TimeSlot = {
      TimeSlot: [],
    };
    let timeslotchild: TimeSlotChild = {
      timeslotId: data.id,
      correlationIds: event.correlationIds,
      TotalDuration: dayjs(data.end).diff(data.start, 'minute'),
      status: event.status,
      startTime: moment(event.start).format('HH:mm:ss.sss').toString() + 'Z',
      endtime: moment(event.end).format('HH:mm:ss.sss').toString() + 'Z',
      providerId: event.resourceId.toString(),
      deliveryChannel: deliveryChannel,
      appointmentDate: moment(event.start).format('YYYY-MM-DD').toString(),
      city: station?.city || '',
      recordType: 'Available',
      station: station,
      Appointment: [],
      timeSlotProducts: [],
      DMLOperationTimeSlot: 'Edit',
    };
    data.treatment.map((product: any) => {
      providerProducts.filter((treatment: any) => {
        if (treatment.value == product) {
          let tsProduct: TimeSlotProducts = {
            productId: treatment.value.toString(),
            Name: treatment.label.toString(),
            ProductDuration: dayjs(data.end)
              .diff(data.start, 'minute')
              .toString(),
            DMLOperationTimeslotProducts: 'Create',
          };
          timeslotchild.timeSlotProducts.push(tsProduct);
        }
      });
    });

    timeslot.TimeSlot.push(timeslotchild);

    callMyRemoteAction(timeslot, 'EditTSandAppt');
    dispatch(
      evPipline({
        type: 'eventChanged',
        data: { id, start, end, treatment, resourceId, statusChangedAt },
      }),
    );
    notify('Requested timeslot updated successfully', 'success');
  };

  const processCreateTSRequest = (data: any, result: any) => {
    let evCollection: any = [];
    let timeslot: TimeSlot = {
      TimeSlot: [],
    };
    let timeslotsObj: TimeSlots = {
      Timeslots: timeslot,
    };

    data.slots.pop();
    data.slots.map(function (i: any, v: any) {
      let correlationID = uuidv4();
      let evPayload = {
        id: helpers.guid(),
        correlationID: correlationID,
        start: new Date(dayjs(i).format('YYYY-MM-DDTHH:mm:ss.sss')),
        end: new Date(
          dayjs(dayjs(i).add(systemConfig.minimumDuration, 'minute')).format(
            'YYYY-MM-DDTHH:mm:ss.sss',
          ),
        ),
        title: 'Available',
        status: 'available',
        type: 'timeslot',
        resourceId: data.resourceId,
        treatment: result.treatment,
        deliveryChannel: result.deliveryChannel,
      };
      evCollection.push(evPayload);
      setEvents((prev: any) => [...prev, evPayload]);

      let station: Station = Object.assign({}, STATION);
      !!station ? (station.DMLOperationStation = null) : null;
      let timeslotchild: TimeSlotChild = {
        timeslotId: null,
        correlationIds: correlationID,
        TotalDuration: moment(
          moment(i).add(systemConfig.minimumDuration, 'minute'),
        ).diff(i, 'minute'),
        status: 'Booked',
        startTime: moment(i).format('HH:mm:ss.SSS').toString() + 'Z',
        endtime:
          moment(i)
            .add(systemConfig.minimumDuration, 'minute')
            .format('HH:mm:ss.SSS')
            .toString() + 'Z',
        providerId: data.resourceId.toString(),
        deliveryChannel: result.deliveryChannel,
        appointmentDate: moment(i).format('YYYY-MM-DD').toString(),
        city: station.city,
        recordType: 'Available',
        station: station,
        Appointment: [],
        timeSlotProducts: [],
        DMLOperationTimeSlot: 'Create',
      };

      let providerProd = calendarProviderProducts
        .filter((treatment: any) => {
          return treatment.providerId == data.resourceId;
        })
        .map((treatment: any) => {
          return treatment.product;
        });
      !!providerProd[0] &&
        providerProd[0].filter((pprod: any) => {
          result.treatment.map((product: any) => {
            if (pprod.productID == product) {
              let tsProduct: TimeSlotProducts = {
                productId: pprod.productID.toString(),
                Name: pprod.productName.toString(),
                ProductDuration: moment(
                  moment(i).add(systemConfig.minimumDuration, 'minute'),
                )
                  .diff(i, 'minute')
                  .toString(),
                DMLOperationTimeslotProducts: 'Create',
              };
              timeslotchild.timeSlotProducts.push(tsProduct);
            }
          });
        });

      timeslot.TimeSlot.push(timeslotchild);
      if (process.env.REACT_APP_SALESFORCE_CONNECT == 'false')
        dispatch(evPipline({ type: 'eventAdded', data: evPayload }));
    });

    timeslotsObj.Timeslots = timeslot;

    callMyRemoteAction(timeslot, 'CreateTimeslot').then((res) => {
      if (res.success) {
        let data: any = JSON.parse(res.data);

        Object.entries(data).map((result: any) => {
          let id = result[1];
          setEvents((prev: any) => {
            const existing =
              prev.find((ev: any) => ev.correlationID === result[0]) ?? {};
            const filtered = prev.filter(
              (ev: any) => ev.correlationID !== result[0],
            );
            return [...filtered, { ...existing, id }];
          });

          let newEv = evCollection
            .filter((ev: any) => {
              return ev.correlationID == result[0];
            })
            .map((ev: any) => {
              return { ...ev, id: result[1] };
            });

          dispatch(evPipline({ type: 'eventAdded', data: newEv[0] }));
        });
      }
    });

    notify('Requested timeslot(s) created successfully', 'success');
  };

  const processCreateRequest = (event: any, data: any) => {
    let id = event.id;
    let resourceId = data.resource;
    let location = data.location;
    let patientID = data.patient;
    let treatment = data.treatment;
    let status = 'booked';
    let type = 'appointment';
    let reasonToVisit = data.visitReason;
    let deliveryChannel = data.deliveryChannel;
    let start = moment(event.start).toDate();
    let end = moment(event.end).toDate();
    let title = calendarPatients
      .filter((patient: any) => {
        return patient.PatientId.toString() == data.patient.toString();
      })
      .map((patient: any) => {
        return `${patient.FirstName} ${patient.LastName || ''}`.trim();
      });
    let statusChangedAt = dayjs();
    let currentType = event.type;

    let appointmentObj: Appointments = {
      Appointment: [],
    };

    let patientObj: any = calendarPatients
      .filter((patient: any) => patient.PatientId == patientID)
      .map((patient: any) => {
        return patient;
      });
    let station: Station = Object.assign({}, STATION);
    !!station ? (station.DMLOperationStation = null) : null;
    let appointment: any = [];
    let app: Appointment = {
      status: 'Booked',
      timeslotId: data.id,
      correlationId: event.correlationID,
      providerId: resourceId,
      product: treatment.isArray ? treatment[0] : treatment,
      description: reasonToVisit,
      patient: patientObj,
      AppointmentStartTime:
        moment(event.start).format('HH:mm:ss.SSS').toString() + 'Z',
      AppointmentEndTime:
        moment(event.end).format('HH:mm:ss.SSS').toString() + 'Z',
      appointmentId: null,
      conferencePhoneNumber: null,
      conferenceLink: null,
      conferenceId: null,
    };

    if (currentType == 'timeslot') {
      app.DMLOperationAppointment = 'Create';
    }
    appointment = app;

    appointmentObj.Appointment.push(appointment);

    setEvents((prev: any) => {
      const existing = prev.find((ev: any) => ev.id === event.id) ?? {};
      const filtered = prev.filter((ev: any) => ev.id !== event.id);
      return [
        ...filtered,
        {
          ...existing,
          start,
          end,
          location,
          patientID,
          treatment,
          status,
          type,
          reasonToVisit,
          deliveryChannel,
          title,
          resourceId,
          statusChangedAt,
        },
      ];
    });
    callMyRemoteAction(appointmentObj, 'CreateAppt').then((res: any) => {
      if (res.success) {
        notify('Requested appointment updated successfully', 'success');
        let data: any = JSON.parse(res.data);

        Object.entries(data).map((result: any) => {
          let appointmentID = result[1];
          setEvents((prev: any) => {
            const existing = prev.find((ev: any) => ev.id === event.id) ?? {};
            const filtered = prev.filter((ev: any) => ev.id !== event.id);
            return [
              ...filtered,
              {
                ...existing,
                start,
                end,
                location,
                patientID,
                treatment,
                status,
                type,
                reasonToVisit,
                deliveryChannel,
                title,
                resourceId,
                appointmentID,
                statusChangedAt,
              },
            ];
          });
          dispatch(
            evPipline({
              type: 'eventChanged',
              data: {
                id,
                start,
                end,
                location,
                patientID,
                treatment,
                status,
                type,
                reasonToVisit,
                deliveryChannel,
                title,
                resourceId,
                appointmentID,
                statusChangedAt,
              },
            }),
          );
        });
      }
    });
  };

  const renderTransferModal = (args: any) => {
    if (!multipleEvents.length) {
      notify(
        'You can use drag and drop feature for transfering single entities.',
        'default',
      );
      return false;
    }
    let eventData = args.source.data;

    const form: any = [
      {
        type: 'title',
        name: 'Transfer Appointment',
      },
      {
        type: 'html',
        html:
          'Transferring From: ' +
          PROVIDERS.filter(
            (provider: any) => provider.resourceId == eventData.resource,
          ).map((provider: any) => provider.name),
      },
      {
        type: 'searchable',
        id: 'transferTo',
        name: 'Transfer To',
        options: PROVIDERS.filter((provider: any) => {
          return provider.resourceId !== eventData.resource
            ? { name: provider.name, id: provider.resourceId }
            : null;
        }),
      },
    ];
    const data = {};

    Modal.form(form, data).then((modal) => {
      if (modal.canceled) {
        setMultipleEvents([]);
      }
      if (modal.result)
        [processTransferRequest({ providerID: modal.result.transferTo })];
    });
  };

  const renderUpdateTSModal = (args: any) => {
    args = {
      ...args,
      start: moment(args.start)
        .tz('America/Toronto')
        .format('YYYY-MM-DD HH:mm:ss'),
      end: moment(args.end).tz('America/Toronto').format('YYYY-MM-DD HH:mm:ss'),
    };
    setEventUpdateArgs(args);
    setShowUpdateTSModal(true);
  };

  const renderUpdateModal = (args: any) => {
    args = {
      ...args,
      start: moment(args.start)
        .tz('America/Toronto')
        .format('YYYY-MM-DD HH:mm:ss'),
      end: moment(args.end).tz('America/Toronto').format('YYYY-MM-DD HH:mm:ss'),
    };
    setEventUpdateArgs(args);
    setShowUpdateModal(true);
  };

  const renderCreateTSModal = (args: any) => {
    args = {
      ...args,
      start: moment(args.start)
        .tz('America/Toronto')
        .format('YYYY-MM-DD HH:mm:ss'),
      end: moment(args.end).tz('America/Toronto').format('YYYY-MM-DD HH:mm:ss'),
    };
    setEventCreateArgs(args);
    setShowCreateTSModal(true);
  };

  const renderCreateModal = (args: any) => {
    args = {
      ...args,
      start: moment(args.start)
        .tz('America/Toronto')
        .format('YYYY-MM-DD HH:mm:ss'),
      end: moment(args.end).tz('America/Toronto').format('YYYY-MM-DD HH:mm:ss'),
    };
    setEventCreateArgs(args);
    setShowCreateModal(true);
  };

  const handleTransferModal = () => {
    setShowTransfer(!showTransfer);
  };

  const handleCreateModal = () => {
    setShowCreateModal(!showCreateModal);
  };

  const handleCreateTSModal = () => {
    setShowCreateTSModal(!showCreateTSModal);
  };

  const handleUpdateModal = () => {
    setShowUpdateModal(!showUpdateModal);
  };

  const handleUpdateTSModal = () => {
    setShowUpdateTSModal(!showUpdateTSModal);
  };

  const handleEventUpdate = () => {};

  const handleEventStatusChange = (
    args: any,
    status: string,
    moreProps?: any,
  ) => {
    let providerProducts =
      calendarRef?.current?.props?.extraProps?.providerProducts;
    let calendarPatients =
      calendarRef?.current?.props?.extraProps?.calendarPatients;

    let id = args.id;
    let resourceId = args.resourceId;
    let location = args.location;
    let patientID = args.patientID;
    let treatment = args.treatment;
    let type = args.type;
    let reasonToVisit = args.visitReason;
    let deliveryChannel = args.deliveryChannel;
    let start = moment(args.start).toDate();
    let end = moment(args.end).toDate();
    let title =
      args.type == 'appointment'
        ? calendarPatients
            .filter((patient: any) => {
              return patient.PatientId.toString() == args.patientID.toString();
            })
            .map((patient: any) => {
              return `${patient.FirstName} ${patient.LastName || ''}`.trim();
            })
        : 'Available';
    let statusChangedAt = dayjs();
    let timeslot: TimeSlot = {
      TimeSlot: [],
    };
    setEvents((prev: any) => {
      const existing = prev.find((ev: any) => ev.id === args.id) ?? {};
      const filtered = prev.filter((ev: any) => ev.id !== args.id);
      return [
        ...filtered,
        {
          ...existing,
          start,
          end,
          location,
          patientID,
          treatment,
          status,
          type,
          reasonToVisit,
          deliveryChannel,
          title,
          resourceId,
          statusChangedAt,
        },
      ];
    });
    let appointment: any = [];
    if (args.type == 'appointment') {
      let patientObj: any = calendarPatients
        .filter((patient: any) => patient.PatientId == patientID)
        .map((patient: any) => {
          return patient;
        });

      let app: Appointment = {
        status: 'Booked',
        timeslotId: args.id,
        correlationId: args.correlationID || '',
        providerId: resourceId,
        product: treatment.isArray ? treatment[0] : treatment,
        description: reasonToVisit,
        patient: patientObj,
        appointmentId: args.appointmentID || '',
        conferencePhoneNumber: null,
        conferenceLink: null,
        conferenceId: null,
        DMLOperationAppointment: 'Edit',
      };

      appointment.push(app);
    }
    let station: Station = Object.assign({}, STATION);
    !!station ? (station.DMLOperationStation = null) : null;

    let timeslotchild: TimeSlotChild = {
      timeslotId: args.id,
      correlationIds: args.correlationID || '',
      TotalDuration: dayjs(args.end).diff(args.start, 'minute'),
      status: status,
      startTime: moment(args.start).format('HH:mm:ss.sss').toString() + 'Z',
      endtime: moment(args.end).format('HH:mm:ss.sss').toString() + 'Z',
      providerId: resourceId.toString(),
      deliveryChannel: deliveryChannel,
      appointmentDate: moment(args.start).format('YYYY-MM-DD').toString(),
      city: station?.city || '',
      recordType: 'Available',
      station: station,
      Appointment: appointment,
      timeSlotProducts: [],
      DMLOperationTimeSlot: 'Edit',
    };

    args.treatment && Array.isArray(args.treatment)
      ? args.treatment.map((product: any) => {
          providerProducts.filter((treatment: any) => {
            if (treatment.value == product) {
              let tsProduct: TimeSlotProducts = {
                productId: treatment.value.toString(),
                Name: treatment.label.toString(),
                ProductDuration: dayjs(args.end)
                  .diff(args.start, 'minute')
                  .toString(),
                DMLOperationTimeslotProducts: 'Create',
              };
              timeslotchild.timeSlotProducts.push(tsProduct);
            }
          });
        })
      : providerProducts.filter((treatment: any) => {
          if (treatment.value == args.treatment) {
            let tsProduct: TimeSlotProducts = {
              productId: treatment.value.toString(),
              Name: treatment.label.toString(),
              ProductDuration: dayjs(args.end)
                .diff(args.start, 'minute')
                .toString(),
              DMLOperationTimeslotProducts: 'Create',
            };
            timeslotchild.timeSlotProducts.push(tsProduct);
          }
        });

    timeslot.TimeSlot.push(timeslotchild);

    callMyRemoteAction(timeslot, 'EditTSandAppt').then((res) => {
      if (res.success) {
        dispatch(
          evPipline({
            type: 'statusChanged',
            data: { id, status, statusChangedAt },
          }),
        );
        notify(
          'Status changed for requested appointment successfully',
          'success',
        );
        let data: any = JSON.parse(res.data);

        Object.entries(data).map((result: any) => {
          let id = result[1];
        });
      }
    });
  };

  const CustomToolbar = (toolbar: any) => {
    let currentDate =
      calendarRef?.current?.props?.extraProps?.currentDate || toolbar.date;

    let viewTrans: any = [];
    viewTrans['day'] = 'Daily';
    viewTrans['week'] = 'Weekly';
    viewTrans['month'] = 'Monthly';

    const [innerCurrentView, setInnerCurrentView] = React.useState<any>(
      !!calendarCurrentView ? viewTrans[calendarCurrentView] : 'Daily',
    );

    React.useEffect(() => {
      goToSelected(currentDate);
    }, [currentDate]);

    const goToBack = () => {
      toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
      toolbar.onNavigate('NEXT');
    };

    const goToCurrent = () => {
      toolbar.onNavigate('TODAY');
    };

    const goToSelected = (selectedDate: any) => {
      selectedDate = moment(selectedDate).toDate();
      toolbar.date.setMonth(selectedDate.getMonth());
      toolbar.date.setYear(selectedDate.getFullYear());
      toolbar.date.setDate(selectedDate.getDate());
      toolbar.onNavigate('DATE');
    };

    const label = () => {
      const date = dayjs(toolbar.date);
      return (
        <span>
          <b>{date.format('dddd, DD MMMM')}</b>
          <span> {date.format('YYYY')}</span>
        </span>
      );
    };

    const items: MenuProps['items'] = [
      {
        label: 'Daily',
        key: 'daily',
        className: innerCurrentView == 'Daily' ? 'active' : '',
        onClick: () => {
          dispatch(currentView('day'));
          setInnerCurrentView('Daily');
          toolbar.onView('day');
        },
      },
      {
        label: 'Monthly',
        key: 'monthly',
        className: innerCurrentView == 'Monthly' ? 'active' : '',
        onClick: () => {
          dispatch(currentView('month'));
          setInnerCurrentView('Monthly');
          toolbar.onView('month');
        },
      },
      {
        label: 'Weekly',
        key: 'weekly',
        className: innerCurrentView == 'Weekly' ? 'active' : '',
        onClick: () => {
          dispatch(currentView('week'));
          setInnerCurrentView('Weekly');
          toolbar.onView('week');
        },
      },
    ];

    return (
      <>
        <Row gutter={[24, 24]} style={{ padding: 24 }}>
          <Col span={4}>
            <Button
              style={{ borderWidth: 1, borderColor: '#00286b' }}
              onClick={goToCurrent}
            >
              Today
            </Button>
          </Col>

          <Col span={4}>
            <Button
              type='primary'
              icon={<CaretLeftOutlined />}
              size={'middle'}
              onClick={goToBack}
            >
              Previous
            </Button>
          </Col>
          <Col span={8} style={{ textAlign: 'center' }}>
            <div style={{ padding: '5px' }}>
              <Text>{label()}</Text>
            </div>
          </Col>
          <Col span={3}>
            <Button
              type='primary'
              icon={<CaretRightOutlined />}
              size={'middle'}
              onClick={goToNext}
            >
              Next
            </Button>
          </Col>
          <Col span={3} offset={1}>
            <Dropdown menu={{ items }}>
              <Button style={{ borderWidth: 1, borderColor: '#00286b' }}>
                <Space>
                  {innerCurrentView}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </Col>
        </Row>
      </>
    );
  };

  const callMyRemoteAction = (event: any, method?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      const eventString = JSON.stringify(event);
      if (process.env.REACT_APP_SALESFORCE_CONNECT == 'true') {
        VisualForceRemotingManager.invoke(
          'schedulingAppController',
          method,
          eventString,
        )
          .then((result: any) => {
            resolve({ success: true, data: result });
          })
          .catch((error: any) => {
            resolve({
              success: false,
              message: 'An error occurred while processing your request',
            });
          });
      } else {
        resolve({ success: true, data: JSON.stringify({}) });
      }
    });
  };

  return (
    <div className='App'>
      <BigCalendar
        resources={resources}
        events={events}
        onSelectSlot={handleTimeRangeSelection}
        onSelectEvent={handleEventClicked}
        onEventDrop={handleEventMove}
        onDragOver={(e: any) => handleEventDragOver(e)}
        onDragStart={handleEventMoving}
        components={{
          eventWrapper: (e: any) => {
            return evWrapper(e);
          },
          toolbar: CustomToolbar,
        }}
        eventMoving={setMoveStart}
        onEventResize={handleEventResize}
        multipleEventSource={multipleEvents}
        forwardedRef={calendarRef}
        extraProps={{
          providerProducts: providerProducts,
          currentDate: calendarCurrentDate,
          calendarPatients: calendarPatients,
        }}
      />
      <ToastContainer />
      {showTransfer && (
        <TransferEventModal
          toggleModal={handleTransferModal}
          events={multipleEvents}
          currentResource={trasnferFromProvider}
        />
      )}
      {showCreateModal && (
        <CreateEventModal
          timeslotPatient={props.activePatient}
          toggleModal={handleCreateModal}
          eventArgs={eventCreateArgs}
          onSubmit={processCreateRequest}
        />
      )}
      {showCreateTSModal && (
        <CreateTimeSlotModal
          toggleModal={handleCreateTSModal}
          eventArgs={eventCreateArgs}
          onSubmit={processCreateTSRequest}
        />
      )}
      {showUpdateModal && (
        <UpdateEventModal
          timeslotPatient={props.activePatient}
          onFormDataChange={handleFormDataChange}
          toggleModal={handleUpdateModal}
          eventArgs={eventUpdateArgs}
          availableSlots={dateSlots}
          appointmentTimeslot={setSelectedTSforAPT}
          onSubmit={processUpdateRequest}
        />
      )}
      {showUpdateTSModal && (
        <UpdateTimeSlotModal
          toggleModal={handleUpdateTSModal}
          eventArgs={eventUpdateArgs}
          onSubmit={processUpdateTSRequest}
        />
      )}
    </div>
  );
};

export default Scheduler;
