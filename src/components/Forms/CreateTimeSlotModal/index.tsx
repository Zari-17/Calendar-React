import React from "react";
import { Button, Modal, Form, Input, Radio, message, Descriptions, Select, DatePicker, Row, Col } from 'antd';
import {PROVIDERS, PATIENTS, DELIVERYCHANNEL, LOCATION, TREATMENT} from '@src/data'
import dayjs from 'dayjs';
import type {Dayjs} from 'dayjs';
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import { systemConfig } from '@src/config'

import { RootState } from "@src/redux/features";
import { useDispatch, useSelector } from "react-redux";

type CreateTimeSlotModalProps = {
    eventArgs?: any,
    currentResource?: any,
    onSubmit?: any
    toggleModal?: any

}

const CreateTimeSlotModal = (props: CreateTimeSlotModalProps) => {

    const providers = PROVIDERS.map((provider) => {
      
    })

    const [form] = Form.useForm();
    const [visible, setVisible] = React.useState(true);
    const [postData, setPostData] = React.useState({
      loading: false,
      error: false,
      data: []
    });
    const { TextArea } = Input;
    // let visibility = props.open;

    const calendarProviderProducts: any = useSelector(
      (state: RootState) => state.calendar.providerProducts
    );

    let providerProducts:any = [];
    console.log(calendarProviderProducts[0].product)
    providerProducts = Object.entries(calendarProviderProducts[0].product).map((cpp:any)=>{return {value:cpp[1].productID, label:cpp[1].productName}})
    console.log(providerProducts)
    const toggleForm =() => {
      setVisible(false);
      props.toggleModal()
    }

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
            title="Book Timeslot"
            okText="Submit"
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
                <Row>
                    <Col span={24}>
                        <Form.Item
                            label="Delivery Channel"
                            name="deliveryChannel"
                            rules={[{ required: true, message: 'Delivery channel is required' }]}
                        >
                            <Select 
                            placeholder={"Select a delivery channel"}
                            showSearch={true}
                            options={DELIVERYCHANNEL} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Treatment"
                            name="treatment"
                            rules={[{ required: true, message: 'Treatment is required' }]}
                        >
                            <Select 
                            placeholder={"Select a treatment"}
                            showSearch={true}
                            mode="multiple"
                            options={providerProducts} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="From"
                            name="start"
                            rules={[{ required: true, message: 'Start time is required' }]}
                            valuePropName={'date'}
                            initialValue={dayjs(props.eventArgs.start)}
                        >
                            <DatePicker showTime={{format:"HH:mm"}} defaultValue={dayjs(props.eventArgs.start)} minuteStep={systemConfig.minimumDuration} onOk={onOk} format="DD-MM-YYYY HH:mm" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="To"
                            name="end"
                            rules={[{ required: true, message: 'End time is required' }]}
                            valuePropName={'date'}
                            initialValue={dayjs(props.eventArgs.end)}
                        >
                            <DatePicker showTime={{format:"HH:mm", hideDisabledOptions: true,
                            }} defaultValue={dayjs(props.eventArgs.end)} minuteStep={systemConfig.minimumDuration} onChange={onChange} onOk={onOk} format="DD-MM-YYYY HH:mm" />
                        </Form.Item>
                    </Col>
                </Row>

              {/* <Form.Item
                label="Location"
                name="location"
                rules={[{ required: true, message: 'Location is required' }]}
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
                disabled={true}
                value={props.eventArgs.resource} />
              </Form.Item>

              <Form.Item
                label="Treatment"
                name="treatment"
                rules={[{ required: true, message: 'Treatment is required' }]}
              >
                <Select 
                placeholder={"Select a treatment"}
                showSearch={true}
                options={TREATMENT} />
              </Form.Item>

              <Form.Item
                label="Patient Name"
                name="patient"
                rules={[{ required: true, message: 'Patient is required' }]}
              >
                <Select 
                placeholder={"Select Patient"}
                showSearch={true}
                options={PATIENTS.map(patient => {return {value:patient.PatientID,label:patient.Name}})}
                 />
              </Form.Item>

              <Form.Item
                label="Appointment Start"
                name="start"
                rules={[{ required: true, message: 'Start is required' }]}
                valuePropName={'date'}
                initialValue={dayjs(props.eventArgs.start)}
              >
                <DatePicker showTime={{format:"HH:mm"}} defaultValue={dayjs(props.eventArgs.start)} minuteStep={systemConfig.minimumDuration} onOk={onOk} format="DD-MM-YYYY HH:mm" />
              </Form.Item>

              <Form.Item
                label="Appointment End"
                name="end"
                rules={[{ required: true, message: 'End is required' }]}
                valuePropName={'date'}
                initialValue={dayjs(props.eventArgs.end).subtract(systemConfig.minimumDuration,'minutes')}
              >
                <DatePicker showTime={{format:"HH:mm", hideDisabledOptions: true,
                   }} defaultValue={dayjs(props.eventArgs.end).subtract(systemConfig.minimumDuration,'minutes')} minuteStep={systemConfig.minimumDuration} onChange={onChange} onOk={onOk} format="DD-MM-YYYY HH:mm" />
              </Form.Item>

              <Form.Item
                label="What is the reason to visit?"
                name="visitReason"
                rules={[{ required: true, message: 'Visit reason is required' }]}
              >
                <TextArea placeholder="What is the reason to visit?" autoSize />
              </Form.Item> */}

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

export default CreateTimeSlotModal;