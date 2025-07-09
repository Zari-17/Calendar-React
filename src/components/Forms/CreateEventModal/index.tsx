import React from 'react';
import {
  Button,
  Modal,
  Form,
  Input,
  Radio,
  message,
  Descriptions,
  Select,
  DatePicker,
} from 'antd';
import {
  PROVIDERS,
  PATIENTS,
  DELIVERYCHANNEL,
  LOCATION,
  TREATMENT,
  EVENTS,
} from '@src/data';
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { systemConfig } from '@src/config';

import { RootState } from '@src/redux/features';
import { useDispatch, useSelector } from 'react-redux';

import useRunOnce from '@src/hooks/useRunOnce';

type CreateEvenModalProps = {
  eventArgs?: any;
  currentResource?: any;
  onSubmit?: any;
  toggleModal?: any;
  timeslotPatient?: any;
};

const { RangePicker } = DatePicker;

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

const CreateEventModal = (props: CreateEvenModalProps) => {
  const calendarProviders: any = useSelector(
    (state: RootState) => state.calendar.providers,
  );
  const calendarPatients: any = useSelector(
    (state: RootState) => state.calendar.patients,
  );
  const calendarProviderProducts: any = useSelector(
    (state: RootState) => state.calendar.providerProducts,
  );

  const providers = PROVIDERS.map((provider) => {});

  const [form] = Form.useForm();
  const [visible, setVisible] = React.useState(true);
  const [postData, setPostData] = React.useState({
    loading: false,
    error: false,
    data: [],
  });
  const [selectedDate, setSelectedDate] = React.useState<Dayjs>();
  const [disableSelection, setDisableSelection] = React.useState();
  const [disabledHours, setDisabledHours] = React.useState<any>([]);
  const [disabledMinutes, setDisabledMinutes] = React.useState<any>([]);
  const [providerProduct, setProviderProduct] = React.useState<any>([]);
  const [initialProduct, setInitialProduct] = React.useState();

  const { TextArea } = Input;
  // let visibility = props.open;

  useRunOnce({
    fn: () => {
      handleProviderSelection(props.eventArgs.resourceId);
    },
  });
  React.useEffect(() => {
    // console.log(disabledHours)
    // !!selectedDate && getDateTimeSlots(selectedDate)
    // !!disableSelection && filterDisableSelection()
    // setVisible(visibility);
    // visibility = false;
  });

  const toggleForm = () => {
    setVisible(false);
    props.toggleModal();
  };

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // disable selecting days before today
    return current && current <= dayjs().subtract(1, 'days');
  };

  const getDisabledHoursMins = (date: any) => {};

  const range = (start: any, end: any) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  const disabledDateTime = () => ({
    disabledHours: () => disabledHours || [],
    disabledMinutes: () => disabledMinutes || [],
  });

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
        // if(disabledTimes[startHour].length)
        // {
        //   disabledTimes[startHour] = dayjs(event.start).format('mm')
        // }
        // disabledTimes.startHour.push(
        //   (dayjs(event.start).format('mm'))
        // )
        // setDisabledHours([...disabledHours,disabledHours[startHour]]);
        // setDisabledHours([...disabledHours,disabledHours[endHour]]);
        // setDisabledHours([...disabledHours[startHour],dayjs(event.start).format('mm')])
        // setDisabledHours([...disabledHours[endHour],dayjs(event.end).format('mm')])
        // disabledTimes[startHour] = [...disabledTimes[startHour],dayjs(event.start).format('mm')];
        // disabledTimes[endHour] = [...disabledTimes[endHour],dayjs(event.end).format('mm')];
        // console.log(disabledTimes)
        // disabledTimes = !!disabledTimes[startHour] ? [...disabledTimes[startHour],dayjs(event.start).format('mm')];
        // disabledTimes[startHour].push(dayjs(event.start).format('mm'));
        // disabledTimes[endHour].push(dayjs(event.end).format('mm'));
        // disabledTimes.push({"start":{"hour":dayjs(event.start).format('HH'),"minute":dayjs(event.start).format('mm')},"end":{"hour":dayjs(event.end).format('HH'),"minute":dayjs(event.end).format('mm')}})
      });

    for (var hour in disabledTimes) {
      !!filteredEvents &&
        filteredEvents.map((event) => {
          let startHour: any = dayjs(event.start).format('H');
          let endHour: any = dayjs(event.end).format('H');
          hour == startHour
            ? disabledTimes[hour].push(Number(dayjs(event.start).format('mm')))
            : null;
          // (!!disabledTimes && hour == endHour)  ? disabledTimes[hour].push(dayjs(event.end).format('mm')) : null;
        });
    }
    console.log(disabledTimes);
    // setDisableSelection(disabledTimes);
    !!selectedDate && filterDisableSelection(disabledTimes);
    // setDisabledHours(disabledTimes);
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

  const handleProviderSelection = (providerID: any) => {
    console.log(props);
    // return;
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
    allProducts.filter((prod: any) => {
      !!props.eventArgs.treatment &&
        props.eventArgs.treatment
          .filter((treatment: any) => {
            return treatment == prod.value;
          })
          .map((resprod: any) => filteredProds.push(prod));
      // return props.eventArgs.treatment.indexOf(prod.value)
    });
    setProviderProduct(filteredProds);
    // handleInitialTreatmentSelection();
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

  return (
    <>
      <Modal
        open={visible}
        title='Create Appointment'
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
              form
                .validateFields()
                .then((values) => {
                  props.onSubmit(props.eventArgs, values);
                  toggleForm();
                })
                .catch((info) => {
                  console.log('Validate Failed:', info);
                });
            }}
          >
            Submit
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout='vertical'
          name='form_in_modal'
          initialValues={{
            modifier: 'public',
          }}
        >
          <Form.Item
            label='Delivery Channel'
            name='deliveryChannel'
            rules={[
              { required: true, message: 'Delivery channel is required' },
            ]}
            initialValue={props.eventArgs.deliveryChannel}
          >
            <Select
              placeholder={'Select a delivery channel'}
              showSearch={true}
              options={DELIVERYCHANNEL}
            />
          </Form.Item>

          <Form.Item
            label='Location'
            name='location'
            rules={[{ required: true, message: 'Location is required' }]}
            initialValue={props.eventArgs.location}
          >
            <Select
              placeholder={'Select a location'}
              showSearch={true}
              options={LOCATION}
            />
          </Form.Item>

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
              disabled
            />
          </Form.Item>

          <Form.Item
            label='Treatment'
            name='treatment'
            rules={[{ required: true, message: 'Treatment is required' }]}
          >
            <Select
              placeholder={'Select a treatment'}
              showSearch={true}
              clearIcon={true}
              options={providerProduct}
              defaultActiveFirstOption={false}
            />
          </Form.Item>

          <Form.Item
            label='Patient Name'
            name='patient'
            rules={[{ required: true, message: 'Patient is required' }]}
            initialValue={
              props.eventArgs.patientId || props.timeslotPatient.PatientId
            }
          >
            <Select
              placeholder={'Select Patient'}
              showSearch={true}
              options={calendarPatients.map((patient: any) => {
                return {
                  value: patient.PatientId,
                  label: `${patient.FirstName} ${
                    patient.LastName || ''
                  }`.trim(),
                };
              })}
              defaultActiveFirstOption={false}
            />
          </Form.Item>

          <Form.Item
            label='What is the reason to visit?'
            name='visitReason'
            rules={[{ required: true, message: 'Visit reason is required' }]}
            initialValue={props.eventArgs.reasonToVisit}
          >
            <TextArea placeholder='What is the reason to visit?' autoSize />
          </Form.Item>

          <Form.Item
            label='Appointment Start'
            name='start'
            rules={[{ required: true, message: 'Start is required' }]}
            valuePropName={'date'}
            initialValue={dayjs(props.eventArgs.start)}
          >
            <DatePicker
              showTime={{ format: 'HH:mm', hideDisabledOptions: true }}
              disabledTime={disabledDateTime}
              defaultValue={dayjs(props.eventArgs.start)}
              minuteStep={systemConfig.minimumDuration}
              onSelect={handleDateSelection}
              onOk={onOk}
              format='DD-MM-YYYY HH:mm'
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

          <Form.Item name='id' noStyle initialValue={props.eventArgs.id}>
            <Input type='hidden'></Input>
          </Form.Item>

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

export default CreateEventModal;
