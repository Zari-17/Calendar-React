import React from 'react';
import { Button, Modal, Form, Select, DatePicker, Card, Row } from 'antd';
import { LOCATION, EVENTS } from '@src/data';
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import moment from 'moment';
import { systemConfig } from '@src/config';

import { RootState } from '@src/redux/features';
import { useSelector } from 'react-redux';
import useRunOnce from '@src/hooks/useRunOnce';

type UpdateEvenModalProps = {
  eventArgs?: any;
  currentResource?: any;
  onSubmit?: any;
  toggleModal?: any;
  timeslotPatient?: any;
  onFormDataChange?: any;
  availableSlots?: any;
  appointmentTimeslot?: any;
};

const onChange = (
  value: DatePickerProps['value'] | RangePickerProps['value'],
  dateString: [string, string] | string,
) => {
  console.log('Selected Time: ', value);
  console.log('Formatted Selected Time: ', dateString);
};

const onOk = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
  console.log('onOk: ', value);
};

const UpdateEventModal = (props: UpdateEvenModalProps) => {
  const calendarProviders: any = useSelector(
    (state: RootState) => state.calendar.providers,
  );
  const calendarPatients: any = useSelector(
    (state: RootState) => state.calendar.patients,
  );
  const calendarProviderProducts: any = useSelector(
    (state: RootState) => state.calendar.providerProducts,
  );

  const [form] = Form.useForm();
  const formRef = React.useRef();
  const [visible, setVisible] = React.useState(true);
  const [postData, setPostData] = React.useState({
    loading: false,
    error: false,
    data: [],
  });
  const [selectedDate, setSelectedDate] = React.useState<Dayjs>();
  const [disabledHours, setDisabledHours] = React.useState<any>([]);
  const [disabledMinutes, setDisabledMinutes] = React.useState<any>([]);
  const [providerProduct, setProviderProduct] = React.useState<any>([]);
  const [selectedTS, setSelectedTS] = React.useState<any>();

  React.useEffect(() => {
    console.log('eventargs ===>', props.availableSlots);
  });

  useRunOnce({
    fn: () => {
      handleProviderSelection(props.eventArgs.resourceId);
      props.onFormDataChange({
        apptdate: dayjs(props.eventArgs.start),
        id: props.eventArgs.id,
        duration: moment(props.eventArgs.end).diff(
          moment(props.eventArgs.start),
          'minutes',
        ),
      });
    },
  });

  const toggleForm = () => {
    setVisible(false);
    props.toggleModal();
  };

  const disabledDateTime = () => ({
    disabledHours: () => disabledHours || [],
    disabledMinutes: () => disabledMinutes || [],
  });

  const handleFormChange = (changedFields: any, allFields: any) => {
    const formData = allFields.reduce((data: any, field: any) => {
      data[field.name] = field.value;
      return data;
    }, {});
    console.log(formData, 'formdata');
    props.onFormDataChange(formData);
  };

  const handleCardSelection = (tsid: any) => {
    setSelectedTS(tsid);
    props.appointmentTimeslot(tsid);
  };

  const getDateTimeSlots = (date: any) => {
    console.log(date);
    const events = EVENTS;
    let filteredEvents = events
      .filter((event) => {
        return (
          new Date(event.start).toDateString() ==
            new Date(date).toDateString() &&
          new Date(event.end).toDateString() == new Date(date).toDateString() &&
          props.eventArgs.resourceId == event.resourceId
        );
      })
      .map((event) => event);
    let disabledTimes: any = [];
    let disabledMinutes = [];
    console.log(filteredEvents);
    !!filteredEvents &&
      filteredEvents.map((event) => {
        let startHour: any = dayjs(event.start).format('H');
        let endHour: any = dayjs(event.end).format('H');
        disabledTimes[startHour] = [];
        if (startHour !== endHour) disabledTimes[endHour] = [];
        console.log(disabledTimes, 'dt');
      });

    for (var hour in disabledTimes) {
      !!filteredEvents &&
        filteredEvents.map((event) => {
          let startHour: any = dayjs(event.start).format('H');
          let endHour: any = dayjs(event.end).format('H');
          hour == startHour
            ? disabledTimes[hour].push(Number(dayjs(event.start).format('mm')))
            : null;
        });
    }
    console.log(disabledTimes);
    !!selectedDate && filterDisableSelection(disabledTimes);
  };

  const handleProviderSelection = (providerID: any) => {
    setProviderProduct([]);
    let allProducts: any = [];
    let filteredProds: any = [];
    calendarProviderProducts
      .filter((obj: any) => {
        return providerID == obj.providerId;
      })
      .map((obj: any) => {
        Object.entries(obj.product).filter((prodObj: any) => {
          allProducts.push({
            value: prodObj[1].productID,
            label: prodObj[1].productName,
          });
        });
      });
    allProducts
      .filter((prod: any) => {
        return props.eventArgs.treatment == prod.value;
      })
      .map((prod: any) => filteredProds.push(prod));
    setProviderProduct(filteredProds);
  };

  const filterDisableSelection = (disabledTimes: any) => {
    let date = selectedDate;
    let selectedHour = date.format('H');
    console.log(selectedHour, 'hour');
    let selectedMinutes = disabledTimes[Number(selectedHour)];
    console.log(selectedMinutes, 'min');
    setDisabledMinutes(selectedMinutes);
  };

  const handleDateSelection = (e: any) => {
    setSelectedDate(e);
    getDateTimeSlots(e);
  };

  const prevHr = dayjs().subtract(1, 'hours').hour();
  const disHrs: any = [];
  for (let i = 0; i <= prevHr; i++) {
    disHrs.push(i);
  }

  const prevMin = dayjs().minute();
  const disMins = [];
  for (let i = 0; i <= prevMin; i++) {
    disMins.push(i);
  }
  const gridStyle: React.CSSProperties = {
    width: '25%',
    textAlign: 'center',
    fontSize: '12px',
  };

  const loca = LOCATION.filter((x) => x.value === props.eventArgs.location);
  const provider = providerProduct.filter(
    (x: any) => x.value === props.eventArgs.treatment,
  );
  const patient = calendarPatients.filter(
    (x: any) => x.PatientId === props.eventArgs.patientID,
  );

  console.log('patient ==>', patient);
  return (
    <>
      <Modal
        open={visible}
        title='Update Appointment'
        okText='Submit'
        cancelText='Cancel'
        onCancel={() => {
          toggleForm();
        }}
        footer={[
          <Button key='cancel' onClick={() => toggleForm()}>
            Cancel
          </Button>,
          <Button
            key='submit'
            type='primary'
            loading={postData.loading}
            onClick={() => {
              console.log('form ===>', form.getFieldsValue());
              form
                .validateFields()
                .then((values: any) => {
                  console.log('value ==>', values);
                  props.onSubmit(props.eventArgs, values);
                  toggleForm();
                })
                .catch((info) => {
                  console.log('Validate Failed ===>', info);
                });
            }}
          >
            Submit
          </Button>,
        ]}
      >
        <p>Appointment Detail</p>

        <Row style={{ alignItems: 'center', justifyItems: 'center' }}>
          <p className='title'>Delivery Channel:</p>
          <p className='sub-text'>{props.eventArgs.deliveryChannel}</p>
        </Row>

        <Row style={{ alignItems: 'center', justifyItems: 'center' }}>
          <p className='title'>Location:</p>
          <p className='sub-text'>{loca[0]?.label}</p>
        </Row>

        <Row style={{ alignItems: 'center', justifyItems: 'center' }}>
          <p className='title'>Treatment: </p>
          <p className='sub-text'>{provider[0]?.label}</p>
        </Row>

        <Row style={{ alignItems: 'center', justifyItems: 'center' }}>
          <p className='title'>Patient Name: </p>
          <p className='sub-text'>{patient[0]?.FirstName}</p>
        </Row>

        <Row style={{ alignItems: 'center', justifyItems: 'center' }}>
          <p className='title'>What is the reason to visit: </p>
          <p className='sub-text'>{props.eventArgs.reasonToVisit}</p>
        </Row>

        <Form
          ref={formRef}
          form={form}
          layout='vertical'
          name='form_in_modal'
          initialValues={{
            modifier: 'public',
          }}
          onFieldsChange={handleFormChange}
        >
          <Form.Item
            label='Staff / Discipline'
            name='resource'
            initialValue={props.eventArgs.resourceId}
          >
            <Select
              placeholder={'Select a Staff / Discipline'}
              showSearch={true}
              options={calendarProviders.map((provider: any) => {
                return { value: provider.resourceId, label: provider.name };
              })}
              value={props.eventArgs.resourceId}
              defaultActiveFirstOption={false}
              onChange={(id) => handleProviderSelection(id)}
            />
          </Form.Item>

          <Form.Item
            label='Appointment Date'
            name='apptdate'
            rules={[
              { required: true, message: 'Appointment Date is required' },
            ]}
            valuePropName={'date'}
            initialValue={dayjs(props.eventArgs.start)}
          >
            <DatePicker
              disabledTime={disabledDateTime}
              disabledDate={(current: any) => {
                return dayjs().add(-1, 'days') >= current;
              }}
              // defaultValue={dayjs(props.eventArgs.start)}
              minuteStep={systemConfig.minimumDuration}
              onSelect={handleDateSelection}
              onOk={onOk}
              format='DD-MM-YYYY'
            />
          </Form.Item>

          <Form.Item
            label='Appointment End'
            name='end'
            rules={[{ required: true, message: 'End is required' }]}
            valuePropName={'date'}
            initialValue={dayjs(props.eventArgs.end)}
          >
            <DatePicker
              showTime={{ format: 'HH:mm', hideDisabledOptions: true }}
              defaultValue={dayjs(props.eventArgs.end)}
              minuteStep={systemConfig.minimumDuration}
              onChange={onChange}
              onOk={onOk}
              format='DD-MM-YYYY HH:mm'
            />
          </Form.Item>

          <Form.Item
            name='id'
            noStyle
            initialValue={props.eventArgs.id}
          ></Form.Item>
          <Form.Item
            name='duration'
            noStyle
            initialValue={moment(props.eventArgs.end).diff(
              moment(props.eventArgs.start),
              'minutes',
            )}
          ></Form.Item>
          {!!props.availableSlots && (
            <Form.Item label='Select Timeslot' noStyle>
              <Card title={'Available Timeslots'}>
                {props.availableSlots.length
                  ? props.availableSlots.map((slots: any) => {
                      return (
                        <Card.Grid
                          style={gridStyle}
                          className={
                            (slots.id === selectedTS
                              ? 'active-selection-ts'
                              : null) + ' do-not-select'
                          }
                          onClick={() => handleCardSelection(slots.id)}
                          id={slots.id}
                        >{`${slots.start} - ${slots.end}`}</Card.Grid>
                      );
                    })
                  : 'No Timeslots available'}
              </Card>
            </Form.Item>
          )}

          {postData.error && (
            <>
              <br />
              <span style={{ color: 'red' }}>{postData.data}</span>
            </>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default UpdateEventModal;
