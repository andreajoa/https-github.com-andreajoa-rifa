
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateRafflePage from './pages/CreateRafflePage';
import RaffleDetailsPage from './pages/RaffleDetailsPage';
import DashboardPage from './pages/DashboardPage';
import Header from './components/Header';
import { Raffle } from './types';
import { MOCK_RAFFLES } from './constants';

const App: React.FC = () => {
  const [raffles, setRaffles] = useState<Raffle[]>(MOCK_RAFFLES);

  const addRaffle = (raffle: Raffle) => {
    setRaffles(prevRaffles => [raffle, ...prevRaffles]);
  };

  const updateRaffle = (updatedRaffle: Raffle) => {
    setRaffles(prevRaffles => prevRaffles.map(r => r.id === updatedRaffle.id ? updatedRaffle : r));
  };
  
  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Header />
        <main className="p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<HomePage raffles={raffles} />} />
            <Route path="/create" element={<CreateRafflePage addRaffle={addRaffle} />} />
            <Route path="/raffle/:id" element={<RaffleDetailsPage raffles={raffles} updateRaffle={updateRaffle} />} />
            <Route path="/dashboard" element={<DashboardPage raffles={raffles} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
