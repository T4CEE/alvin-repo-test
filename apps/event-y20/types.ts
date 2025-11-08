
export enum Page {
  Home,
  PersonalDetails,
  RegistrationStatus,
  AttendanceType,
  TravelDetails,
  FlightDetails,
  Result,
}

export enum ResultType {
  UnregisteredSuccess,
  OnlineSuccess,
  NotFlyingSuccess,
  FinalSuccess,
  RedirectToOBT,
  Error,
}

export interface FormData {
  firstName: string;
  surname: string;
  email: string;
  countryCode: string;
  contactNumber: string;
  country: string;
  organization: string;
  passportNumber: string;
  registrationStatus?: 'registered' | 'not_registered';
  attendanceType?: 'online' | 'in_person';
  travelMethod?: 'plane_booked' | 'plane_not_booked' | 'not_plane';
  flightDetails?: {
    departureCity: string;
    arrivalCity: string;
    carrierCode: string;
    flightNumber: string;
    departureDate: string;
  };
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}
