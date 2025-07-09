import React, { Fragment } from 'react';
import Manager from '@src/layouts/manager';
import {
  Row,
  Col,
  Divider,
  Calendar,
  Card,
  theme,
  AutoComplete,
  Select,
  Button,
  Drawer,
} from 'antd';

import type { Dayjs } from 'dayjs';

import { MenuOutlined } from '@ant-design/icons';
import Scheduler from '@src/components/Scheduler';
import { SPECIALIZATIONS } from '@src/data';

import { RootState } from '@src/redux/features';
import { useDispatch, useSelector } from 'react-redux';
import { currentDate } from '@src/redux/features/slices/calendarSlice';

import moment from 'moment';
import 'moment-timezone';

const { useToken } = theme;

function Home() {
  moment.tz.setDefault('America/New_York');
  const { token } = useToken();
  const [open, setOpen] = React.useState(false);
  const [patientName, setPatientName] = React.useState('');

  const [currentPatient, setCurrentPatient] = React.useState<any>([]);
  const [filterBySpecialization, setFilterBySpecialization] =
    React.useState<any>(null);
  const [filterByProvider, setFilterByProvider] = React.useState<any>(null);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handlePatientSelection = (event: any, option: any) => {
    setPatientName(option.label);
    setCurrentPatient(
      calendarPatients.filter(
        (patient: any) => patient.PatientId == option.value,
      )[0],
    );
  };

  const wrapperStyle: React.CSSProperties = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };

  const calendarPatients: any = useSelector(
    (state: RootState) => state.calendar.patients,
  );
  const calendarProviders: any = useSelector(
    (state: RootState) => state.calendar.providers,
  );

  const dispatch = useDispatch();
  const onPanelChange = (value: Dayjs) => {
    dispatch(currentDate(moment(value.format('YYYY-MM-DD')).toString()));
    callMyRemoteAction(value.format('YYYY-MM-DD'));
  };
  const callMyRemoteAction = (event: any): void => {
    console.log('event details' + event);
  };
  return (
    <>
      <Manager>
        <Fragment>
          <Row gutter={[24, 24]} style={{ padding: 24, paddingBottom: 190 }}>
            <Col span={10}>
              <Select
                showSearch
                style={{
                  width: '100%',
                  backgroundColor: '#00286b',
                  padding: 1,
                  borderRadius: 7,
                }}
                placeholder='Filter by Specialization'
                optionFilterProp='children'
                filterOption={(input, option) =>
                  (option?.label ?? '').includes(input)
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? '')
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? '').toLowerCase())
                }
                options={SPECIALIZATIONS}
                onSelect={(e: any, option) => {
                  setFilterBySpecialization(option.label);
                }}
                allowClear={true}
                onClear={() => setFilterBySpecialization(null)}
              />
            </Col>
            <Col span={10}>
              <Select
                showSearch
                style={{
                  width: '100%',
                  backgroundColor: '#00286b',
                  padding: 1,
                  borderRadius: 7,
                }}
                placeholder='Filter by Provider'
                optionFilterProp='children'
                filterOption={(input: any, option: any) =>
                  (option?.label ?? '').includes(input)
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.name ?? '')
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? '').toLowerCase())
                }
                options={calendarProviders.map((provider: any) => {
                  return { value: provider.resourceId, label: provider.name };
                })}
                onSelect={(e: any, option) => {
                  setFilterByProvider(option.value);
                }}
                allowClear={true}
                onClear={() => setFilterByProvider(null)}
              />
            </Col>

            <Col span={1}>
              <Button type='primary' onClick={showDrawer}>
                <MenuOutlined /> Options
              </Button>
            </Col>
            <Col span={24}>
              <Scheduler
                activePatient={currentPatient}
                specializationFilter={filterBySpecialization}
                providerFilter={filterByProvider}
              />
            </Col>
          </Row>
          <Drawer
            title='Explore more options'
            placement='right'
            height={660}
            closable={false}
            onClose={onClose}
            open={open}
            getContainer={false}
          >
            <Row>
              <Col
                span={24}
                style={{
                  padding: '16px',
                  width: '100%',
                  justifyContent: 'center',
                  top: '50%',
                  position: 'relative',
                }}
              >
                <AutoComplete
                  style={{ width: '100%' }}
                  value={patientName}
                  placeholder='Search for patient by name'
                  options={calendarPatients.map((patient: any) => {
                    return {
                      value: patient.PatientId.toString(),
                      label: `${patient.FirstName} ${
                        patient.LastName || ''
                      }`.trim(),
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
                  <p>
                    Patient Name:{' '}
                    {`${
                      currentPatient?.FirstName === undefined
                        ? '-'
                        : currentPatient?.FirstName
                    }`.trim()}
                  </p>
                  <p>Date of Birth: {currentPatient.DOB}</p>
                  <p>Mobile Phone Number: {currentPatient.PhoneNumber}</p>
                  <p>
                    Home / alternate Number: {currentPatient.AlterNumber || ''}
                  </p>
                  <p>Gender: {currentPatient.Gender}</p>
                  <p>Email: {currentPatient.email}</p>
                </Card>
                <Divider />
                <div style={wrapperStyle}>
                  <Calendar fullscreen={false} onChange={onPanelChange} />
                </div>
              </Col>
            </Row>
          </Drawer>
        </Fragment>
      </Manager>
    </>
  );
}

export default Home;
