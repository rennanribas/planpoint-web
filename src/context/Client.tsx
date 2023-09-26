import React, { createContext, useState, useEffect } from 'react';
import { getClient } from '../api/Client';
import { Client } from '../types';

type ClientProviderProps = {
    children: React.ReactNode;
    clientId: string;
};

export type ClientContextType = {
    client: Client | null;
    setClient: React.Dispatch<React.SetStateAction<Client | null>>;
};

export const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<ClientProviderProps> = ({ children, clientId }) => {
    const [client, setClient] = useState<Client | null>(null);

    useEffect(() => {
        const fetchClientData = async () => {
            try {
                const clientData = await getClient(clientId);
                setClient(clientData);
            } catch (error) {
                console.error("Failed to fetch client data:", error);
            }
        };

        fetchClientData();
    }, [clientId]);

    return (
        <ClientContext.Provider value={{ client, setClient }}>
            {children}
        </ClientContext.Provider>
    );
};
