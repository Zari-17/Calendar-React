import React from 'react'
import Traffiker from '@src/views/manager/roomManagement/Container'
import { RootState } from "@src/redux/features";
import { useDispatch, useSelector } from "react-redux";
import dayjs from 'dayjs'
import moment from 'moment'
import { Appointment, Patient, Station, TimeSlot, TimeSlotChild, TimeSlotProducts } from '@src/models';
import { STATION } from '@src/data';
import helpers from '@src/services/helpers.service';

import {
    events as evPipline,
    calendarView as currentView
  } from "@src/redux/features/slices/calendarSlice";

interface TraffikerProps{
    waitingRoom?: any
    setTransferredRoom?: any
}

const TrafficHandler = () => {
    const dispatch = useDispatch();

    const calendarEvents: any = useSelector(
        (state: RootState) => state.calendar.events
      );
      const [events, setEvents] = React.useState<any>(calendarEvents);
    
      let waitingRoom:any = [];
      let examRoom:any = [];
    
      const calendarProviders: any = useSelector(
        (state: RootState) => state.calendar.providers
      );
    
      const calendarCurrentDate: any = useSelector(
        (state: RootState) => state.calendar.value
      );
    
      const calendarPatients: any = useSelector(
        (state:RootState)  => state.calendar.patients
      );
    
      const calendarProviderProducts: any = useSelector(
        (state:RootState)  => state.calendar.providerProducts
      );
    
      let providerProducts:any = [];
      // console.log(calendarProviderProducts[0].product)
      providerProducts = calendarProviderProducts.length && Object.entries(calendarProviderProducts[0].product).map((cpp:any)=>{return {value:cpp[1].productID, label:cpp[1].productName}})

      const [transferredEvent, setTransferredEvent] = React.useState<any>();

      const processUpdateRequest = (event:any, examRoom:any) => {
        let selectedEvent = calendarEvents.filter((ev:any) => {
            return event == ev.id
        })
        if(!selectedEvent.length)
        {
            return false;
        }
        
        let id = selectedEvent[0].id
        let resourceId = selectedEvent[0].resourceId;
        let location = selectedEvent[0].location
        let patientID = selectedEvent[0].patientID
        let treatment = selectedEvent[0].treatment
        let status = 'inexam'
        let type = selectedEvent[0].type
        let reasonToVisit = selectedEvent[0].visitReason
        let deliveryChannel = selectedEvent[0].deliveryChannel
        let start = moment(selectedEvent[0].start).toDate();
        let end = moment(selectedEvent[0].end).toDate();
        let title = calendarPatients.filter((patient:any) => {return patient.PatientId.toString() == selectedEvent[0].patientID.toString()}).map((patient:any) => { return (`${patient.FirstName} ${patient.LastName || ''}`).trim()});
        let statusChangedAt = dayjs()
        let timeslot:TimeSlot = {
          TimeSlot: []
        };
        
        let patientObj:any = calendarPatients.filter((patient:any) => patient.PatientId == patientID).map((patient:any) => { return patient});
        let patient:Patient = patientObj[0];
        let station:Station = Object.assign({}, STATION);
          !!station ? station.DMLOperationStation = null : null;
        let appointment:any = [];
        // !!treatment && treatment.map((product:any) => {
          let app:Appointment = {
            status: 'Booked',
            timeslotId: selectedEvent[0].id,
            correlationId: selectedEvent[0].correlationID || "",
            providerId: resourceId,
            product: treatment.isArray ? treatment[0] : treatment,
            description: reasonToVisit,
            patient: patientObj,
            appointmentId: selectedEvent[0].appointmentID || "",
            conferencePhoneNumber: null,
            conferenceLink: null,
            conferenceId: null,
            examRoom: examRoom,
            DMLOperationAppointment: 'Edit'
          };

          
          appointment.push(app);


          
          let timeslotchild:TimeSlotChild = {
            timeslotId: selectedEvent[0].id,
            correlationIds: selectedEvent[0].correlationID || "",
            TotalDuration: dayjs(selectedEvent[0].end).diff(selectedEvent[0].start,'minute'),
            status: 'inexam',
            startTime: moment(selectedEvent[0].start).format('HH:mm:ss.sss').toString()+'Z',
            endtime: moment(selectedEvent[0].end).format('HH:mm:ss.sss').toString()+'Z',
            providerId: resourceId.toString(),
            deliveryChannel: deliveryChannel,
            appointmentDate: moment(selectedEvent[0].start).format('YYYY-MM-DD').toString(),
            city: station?.city || '',
            recordType: "Available",
            station: station,
            Appointment: appointment,
            timeSlotProducts: [],
            DMLOperationTimeSlot: 'Edit'
          };

          selectedEvent[0].treatment.isArray && selectedEvent[0].treatment.map((product:any) => {
            providerProducts.filter((treatment:any) => {
              // console.log(treatment,product)
              if(treatment.value == product)
              {
                let tsProduct:TimeSlotProducts = {
                  productId: treatment.value.toString(),
                  Name: treatment.label.toString(),
                  ProductDuration: dayjs(event.end).diff(event.start,'minute').toString(),
                  DMLOperationTimeslotProducts: 'Create'
                };
                timeslotchild.timeSlotProducts.push(tsProduct)
              }
            }
            )
          });

          timeslot.TimeSlot.push(timeslotchild);
        console.log(JSON.stringify(timeslot));

        helpers.callMyRemoteAction(timeslot, 'EditTSandAppt')
        .then((res:any)=>{
            if(res.success){
                dispatch(evPipline({ type: 'eventChanged', data: {id:selectedEvent[0].id,start,end,location,patientID,treatment,status,type, reasonToVisit, deliveryChannel, title, resourceId,examRoom, statusChangedAt} }))
            }
        })
      }
      
    React.useEffect(() => {
       !!transferredEvent && processUpdateRequest(transferredEvent.id, transferredEvent.roomID)
    },[transferredEvent])

      events.map((event:any) => {
        if(event.status == 'arrived')
        {
          waitingRoom.push(
            {
              id: event.id,
              patient: calendarPatients && calendarPatients.filter((patient:any) => {
                return patient.PatientId.toString() === event.patientID.toString()
              }).map((patient:any) => (`${patient.FirstName} ${patient.LastName || ''}`)),
              provider: calendarProviders && calendarProviders.filter((provider:any) => {
                return provider.resourceId == event.resourceId
              }).map((provider:any) => provider.name),
              treatment: providerProducts && providerProducts.filter((prod:any) => {
                return prod.value == event.treatment
              }).map((prod:any) => prod.label),
              arrivalTime: !!event.statusChangedAt ? dayjs(event.statusChangedAt).format('YYYY-MM-DD HH:mm:ss') : dayjs(event.start).add(15,'minutes').format('YYYY-MM-DD HH:mm:ss'),
              appointmentTime: dayjs(event.start).format('YYYY-MM-DD HH:mm:ss')
            }
          )
        }
        if(event.status == 'inexam')
        {
          examRoom.push(
            {
              id: event.id,
              roomID: event.examRoom,
              patient: calendarPatients && calendarPatients.filter((patient:any) => {
                return patient.PatientId.toString() === event.patientID.toString()
              }).map((patient:any) => (`${patient.FirstName} ${patient.LastName || ''}`)),
              provider: calendarProviders && calendarProviders.filter((provider:any) => {
                return provider.resourceId == event.resourceId
              }).map((provider:any) => provider.name),
              treatment: providerProducts && providerProducts.filter((prod:any) => {
                return prod.value == event.treatment
              }).map((prod:any) => prod.label),
              arrivalTime: !!event.statusChangedAt ? dayjs(event.statusChangedAt).format('YYYY-MM-DD HH:mm:ss') : dayjs(event.start).add(15,'minutes').format('YYYY-MM-DD HH:mm:ss'),
              appointmentTime: dayjs(event.start).format('YYYY-MM-DD HH:mm:ss')
            }
          )
        }
      })
    
    return (
        <Traffiker waitingRoom={waitingRoom} examRoom={examRoom} setTransferredRoom={setTransferredEvent} />
    )
}

export default TrafficHandler;