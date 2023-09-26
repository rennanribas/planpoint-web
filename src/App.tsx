import React from 'react';
import './App.css';
import AppointmentsCalendar from './components/AppointmentsCalendar';
import { ClientProvider } from './context/Client';
import { TeamProvider } from './context/Team';
import { AppointmentsProvider } from './context/Appointment';

const App: React.FC = () => {
  const clientId = new URLSearchParams(window.location.search).get("clientId");
  
  return (
      <div className="App">
          <h1>Appointments</h1>
          {clientId && 
            <ClientProvider clientId={clientId} >
              <TeamProvider>
                <AppointmentsProvider>
                  <AppointmentsCalendar/>
                </AppointmentsProvider>
              </TeamProvider>
            </ClientProvider>
          }
      </div>
  );
};

export default App;
