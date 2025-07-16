import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BuildingOfficeIcon, CalendarDaysIcon, DashboardIcon, DocumentDuplicateIcon, UsersIcon, WrenchScrewdriverIcon } from './icons';

const navItems = [
    { to: '/', text: 'Cruscotto', icon: DashboardIcon },
    { to: '/maintenance', text: 'Manutenzione', icon: WrenchScrewdriverIcon },
    { to: '/tenants', text: 'Inquilini', icon: UsersIcon },
    { to: '/calendar', text: 'Calendario', icon: CalendarDaysIcon },
    { to: '/documents', text: 'Documenti', icon: DocumentDuplicateIcon },
];

interface NavItemProps {
    to: string;
    text: string;
    icon: React.ElementType;
    isCurrent: boolean;
    onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, text, icon: Icon, isCurrent, onClick }) => {
    const baseClasses = 'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200';
    const activeClasses = 'bg-brand-primary text-white shadow-lg';
    const inactiveClasses = 'text-slate-600 hover:bg-slate-200 hover:text-slate-900';
    
    return (
        <li>
            <NavLink
                to={to}
                onClick={onClick}
                className={`${baseClasses} ${isCurrent ? activeClasses : inactiveClasses}`}
            >
                <Icon className="w-6 h-6 mr-3" />
                <span>{text}</span>
            </NavLink>
        </li>
    );
};

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    const location = useLocation();

    const handleLinkClick = () => {
        if (window.innerWidth < 768) {
            setIsOpen(false);
        }
    }

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setIsOpen(false)}></div>}
            
            <aside className={`fixed top-0 left-0 w-64 h-full bg-slate-100/95 backdrop-blur-sm border-r border-slate-200 z-40 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-center h-20 border-b border-slate-200 px-4">
                        <BuildingOfficeIcon className="w-8 h-8 text-brand-primary" />
                        <h1 className="ml-3 text-2xl font-bold text-slate-800">GestioneApt</h1>
                    </div>
                    <nav className="flex-1 px-4 py-6">
                        <ul className="space-y-2">
                            {navItems.map(item => (
                                <NavItem
                                    key={item.to}
                                    to={item.to}
                                    text={item.text}
                                    icon={item.icon}
                                    isCurrent={location.pathname === item.to}
                                    onClick={handleLinkClick}
                                />
                            ))}
                        </ul>
                    </nav>
                    <div className="p-4 border-t border-slate-200 text-center text-xs text-slate-500">
                        <p>&copy; {new Date().getFullYear()} GestioneApt Pro</p>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;