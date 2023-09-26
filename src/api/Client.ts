import { Client } from "../types";

const baseURL = process.env.REACT_APP_API_ENDPOINT;

export const getClient = async (clientId: string) => {
    try {
        const response = await fetch(`${baseURL}/clients/${clientId}`);
        const data: Client = await response.json();
        return data;
    } catch (error) {
        console.error('Error to fetch appointments:', error);
        throw error;
    }
};