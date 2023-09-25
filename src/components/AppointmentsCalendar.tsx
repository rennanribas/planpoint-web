import React, { useState, ChangeEvent } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Client } from '../types';

type AppointmentsCalendarProps = {
  client: Client;
};

const AppointmentsCalendar: React.FC<AppointmentsCalendarProps> = ({ client }) => {
    const [date, setDate] = useState<Date | null>(null);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

    const handleDateChange = (selectedDate: any, event: React.MouseEvent<HTMLButtonElement>) => {
      if (selectedDate instanceof Date) {
          setDate(selectedDate);
      }
  };

    const handleAddressChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedAddressId(event.target.value);
    };

    return (
        <div className="client-details">
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

            <div className="calendar-wrapper">
                <Calendar onChange={handleDateChange} value={date} />
            </div>
        </div>
    );
};

export default AppointmentsCalendar;
