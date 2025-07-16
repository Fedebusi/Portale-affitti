import React, { useState } from 'react';
import { Apartment, MaintenanceRequest, OccupancyStatus, RentStatus } from '../types';
import Card from './shared/Card';
import Modal from './shared/Modal';
import ApartmentForm from './ApartmentForm';
import { BuildingOfficeIcon, CheckCircleIcon, XCircleIcon, ClockIcon, WrenchScrewdriverIcon, PencilIcon } from './icons';

interface DashboardProps {
    apartments: Apartment[];
    maintenanceRequests: MaintenanceRequest[];
    addApartment: (data: { address: string; unit: string; rentAmount: number; }) => void;
    updateApartment: (apartment: Apartment) => void;
}

const statusStyles: { [key in RentStatus]: string } = {
    [RentStatus.Paid]: 'bg-status-paid text-white',
    [RentStatus.Overdue]: 'bg-status-overdue text-white',
    [RentStatus.Pending]: 'bg-status-pending text-white',
};

const statusIcons: { [key in RentStatus]: React.ReactNode } = {
    [RentStatus.Paid]: <CheckCircleIcon className="w-5 h-5" />,
    [RentStatus.Overdue]: <XCircleIcon className="w-5 h-5" />,
    [RentStatus.Pending]: <ClockIcon className="w-5 h-5" />,
};

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <Card className="shadow-lg transition-transform hover:scale-105">
        <div className="flex items-center">
            <div className="p-3 rounded-full bg-brand-light text-white mr-4">
                {icon}
            </div>
            <div>
                <p className="text-sm text-slate-500">{title}</p>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
            </div>
        </div>
    </Card>
);

const Dashboard: React.FC<DashboardProps> = ({ apartments, maintenanceRequests, addApartment, updateApartment }) => {
    const [filter, setFilter] = useState('all');
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingApartment, setEditingApartment] = useState<Apartment | null>(null);

    const totalProperties = apartments.length;
    const occupied = apartments.filter(a => a.occupancy === OccupancyStatus.Occupied).length;
    const occupancyRate = totalProperties > 0 ? ((occupied / totalProperties) * 100).toFixed(0) + '%' : '0%';
    const overdueRents = apartments.filter(a => a.rentStatus === RentStatus.Overdue).length;
    const openMaintenance = maintenanceRequests.filter(m => m.status !== 'Completata').length;

    const handleOpenAddModal = () => {
        setEditingApartment(null);
        setModalOpen(true);
    };

    const handleOpenEditModal = (apartment: Apartment) => {
        setEditingApartment(apartment);
        setModalOpen(true);
    };

    const handleFormSubmit = (data: { address: string; unit: string; rentAmount: number; }) => {
        if (editingApartment) {
            updateApartment({ ...editingApartment, ...data });
        } else {
            addApartment(data);
        }
        setModalOpen(false);
    };

    const filteredApartments = apartments.filter(apt => {
        if (filter === 'all') return true;
        if (filter === 'occupied') return apt.occupancy === OccupancyStatus.Occupied;
        if (filter === 'vacant') return apt.occupancy === OccupancyStatus.Vacant;
        if (filter === 'overdue') return apt.rentStatus === RentStatus.Overdue;
        if (filter === 'maintenance') return maintenanceRequests.some(m => m.apartmentId === apt.id && m.status !== 'Completata');
        return true;
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-slate-800">Cruscotto</h1>
                 <button onClick={handleOpenAddModal} className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-secondary shadow-md">
                    <BuildingOfficeIcon className="w-5 h-5 mr-2" />
                    Aggiungi Immobile
                </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Immobili Totali" value={totalProperties} icon={<BuildingOfficeIcon className="w-6 h-6" />} />
                <StatCard title="Tasso di Occupazione" value={occupancyRate} icon={<CheckCircleIcon className="w-6 h-6" />} />
                <StatCard title="Affitti Scaduti" value={overdueRents} icon={<XCircleIcon className="w-6 h-6" />} />
                <StatCard title="Manutenzioni Aperte" value={openMaintenance} icon={<WrenchScrewdriverIcon className="w-6 h-6" />} />
            </div>

            <div>
                <div className="flex flex-wrap gap-2 mb-4">
                    <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-full text-sm font-semibold ${filter === 'all' ? 'bg-brand-primary text-white' : 'bg-white text-slate-600'}`}>Tutti</button>
                    <button onClick={() => setFilter('occupied')} className={`px-4 py-2 rounded-full text-sm font-semibold ${filter === 'occupied' ? 'bg-brand-primary text-white' : 'bg-white text-slate-600'}`}>Occupati</button>
                    <button onClick={() => setFilter('vacant')} className={`px-4 py-2 rounded-full text-sm font-semibold ${filter === 'vacant' ? 'bg-brand-primary text-white' : 'bg-white text-slate-600'}`}>Sfitti</button>
                    <button onClick={() => setFilter('overdue')} className={`px-4 py-2 rounded-full text-sm font-semibold ${filter === 'overdue' ? 'bg-brand-primary text-white' : 'bg-white text-slate-600'}`}>Affitto Scaduto</button>
                    <button onClick={() => setFilter('maintenance')} className={`px-4 py-2 rounded-full text-sm font-semibold ${filter === 'maintenance' ? 'bg-brand-primary text-white' : 'bg-white text-slate-600'}`}>Manutenzione</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredApartments.map(apt => (
                        <Card key={apt.id} className="hover:shadow-xl transition-shadow flex flex-col">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className="font-bold text-lg text-slate-900">{apt.address}, {apt.unit}</h3>
                                    <p className={`text-sm font-medium ${apt.occupancy === OccupancyStatus.Occupied ? 'text-slate-600' : 'text-green-600'}`}>
                                        {apt.occupancy}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 ${statusStyles[apt.rentStatus]}`}>
                                    {statusIcons[apt.rentStatus]}
                                    {apt.rentStatus}
                                </span>
                            </div>
                            <div className="mt-4 border-t pt-4 space-y-2 text-sm text-slate-600 flex-grow">
                                <p><strong>Inquilino:</strong> {apt.tenantId ? 'Affittato' : 'N/D'}</p>
                                <p><strong>Canone:</strong> {apt.rentAmount.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}/mese</p>
                                {maintenanceRequests.some(m => m.apartmentId === apt.id && m.status !== 'Completata') && (
                                    <p className="flex items-center text-orange-600 font-semibold">
                                        <WrenchScrewdriverIcon className="w-4 h-4 mr-2" />
                                        Manutenzione Attiva
                                    </p>
                                )}
                            </div>
                            <div className="mt-4 pt-4 border-t">
                                <button onClick={() => handleOpenEditModal(apt)} className="w-full flex items-center justify-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50">
                                    <PencilIcon className="w-4 h-4 mr-2" />
                                    Modifica
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={editingApartment ? 'Modifica Immobile' : 'Aggiungi Nuovo Immobile'}>
                <ApartmentForm 
                    onSubmit={handleFormSubmit}
                    onClose={() => setModalOpen(false)}
                    initialData={editingApartment} 
                />
            </Modal>
        </div>
    );
};

export default Dashboard;