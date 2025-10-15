
import React from 'react';
import { Ticket } from '../types';

interface TicketGridProps {
  tickets: Ticket[];
  onSelectTicket: (ticketNumber: number) => void;
}

const TicketGrid: React.FC<TicketGridProps> = ({ tickets, onSelectTicket }) => {
  const getTicketClasses = (ticket: Ticket): string => {
    let base = "w-full h-12 flex items-center justify-center font-bold text-sm rounded-lg border-2 transition-all duration-200 cursor-pointer";
    switch (ticket.status) {
      case 'sold':
        return `${base} bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed line-through`;
      case 'selected':
        return `${base} bg-primary border-primary text-white shadow-lg scale-110`;
      case 'available':
      default:
        return `${base} bg-white border-gray-300 text-neutral-dark hover:bg-primary/10 hover:border-primary hover:text-primary`;
    }
  };

  return (
    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
      {tickets.map(ticket => (
        <button
          key={ticket.number}
          disabled={ticket.status === 'sold'}
          onClick={() => onSelectTicket(ticket.number)}
          className={getTicketClasses(ticket)}
        >
          {String(ticket.number).padStart(4, '0')}
        </button>
      ))}
    </div>
  );
};

export default TicketGrid;
