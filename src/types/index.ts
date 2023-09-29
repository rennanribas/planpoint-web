export type Address = {
    id: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    regularSessionDuration: Interval;
    initialSessionDuration: Interval;
};

export type Interval = {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
}

export type Client = {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    addresses: Address[];
};

export type Appointment = {
    id: number;
    startDate: string;
    endDate: string;
    comments: string;
    address: Address | null;
    team: Team;
};

export type Team = {
    id: number;
    name: string;
    description: string;
    availabilities: Availability[];
};

export type Availability = {
    id: number;
    day: WeekDay;
    startTime: string; 
    endTime: string;
    teamId: number;
}

export enum WeekDay {
    Monday = 'Monday',
    Tuesday = 'Tuesday',
    Wednesday = 'Wednesday',
    Thursday = 'Thursday',
    Friday = 'Friday',
    Saturday = 'Saturday',
    Sunday = 'Sunday',
  }
