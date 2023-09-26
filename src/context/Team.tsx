import React, { createContext, useState, useEffect } from 'react';
import { getTeams } from '../api/Team';
import { Team } from '../types';

type TeamProviderProps = {
    children: React.ReactNode;
};

export type TeamContextType = {
    teams: Team[];
    setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
};

export const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider: React.FC<TeamProviderProps> = ({ children }) => {
    const [teams, setTeams] = useState<Team[]>([]);

    useEffect(() => {
        const fetchTeamData = async () => {
            try {
                const teamData = await getTeams(); // Assumindo que esta função retorna todos os times.
                setTeams(teamData);
            } catch (error) {
                console.error("Failed to fetch team data:", error);
            }
        };

        fetchTeamData();
    }, []);

    return (
        <TeamContext.Provider value={{ teams, setTeams }}>
            {children}
        </TeamContext.Provider>
    );
};
