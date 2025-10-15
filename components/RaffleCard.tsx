
import React from 'react';
import { Link } from 'react-router-dom';
import { Raffle } from '../types';
import ProgressBar from './ProgressBar';

interface RaffleCardProps {
  raffle: Raffle;
}

const RaffleCard: React.FC<RaffleCardProps> = ({ raffle }) => {
  const soldTickets = raffle.tickets.filter(t => t.status === 'sold').length;
  const totalTickets = raffle.tickets.length;
  const percentageSold = Math.round((soldTickets / totalTickets) * 100);

  return (
    <Link to={`/raffle/${raffle.id}`}>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out group">
        <div className="relative">
          <img className="w-full h-48 object-cover" src={raffle.image} alt={raffle.name} />
          <div className="absolute top-0 right-0 bg-accent text-white text-xs font-bold px-3 py-1 m-2 rounded-full">{raffle.category}</div>
           <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-lg font-bold p-2 w-full">{raffle.name}</div>
        </div>
        <div className="p-4">
          <p className="text-neutral-dark text-2xl font-bold mb-2">
            R$ {raffle.ticketPrice.toFixed(2).replace('.', ',')}
          </p>
          <div className="mb-3">
            <ProgressBar value={percentageSold} />
            <div className="flex justify-between text-sm text-neutral mt-1">
              <span>{percentageSold}% vendido</span>
              <span>{soldTickets}/{totalTickets}</span>
            </div>
          </div>
          <button className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-2 px-4 rounded-full shadow-lg group-hover:scale-105 transform transition-transform duration-300 ease-in-out">
            Participar
          </button>
        </div>
      </div>
    </Link>
  );
};

export default RaffleCard;
