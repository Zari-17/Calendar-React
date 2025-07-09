import React from "react";
import UpdateTimeSlotModal from "@src/components/Forms/UpdateTimeSlotModal";

class calendarManager {
// const calendarManager = (props:any) => {
    // const [eventUpdateArgs, setEventUpdateArgs] = React.useState();
    // const [showUpdateTSModal, setShowUpdateTSModal] = React.useState(false);
    handleUpdateTSModal =() =>{
        // setShowUpdateTSModal(!showUpdateTSModal)
    }

    processUpdateTSRequest = (event:any, data: any) => {
        // console.log(data)
        // var e = calendarRef.current.control.events.find(event.id)
        // // console.log(e)
        // e.data.deliveryChannel = data.deliveryChannel
        // e.data.location = data.location
        // e.resource(data.resource)
        // e.data.treatment = data.treatment

        // calendarRef.current.control.events.update(e);
        // notify('Requested timeslot updated successfully','success');
      }

    renderUpdateTSModal = (args:any) => {
        // alert(args);
        // setEventUpdateArgs(args.source.data)
        // setShowUpdateTSModal(true);
        return (
            <>
            
                <UpdateTimeSlotModal toggleModal={true} eventArgs={args} onSubmit={this.processUpdateTSRequest} />
           
            </>
        )
    }
    
}
const calManager = new calendarManager(); 

export default calManager
    



