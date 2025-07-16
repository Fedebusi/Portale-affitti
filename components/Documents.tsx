import React from 'react';
import { Document, DocumentType } from '../types';
import Card from './shared/Card';
import { DocumentDuplicateIcon } from './icons';

interface DocumentsProps {
    documents: Document[];
}

const docTypeColors: { [key in DocumentType]: string } = {
    [DocumentType.Contract]: 'border-blue-500',
    [DocumentType.Invoice]: 'border-green-500',
    [DocumentType.Receipt]: 'border-purple-500',
    [DocumentType.Other]: 'border-slate-400',
};

const Documents: React.FC<DocumentsProps> = ({ documents }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800">Documenti</h1>
                <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-secondary shadow-md">
                    Carica Documento
                </button>
            </div>
            
            <div className="space-y-4">
                {documents.map(doc => (
                    <Card key={doc.id} className={`border-l-4 ${docTypeColors[doc.type]}`}>
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                            <div className="flex items-center">
                                <DocumentDuplicateIcon className="w-8 h-8 text-slate-400 mr-4" />
                                <div>
                                    <p className="font-semibold text-slate-800">{doc.name}</p>
                                    <p className="text-sm text-slate-500">Appartamento: {doc.apartmentId} | Tipo: {doc.type}</p>
                                    <p className="text-xs text-slate-400">Caricato il: {new Date(doc.uploadDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm font-medium rounded-md text-brand-primary bg-slate-100 hover:bg-slate-200 text-center">
                                Visualizza/Scarica
                            </a>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Documents;