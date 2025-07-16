import React, { useState, useCallback } from 'react';
import { MaintenanceRequest, MaintenanceStatus, MaintenanceCategory, Apartment } from '../types';
import Card from './shared/Card';
import Modal from './shared/Modal';
import { WrenchScrewdriverIcon, SparklesIcon } from './icons';
import { getMaintenanceSuggestions } from '../services/geminiService';

interface MaintenanceProps {
    requests: MaintenanceRequest[];
    addRequest: (request: Omit<MaintenanceRequest, 'id'>) => void;
    apartments: Apartment[];
}

const statusColors: { [key in MaintenanceStatus]: string } = {
    [MaintenanceStatus.New]: 'bg-red-500',
    [MaintenanceStatus.InProgress]: 'bg-blue-500',
    [MaintenanceStatus.Completed]: 'bg-green-500',
};

const MaintenanceForm: React.FC<{
    apartments: Apartment[];
    addRequest: (request: Omit<MaintenanceRequest, 'id'>) => void;
    closeModal: () => void;
}> = ({ apartments, addRequest, closeModal }) => {
    const [apartmentId, setApartmentId] = useState(apartments[0]?.id || '');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<MaintenanceCategory>(MaintenanceCategory.General);
    const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !apartmentId) {
            setError('Per favore, compila tutti i campi richiesti.');
            return;
        }
        addRequest({
            apartmentId,
            description,
            category,
            status: MaintenanceStatus.New,
            dateLogged: new Date().toISOString().split('T')[0],
            priority
        });
        closeModal();
    };

    const handleGetSuggestions = async () => {
        if (!description) {
            setError('Per favore, inserisci prima una descrizione.');
            return;
        }
        setIsLoadingSuggestions(true);
        setError('');
        setSuggestions([]);
        const result = await getMaintenanceSuggestions(description);
        if (result) {
            setSuggestions(result);
        } else {
            setError("Impossibile ottenere suggerimenti dall'IA. Puoi comunque inviare la richiesta.");
        }
        setIsLoadingSuggestions(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="apartmentId" className="block text-sm font-medium text-slate-700">Appartamento</label>
                <select id="apartmentId" value={apartmentId} onChange={e => setApartmentId(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md">
                    {apartments.map(apt => <option key={apt.id} value={apt.id}>{apt.address}, {apt.unit}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700">Descrizione</label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full shadow-sm sm:text-sm border-slate-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"></textarea>
            </div>
            {process.env.API_KEY && (
                <div>
                     <button type="button" onClick={handleGetSuggestions} disabled={isLoadingSuggestions} className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-brand-primary bg-brand-accent/20 hover:bg-brand-accent/30 disabled:bg-slate-200 disabled:cursor-not-allowed">
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        {isLoadingSuggestions ? 'Sto pensando...' : 'Assistente IA Risoluzione Problemi'}
                    </button>
                    {isLoadingSuggestions && <p className="text-sm text-slate-500 mt-2 text-center">Ricezione suggerimenti da Gemini...</p>}
                    {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                    {suggestions.length > 0 && (
                        <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <h4 className="font-semibold text-slate-800 mb-2">Idee per la risoluzione:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                                {suggestions.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                    )}
                </div>
            )}
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="category" className="block text-sm font-medium text-slate-700">Categoria</label>
                    <select id="category" value={category} onChange={e => setCategory(e.target.value as MaintenanceCategory)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md">
                        {Object.values(MaintenanceCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-slate-700">Priorità</label>
                    <select id="priority" value={priority} onChange={e => setPriority(e.target.value as 'Low'|'Medium'|'High')} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md">
                        <option value="Low">Bassa</option>
                        <option value="Medium">Media</option>
                        <option value="High">Alta</option>
                    </select>
                </div>
            </div>
            <div className="flex justify-end pt-4">
                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary">
                    Registra Richiesta
                </button>
            </div>
        </form>
    );
};

const Maintenance: React.FC<MaintenanceProps> = ({ requests, addRequest, apartments }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [filter, setFilter] = useState<MaintenanceStatus | 'all'>('all');

    const filteredRequests = requests.filter(req => filter === 'all' || req.status === filter);

    const getApartmentAddress = useCallback((apartmentId: string) => {
        const apt = apartments.find(a => a.id === apartmentId);
        return apt ? `${apt.address}, ${apt.unit}` : 'Appartamento Sconosciuto';
    }, [apartments]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800">Manutenzione</h1>
                <button onClick={() => setModalOpen(true)} className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-secondary shadow-md">
                    <WrenchScrewdriverIcon className="w-5 h-5 mr-2" />
                    Nuova Richiesta
                </button>
            </div>

            <div className="flex flex-wrap gap-2">
                <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-full text-sm font-semibold ${filter === 'all' ? 'bg-brand-primary text-white' : 'bg-white text-slate-600'}`}>Tutte</button>
                {Object.values(MaintenanceStatus).map(status => (
                     <button key={status} onClick={() => setFilter(status)} className={`px-4 py-2 rounded-full text-sm font-semibold ${filter === status ? 'bg-brand-primary text-white' : 'bg-white text-slate-600'}`}>{status}</button>
                ))}
            </div>

            <div className="space-y-4">
                {filteredRequests.map(req => (
                    <Card key={req.id} className="transition-shadow hover:shadow-lg">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                            <div className="flex-1">
                                <p className="font-semibold text-slate-800">{getApartmentAddress(req.apartmentId)}</p>
                                <p className="text-slate-600">{req.description}</p>
                                <p className="text-xs text-slate-400 mt-1">Registrata il: {new Date(req.dateLogged).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-slate-700 bg-slate-200 px-3 py-1 rounded-full">{req.category}</span>
                                <span className={`text-sm font-bold text-white px-3 py-1 rounded-full ${statusColors[req.status]}`}>
                                    {req.status}
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Registra Nuova Richiesta di Manutenzione">
                <MaintenanceForm apartments={apartments} addRequest={addRequest} closeModal={() => setModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default Maintenance;