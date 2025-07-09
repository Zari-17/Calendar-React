import React, { Fragment } from 'react';
import Physician from '@src/layouts/physician';
import VisualForceRemotingManager from '@src/services/remotingManager.service';
import {
  Row,
  Col,
  Space,
  Divider,
  Badge,
  Calendar as InlineCalendar,
  Tabs,
  Input,
  Card,
  theme,
  AutoComplete,
  Select,
} from 'antd';
import MonthlyCalendar from '@src/components/MonthlyCalendar';
import DailyCalendar from '@src/components/Calendar';
import { EVENTS, PATIENTS, PROVIDERS } from '@src/data';
import { systemConfig, eventColors } from '@src/config';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

import { RootState } from '@src/redux/features';
import { useDispatch, useSelector } from 'react-redux';
import { currentDate } from '@src/redux/features/slices/calendarSlice';
import {
  DayPilot,
  DayPilotCalendar,
  DayPilotNavigator,
} from '@daypilot/daypilot-lite-react';

const { useToken } = theme;

const Calendar = () => {
  const { token } = useToken();
  const wrapperStyle: React.CSSProperties = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };
  const dispatch = useDispatch();

  const [patientName, setPatientName] = React.useState('');
  const [currentPatient, setCurrentPatient] = React.useState<any>([]);

  EVENTS.map((event) => {
    event.text = !event.disabled
      ? PATIENTS.filter((patient) => patient.PatientID == event.patientID)
          .map((patient) => patient.Name)
          .toString()
      : 'Blocked';
  });

  const [events, setEvents] = React.useState<any>(EVENTS);
  const handlePatientSelection = (event: any, option: any) => {
    // console.log(option)
    setPatientName(option.label);
    setCurrentPatient(
      PATIENTS.filter((patient) => patient.PatientID == option.value)[0],
    );
  };
  const callMyRemoteAction = (event: any): void => {
    // const eventString =  JSON.stringify(event);
    // console.log("event details" +eventString);
    // VisualForceRemotingManager.invoke('schedulingAppController', 'SchAppTest1', eventString)
    //   .then((result: any) => {
    //     // do something here
    //     console.log(result);
    //   })
    //   .catch((error: any) => {
    //     console.log(error);
    //     // do something here
    //   })
  };
  const onPanelChange = (value: Dayjs) => {
    // console.log(value.format('YYYY-MM-DD'));
    // console.log(new DayPilot.Date(new Date(value.format('YYYY-MM-DD'))).toString("yyyy-MM-dd"));
    dispatch(
      currentDate(
        new DayPilot.Date(new Date(value.format('YYYY-MM-DD'))).toString(
          'yyyy-MM-dd',
        ),
      ),
    );
    callMyRemoteAction(value.format('YYYY-MM-DD'));
  };
  return (
    <>
      <Physician>
        <Row>
          <Col span={18} style={{ padding: '24px' }}>
            <MonthlyCalendar events={events} />
          </Col>
          <Col
            span={6}
            style={{
              padding: '16px',
              width: '100%',
              justifyContent: 'center',
              top: '50%',
              position: 'relative',
            }}
          >
            <Divider />
            <Divider />
            <Divider />
            <AutoComplete
              style={{ width: 200 }}
              value={patientName}
              placeholder='Search for patient by name'
              options={PATIENTS.map((patient) => {
                return {
                  value: patient.PatientID.toString(),
                  label: patient.Name,
                };
              })}
              onSelect={(e, option) => handlePatientSelection(e, option)}
            />
            <Divider />
            <Card
              title='Patient Card'
              bordered={true}
              style={{ textAlign: 'center', width: 300 }}
            >
              <p>Patient Name: {currentPatient.Name}</p>
              <p>Date of Birth: {currentPatient.DOB}</p>
              <p>Mobile Phone Number: {currentPatient.MobilePhoneNumber}</p>
              <p>Home / alternate Number: {currentPatient.AlterNumber}</p>
              <p>Gender: {currentPatient.Gener}</p>
              <p>Email: {currentPatient.Email}</p>
            </Card>
            <Divider />
            <div style={wrapperStyle}>
              <InlineCalendar fullscreen={false} onChange={onPanelChange} />
            </div>
          </Col>
        </Row>
      </Physician>
    </>
  );
};

export default Calendar;
