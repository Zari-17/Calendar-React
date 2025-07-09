import React from 'react';
import type { CSSProperties, FC } from 'react';
import { memo } from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { List, Typography, Card } from 'antd';
import dayjs from 'dayjs';
import helpers from '@src/services/helpers.service';
import moment from 'moment';
import 'moment-timezone';

const style: CSSProperties = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move',
  float: 'left',
};

export interface BoxProps {
  id: string;
  name: string;
  type: any;
  isDropped: boolean;
  boxData: any;
  roomID?: any;
}

export const Box: FC<BoxProps> = memo(function Box({
  name,
  id,
  type,
  boxData,
  isDropped,
  roomID,
}) {
  moment.tz.setDefault('America/New_York');
  const [date, setDate] = React.useState(new Date());
  const [{ opacity }, drag] = useDrag(
    () => ({
      type: ItemTypes.BOX,
      item: { name, id, roomID },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [name, type],
  );
  const { Text, Link } = Typography;

  React.useEffect(() => {
    var timer = setInterval(() => setDate(new Date()), 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  });

  return (
    !isDropped && (
      <Card
        size='small'
        ref={drag}
        title={name}
        style={{ width: 220 }}
        bodyStyle={{ fontSize: '11px' }}
      >
        <table>
          <tr>
            <td style={{ textAlign: 'left', width: '60%' }}>Specialist</td>
            <td style={{ textAlign: 'right', width: '40%' }}>
              {boxData.provider}
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: 'left' }}>Treatment</td>
            <td style={{ textAlign: 'right' }}>{boxData.treatment}</td>
          </tr>
          <tr>
            <td style={{ textAlign: 'left' }}>Appointment Time</td>
            <td style={{ textAlign: 'right' }}>
              {dayjs(boxData.appointmentTime).format('h:mm a')}
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: 'left' }}>Arrival</td>
            <td style={{ textAlign: 'right' }}>
              {!!boxData.appointmentTime && !!boxData.arrivalTime
                ? dayjs(boxData.arrivalTime).format('h:mm a')
                : null}
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: 'left' }}>Time waited</td>
            <td style={{ textAlign: 'right' }}>
              {!!boxData.appointmentTime && !!boxData.arrivalTime ? (
                <Text
                  style={{ fontSize: '11px' }}
                  type={
                    dayjs().diff(dayjs(boxData.appointmentTime), 'minute', true) > 5
                      ? 'danger'
                      : null
                  }
                >
                  {helpers.secondsToDhms(
                    dayjs().diff(dayjs(boxData.appointmentTime), 'second', true),
                  )}{' '}
                </Text>
              ) : null}
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: 'left' }}>Status</td>
            <td style={{ textAlign: 'right' }}>
              {!!boxData.appointmentTime && !!boxData.arrivalTime
                ? dayjs(boxData.appointmentTime).diff(
                    boxData.arrivalTime,
                    'minute',
                  ) >= 1
                  ? 'On Time'
                  : 'Late'
                : null}
            </td>
          </tr>
        </table>
      </Card>
    )
  );
});
