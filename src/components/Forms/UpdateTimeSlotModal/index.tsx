import React from "react";
import { Button, Modal, Form, Input, Radio, message, Descriptions, Select, DatePicker } from 'antd';
import {PROVIDERS, PATIENTS, DELIVERYCHANNEL, LOCATION, TREATMENT, EVENTS} from '@src/data'
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import moment from 'moment';
import type {Dayjs} from 'dayjs';
import { systemConfig } from '@src/config'

import { RootState } from "@src/redux/features";
import { useDispatch, useSelector } from "react-redux";

type UpdateTimeSlotModalProps = {
    eventArgs?: any,
    currentResource?: any,
    onSubmit?: any
    toggleModal?: any

}

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

}

const UpdateTimeSlotModal = (props: UpdateTimeSlotModalProps) => {

    const providers = PROVIDERS.map((provider) => {
      
    })

    const calendarProviderProducts: any = useSelector(
      (state: RootState) => state.calendar.providerProducts
    );

  let providerProducts:any = [];
      console.log(calendarProviderProducts[0].product)
      providerProducts = Object.entries(calendarProviderProducts[0].product).map((cpp:any)=>{return {value:cpp[1].productID, label:cpp[1].productName}})
  

    const [form] = Form.useForm();
    const [visible, setVisible] = React.useState(true);
    const [postData, setPostData] = React.useState({
      loading: false,
      error: false,
      data: []
    });
    const [selectedDate, setSelectedDate] = React.useState<Dayjs>();
    const [disableSelection, setDisableSelection] = React.useState();
    const [disabledHours, setDisabledHours] = React.useState<any>([])
    const [disabledMinutes, setDisabledMinutes] = React.useState<any>([])
    const { TextArea } = Input;
    // let visibility = props.open;

    React.useEffect(() => {
      // console.log(disabledHours)
      // !!selectedDate && getDateTimeSlots(selectedDate)
      // !!disableSelection && filterDisableSelection()
      
      // setVisible(visibility);
      // visibility = false;
    })

    const toggleForm =() => {
      setVisible(false);
      props.toggleModal()
    }

    const disabledDate: RangePickerProps["disabledDate"] = (current) => {
      // disable selecting days before today
      return current && current <= dayjs().subtract(1, "days");
    };

    const getDisabledHoursMins = (date:any) => {

    }

    const range = (start:any, end:any) => {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    }

    const disabledDateTime = () => ({
      disabledHours: () => disabledHours || [],
      disabledMinutes: () => disabledMinutes || [],
    });
    
    const getDateTimeSlots = (date:any) => {
      console.log(date)
      const events = EVENTS;
      let filteredEvents = events.filter( event => {return ( (new Date(event.start)).toDateString() == (new Date(date)).toDateString() && (new Date(event.end)).toDateString() == (new Date(date)).toDateString() && props.eventArgs.resource == event.resourceId)}).map(event => event)
      let disabledTimes:any = [];
      let disabledMinutes = [];
      console.log(filteredEvents);
      !!filteredEvents && filteredEvents.map( event => {
        let startHour:any = (dayjs(event.start).format('H'));
        let endHour:any = (dayjs(event.end).format('H'));
        disabledTimes[startHour] = []
        if(startHour !== endHour)
          disabledTimes[endHour] = []

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
      })
      
      for(var hour in disabledTimes)
      {
        !!filteredEvents && filteredEvents.map( event => {
          let startHour:any = (dayjs(event.start).format('H'));
          let endHour:any = (dayjs(event.end).format('H'));
          (!!disabledTimes && hour == startHour) ? disabledTimes[hour].push(Number(dayjs(event.start).format('mm'))) : null;
          // (!!disabledTimes && hour == endHour)  ? disabledTimes[hour].push(dayjs(event.end).format('mm')) : null;
        })
      }
      console.log(disabledTimes);
      // setDisableSelection(disabledTimes);
      !!selectedDate && filterDisableSelection(disabledTimes)
      // setDisabledHours(disabledTimes);
    }

    const filterDisableSelection = (disabledTimes:any) => {
      let date = selectedDate;
      let selectedHour = date.format('H');
      console.log(selectedHour,'hour');
      let selectedMinutes = (disabledTimes[Number(selectedHour)]);
      console.log(selectedMinutes,'min')
      setDisabledMinutes(selectedMinutes)
    }

    const handleDateSelection = (e:any) => {
      setSelectedDate(e);
      getDateTimeSlots(e)
    }
    
    const prevHr = dayjs().subtract(1, "hours").hour();
    const disHrs:any = [];
    for (let i = 0; i <= prevHr; i++) {
      disHrs.push(i);
    }
    
    const prevMin = dayjs().minute();
    const disMins = [];
    for (let i = 0; i <= prevMin; i++) {
      disMins.push(i);
    }


    // const setVisible = (visibility:boolean) => {
    //   props.open = visibility
    // }

    // const onSubmit = (values:any) => {
        // setPostData({ ...postData, loading: true, error: false, data:values });
        // _postSchoolRollOutRequest(values, (status, data) => {
        //   if (status === 200) {
        //     form.resetFields();
        //     setPostData({ ...postData, loading: false, data: data });
        //   } else {
        //     setPostData({
        //       ...postData,
        //       loading: false,
        //       error: true,
        //       data: "Post school roll out form failed!"
        //     });
        //   }
        // });
    // };

    return (
        <>
            <Modal
            open={visible}
            title="Update Timeslot"
            okText="Update"
            cancelText="Cancel"
            onCancel={() => {
              toggleForm()
            }}
            width={250}
            footer={[
              <Button key="cancel" onClick={() => toggleForm()}>
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={postData.loading}
                onClick={() => {
                  form
                    .validateFields()
                    .then((values) => {
                      props.onSubmit(props.eventArgs, values);
                      toggleForm()
                    })
                    .catch((info) => {
                      console.log("Validate Failed:", info);
                    });
                }}
              >
                Submit
              </Button>
            ]}
          >
            <Form
              form={form}
              layout="vertical"
              name="form_in_modal"
              initialValues={{
                modifier: "public"
              }}
              
            >
              <Form.Item
                label="Delivery Channel"
                name="deliveryChannel"
                rules={[{ required: true, message: 'Delivery channel is required' }]}
                initialValue={props.eventArgs.deliveryChannel}
              >
                <Select 
                placeholder={"Select a delivery channel"}
                showSearch={true}
                options={DELIVERYCHANNEL} />
              </Form.Item>

              {/* <Form.Item
                label="Location"
                name="location"
                rules={[{ required: true, message: 'Location is required' }]}
                initialValue={props.eventArgs.location}
              >
                <Select 
                placeholder={"Select a location"}
                showSearch={true}
                options={LOCATION} />
              </Form.Item>

              <Form.Item
                label="Staff / Discipline"
                name="resource"
                initialValue={props.eventArgs.resource}
              >
                <Select 
                placeholder={"Select a Staff / Discipline"}
                showSearch={true}
                options={PROVIDERS.map(provider => {return {value:provider.id,label:provider.name}})}
                value={props.eventArgs.resource} />
              </Form.Item> */}

              <Form.Item
                label="Treatment"
                name="treatment"
                rules={[{ required: true, message: 'Treatment is required' }]}
                initialValue={props.eventArgs.treatment}
              >
                <Select 
                placeholder={"Select a treatment"}
                showSearch={true}
                mode="multiple"
                options={providerProducts} />
              </Form.Item>

              {/* <Form.Item
                label="Patient Name"
                name="patient"
                rules={[{ required: true, message: 'Patient is required' }]}
                initialValue={props.eventArgs.patientID}
              >
                <Select 
                placeholder={"Select Patient"}
                showSearch={true}
                disabled={true}
                options={PATIENTS.map(patient => {return {value:patient.PatientID,label:patient.Name}})}
                 />
              </Form.Item>

              <Form.Item
                label="What is the reason to visit?"
                name="visitReason"
                rules={[{ required: true, message: 'Visit reason is required' }]}
                initialValue={props.eventArgs.reasonToVisit}
              >
                <TextArea placeholder="What is the reason to visit?" autoSize />
              </Form.Item> */}

              <Form.Item
                label="From"
                name="start"
                rules={[{ required: true, message: 'Start time is required' }]}
                initialValue={dayjs(props.eventArgs.start)}
              >
                  <DatePicker showTime={{format:"HH:mm", hideDisabledOptions: true}} disabledTime={disabledDateTime} disabledDate={(current:any) => {
                      return dayjs().add(-1, 'days')  >= current;
                    }} defaultValue={dayjs(props.eventArgs.start)} minuteStep={systemConfig.minimumDuration} onSelect={handleDateSelection} onOk={onOk} format="DD-MM-YYYY HH:mm" />
              </Form.Item>

              <Form.Item
                label="To"
                name="end"
                rules={[{ required: true, message: 'End time is required' }]}
                initialValue={dayjs(props.eventArgs.end)}
              >
                <DatePicker showTime={{format:"HH:mm", hideDisabledOptions: true}} defaultValue={dayjs(props.eventArgs.end)} disabledDate={(current:any) => {
                      return dayjs().add(-1, 'days')  >= current;
                    }} minuteStep={systemConfig.minimumDuration} onChange={onChange} onOk={onOk} format="DD-MM-YYYY HH:mm" />
              </Form.Item>

              {postData.error && (
                <>
                  <br />
                  <span style={{ color: "red" }}>{postData.data}</span>
                </>
              )}
            </Form>
          </Modal>
        </>
    )
}

export default UpdateTimeSlotModal;