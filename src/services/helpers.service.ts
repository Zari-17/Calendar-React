import  VisualForceRemotingManager  from "@src/services/remotingManager.service"
class Helpers {
    secondsToDhms(seconds:any) {
        seconds = Number(seconds)
        var d = Math.floor(seconds / (3600 * 24))
        var h = Math.floor((seconds % (3600 * 24)) / 3600)
        var m = Math.floor((seconds % 3600) / 60)
        var s = Math.floor(seconds % 60)
        // console.log(d, h, m, s)
        var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : ""
        var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : ""
        var mDisplay = m > 0 ? m + (m == 1 ? " ', " : " ' ") : ""
        var sDisplay = s > 0 ? s + (s == 1 ? " \"" : " \"") : ""
        return dDisplay + hDisplay + mDisplay + sDisplay
    }
    getLocalISOString(date:any) {
        const offset = date.getTimezoneOffset()
        const offsetAbs = Math.abs(offset)
        const isoString = new Date(date.getTime() - offset * 60 * 1000).toISOString()
        return `${isoString.slice(0, -1)}${offset > 0 ? '-' : '+'}${String(Math.floor(offsetAbs / 60)).padStart(2, '0')}:${String(offsetAbs % 60).padStart(2, '0')}`
      }
    guid() {
        return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
    }
    callMyRemoteAction (event: any, method?:any) : Promise<any> {
        return new Promise((resolve, reject) => {
        // console.log(event)
        const eventString =  JSON.stringify(event);
        console.log("event details" +eventString);
          if(process.env.REACT_APP_SALESFORCE_CONNECT == "true")
          {
          
            VisualForceRemotingManager.invoke('schedulingAppController', method, eventString)
              .then((result: any) => { 
                // do something here
                //  setTimeSlots(JSON.parse(result))
                console.log(result);
                resolve({success:true,data:result});
              })
              .catch((error: any) => {
                console.log(error);
                resolve({success:false,message:"An error occurred while processing your request"})
              })
          }
          else
          {
            let result:any = [];
            result[event.TimeSlot[0].correlationIds] = event.TimeSlot[0].timeslotId
            resolve({success:true,data:JSON.stringify({})});
          }
        });
    }
}

const helpers = new Helpers();
export default helpers
