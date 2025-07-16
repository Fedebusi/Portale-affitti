import React, { useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { initialApartments, initialTenants, initialMaintenanceRequests, initialDocuments, initialCalendarEvents } from './data/mockData';
import { Apartment, Tenant, MaintenanceRequest, Document, CalendarEvent, OccupancyStatus, RentStatus } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Maintenance from './components/Maintenance';
import Tenants from './components/Tenants';
import CalendarView from './components/CalendarView';
import Documents from './components/Documents';
import { MenuIcon, XIcon } from './components/icons';

const App: React.FC = () => {
    const [apartments, setApartments] = useState<Apartment[]>(initialApartments);
    const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
    const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>(initialMaintenanceRequests);
    const [documents, setDocuments] = useState<Document[]>(initialDocuments);
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(initialCalendarEvents);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const addMaintenanceRequest = (request: Omit<MaintenanceRequest, 'id'>) => {
        const newRequest: MaintenanceRequest = {
            ...request,
            id: `MNT-${Date.now()}`
        };
        setMaintenanceRequests(prev => [newRequest, ...prev]);
    };

    const addApartment = (apartmentData: { address: string; unit: string; rentAmount: number; }) => {
        const newApartment: Apartment = {
            ...apartmentData,
            id: `A-${Date.now()}`,
            occupancy: OccupancyStatus.Vacant,
            tenantId: undefined,
            rentStatus: RentStatus.Pending,
        };
        setApartments(prev => [...prev, newApartment]);
    };

    const updateApartment = (updatedApartment: Apartment) => {
        setApartments(prev => prev.map(apt => apt.id === updatedApartment.id ? updatedApartment : apt));
    };


    return (
        <HashRouter>
            <div className="flex h-screen bg-slate-100 font-sans">
                <div className="absolute top-4 left-4 z-20 md:hidden">
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md bg-white text-slate-600 shadow-md">
                        {isSidebarOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                    </button>
                </div>

                <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

                <main className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 md:p-8">
                        <Routes>
                            <Route path="/" element={<Dashboard apartments={apartments} maintenanceRequests={maintenanceRequests} addApartment={addApartment} updateApartment={updateApartment} />} />
                            <Route path="/maintenance" element={<Maintenance requests={maintenanceRequests} addRequest={addMaintenanceRequest} apartments={apartments} />} />
                            <Route path="/tenants" element={<Tenants tenants={tenants} />} />
                            <Route path="/calendar" element={<CalendarView events={calendarEvents} />} />
                            <Route path="/documents" element={<Documents documents={documents} />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </HashRouter>
    );
};

export default App;