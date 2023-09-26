// api/Teams.ts
import { Team } from '../types';

const baseURL = process.env.REACT_APP_API_ENDPOINT;

export const getTeams = async (): Promise<Team[]> => {
    try {
        const response = await fetch(`${baseURL}/teams`);
        const data: Team[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error to fetch teams:', error);
        throw error;
    }
};
