import React, { useState, ChangeEvent, useEffect, useContext } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { ClientContext } from '../context/Client';
import { AppointmentsContext } from '../context/Appointment';
import { TeamContext } from '../context/Team';
import { Value } from 'react-calendar/dist/cjs/shared/types';

const AppointmentsCalendar: React.FC = () => {
    const clientContext = useContext(ClientContext);
    const appointmentContext = useContext(AppointmentsContext);
    const teamContext = useContext(TeamContext);

    if (!clientContext || !appointmentContext || !teamContext) {
        throw new Error("Contexts must be initialized.");
    }

    const { client } = clientContext;
    const { loadAppointments, appointments } = appointmentContext;
    const { teams } = teamContext;

    const [selectedTeam, setSelectedTeam] = useState<number | null>(teams[0]?.id || null);
    const [date, setDate] = useState<Date | null>(null);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

    const isSingleDate = (value: any): value is Date => {
      return value instanceof Date;
    };

    const dateHasAppointments = (date: Date) => {
        const isoDate = date.toISOString().split('T')[0];
        return appointments.some(appointment => new Date(appointment.startDate).toISOString().split('T')[0] === isoDate);
    };

    const handleDateClick = (value: Value) => {
        if (isSingleDate(value)) {
            setDate(value);
        } else if (Array.isArray(value) && value.length > 0) {
            setDate(value[0]); 
        }
    }

    const handleAddressChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedAddressId(event.target.value);
    };

    useEffect(() => {
      if (teams.length > 0) {
          setSelectedTeam(teams[0].id);
      }
    }, [teams]); 

    useEffect(() => {
      if (client) {
        setSelectedAddressId(client.id);
      }
    }, [client]); 

    useEffect(() => {
      if (selectedAddressId && selectedTeam) {
          loadAppointments(selectedAddressId, selectedTeam);
      }
  }, [selectedAddressId, selectedTeam]);

  console.log(selectedTeam, appointments)

    return (
      <div className="client-details">
        {client && selectedTeam && teams.length > 0 && <>
            <h2>{client.name}</h2>
            <p>Email: {client.email}</p>
            <p>Phone Number: {client.phoneNumber}</p>
            
            <label htmlFor="addressDropdown">Select an Address: </label>
            <select 
                id="addressDropdown" 
                value={selectedAddressId || ""} 
                onChange={handleAddressChange}
            >
                {client.addresses.map(address => (
                    <option key={address.id} value={address.id}>
                        {address.streetAddress}, {address.city}, {address.state} - {address.zipCode}
                    </option>
                ))}
            </select>

            <label htmlFor="addressDropdown">Select an Team: </label>
            <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value ? parseInt(e.target.value) : 0)}>
              {teams.map(team => (
                <option key={team.id} value={team.id}>
                      {team.name}
                </option>
              ))}
            </select>
            <div className="calendar-wrapper">
                <Calendar 
                    onChange={handleDateClick} 
                    value={date}
                    tileClassName={({ date, view }) => dateHasAppointments(date) ? "hasAppointments" : ""}
                />
            </div>

            {date && (
                <div className="appointment-list">
                    <h3>Appointments for {date.toLocaleDateString()}:</h3>
                    {appointments
                        .filter(appointment => new Date(appointment.startDate).toDateString() === date.toDateString())
                        .map(appointment => (
                            <div key={appointment.id}>
                                {new Date(appointment.startDate).toLocaleTimeString()} - {new Date(appointment.endDate).toLocaleTimeString()}
                            </div>
                        ))
                    }
                </div>
            )}
            </> }
        </div>
    );
};

export default AppointmentsCalendar;
