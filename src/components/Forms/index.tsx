import React from "react";
import { Button, Modal, Form, Input, Radio, message, Descriptions } from 'antd';
import {PROVIDERS} from '@src/data'

type TransferModalProps = {
    events?: any,
    currentResource?: any,
    onSubmit?: any
    toggleModal?: any

}

const TransferModal = (props: TransferModalProps) => {

    const providers = PROVIDERS.map((provider) => {
      
    })

    const [form] = Form.useForm();
    const [visible, setVisible] = React.useState(true);
    const [postData, setPostData] = React.useState({
      loading: false,
      error: false,
      data: []
    });
    // let visibility = props.open;

    React.useEffect(() => {
      // setVisible(visibility);
      // visibility = false;
    })

    const toggleForm =() => {
      setVisible(false);
      props.toggleModal()
    }


    // const setVisible = (visibility:boolean) => {
    //   props.open = visibility
    // }

    const onSubmit = (values:any) => {
        setPostData({ ...postData, loading: true, error: false });
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
    };

    return (
        <>
            <Modal
            open={visible}
            title="Transfer Appointment"
            okText="Submit"
            cancelText="Cancel"
            onCancel={() => {
              toggleForm()
            }}
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
                      onSubmit(values);
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
            <Descriptions title="User Info">
              <Descriptions.Item label="From Provider">
                rerer
              </Descriptions.Item>

              <Descriptions.Item label="To Provider">
                <Form.Item
                  label="Provider"
                  name="provider"
                  rules={[
                    {
                      required: true,
                      message: ""
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Descriptions.Item>
            </Descriptions>
              
              <Form.Item
                label="Any other requirements/feedback (optional)"
                name="otherFeedback"
              >
                <Input type="textarea" />
              </Form.Item>
              <Form.Item label="How do we contact you? (optional)" name="contact">
                <Input />
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

type UpdateEventModalProps = {

}

const UpdateEventModal = (props: UpdateEventModalProps) => {

}

export default TransferModal;