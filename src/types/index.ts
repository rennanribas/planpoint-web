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
