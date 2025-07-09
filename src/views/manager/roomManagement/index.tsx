import React, {Fragment} from "react";
import Manager from "@src/layouts/manager";
import  VisualForceRemotingManager  from '@src/services/remotingManager.service';
import {
    Row,
    Col,
    Space,
    Divider,
    Badge,
    Calendar,
    Tabs,
    Input,
    Card,
    theme,
    AutoComplete,
    Typography,
    Button as AntButton
} from 'antd';
import type { BadgeProps, TabsProps } from "antd";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'
import type { Dayjs } from 'dayjs';
import moment from 'moment'
// import type { CalendarMode } from 'antd/es/calendar/generateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { UserOutlined } from "@ant-design/icons";
import Scheduler from "@src/components/Scheduler";
import { Button } from "@mui/material";
import { EVENTS, PROVIDERS, PATIENTS, ROOMS, WAITINGROOM } from "@src/data";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

import {DayPilot, DayPilotCalendar, DayPilotNavigator} from "@daypilot/daypilot-lite-react";
import { CalendarMode } from "antd/es/calendar/generateCalendar";
import {systemConfig, eventColors} from '@src/config';
import helpers from "@src/services/helpers.service";

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import TrafficHandler from "@src/components/TrafficHandler";

dayjs.extend(utc)
dayjs.extend(tz)

const { Text, Link } = Typography;

const RoomManagement = () =>
{
  
  const [date,setDate] = React.useState(new Date());
  
  
  const [rooms, setRooms] = React.useState([
    { id: 'ExamRoom-1', name: 'Exam Room 1', visitors: [{ id: 'visitor-1', name: 'John Doe' }] },
    { id: 'ExamRoom-2', name: 'Exam Room 2', visitors: [{ id: 'visitor-2', name: 'Jane Smith' }, { id: 'visitor-3', name: 'Bob Johnson' }] },
    { id: 'ExamRoom-3', name: 'Exam Room 3', visitors: [] },
    { id: 'ExamRoom-4', name: 'Exam Room 4', visitors: [] },
    { id: 'ExamRoom-5', name: 'Exam Room 5', visitors: [] },
    { id: 'ExamRoom-6', name: 'Exam Room 6', visitors: [] },
    { id: 'ExamRoom-7', name: 'Exam Room 7', visitors: [] },
    { id: 'ExamRoom-8', name: 'Exam Room 8', visitors: [] },
    { id: 'ExamRoom-9', name: 'Exam Room 9', visitors: [] },
  ]);
  
  

  // React.useEffect(() => {
  //   var timer = setInterval(()=>setDate(new Date()), 1000 )
  //   return function cleanup() {
  //       clearInterval(timer)
  //   }

  // });

  return(
    <>
        <Manager>
          <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          <DndProvider backend={HTML5Backend}>
					<TrafficHandler/>
				</DndProvider>
          </Space>
        </Manager>
    </>
  )
}

export default RoomManagement;