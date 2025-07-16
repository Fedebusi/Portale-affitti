import React, { useState } from 'react';
import { CalendarEvent } from '../types';
import { ChevronDownIcon } from './icons';

interface CalendarViewProps {
    events: CalendarEvent[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ events }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: startDay }, (_, i) => i);

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };
    
    const eventTypeColors = {
        'Riscossione Affitto': 'bg-blue-100 text-blue-800',
        'Rinnovo Contratto': 'bg-yellow-100 text-yellow-800',
        'Ispezione': 'bg-purple-100 text-purple-800',
    };

    const monthStr = currentDate.toLocaleString('it-IT', { month: 'long' });
    const yearStr = currentDate.getFullYear();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Calendario</h1>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={prevMonth} className="p-2 rounded-full hover:bg-slate-100">
                        <ChevronDownIcon className="w-6 h-6 rotate-90" />
                    </button>
                    <h2 className="text-xl font-bold text-slate-700 capitalize">{monthStr} {yearStr}</h2>
                    <button onClick={nextMonth} className="p-2 rounded-full hover:bg-slate-100">
                        <ChevronDownIcon className="w-6 h-6 -rotate-90" />
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center font-semibold text-slate-500 text-sm">
                    {['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'].map(day => (
                        <div key={day} className="py-2">{day}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {emptyDays.map(d => <div key={`empty-${d}`} className="border rounded-md border-slate-100"></div>)}
                    {days.map(day => {
                        const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                        const dayString = dayDate.toISOString().split('T')[0];
                        const dayEvents = events.filter(e => e.date === dayString);

                        return (
                            <div key={day} className="border rounded-md p-2 h-28 flex flex-col bg-white hover:bg-slate-50">
                                <span className="font-medium text-slate-800">{day}</span>
                                <div className="mt-1 space-y-1 overflow-y-auto text-xs">
                                    {dayEvents.map(event => (
                                        <div key={event.id} className={`p-1 rounded-md ${eventTypeColors[event.type]}`}>
                                            {event.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CalendarView;