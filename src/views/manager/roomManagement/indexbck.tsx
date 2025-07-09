import React, { useState } from 'react';
import { Row, Col, Card, Empty } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface Room {
  id: string;
  name: string;
  visitors: Visitor[];
}

interface Visitor {
  id: string;
  name: string;
}

interface Props {
  rooms: Room[];
}

const RoomManagement = () => {
  const [visitors, setVisitors] = useState([
    { id: 'visitor-1', name: 'John Doe' },
    { id: 'visitor-2', name: 'Jane Smith' },
    { id: 'visitor-3', name: 'Bob Johnson' },
    { id: 'visitor-4', name: 'Alice Lee' },
  ]);

  const [rooms, setRooms] = useState([
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
  const [state, setState] = useState(rooms);

  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const sourceRoom = state.find((room) => room.id === result.source.droppableId);
    const destinationRoom = state.find((room) => room.id === result.destination.droppableId);

    const visitor = sourceRoom.visitors[result.source.index];
    sourceRoom.visitors.splice(result.source.index, 1);
    destinationRoom.visitors.splice(result.destination.index, 0, visitor);

    setState([...state]);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Row gutter={[24, 24]}>
      <Col xs={24} sm={12} md={6} lg={6}>
          <Droppable droppableId={"patients"}>
          {(provided:any) => (

          <div ref={provided.innerRef} {...provided.droppableProps}>
          {
            visitors.map((visitor, index) => {
              // Render all draggables
              <Draggable key={visitor.id} draggableId={visitor.id} index={index}>
                          {(provided:any) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Card>{visitor.name}</Card>
                            </div>
                          )}
                        </Draggable>
            })
          }
                    {provided.placeholder}
                  </div>
                )}
            
            </Droppable>    
        </Col>
        {state.map((room) => (
          <Col key={room.id} xs={24} sm={12} md={6} lg={6}>
            <Card title={room.name}>
              <Droppable droppableId={room.id}>
                {(provided:any) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {room.visitors.length > 0 ? (
                      room.visitors.map((visitor, index) => (
                        <Draggable key={visitor.id} draggableId={visitor.id} index={index}>
                          {(provided:any) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Card>{visitor.name}</Card>
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <Empty />
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Card>
          </Col>
        ))}
        
      </Row>
    </DragDropContext>
  );
};

export default RoomManagement;