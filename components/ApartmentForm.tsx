import React, { useState, useEffect } from 'react';
import { Apartment } from '../types';

interface ApartmentFormProps {
    onSubmit: (data: { address: string; unit: string; rentAmount: number; }) => void;
    onClose: () => void;
    initialData?: Apartment | null;
}

const ApartmentForm: React.FC<ApartmentFormProps> = ({ onSubmit, onClose, initialData }) => {
    const [formData, setFormData] = useState({
        address: '',
        unit: '',
        rentAmount: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                address: initialData.address,
                unit: initialData.unit,
                rentAmount: String(initialData.rentAmount),
            });
        } else {
             setFormData({ address: '', unit: '', rentAmount: '' });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            address: formData.address,
            unit: formData.unit,
            rentAmount: Number(formData.rentAmount),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="address" className="block text-sm font-medium text-slate-700">Indirizzo</label>
                <input
                    type="text"
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full shadow-sm sm:text-sm border-slate-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"
                />
            </div>
            <div>
                <label htmlFor="unit" className="block text-sm font-medium text-slate-700">Unità / Interno</label>
                <input
                    type="text"
                    name="unit"
                    id="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full shadow-sm sm:text-sm border-slate-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"
                />
            </div>
            <div>
                <label htmlFor="rentAmount" className="block text-sm font-medium text-slate-700">Canone Mensile (€)</label>
                <input
                    type="number"
                    name="rentAmount"
                    id="rentAmount"
                    value={formData.rentAmount}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full shadow-sm sm:text-sm border-slate-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"
                />
            </div>
            <div className="flex justify-end gap-4 pt-4">
                 <button type="button" onClick={onClose} className="py-2 px-4 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50">
                    Annulla
                </button>
                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-secondary">
                    {initialData ? 'Salva Modifiche' : 'Aggiungi Immobile'}
                </button>
            </div>
        </form>
    );
};

export default ApartmentForm;
