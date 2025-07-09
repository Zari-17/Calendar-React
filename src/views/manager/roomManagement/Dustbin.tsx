import React from 'react'
import type { CSSProperties, FC } from 'react'
import { memo } from 'react'
import { useDrop, useDrag } from 'react-dnd'
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
    Button as AntButton,
    Empty
} from 'antd';
import { ItemTypes } from './ItemTypes';
import helpers from '@src/services/helpers.service';

const style: CSSProperties = {
  height: '15rem',
  width: '15rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  color: 'white',
  padding: '1rem',
  textAlign: 'center',
  fontSize: '1rem',
  lineHeight: 'normal',
  float: 'left',
}

export interface DustbinProps {
    id: string
    name: string
    visitor: any
    accept: string[]
    lastDroppedItem?: any
    onDrop: (item: any) => void
    occupied?: any
}

export const Dustbin: FC<DustbinProps> = memo(function Dustbin({
  accept,
  name,
  visitor,
  id,
  lastDroppedItem,
  onDrop,
  occupied,
  
}) {
    // console.log(occupied,'occ')
  const [{ isOver, canDrop }, drop] = useDrop({
    accept,
    drop: onDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })
  const [{ opacity, isDragging }, drag] = useDrag(
    () => ({
    type:ItemTypes.BOX,
    item: { name:!!occupied[0] && !!occupied[0].patient[0] ? occupied[0].patient[0] : null ,id:!!occupied[0] ? occupied[0].id : null },
    collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
        isDragging: monitor.isDragging()
    }),
    }),
    [name, {type:ItemTypes.BOX}],
)

  const isActive = !occupied[0] ? true : false
  let backgroundColor = '#222'
  if (isActive) {
    backgroundColor = 'darkgreen'
  } else if (canDrop) {
    backgroundColor = 'darkkhaki'
  }
// console.log(isDragging && canDrop,'candrop')
 

  return (
    <Col span={5} ref={isActive ? drop : null} style={{ ...style }} data-testid={helpers.guid()}>
        <Card title={name} className={"room-card"} headStyle={{minHeight:40}} bodyStyle={{padding:18,textAlign:'center', height:'140px'}} bordered={false}>
        {isActive
        && visitor.name}
        {!isActive ? (
            <>
                <div ref={drag} >
                    <p>Patient: {occupied[0].patient}</p>
                    <p>Specialist: {occupied[0].provider}</p>
                </div>
            </>
      ) : <Empty imageStyle={{width:"40px", height:"40px"}} description={(<p style={{textAlign:"center"}}>Room available</p>)} />}
           
            {/* {
            !!PROVIDERS && PROVIDERS.map((provider) => {
                return provider.resourceId == room.provider ? <p>{provider.name}</p> : null
            })
            }
            {
            !!PATIENTS && PATIENTS.map((patient) => {
                return patient.PatientID.toString() === room.patient.toString() ? <AntButton type="primary" size={'large'} style={{backgroundColor:eventColors[room.status]}}>{patient.Name}</AntButton> : null
            })
            } */}
        </Card>
    </Col>
    // <div ref={drop} style={{ ...style, backgroundColor }} data-testid="dustbin">
    //     {name}
    //   {isActive
    //     ? 'Release to drop'
    //     : visitor.name}

    //   {lastDroppedItem && (
    //     <p>Last dropped: {JSON.stringify(lastDroppedItem)}</p>
    //   )}
    // </div>
  )
})