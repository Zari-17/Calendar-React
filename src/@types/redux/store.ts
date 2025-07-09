interface InitialState {
    value: string;
    events: any;
    providers: any;
    patients: any;
    providerProducts: any;
    view: string;
    // rooms: any;
    // specilizations: any;
    // waitingroom: any;

  }
  const UpdateCalendarAction: string = "calendar";
  
  export default InitialState;
  export { UpdateCalendarAction };