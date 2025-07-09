import React from 'react'
import update from 'immutability-helper'
import type { FC } from 'react'
import { memo, useCallback, useState } from 'react'
import { NativeTypes } from 'react-dnd-html5-backend'

import { Box } from './Box'
import { Dustbin } from '@src/views/manager/roomManagement/Dustbin'
import { ItemTypes } from '@src/views/manager/roomManagement/ItemTypes'
import {Empty, List, Row} from 'antd'

import { RootState } from "@src/redux/features";
import { useDispatch, useSelector } from "react-redux";

import dayjs from 'dayjs'

interface DustbinState {
    id: string
    name: string
    accepts?: string[]
    visitors?: any
    lastDroppedItem?: any
    occupied?: any
}

interface BoxState {
  name: string
  type?: string
}

export interface DustbinSpec {
  accepts: string[]
  lastDroppedItem: any
}
export interface BoxSpec {
  name: string
  type: string
}
export interface ContainerState {
  droppedBoxNames: string[]
  dustbins: DustbinSpec[]
  boxes: BoxSpec[]
}

interface ContainerProps {
    waitingRoom:any
    examRoom: any
    setTransferredRoom?:any
    setExamRoom?:any
}

const Container  = memo(function Container(props:ContainerProps) {

    const calendarEvents: any = useSelector(
        (state: RootState) => state.calendar.events
    );
    const calendarProviders: any = useSelector(
        (state: RootState) => state.calendar.providers
    );

    const calendarCurrentDate: any = useSelector(
    (state: RootState) => state.calendar.value
    );

    const calendarPatients: any = useSelector(
    (state:RootState)  => state.calendar.patients
    );

    const calendarProviderProducts: any = useSelector(
    (state:RootState)  => state.calendar.providerProducts
    );

    let providerProducts:any = [];
      // console.log(calendarProviderProducts[0].product)
    providerProducts = calendarProviderProducts.length && Object.entries(calendarProviderProducts[0].product).map((cpp:any)=>{return {value:cpp[1].productID, label:cpp[1].productName}})

  const [dustbins, setDustbins] = useState<DustbinState[]>([
    { id: 'ExamRoom-1', name: 'Exam Room 1', visitors: [], accepts:[ItemTypes.BOX] },
    { id: 'ExamRoom-2', name: 'Exam Room 2', visitors: [], accepts:[ItemTypes.BOX] },
    { id: 'ExamRoom-3', name: 'Exam Room 3', visitors: [], accepts:[ItemTypes.BOX] },
    { id: 'ExamRoom-4', name: 'Exam Room 4', visitors: [], accepts:[ItemTypes.BOX] },
    { id: 'ExamRoom-5', name: 'Exam Room 5', visitors: [], accepts:[ItemTypes.BOX] },
    { id: 'ExamRoom-6', name: 'Exam Room 6', visitors: [], accepts:[ItemTypes.BOX] },
    { id: 'ExamRoom-7', name: 'Exam Room 7', visitors: [], accepts:[ItemTypes.BOX] },
    { id: 'ExamRoom-8', name: 'Exam Room 8', visitors: [], accepts:[ItemTypes.BOX] },
    { id: 'ExamRoom-9', name: 'Exam Room 9', visitors: [], accepts:[ItemTypes.BOX] },
    // { accepts: [ItemTypes.GLASS], lastDroppedItem: null },
    // { accepts: [ItemTypes.FOOD], lastDroppedItem: null },
    // {
    //   accepts: [ItemTypes.PAPER, ItemTypes.GLASS, NativeTypes.URL],
    //   lastDroppedItem: null,
    // },
    // { accepts: [ItemTypes.PAPER, NativeTypes.FILE], lastDroppedItem: null },
  ])

  const [boxes] = useState<BoxState[]>([
    { name: 'Bottle' },
    { name: 'Banana'},
    { name: 'Magazine' },
  ])

  const [date,setDate] = React.useState(new Date());

   React.useEffect(() => {
    var timer = setInterval(()=>setDate(new Date()), 1000 )
    return function cleanup() {
        clearInterval(timer)
    }

  });

  const [droppedBoxNames, setDroppedBoxNames] = useState<string[]>([])
 
  const isDropped = (boxName: string) => {
    
    // console.log(droppedBoxNames)
    //   props.setTrasnferredRoom({eventID: boxName})
    return droppedBoxNames.indexOf(boxName.trim()) > -1
  }

  const handleDrop = useCallback(
    (index: number, item: { name: string}, roomID?: any) => {
      const { name } = item
      setDroppedBoxNames(
        update(droppedBoxNames, name ? { $push: [name.trim()] } : { $push: [] }),
      )
      props.setTransferredRoom({...item,roomID})
      setDustbins(
        update(dustbins, {
          [index]: {
            lastDroppedItem: {
              $set: {...item,roomID},
            },
            occupied: {
                $set: !!props.examRoom && props.examRoom.find((exr:any) => {return exr.roomID.trim() == roomID.trim()})
            }
          },
        }),
      )
      
    },
    [droppedBoxNames, dustbins],
  )

  const filterOccupiedRoom = (roomID:any) => {
    let occupiedRoom = !!calendarEvents && calendarEvents.filter((exr:any) => {return exr.examRoom == roomID && exr.status == 'inexam'}).map((exr:any) => { return {
        id: exr.id,
        roomID: roomID,
        patient: calendarPatients && calendarPatients.filter((patient:any) => {
        return patient.PatientId.toString() === exr.patientID.toString()
        }).map((patient:any) => (`${patient.FirstName} ${patient.LastName || ''}`)),
        provider: calendarProviders && calendarProviders.filter((provider:any) => {
        return provider.resourceId == exr.resourceId
        }).map((provider:any) => provider.name),
        treatment: providerProducts && providerProducts.filter((prod:any) => {
        return prod.value == exr.treatment
        }).map((prod:any) => prod.label),
        arrivalTime: !!exr.statusChangedAt ? dayjs(exr.statusChangedAt).format('YYYY-MM-DD HH:mm:ss') : dayjs(exr.start).add(15,'minutes').format('YYYY-MM-DD HH:mm:ss'),
        appointmentTime: dayjs(exr.start).format('YYYY-MM-DD HH:mm:ss')
    }
    })
    return occupiedRoom
  }

  return (
    <div>
    <div style={{
        height: 350,
        overflow: 'auto',
        padding: '20px',
        margin: '0 auto',
        border: '1px solid rgba(140, 140, 140, 0.35)',
        clear: 'both'
      }}>
        <List
             header={<div>Waiting Area (Current Time: {date.toLocaleTimeString(navigator.language, {
                hour: '2-digit',
                minute:'2-digit'
              })})</div>}
        >
        {props.waitingRoom.map((waiting:any,index:any) => (
            // console.log(waiting),
                <Box
                    id={waiting.id}
                    name={waiting.patient[0]}
                    type={ItemTypes.BOX}
                    isDropped={isDropped(waiting.patient[0])}
                    key={index}
                    boxData={waiting}
                />
                ))}
        </List>
      </div>

      <div style={{ overflow: 'hidden', clear: 'both' }}>
        <Row gutter={[50,5]} justify={'center'}>
        {dustbins.map(({ accepts, lastDroppedItem, name, visitors,id, occupied}, index) => (
          <Dustbin
            accept={accepts}
            lastDroppedItem={lastDroppedItem}
            onDrop={(item) => handleDrop(index, item, id)}
            key={index}
            name={name}
            visitor={visitors}
            id={id}
            occupied={(filterOccupiedRoom(id))  || null}

          />
        ))}
        </Row>
      </div>

      
    </div>
  )
})

export default Container;