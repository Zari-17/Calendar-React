export interface TimeSlots {
    Timeslots?: TimeSlot
}

export interface TimeSlot {
    TimeSlot?: TimeSlotChild[] | undefined
}

export interface TimeSlotChild {
    TotalDuration: number,
    timeslotId?: string,
    correlationIds?: string
    status: string,
    station: Station,
    startTime: string,
    endtime: string,
    recordType: string | undefined,
    providerId: string,
    deliveryChannel: string,
    city: string,
    appointmentDate: string,
    Appointment: Appointment[] | null,
    timeSlotProducts?: TimeSlotProducts[] | null,
    DMLOperationTimeSlot: string | null
}

export interface TimeSlotProducts {
    productId: string,
    ProductDuration: string,
    Name: string,
    DMLOperationTimeslotProducts?: string | undefined
}

export interface Appointments {
    Appointment?: Appointment[]
}

export interface Appointment {
    status: string,
    providerId: string | undefined,
    timeslotId: string | undefined
    correlationId?: string | undefined
    product: string | undefined,
    description: string,
    conferencePhoneNumber?: string,
    conferenceLink?: string,
    conferenceId?: string,
    patient: Patient[] | null,
    appointmentId?: string | null,
    AppointmentStartTime?: string,
    AppointmentEndTime?: string,
    examRoom?: string | null
    DMLOperationAppointment?: string | null
}

export interface PatientProduct {
    ProductDuration: string,
    PatientProductsId: string,
    Name: string,
    DMLOperationPatientProducts: string
}

export interface Patient {
    PhoneNumber: number,
    PatientId: string,
    FirstName: string,
    LastName: string,
    HealthCardNumber: string,
    Gender: string,
    DOB: Date,
    location?: Location,
    DMLOperationPatient: null | string
    PatientProducts?: PatientProduct[]

}

export interface Location {
    province: string,
    postalCode: string,
    geoLocation: string,
    country: string,
    city: string,
    addressLine1: string,
    addressLine2: string
}

export interface Station {
    stationName: string,
    StationId: string,
    city: string,
    DMLOperationStation?: string | null
}

export interface Event {
    id: string,
    patientID: any,
    start: any,
    end: any,
    resourceId: any,
    correlationID?: any
    appointmentID?: any
    disabled?: boolean | undefined
    status?: string,
    type?: any
    deliveryChannel?: string,
    location?: string,
    treatment?: any,
    dob?: Date,
    cellnumber?: String,
    email?: String,
    title?: String,
    reasonToVisit?: String
    duration?: any
    appointment?: any
    treatmentProducts?: any
    subClassTimeSlot?:any
    timeSlotId?: any
    examRoom?: any
}

export interface Events {
    event: Event[] | undefined
}

export interface ProviderProduct {
    ProviderProductsId: string
    ProductDuration: string,
    Name: string,
    DMLOperationProviderProducts: string | null
}

export interface Provider {
    providerId: string
    timeSlotId?: []
    speciality?: string,
    providerProducts?: ProviderProduct[]
    providerEmail?: string,
    phoneNumber?: string,
    name?: string,
    location?: Location
    isActive?: boolean,
    Gender?: string,
    DMLOperationProvider?: string | null
}

export interface Resource {
    resourceId?: string
    name?: string
    speciality?: string
    mobile?: string
    station?: Station
}