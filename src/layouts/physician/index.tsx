import React from "react";
import {
    Layout,
    Space,
    Typography,
    Col,
    Divider,
    Row,
    theme
} from 'antd';
import {
    CalendarOutlined,
    IdcardOutlined
} from '@ant-design/icons';
import { NavLink } from "react-router-dom";


const { Header, Footer, Sider, Content } = Layout;

const { useToken } = theme;
const {Text, Link} = Typography;



function PhysicianHome(props:any)
{
    const { token } = useToken();
    const {children} = props;
    
    return (
        <>
            <Layout style={{background:"#ffffff"}}>
                <Sider width={200} 
                        style={{ 
                            backgroundColor:token.colorPrimary,
                            overflow: 'auto',
                            height: '130vh',
                            left: 0,
                        }}>
                    <Row>
                        <Col span={24} style={{padding:"10px"}}>
                            {/* <Space>
                                <svg width="164" height="53" viewBox="0 0 164 53" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <rect x="89" width="75" height="53" rx="10" fill="url(#pattern0)"/>
                                    <path d="M0.24 37L0.576 30.196L0.24 17.68H10.74L10.432 20.676H4.132L3.964 25.632H9.564L9.256 28.6H3.852L3.824 29.72L4.02 34.032H10.796L10.488 37H0.24ZM18.1653 33.5H18.5293L19.4533 29.664L20.9653 22.748L24.4373 23.168L22.3373 30.112L20.5733 36.664L15.7853 37.084L14.1333 30.28L12.1173 23.476L15.9253 22.776L17.1293 28.936L18.1653 33.5ZM31.3242 34.144C31.8655 34.144 32.4348 34.004 33.0322 33.724C33.6295 33.444 34.0962 33.164 34.4322 32.884L34.9362 32.464L36.2242 34.032C36.0375 34.3493 35.7482 34.7133 35.3562 35.124C34.9642 35.5347 34.5628 35.8893 34.1522 36.188C33.7602 36.468 33.2282 36.7293 32.5562 36.972C31.9028 37.196 31.2215 37.308 30.5122 37.308C29.0002 37.308 27.7682 36.7387 26.8162 35.6C25.8642 34.4427 25.3882 32.9587 25.3882 31.148C25.3882 28.8707 26.0508 26.8733 27.3762 25.156C28.7015 23.4387 30.2508 22.58 32.0242 22.58C33.3868 22.58 34.4415 22.9627 35.1882 23.728C35.9535 24.4933 36.3362 25.5667 36.3362 26.948C36.3362 27.7693 36.1962 28.7027 35.9162 29.748L35.3562 30.336L28.3562 30.98C28.6735 33.0893 29.6628 34.144 31.3242 34.144ZM31.3242 25.464C30.5028 25.464 29.8122 25.8 29.2522 26.472C28.6922 27.1253 28.3655 27.9653 28.2722 28.992L33.0322 28.404C33.0882 27.9747 33.1162 27.62 33.1162 27.34C33.1162 26.0893 32.5188 25.464 31.3242 25.464ZM38.4723 23.476L41.8603 22.748C42.0283 24.1853 42.1403 25.548 42.1963 26.836C43.8949 24.204 45.4909 22.888 46.9843 22.888L46.6763 27.256C45.5936 27.256 44.7349 27.3587 44.1003 27.564C43.4843 27.7507 42.8496 28.1333 42.1963 28.712V29.72L42.5043 36.3L38.7523 37L39.0883 30.196C39.0136 27.6947 38.8083 25.4547 38.4723 23.476ZM53.8007 34.144C54.3421 34.144 54.9114 34.004 55.5087 33.724C56.1061 33.444 56.5727 33.164 56.9087 32.884L57.4127 32.464L58.7007 34.032C58.5141 34.3493 58.2247 34.7133 57.8327 35.124C57.4407 35.5347 57.0394 35.8893 56.6287 36.188C56.2367 36.468 55.7047 36.7293 55.0327 36.972C54.3794 37.196 53.6981 37.308 52.9887 37.308C51.4767 37.308 50.2447 36.7387 49.2927 35.6C48.3407 34.4427 47.8647 32.9587 47.8647 31.148C47.8647 28.8707 48.5274 26.8733 49.8527 25.156C51.1781 23.4387 52.7274 22.58 54.5007 22.58C55.8634 22.58 56.9181 22.9627 57.6647 23.728C58.4301 24.4933 58.8127 25.5667 58.8127 26.948C58.8127 27.7693 58.6727 28.7027 58.3927 29.748L57.8327 30.336L50.8327 30.98C51.1501 33.0893 52.1394 34.144 53.8007 34.144ZM53.8007 25.464C52.9794 25.464 52.2887 25.8 51.7287 26.472C51.1687 27.1253 50.8421 27.9653 50.7487 28.992L55.5087 28.404C55.5647 27.9747 55.5927 27.62 55.5927 27.34C55.5927 26.0893 54.9954 25.464 53.8007 25.464ZM65.4848 34.396C66.4555 34.396 66.9408 33.9667 66.9408 33.108C66.9408 32.8093 66.7261 32.5293 66.2968 32.268C65.8861 32.0067 65.3728 31.7453 64.7568 31.484C64.1595 31.2227 63.5528 30.9333 62.9368 30.616C62.3395 30.28 61.8261 29.8227 61.3968 29.244C60.9861 28.6653 60.7808 28.0027 60.7808 27.256C60.7808 26.0053 61.3315 24.9133 62.4328 23.98C63.5341 23.0467 64.8035 22.58 66.2408 22.58C66.9128 22.58 67.5661 22.664 68.2008 22.832C68.8541 22.9813 69.4795 23.224 70.0768 23.56L68.2008 26.976C68.0701 26.864 67.9021 26.724 67.6968 26.556C67.4915 26.388 67.0995 26.1733 66.5208 25.912C65.9608 25.632 65.4568 25.492 65.0088 25.492C64.5795 25.492 64.2435 25.5947 64.0008 25.8C63.7768 25.9867 63.6648 26.2573 63.6648 26.612C63.6648 26.948 63.9821 27.2933 64.6168 27.648C65.2701 27.984 65.9795 28.3013 66.7448 28.6C67.5101 28.88 68.2101 29.356 68.8448 30.028C69.4981 30.6813 69.8248 31.4653 69.8248 32.38C69.8248 33.6867 69.2835 34.8347 68.2008 35.824C67.1368 36.8133 65.9048 37.308 64.5048 37.308C63.6088 37.308 62.7688 37.112 61.9848 36.72C61.2195 36.328 60.6688 35.936 60.3328 35.544L59.8288 34.956L62.0408 32.38C62.1528 32.5293 62.3115 32.716 62.5168 32.94C62.7221 33.164 63.1235 33.4627 63.7208 33.836C64.3368 34.2093 64.9248 34.396 65.4848 34.396ZM73.3683 23.448V20.396L77.1483 19.668L76.7843 23.448H80.1723L79.8643 25.744H76.6723L76.5323 31.596C76.5323 32.4733 76.6163 33.0613 76.7843 33.36C76.9523 33.64 77.2603 33.78 77.7083 33.78C78.1563 33.78 78.7537 33.6773 79.5003 33.472L79.6683 35.46C78.4363 36.4867 77.3537 37 76.4203 37C75.487 37 74.7217 36.664 74.1243 35.992C73.527 35.3013 73.2283 34.4053 73.2283 33.304L73.3963 30.168L73.3683 25.744H71.4363L71.7443 23.448H73.3683Z" fill="white"/>
                                    <defs>
                                    <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                                    <use xlinkHref="#image0_0_1" transform="matrix(0.004 0 0 0.00566038 0 -0.0660377)"/>
                                    </pattern>
                                    <image id="image0_0_1" width="250" height="200" xlinkHref="data:image/png;base64,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"/>
                                    </defs>
                                </svg>
                            </Space> */}
                        </Col>
                        <Col span={24} style={{textAlign:'center', marginTop:"20px"}}>
                            <Space >
                                <Text style={{color:"#ffffff" }} >
                                    user: &nbsp;Admin
                                </Text>
                            </Space>
                        </Col>
                        <Divider></Divider>
                        <Col span={24}>
                            <Col span={24} style={{textAlign:"center", padding: "20px",background:"#ffffff"}}>
                                <NavLink to={'/physician/home'}>
                                    <Space direction="vertical">
                                    <CalendarOutlined />
                                Dashboard
                                </Space>
                                </NavLink>
                            </Col>  
                            <Col span={24} style={{textAlign:"center", padding: "20px",color:"#ffffff"}}>
                                <NavLink to={'/physician/calendar'}>
                                    <Space direction="vertical">
                                    <CalendarOutlined />
                                Calendar
                                </Space>
                                </NavLink>
                            </Col>  
                            <Col span={24} style={{textAlign:"center", padding: "20px",color:"#ffffff"}}>
                                <NavLink to={'/physician/patient'}>
                                    <Space direction="vertical">
                                    <IdcardOutlined />
                                Patients
                                    </Space>
                                </NavLink>
                            </Col>                                                     
                            <Col span={24} style={{textAlign:"center", padding: "20px",color:"#ffffff"}}>
                                <NavLink to={'/physician/profile'}>
                                    <Space direction="vertical">
                                    <IdcardOutlined />
                                Profile Management
                                    </Space>
                                </NavLink>
                            </Col>                                                     
                        </Col>
                    </Row>
                    <Row style={{position:"fixed", bottom:0, width:"200px"}}>
                        <Col span={24} style={{textAlign:"center", padding: "20px",color:"#ffffff"}}>
                            <NavLink to={'/'}>
                                <Space direction="vertical">
                                <IdcardOutlined />
                            Logout
                                </Space>
                            </NavLink>
                        </Col>        
                    </Row>
                </Sider>
                <Layout>
                    <Content>
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </>
    )
}

export default PhysicianHome