
import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Raffle, Ticket } from '../types';
import ProgressBar from '../components/ProgressBar';
import TicketGrid from '../components/TicketGrid';
import { CheckCircleIcon } from '../components/icons';

interface RaffleDetailsPageProps {
  raffles: Raffle[];
  updateRaffle: (raffle: Raffle) => void;
}

const RaffleDetailsPage: React.FC<RaffleDetailsPageProps> = ({ raffles, updateRaffle }) => {
  const { id } = useParams<{ id: string }>();
  const raffle = raffles.find(r => r.id === id);

  const [localTickets, setLocalTickets] = useState<Ticket[] | undefined>(raffle?.tickets);
  const [selectedTicketNumbers, setSelectedTicketNumbers] = useState<number[]>([]);
  const [buyerInfo, setBuyerInfo] = useState({ name: '', whatsapp: '', email: '' });
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

  const soldTickets = useMemo(() => localTickets?.filter(t => t.status === 'sold').length ?? 0, [localTickets]);
  const totalTickets = useMemo(() => localTickets?.length ?? 0, [localTickets]);
  const percentageSold = totalTickets > 0 ? Math.round((soldTickets / totalTickets) * 100) : 0;
  
  if (!raffle || !localTickets) {
    return <div className="text-center font-bold text-2xl">Rifa não encontrada!</div>;
  }

  const handleSelectTicket = (ticketNumber: number) => {
    setLocalTickets(prevTickets =>
      prevTickets?.map(ticket => {
        if (ticket.number === ticketNumber) {
          if (ticket.status === 'selected') {
            setSelectedTicketNumbers(nums => nums.filter(n => n !== ticketNumber));
            return { ...ticket, status: 'available' };
          } else if (ticket.status === 'available') {
            setSelectedTicketNumbers(nums => [...nums, ticketNumber]);
            return { ...ticket, status: 'selected' };
          }
        }
        return ticket;
      })
    );
  };
  
  const handlePurchase = () => {
      if (selectedTicketNumbers.length === 0) {
          alert('Selecione pelo menos um número!');
          return;
      }
      if (!buyerInfo.name || !buyerInfo.whatsapp) {
          alert('Por favor, preencha seu nome e WhatsApp.');
          return;
      }
      
      const updatedTickets = localTickets.map(ticket => {
          if (selectedTicketNumbers.includes(ticket.number)) {
              return { ...ticket, status: 'sold' as const, buyerName: buyerInfo.name, buyerContact: buyerInfo.whatsapp };
          }
          return ticket;
      });
      
      const updatedRaffle = { ...raffle, tickets: updatedTickets };
      updateRaffle(updatedRaffle);
      
      setLocalTickets(updatedTickets);
      setSelectedTicketNumbers([]);
      setPaymentModalOpen(true);
  };

  const totalCost = selectedTicketNumbers.length * raffle.ticketPrice;
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Side (Details & Purchase) */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <img src={raffle.image} alt={raffle.name} className="w-full h-64 object-cover rounded-lg mb-4" />
                <h1 className="font-display text-3xl font-bold text-neutral-dark">{raffle.name}</h1>
                <p className="text-neutral mt-2">{raffle.description}</p>
                <div className="mt-4 flex justify-between items-center text-lg">
                    <span className="font-bold">Vendedor:</span>
                    <span className="text-primary font-semibold">{raffle.seller}</span>
                </div>
                <div className="mt-2 flex justify-between items-center text-lg">
                    <span className="font-bold">Sorteio:</span>
                    <span className="text-primary font-semibold">{new Date(raffle.drawDate).toLocaleDateString('pt-BR')}</span>
                </div>
            </div>
             <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="font-display text-2xl font-bold mb-4">Progresso</h2>
                <ProgressBar value={percentageSold} />
                <div className="flex justify-between text-sm text-neutral mt-2">
                    <span>{percentageSold}% vendido</span>
                    <span>{soldTickets}/{totalTickets}</span>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-20">
                <h2 className="font-display text-2xl font-bold mb-4">Comprar Bilhetes</h2>
                {selectedTicketNumbers.length > 0 ? (
                    <>
                    <p className="mb-2">Números selecionados: <span className="font-bold text-primary">{selectedTicketNumbers.join(', ')}</span></p>
                    <p className="text-2xl font-bold mb-4">Total: R$ {totalCost.toFixed(2).replace('.', ',')}</p>
                     <div>
                        <input type="text" placeholder="Seu Nome*" value={buyerInfo.name} onChange={e => setBuyerInfo({...buyerInfo, name: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm mb-2" />
                        <input type="text" placeholder="Seu WhatsApp*" value={buyerInfo.whatsapp} onChange={e => setBuyerInfo({...buyerInfo, whatsapp: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm mb-2" />
                        <input type="email" placeholder="Seu Email" value={buyerInfo.email} onChange={e => setBuyerInfo({...buyerInfo, email: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                    <button onClick={handlePurchase} className="w-full mt-4 bg-gradient-to-r from-success to-green-400 text-white font-bold py-3 px-4 rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300 ease-in-out">
                        Pagar com PIX
                    </button>
                    </>
                ) : (
                    <p className="text-center text-neutral">Selecione seus números da sorte na grade ao lado!</p>
                )}
            </div>
        </div>

        {/* Right Side (Ticket Grid) */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="font-display text-2xl font-bold mb-4">Selecione seus números</h2>
          <TicketGrid tickets={localTickets} onSelectTicket={handleSelectTicket} />
        </div>
      </div>

       {isPaymentModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm transform transition-all scale-100">
                    <CheckCircleIcon className="h-16 w-16 text-success mx-auto mb-4" />
                    <h2 className="font-display text-2xl font-bold mb-2">Pagamento Confirmado!</h2>
                    <p className="text-neutral mb-4">🎉 Parabéns! Seus números da sorte foram garantidos. Você receberá a confirmação por WhatsApp.</p>
                    <button onClick={() => setPaymentModalOpen(false)} className="bg-primary text-white font-bold py-2 px-6 rounded-full">
                        Fechar
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};

export default RaffleDetailsPage;
