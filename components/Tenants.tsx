import React, { useState } from 'react';
import { Tenant } from '../types';
import Card from './shared/Card';

interface TenantsProps {
    tenants: Tenant[];
}

const Tenants: React.FC<TenantsProps> = ({ tenants }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTenants = tenants.filter(tenant =>
        tenant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Inquilini</h1>

            <div className="sticky top-0 bg-slate-50 py-2">
                <input
                    type="text"
                    placeholder="Cerca inquilini..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-brand-primary focus:border-brand-primary"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTenants.map(tenant => (
                    <Card key={tenant.id} className="hover:shadow-xl transition-shadow">
                        <h3 className="font-bold text-lg text-slate-900">{tenant.name}</h3>
                        <p className="text-sm text-slate-500">ID Appartamento: {tenant.apartmentId}</p>
                        <div className="mt-4 border-t pt-4 space-y-2 text-sm">
                            <p className="text-slate-700"><strong>Email:</strong> {tenant.email}</p>
                            <p className="text-slate-700"><strong>Telefono:</strong> {tenant.phone}</p>
                            <p className="text-slate-700">
                                <strong>Contratto:</strong> {new Date(tenant.leaseStartDate).toLocaleDateString()} - {new Date(tenant.leaseEndDate).toLocaleDateString()}
                            </p>
                            <div className="pt-2">
                                <button className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-secondary hover:bg-brand-primary">
                                    Invia Messaggio
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Tenants;