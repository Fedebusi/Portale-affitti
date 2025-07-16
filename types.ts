export enum RentStatus {
    Paid = 'Pagato',
    Overdue = 'Scaduto',
    Pending = 'In attesa'
}

export enum OccupancyStatus {
    Occupied = 'Occupato',
    Vacant = 'Sfitto'
}

export enum MaintenanceStatus {
    New = 'Nuova',
    InProgress = 'In corso',
    Completed = 'Completata'
}

export enum MaintenanceCategory {
    Plumbing = 'Idraulica',
    Electricity = 'Elettricità',
    Appliance = 'Elettrodomestici',
    Structural = 'Strutturale',
    General = 'Generale'
}

export enum DocumentType {
    Contract = 'Contratto',
    Invoice = 'Fattura',
    Receipt = 'Ricevuta',
    Other = 'Altro'
}

export interface Tenant {
    id: string;
    name: string;
    email: string;
    phone: string;
    apartmentId: string;
    leaseStartDate: string;
    leaseEndDate: string;
}

export interface Apartment {
    id: string;
    address: string;
    unit: string;
    occupancy: OccupancyStatus;
    tenantId?: string;
    rentStatus: RentStatus;
    rentAmount: number;
}

export interface MaintenanceRequest {
    id: string;
    apartmentId: string;
    description: string;
    category: MaintenanceCategory;
    status: MaintenanceStatus;
    dateLogged: string;
    priority: 'Low' | 'Medium' | 'High';
}

export interface Document {
    id: string;
    apartmentId: string;
    name: string;
    type: DocumentType;
    uploadDate: string;
    fileUrl: string; // In a real app, this would be a URL to the file
}

export interface CalendarEvent {
    id: string;
    date: string; // YYYY-MM-DD
    title: string;
    type: 'Riscossione Affitto' | 'Rinnovo Contratto' | 'Ispezione';
}