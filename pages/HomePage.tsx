
import React from 'react';
import { Raffle } from '../types';
import RaffleCard from '../components/RaffleCard';
import { Link } from 'react-router-dom';

interface HomePageProps {
  raffles: Raffle[];
}

const HomePage: React.FC<HomePageProps> = ({ raffles }) => {
  return (
    <div className="container mx-auto">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-dark mb-4">Crie Rifas Digitais 🎉</h1>
        <p className="max-w-2xl mx-auto text-lg text-neutral">Ganhe dinheiro fazendo sorteios de forma simples, segura e automatizada.</p>
        <div className="mt-8">
            <Link
                to="/create"
                className="inline-block bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-8 rounded-full shadow-xl hover:scale-105 transform transition-transform duration-300 ease-in-out text-lg"
            >
                Comece Grátis
            </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {raffles.map(raffle => (
          <RaffleCard key={raffle.id} raffle={raffle} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
