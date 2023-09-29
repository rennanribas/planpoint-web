import React, { useState, ChangeEvent, useEffect, useContext } from 'react';
import { Calendar, EventPropGetter, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ClientContext } from '../context/Client';
import { AppointmentsContext } from '../context/Appointment';
import { TeamContext } from '../context/Team';
import format from 'date-fns/format';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import parse from 'date-fns/parse';
import { Address, Appointment, Availability, Interval, Team } from '../types';
import { addMinutes, eachDayOfInterval, endOfDay, endOfMonth, isAfter, isBefore, isWithinInterval, parseISO, set, startOfDay } from 'date-fns';
import './styles.css'


const locales = {
   'en-US': require('date-fns/locale/en-US'),
};
const localizer = dateFnsLocalizer({
   format,
   parse,
   startOfWeek,
   getDay,
   locales,
});

type CalendarSlot = {
  start: Date;
  end: Date;
  title: string;
  allDay: boolean;
  style?: { backgroundColor?: string, color?: string };
  className?: string;
};

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

    const [selectedTeam, setSelectedTeam] = useState<Team | null>(teams[0] || null);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [calendarSlots, setCalendarSlots] = useState<CalendarSlot[]>([]);


    const handleAddressChange = (event: ChangeEvent<HTMLSelectElement>) => {
      const selected = client?.addresses.filter(address => address.id === event.target.value)[0]
      if (selected)
        setSelectedAddress(selected);
    };

    const handleTeamChange = (teamId: number) => {
      const selected = teams?.filter(team => team.id === teamId)[0]
      if (selected)
        setSelectedTeam(selected);
    }
  
  const calculateAvailableSlots = (
    teamAvailabilities: Availability[],
    appointments: Appointment[],
    sessionDuration: Interval
  ): CalendarSlot[] => {
    const slots: CalendarSlot[] = [];
    const now = new Date();
    const endOfMonthDate = endOfMonth(now);
  
    const days = eachDayOfInterval({
      start: now,
      end: endOfMonthDate,
    });
  
    days.forEach(day => {
      const weekDay = day.toLocaleString('en-US', { weekday: 'long' });
      const availabilities = teamAvailabilities.filter(a => a.day === weekDay);
  
      availabilities.forEach(avail => {
        let startTime = set(day, {
          hours: Number(avail.startTime.split(':')[0]),
          minutes: Number(avail.startTime.split(':')[1]),
        });
        startTime = parseISO(startTime.toISOString());
  
        if (isBefore(startTime, now)) {
          startTime = now;
        }
  
        const endTime = parseISO(set(day, {
          hours: Number(avail.endTime.split(':')[0]),
          minutes: Number(avail.endTime.split(':')[1]),
        }).toISOString());

        for (let time = startTime; isBefore(time, endTime); time = addMinutes(time, (sessionDuration.hours || 0) * 60 + (sessionDuration.minutes || 0))) {

          const endSlotTime = addMinutes(time, (sessionDuration.hours || 0) * 60 + (sessionDuration.minutes || 0));

          if (isAfter(endSlotTime, endTime)) break;
  
          const slot = {
            start: time,
            end: endSlotTime,
            title: `Available`,
            allDay: false            
          };
  
          appointments.map(app => {
            if (app.startDate && app.endDate) {
                const isWithin = isWithinInterval(parseISO(app.startDate), { start: slot.start, end: slot.end }) ||
                                 isWithinInterval(parseISO(app.endDate), { start: slot.start, end: slot.end });

                if (isWithin) {
                  console.log('entrou no iswithin', app, slot)
                    if (app.address?.id) {
                        slot.title = 'Your Appointment';
                    } else {
                        slot.title = 'Occupied';
                    }
                }
                return isWithin;
            }
            return false;
        });

        console.log('slot:', slot)
      
        slots.push(slot);
        }
      });
    });
  
    return slots;
  };

  const eventStyleGetter: EventPropGetter<CalendarSlot> = (event) => {
    const style: React.CSSProperties = {};
  
    if (event.title === 'Available') {
      style.backgroundColor = 'green';
    }
    if (event.title === 'Your Appointment') {
      style.backgroundColor = 'blue';
    }
    if (event.title === 'Occupied') {
      style.backgroundColor = 'red';
    }
  
    return {
      style,
    };
  };
  
    useEffect(() => {
    if (selectedTeam === null && teams.length > 0) {
        setSelectedTeam(teams[0]);
    }
    }, [teams, selectedTeam]);

    useEffect(() => {
        if (selectedAddress === null && client && client.addresses.length > 0) {
            setSelectedAddress(client.addresses[0]);
        }
    }, [client, selectedAddress]);

    useEffect(() => {
        if (selectedAddress !== null && selectedTeam !== null) {
            loadAppointments(selectedAddress.id, selectedTeam.id);
        }
    }, [selectedAddress, selectedTeam]);

    useEffect(() => {
      if (selectedAddress !== null && selectedTeam !== null)
        setCalendarSlots(calculateAvailableSlots(selectedTeam.availabilities, appointments, selectedAddress.regularSessionDuration))
      
  }, [appointments]);

    return (
      <div className="client-details">
        {client && selectedAddress && selectedTeam && teams.length > 0 && <>
            <h2>{client.name}</h2>
            <p>Email: {client.email}</p>
            <p>Phone Number: {client.phoneNumber}</p>
            
            <label htmlFor="addressDropdown">Select an Address: </label>
            <select 
                id="addressDropdown" 
                value={selectedAddress?.id || ""} 
                onChange={handleAddressChange}
            >
                {client.addresses.map(address => (
                    <option key={address.id} value={address.id}>
                        {address.streetAddress}, {address.city}, {address.state} - {address.zipCode}
                    </option>
                ))}
            </select>

            <label htmlFor="addressDropdown">Select an Team: </label>
            <select value={selectedTeam.id} onChange={(e) => handleTeamChange(e.target.value ? parseInt(e.target.value) : 0)}>
              {teams.map(team => (
                <option key={team.id} value={team.id}>
                      {team.name}
                </option>
              ))}
            </select>
            <div className="calendar-wrapper">
            <Calendar 
               localizer={localizer}
               events={calendarSlots}
               startAccessor="start"
               endAccessor="end"
               style={{ height: 500 }}
               eventPropGetter={eventStyleGetter}
            />
         </div>
            </> }
        </div>
    );
};


export default AppointmentsCalendar;
