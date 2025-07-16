import { Apartment, Tenant, MaintenanceRequest, Document, CalendarEvent, RentStatus, OccupancyStatus } from '../types';

// Iniziamo senza inquilini
export const initialTenants: Tenant[] = [];

// Iniziamo con un solo appartamento sfitto come richiesto
export const initialApartments: Apartment[] = [
    {
        id: 'A1',
        address: 'Piazzale Susa, 7',
        unit: 'Int. 1',
        occupancy: OccupancyStatus.Vacant,
        tenantId: undefined,
        rentStatus: RentStatus.Pending,
        rentAmount: 1440
    }
];

// Iniziamo senza richieste di manutenzione
export const initialMaintenanceRequests: MaintenanceRequest[] = [];

// Iniziamo senza documenti
export const initialDocuments: Document[] = [];

// Iniziamo senza eventi a calendario
export const initialCalendarEvents: CalendarEvent[] = [];