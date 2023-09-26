import { Appointment } from "../types";

const baseURL = process.env.REACT_APP_API_ENDPOINT;

export const getAppointments = async (addressId: string, teamId: number) => {
    try {
        const response = await fetch(`${baseURL}/appointments/address/${addressId}/team/${teamId}`);
        const data: Appointment[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error to fetch appointments:', error);
        throw error;
    }
};