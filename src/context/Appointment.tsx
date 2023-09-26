import React, { createContext, useState } from 'react';
import { getAppointments } from '../api/Appointment';
import { Appointment } from '../types';

type AppointmentsProviderProps = {
    children: React.ReactNode;
};

export type AppointmentsContextType = {
    appointments: Appointment[];
    setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
    loadAppointments: (addressId: string, teamId: number) => Promise<void>;
};

export const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined);


export const AppointmentsProvider: React.FC<AppointmentsProviderProps> = ({ children }) => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    const loadAppointments = async (addressId: string, teamId: number) => {
        try {
            const appointmentData = await getAppointments(addressId, teamId);
            setAppointments(appointmentData);
        } catch (error) {
            console.error("Failed to fetch appointment data:", error);
        }
    }

    return (
        <AppointmentsContext.Provider value={{ appointments, setAppointments, loadAppointments }}>
            {children}
        </AppointmentsContext.Provider>
    );
};
