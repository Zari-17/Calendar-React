import React, {StrictMode} from 'react';
import { HashRouter, Route, BrowserRouter as Router, Routes, useNavigate, Navigate } from "react-router-dom";
import SignIn from './views/auth/signIn';
import ManagerHome from './views/manager/home';
import { Button, ConfigProvider } from 'antd';
import './App.scss';
import RoomManagement from './views/manager/roomManagement';
import PhysicianHome from './views/physician/home';
import PhysicianCalendar from './views/physician/calendar';
import  VisualForceRemotingManager  from "@src/services/remotingManager.service"
import dayjs from 'dayjs';
import moment from 'moment'
import 'moment-timezone'
import { systemConfig } from '@src/config';

import { RootState } from "@src/redux/features";
import { useDispatch, useSelector } from "react-redux";
import {
  events as evPipline, providers as pvPipline, patients as ptPipeline, providerProducts
} from "@src/redux/features/slices/calendarSlice";
import useRunOnce from "@src/hooks/useRunOnce";

import { Event, Events as CalendarEvents, TimeSlot, TimeSlots, Station, TimeSlotProducts, TimeSlotChild, Appointment, Patient, Resource, Provider, ProviderProduct  } from "@src/models";
import { STATION } from './data';
import timeslotsJSON from '@src/data/timeslots.json'


moment.tz.setDefault('America/New_York')

function App() {
  const navigate = useNavigate;
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [providers, setProviders] = React.useState([]);
  const [timeslots, setTimeSlots] = React.useState([]);
  const [patients, setPatients] = React.useState([]);
  const [remoteCalled, setRemoteCalled] = React.useState(false);
  // dayjs.tz.setDefault('America/New_York')
  const callRemoteInit = () : void => {
    console.log("initiating RM");
    process.env.REACT_APP_USE_LOCALSTORAGE == "true" && setRemoteCalled(true)
    let dummyinitResult = timeslotsJSON;
    let dummyPatientData = JSON.parse('{"patients":[{"PhoneNumber":"456789","PatientId":"a0t2M00000ZJnjuQAD","location":{"province":"Ontario","postalCode":"M1M3M4","geoLocation":null,"country":"Canada","city":"Toronto","addressLine2":null,"addressLine1":"123 Downtown"},"LastName":null,"HealthCardNumber":"123456","Gender":"Female","FirstName":"tesla","email":"test@gmail.com","DOB":"2023-03-23","DMLOperationPatient":null},{"PhoneNumber":"3456789","PatientId":"a0t2M00000a8taUQAQ","location":{"province":"Ontario","postalCode":"M1M3M4","geoLocation":null,"country":"Canada","city":"Toronto","addressLine2":null,"addressLine1":"123 Downtown"},"LastName":null,"HealthCardNumber":"123456789","Gender":"Male","FirstName":"Amir","email":"amirtest@gmail.com","DOB":"2010-04-18","DMLOperationPatient":null}]}');
    if(process.env.REACT_APP_SALESFORCE_CONNECT == "true")
    {
      VisualForceRemotingManager.invoke('schedulingAppController', 'initiateData',null)
        .then((result: any) => { 
          result = JSON.parse(result);
          parseInitiateData(result)
          // do something here
          //  setTimeSlots(JSON.parse(result))
          // console.log(result);
        })
        .catch((error: any) => {
          // console.log(error);
          // do something here
      })
      VisualForceRemotingManager.invoke('schedulingAppController', 'getPatientData',null)
        .then((result: any) => { 
          result = JSON.parse(result);
          console.log(result)
          parseInitiateData(result)
          // do something here
          //  setTimeSlots(JSON.parse(result))
          // console.log(result);
        })
        .catch((error: any) => {
          // console.log(error);
          // do something here
      })
    }
    else
    {
      parseInitiateData(dummyinitResult)
      parseInitiateData(dummyPatientData)
    }
  }

  const parseInitiateData = (result:any) => {
    console.log(result)
    let timeSlots = result.timeslots;
    let providers = result.provider;
    let patients = result.patients;
    // setTimeSlots(result.timeslots)
    if(!!timeSlots && typeof timeSlots !== 'undefined' && typeof timeSlots == 'object' && timeSlots.hasOwnProperty('TimeSlot') && timeSlots.TimeSlot !== null)
    {
      timeSlots.TimeSlot.forEach(function(ts:any, index:any){
        let event:Event = {
          id: ts.timeslotId,
          patientID: !!ts.Appointment && ts.Appointment.length && ts.Appointment[0].patient != null ? ts.Appointment[0].patient[0].PatientId : null,
          title: !!ts.Appointment && ts.Appointment.length && ts.Appointment[0].patient !== null && !!ts.Appointment[0].patient[0] ? ts.Appointment[0].patient[0].FirstName.toString() + ts.Appointment[0].patient[0].LastName.toString() : 'Available',
          start: moment(new Date(ts.appointmentDate+' '+ts.startTime)).toDate(),
          end: moment(new Date(ts.appointmentDate+' '+ts.endtime)).toDate(),
          resourceId: ts.providerId,
          correlationID: ts.correlationIds,
          treatment: !!ts.Appointment && ts.Appointment.length ? ts.Appointment[0].product : (!!ts.timeslotproducts && ts.timeslotproducts.map((prod:any) => {return prod.productId})),
          deliveryChannel: ts.deliveryChannel,
          appointmentID: !!ts.Appointment && ts.Appointment.length ? ts.Appointment[0].appointmentId : null,
          status: !!ts.Appointment && ts.Appointment.length ? ts.Appointment[0].status.toLowerCase() : 'available',
          type: !!ts.Appointment && ts.Appointment.length ? 'appointment' : 'timeslot',
          duration: ts.TotalDuration,
          treatmentProducts: ts.timeslotproducts && ts.timeslotproducts.map((prod:any) => {return prod.productId})
        };
        setTimeSlots((prev:any) => [...prev, event]);
        // let eventsLocal = [];
        // eventsLocal.push(event);
        // setEvents(eventsLocal);
        
        dispatch(evPipline({ type: 'eventAdded', data: event }))

      });
    //   timeSlots.hasOwnProperty('TimeSlot')
      
    }
    if(!!providers && typeof providers !== 'undefined' && typeof providers == 'object')
    {
      providers.forEach(function(pv:Provider, index:any){
      let provider:Resource = {
        resourceId: pv.providerId,
        name: pv.name,
        speciality: pv.speciality,
        mobile: pv.phoneNumber,
        station: STATION
      }
      setProviders((prev:any) => [...prev, provider]);
      dispatch(pvPipline({type: 'list', data: provider}))
      if(!!pv.providerProducts && pv.providerProducts.length)
      {
        let providerID:any = pv.providerId;
        // let products:any = [];
        // products[providerID] = [];
        let products:any = {providerId:providerID,product:[]}
        Object.entries(pv.providerProducts).map((prodObj:any, index:any)=>{
          products.product = [...products.product, {productID: prodObj[1].productId, productName: prodObj[1].Name}]
          // console.log({providerId:providerID,products:)
            //   // console.log(prodObj[1])
            //   let provProdID = prodObj[1].ProviderProductsId;
            //   let provProdName = prodObj[1].Name;
            //   // let prod = {provProdID:prodObj[1].Name}
            //   return  {prodID:provProdID,prodName: provProdName}
          })
        dispatch(providerProducts({type: 'providerProdAdded', data: products}));
        // )];
       
        // console.log(products)
        
        // let provProd = pv.providerProducts;
        // let product:any = {`${providerID}`:provProd}
      }
     
      
    });
    }
    if(!!patients && typeof patients !== 'undefined' && typeof patients == 'object')
    {
      patients.forEach(function(pt:any){
        let patient = pt;
        setPatients((prev:any) => [...prev,patient]);
        dispatch(ptPipeline({type: 'patientAdded',data:patient}));
      })

    }
  }

  useRunOnce({
    fn: () => {
      callRemoteInit()
    },
    sessionKey: process.env.REACT_APP_USE_LOCALSTORAGE == "true" ? "remoteLoader__" : null
  });

  React.useEffect(() => {
    if(process.env.REACT_APP_USE_LOCALSTORAGE == "true")
    {
      (!!providers && providers.length) ? localStorage.setItem('providers', JSON.stringify(providers)) : null;
      (!!timeslots && timeslots.length) ? localStorage.setItem('timeslots', JSON.stringify(timeslots)) : null;
      if(!remoteCalled)
      {
        const providers = JSON.parse(localStorage.getItem('providers'));
        const timeslots = JSON.parse(localStorage.getItem('timeslots'));
        let timeslotsParsed:any = [];
        timeslotsParsed = !!timeslots && timeslots.map((ts:any) => {
          return {
              ...ts,       
              start: new Date(ts.start),
              end: new Date(ts.end),
          }
        })
        // console.log(timeslotsParsed)
        if (providers) {
          dispatch(pvPipline({type: 'providersLoaded', data: providers}))
        }
        if (timeslotsParsed) {
          dispatch(evPipline({type: 'eventsLoaded', data: timeslotsParsed}))
        }
      }
    }
    else
    {
      let timeslotsParsed:any = [];
      timeslotsParsed = !!timeslots && timeslots.map((ts:any) => {
        return {
            ...ts,       
            start: new Date(ts.start),
            end: new Date(ts.end),
        }
      })
      // console.log(timeslotsParsed)
      if (providers) {
        dispatch(pvPipline({type: 'providersLoaded', data: providers}))
      }
      if (timeslotsParsed) {
        dispatch(evPipline({type: 'eventsLoaded', data: timeslotsParsed}))
      }
    }
    // (!!patients && patients.length) ? localStorage.setItem('patients', JSON.stringify(patients)) : null;

  })
  return (
    
      <HashRouter>
        <ConfigProvider
            theme={{
              "token": {
                "colorPrimary": "#00296b",
                "colorWarning": "#fca311",
                "colorTextBase": "#003f88",
                "colorInfo": "#9ED2F8",
                "colorError": "#fe3f61",
                "colorSuccess": "#60cf7d",
                "colorBorder": "00296b",
                "wireframe": false,
                "fontFamily": "-apple-system, 'Acme Regular', BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
              }
            }}
          >
          <Routes>
          <Route index path={"/auth/sign-in"} element={<SignIn />} />
          <Route path={"/manager/home"} element={<ManagerHome />} />
          <Route path={"/manager/traffic"} element={<RoomManagement />} />
          <Route path={"/physician/home"} element={<PhysicianHome />} />
          <Route path={"/physician/calendar"} element={<PhysicianCalendar />} />
          {/* <Redirect from='/' to='/auth/sign-in' /> */}
          <Route 
                path="/"
                element={
                  isAuthenticated ? (
                    <ManagerHome />
                  ) : (
                    <Navigate replace to={"/auth/sign-in"} />
                  )
                }
              />
      </Routes>
      </ConfigProvider>
      </HashRouter>
  );
}

export default App;
