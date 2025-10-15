
import React from 'react';
import { Raffle } from '../types';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DashboardPageProps {
  raffles: Raffle[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({ raffles }) => {
  if (raffles.length === 0) {
    return (
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold mb-4">Nenhuma rifa criada ainda.</h1>
        <Link to="/create" className="inline-block bg-primary text-white font-bold py-3 px-6 rounded-full">
          Criar minha primeira Rifa
        </Link>
      </div>
    );
  }

  const COLORS = ['#10B981', '#F3F4F6'];

  return (
    <div className="space-y-8">
      <h1 className="font-display text-4xl font-bold text-neutral-dark">Meu Dashboard</h1>
      {raffles.map(raffle => {
        const soldTickets = raffle.tickets.filter(t => t.status === 'sold').length;
        const totalTickets = raffle.tickets.length;
        const revenue = soldTickets * raffle.ticketPrice;
        const potentialRevenue = totalTickets * raffle.ticketPrice;
        
        const chartData = [
          { name: 'Vendidos', value: soldTickets },
          { name: 'Disponíveis', value: totalTickets - soldTickets },
        ];

        return (
          <div key={raffle.id} className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <h2 className="font-display text-2xl font-bold mb-1">{raffle.name}</h2>
                    <p className="text-sm text-neutral mb-4">Sorteio em: {new Date(raffle.drawDate).toLocaleDateString('pt-BR')}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-neutral-dark font-semibold">Receita Atual</p>
                            <p className="text-2xl font-bold text-success">R$ {revenue.toFixed(2)}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-neutral-dark font-semibold">Potencial</p>
                            <p className="text-2xl font-bold text-primary">R$ {potentialRevenue.toFixed(2)}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-neutral-dark font-semibold">Vendidos</p>
                            <p className="text-2xl font-bold text-secondary">{soldTickets} / {totalTickets}</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="font-bold text-lg mb-2">Últimos Compradores</h3>
                        <ul className="space-y-2 max-h-40 overflow-y-auto">
                            {raffle.tickets.filter(t => t.status === 'sold' && t.buyerName).slice(0, 5).map((t, i) => (
                                <li key={i} className="flex justify-between p-2 bg-gray-50 rounded-md text-sm">
                                    <span>{t.buyerName}</span>
                                    <span className="font-mono text-primary">#{String(t.number).padStart(4, '0')}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `${value} bilhetes`} />
                        <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="mt-6 border-t pt-4 flex justify-end gap-4">
                <Link to={`/raffle/${raffle.id}`} className="bg-secondary text-white font-bold py-2 px-4 rounded-full">Ver Página</Link>
                <button className="bg-primary text-white font-bold py-2 px-4 rounded-full">Editar</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardPage;
