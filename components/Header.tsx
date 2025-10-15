
import React from 'react';
import { NavLink } from 'react-router-dom';
import { TicketIcon } from './icons';

const Header: React.FC = () => {
  const activeLinkClass = "bg-primary text-white";
  const inactiveLinkClass = "text-neutral-dark hover:bg-primary/10 hover:text-primary";
  const linkBaseClass = "px-3 py-2 rounded-md text-sm font-medium transition-colors";

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex-shrink-0 flex items-center gap-2">
              <TicketIcon className="h-8 w-8 text-primary" />
              <span className="font-display text-2xl text-neutral-dark font-bold">RifaPro</span>
            </NavLink>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink
                  to="/"
                  className={({ isActive }) => `${linkBaseClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}
                >
                  Rifas
                </NavLink>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => `${linkBaseClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}
                >
                  Dashboard
                </NavLink>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
               <NavLink
                  to="/create"
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-2 px-4 rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300 ease-in-out flex items-center justify-center gap-2"
                >
                  🎉 Criar Rifa
                </NavLink>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
