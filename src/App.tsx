import React, { useState, useEffect } from 'react';
import './App.css';
import AppointmentsCalendar from './components/AppointmentsCalendar';
import { Client } from './types';

const App: React.FC = () => {
    const [client, setClient] = useState<Client | null>(null);
    
    useEffect(() => {
        const fetchClientData = async () => {
            const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/clients/3ea936e2-43e0-42bf-b7b0-f371042b4e96`);
            const data: Client = await response.json();
            setClient(data);
        };
        
        fetchClientData();
    }, []);

    return (
        <div className="App">
            <h1>Appointments</h1>
            {client && <AppointmentsCalendar client={client} />}
        </div>
    );
};

export default App;
