export const PATIENTS = [
  {
    "PatientID": 1090,
    "Name": "Peter",
    "DOB": "2000-09-22",
    "HealthCardNumber":"3434333",
    "MobilePhoneNumber": "28268323",
    "AlterNumber": "55646345",
    "Gener": "Male",
    "Email": "abc@hotmail.com"
  },
  {
    "PatientID": 1091,
    "Name": "Suzzaine",
    "DOB": "2003-03-22",
    "HealthCardNumber":"564534",
    "MobilePhoneNumber": "283434323",
    "AlterNumber": "54675",
    "Gener": "Female",
    "Email": "adef@hotmail.com"
  },
  {
    "PatientID": 1092,
    "Name": "Sammie",
    "DOB": "1990-09-22",
    "HealthCardNumber":"546754645",
    "MobilePhoneNumber": "98768576",
    "AlterNumber": "21323456",
    "Gener": "Female",
    "Email": "efi@hotmail.com"
  },
  {
    "PatientID": 1093,
    "Name": "Joshua",
    "DOB": "1986-12-19",
    "HealthCardNumber":"9926528",
    "MobilePhoneNumber": "19273799",
    "AlterNumber": "076397626",
    "Gener": "Male",
    "Email": "josh@hotmail.com"
  },
  {
    "PatientID": 1094,
    "Name": "Stephanie",
    "DOB": "2004-09-08",
    "HealthCardNumber":"3629883",
    "MobilePhoneNumber": "098273732",
    "AlterNumber": "6543782",
    "Gener": "Female",
    "Email": "steph@hotmail.com"
  },
];

export const EVENTS = [
    {
      id: 1,
      patientID: 1090,
      start: new Date(new Date(new Date().setHours(17)).setMinutes(30)),
      end: new Date(new Date(new Date().setHours(17)).setMinutes(45)),
      resourceId: 50430,
      status: 'booked',
      deliveryChannel: 'online',
      location: '4',
      treatment: 10,
      dob: '19/09/2006',
      cellnumber: '0283832892',
      email: 'abc@email.com',
      reasonToVisit:  'Acne Problem',
      disabled: false,
      title: PATIENTS.filter((patient:any) => patient.PatientID == 1090).map(patient => patient.Name).toString()
    },
    {
      id: 2,
      patientID: 1092,
      start: new Date(new Date(new Date().setHours(10)).setMinutes(0)),
      end: new Date(new Date(new Date().setHours(10)).setMinutes(15)),
      resourceId: 50431,
      status: 'completed',
      deliveryChannel: 'inclinic',
      location: '5',
      treatment: 9,
      dob: '19/08/1998',
      cellnumber: '02855442892',
      email: 'def@email.com',
      reasonToVisit:  'Gastric Pain',
      disabled: false,
      title: PATIENTS.filter((patient:any) => patient.PatientID == 1092).map(patient => patient.Name).toString()
    },
    {
      id: 4,
      text: "Riaz",
      patientID: 1094,
      start: new Date(
        new Date(new Date(new Date().setHours(9)).setMinutes(15)).setDate(
          new Date().getDate() - 2
        )
      ),
      end: new Date(
        new Date(new Date(new Date().setHours(9)).setMinutes(30)).setDate(
          new Date().getDate() - 2
        )
      ),
      resourceId: 50431,
      status: 'inexam',
      deliveryChannel: 'inclinic',
      location: '4',
      treatment: 10,
      dob: '19/09/2006',
      cellnumber: '0283832892',
      email: 'ghi@email.com',
      reasonToVisit:  'Body Ache',
      disabled: false,
      title: PATIENTS.filter((patient:any) => patient.PatientID == 1094).map(patient => patient.Name).toString()
    },
    {
      id: 5,
      patientID: 1091,
      start: new Date(
        new Date(new Date(new Date().setHours(10)).setMinutes(30)).setDate(
          new Date().getDate() - 1
        )
      ),
      end: new Date(
        new Date(new Date(new Date().setHours(10)).setMinutes(45)).setDate(
          new Date().getDate() -1
        )
      ),
      resourceId: 50433,
      status: 'cancelled',
      deliveryChannel: 'online',
      location: '5',
      treatment: 9,
      dob: '19/09/2006',
      cellnumber: '0283832892',
      email: 'jkl@email.com',
      reasonToVisit:  'Pain in Chest',
      disabled: false,
      title: PATIENTS.filter((patient:any) => patient.PatientID == 1091).map(patient => patient.Name).toString()
    },
    {
      id: 6,
      patientID: 1093,
      start: new Date(new Date(new Date().setHours(11)).setMinutes(15)),
      end: new Date(new Date(new Date().setHours(11)).setMinutes(30)),
      resourceId: 50431,
      status: 'arrived',
      deliveryChannel: 'online',
      location: '4',
      treatment: 10,
      dob: '19/09/2006',
      cellnumber: '0283832892',
      email: 'mni@email.com',
      reasonToVisit:  'Nausea',
      disabled: false,
      title: PATIENTS.filter((patient:any) => patient.PatientID == 1093).map(patient => patient.Name).toString()
    },
    {
      id: 7,
      patientID: 1090,
      start: new Date(
        new Date(new Date(new Date().setHours(17)).setMinutes(0)).setDate(
          new Date().getDate() - 1
        )
      ),
      end: new Date(
        new Date(new Date(new Date().setHours(17)).setMinutes(15)).setDate(
          new Date().getDate() - 1
        )
      ),
      resourceId: 50432,
      status: 'booked',
      deliveryChannel: 'inclinic',
      location: '4',
      treatment: 10,
      dob: '19/09/2006',
      cellnumber: '0283832892',
      email: 'pqr@email.com',
      reasonToVisit:  'Low to high fever',
      disabled: false,
      title: PATIENTS.filter((patient:any) => patient.PatientID == 1090).map(patient => patient.Name).toString()
    },
    {
      id: 8,
      patientID: 1092,
      start: new Date(
        new Date(new Date(new Date().setHours(14)).setMinutes(0)).setDate(
          new Date().getDate() - 1
        )
      ),
      end: new Date(
        new Date(new Date(new Date().setHours(14)).setMinutes(15)).setDate(
          new Date().getDate() - 1
        )
      ),
      resourceId: 50433,
      status: 'completed',
      deliveryChannel: 'online',
      location: '5',
      treatment: 10,
      dob: '19/09/2006',
      cellnumber: '0283832892',
      email: 'bvc@email.com',
      reasonToVisit:  'Chest Pain',
      disabled: false,
      title: PATIENTS.filter((patient:any) => patient.PatientID == 1092).map(patient => patient.Name).toString()
    },
    {
      id: 9,
      patientID: 1092,
      start: new Date(
        new Date(new Date(new Date().setHours(15)).setMinutes(5)).setDate(
          new Date().getDate() + 1
        )
      ),
      end: new Date(
        new Date(new Date(new Date().setHours(15)).setMinutes(20)).setDate(
          new Date().getDate() + 1
        )
      ),
      resourceId: 50432,
      status: 'noshow',
      deliveryChannel: 'inclinic',
      location: '5',
      treatment: 10,
      dob: '19/09/2006',
      cellnumber: '0283832892',
      email: 'tyr@email.com',
      reasonToVisit:  'Body Shivers',
      disabled: false,
      title: PATIENTS.filter((patient:any) => patient.PatientID == 1092).map(patient => patient.Name).toString()
    },
    {
      id: 10,
      patientID: 1090,
      start: new Date(
        new Date(new Date(new Date().setHours(16)).setMinutes(0)).setDate(
          new Date().getDate() + 1
        )
      ),
      end: new Date(
        new Date(new Date(new Date().setHours(16)).setMinutes(15)).setDate(
          new Date().getDate() + 1
        )
      ),
      resourceId: 50430,
      status: 'inexam',
      deliveryChannel: 'inclinic',
      location: '5',
      treatment: 9,
      dob: '19/09/2006',
      cellnumber: '0283832892',
      email: 'piu@email.com',
      reasonToVisit:  'Eye sight blurry',
      disabled: false,
      title: PATIENTS.filter((patient:any) => patient.PatientID == 1090).map(patient => patient.Name).toString()
    },
    {
      id: 11,
      patientID: 1091,
      start: new Date(
        new Date(new Date(new Date().setHours(20)).setMinutes(0)).setDate(
          new Date().getDate() - 1
        )
      ),
      end: new Date(
        new Date(new Date(new Date().setHours(20)).setMinutes(15)).setDate(
          new Date().getDate() - 1
        )
      ),
      resourceId: 50433,
      status: 'completed',
      deliveryChannel: 'online',
      location: '4',
      treatment: 9,
      dob: '19/09/2006',
      cellnumber: '0283832892',
      email: 'qwr@email.com',
      reasonToVisit:  'Routine checkup',
      disabled: false,
      title: PATIENTS.filter((patient:any) => patient.PatientID == 1091).map(patient => patient.Name).toString()
    }
  ];
  
  export const PROVIDERS = [
    {
      resourceId: "a0q2M00000Q6J5zQAF",
      name: "Dr. Peter Lawson",
      speciality: 1,
      mobile: "555666777",
      avatar: "",
      color: "#ab2d2d",
      station: {
        stationName: "Veterinary Clinic",
        StationId: "Station1",
        city: "Mississauga"
      }
    },
    {
      resourceId: 50431,
      name: "Dr. Sarah Jordan",
      speciality: 2,
      mobile: "545678354",
      avatar: "",
      color: "#58ab2d",
      station: {
        stationName: "Veterinary Clinic",
        StationId: "Station1",
        city: "Mississauga"
      }
    },
    {
      resourceId: 50432,
      name: "Dr. Joseph Ball",
      speciality: 1,
      mobile: "543678433",
      avatar: "",
      color: "#a001a2",
      station: {
        stationName: "Veterinary Clinic",
        StationId: "Station1",
        city: "Mississauga"
      }
    },
    {
      resourceId: 50433,
      name: "Dr. Mera Santiago",
      speciality: 6,
      mobile: "507487620",
      avatar: "",
      color: "#08c5bd",
      station: {
        stationName: "Veterinary Clinic",
        StationId: "Station1",
        city: "Mississauga"
      }
    },
    {
      resourceId: 50434,
      name: "Dr. Jordan Lynch",
      speciality: 6,
      mobile: "507487620",
      avatar: "",
      color: "#08c5bd",
      station: {
        stationName: "Veterinary Clinic",
        StationId: "Station1",
        city: "Mississauga"
      }
    },
    {
      resourceId: 50435,
      name: "Dr. Alexander Adams",
      speciality: "Dermatologist",
      mobile: "507487620",
      avatar: "",
      color: "#08c5bd"
    },
    {
      resourceId: 50436,
      name: "Dr. Vincent Adams",
      speciality: "Dermatologist",
      mobile: "507487620",
      avatar: "",
      color: "#08c5bd"
    },
    {
      resourceId: 50437,
      name: "Dr. Darryl Marvin",
      speciality: "Dermatologist",
      mobile: "507487620",
      avatar: "",
      color: "#08c5bd"
    },
    {
      resourceId: 50438,
      name: "Dr. Vivian Carter",
      speciality: "Dermatologist",
      mobile: "507487620",
      avatar: "",
      color: "#08c5bd"
    },
    {
      resourceId: 50439,
      name: "Dr. Paula Obrien",
      speciality: "Dermatologist",
      mobile: "507487620",
      avatar: "",
      color: "#08c5bd"
    },
    {
      resourceId: 50441,
      name: "Dr. Allison Henry",
      speciality: "Dermatologist",
      mobile: "507487620",
      avatar: "",
      color: "#08c5bd"
    },
    {
      resourceId: 50442,
      name: "Dr. Janie Gibbs",
      speciality: "Dermatologist",
      mobile: "507487620",
      avatar: "",
      color: "#08c5bd"
    },
    {
      resourceId: 50443,
      name: "Dr. Monica Lucas",
      speciality: "Dermatologist",
      mobile: "507487620",
      avatar: "",
      color: "#08c5bd"
    },
    {
      resourceId: 50444,
      name: "Dr. Kristy Dawson",
      speciality: "Dermatologist",
      mobile: "507487620",
      avatar: "",
      color: "#08c5bd"
    },
    {
      resourceId: 50445,
      name: "Dr. Ken Benson",
      speciality: "Dermatologist",
      mobile: "507487620",
      avatar: "",
      color: "#08c5bd"
    },
    
  ];

  

  export const ROOMS = [
    {
      id: 10211,
      name: 'Exam Room 1',
      status: 'inexam',
      provider: 50430,
      patient: 1090
    },
    {
      id: 10212,
      name: 'Exam Room 2',
      status: 'booked',
      provider: 50433,
      patient: ''
    },
    {
      id: 10213,
      name: 'Exam Room 3',
      status: 'completed',
      provider: 50432,
      patient: 1092
    },
    {
      id: 10214,
      name: 'Exam Room 4',
      status: 'booked',
      provider: 50431,
      patient: 1091
    },
    {
      id: 10215,
      name: 'Exam Room 5',
      status: 'cancelled',
      provider: 50434,
      patient: 1093
    },
  ]

  export const SPECIALIZATIONS = [
    {
      value: 1,
      label: "Allergists/Immunologists"
    },
    {
      value: 2,
      label: "Anesthesiologists"
    },
    {
      value: 3,
      label: "Cardiologists"
    },
    {
      value: 4,
      label: "Colon and Rectal Surgeons"
    },
    {
      value: 5,
      label: "Critical Care Medicine Specialists"
    },
    {
      value: 6,
      label: "Dermatologists"
    },
    {
      value: 7,
      label: "Endocrinologists"
    },
    {
      value: 8,
      label: "Emergency Medicine Specialists"
    },
    {
      value: 9,
      label: "Family Physicians"
    },
    {
      value: 10,
      label: "Gastroenterologists"
    },
    {
      value: 11,
      label: "Geriatric Medicine Specialists"
    },
    {
      value: 12,
      label: "Hematologists"
    },
    {
      value: 13,
      label: "Hospice and Palliative Medicine Specialists"
    },
    {
      value: 14,
      label: "Infectious Disease Specialists"
    },
    {
      value: 15,
      label: "Internists"
    },
    {
      value: 16,
      label: "Medical Geneticists"
    },
    {
      value: 17,
      label: "Nephrologists"
    },
    {
      value: 18,
      label: "Neurologists"
    },
    {
      value: 19,
      label: "Obstetricians and Gynecologists"
    },
    {
      value: 20,
      label: "Oncologists"
    },
    {
      value: 21,
      label: "Ophthalmologists"
    },
    {
      value: 22,
      label: "Osteopaths"
    },
    {
      value: 23,
      label: "Otolaryngologists"
    },
    {
      value: 24,
      label: "Pathologists"
    },
    {
      value: 25,
      label: "Pediatricians"
    },
    {
      value: 26,
      label: "Physiatrists"
    },
    {
      value: 27,
      label: "Plastic Surgeons"
    },
    {
      value: 28,
      label: "Podiatrists"
    },
    {
      value: 29,
      label: "Preventive Medicine Specialists"
    },
    {
      value: 30,
      label: "Psychiatrists"
    },
    {
      value: 31,
      label: "Pulmonologists"
    },
    {
      value: 32,
      label: "Radiologists"
    },
    {
      value: 33,
      label: "Rheumatologists"
    },
    {
      value: 34,
      label: "General Surgeons"
    },
    {
      value: 35,
      label: "Urologists"
    }
  ]

  export const WAITINGROOM = [
    {
        id: 10212,
        patient: 1094,
        provider: 50434,
        arrivalTime: '2023-03-24 19:20:22',
        appointmentTime: '2023-03-24 19:00:00'
    }
  ]

  export const DELIVERYCHANNEL = [
    {
      label: 'In Clinic',
      value: 'inclinic',
    },
    {
      label: 'Video',
      value: 'online',
    },
    {
      label: 'Phone',
      value: 'phone',
    },
  ];

  export const LOCATION = [
    {
      label: 'Toronto',
      value: '4',
    },
    {
      label: 'California',
      value: '5',
    },
  ];

  export const TREATMENT = [
    {
      label: 'Chiropractic Initial Assessment',
      value: 'a0r2M00000PF6a4QAD',
    },
    {
      label: 'Routine Checkup',
      value: 'a0r2M00000PF77EQAT',
    },
  ]

  export var STATION = {
    stationName: "Toroto Xray",
    StationId: "a0u2M00000bGqhbQAC",
    city: "toronto"
  }

  export const PATIENTLOCATION = {
      "province": "Ontario",
      "postalCode": "M1T3P5",
      "geoLocation": "",
      "country": "Canada",
      "city": "Brampton",
      "addressLine2": " ",
      "addressLine1": "23 Adward Street"
  }
  