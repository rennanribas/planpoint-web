export type Address = {
    id: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
};

export type Client = {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    addresses: Address[];
};

export type Appointment = {
    id: number;
    startDate: Date;
    endDate: Date;
    comments: string;
    address: Address | null;
    team: Team;
};

export type Team = {
    id: number;
    name: string;
    description: string;
};
