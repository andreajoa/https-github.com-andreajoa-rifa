
import React, { useState, ChangeEvent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Raffle, Category, PixKeyType, Ticket } from '../types';
import { CATEGORIES, TICKET_SIZES, PIX_KEY_TYPES } from '../constants';
import { generateDescription } from '../services/geminiService';
import { ArrowLeftIcon, ArrowRightIcon, CameraIcon, SparklesIcon, CheckCircleIcon } from '../components/icons';

type FormData = Omit<Raffle, 'id' | 'tickets' | 'seller'> & { ticketCount: number };

const initialFormData: FormData = {
    name: '',
    description: '',
    category: Category.ELECTRONICS,
    image: '',
    ticketPrice: 10,
    ticketCount: 100,
    drawDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    pixKeyType: PixKeyType.CPF,
    pixKey: '',
};

interface CreateRafflePageProps {
  addRaffle: (raffle: Raffle) => void;
}

const CreateRafflePage: React.FC<CreateRafflePageProps> = ({ addRaffle }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'ticketPrice' ? parseFloat(value) || 0 : value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
        setImagePreview(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateDescription = async () => {
    if (!formData.name || !formData.category) {
        alert("Por favor, preencha o nome do produto e a categoria primeiro.");
        return;
    }
    setIsGenerating(true);
    const description = await generateDescription(formData.name, formData.category);
    setFormData(prev => ({ ...prev, description }));
    setIsGenerating(false);
  };
  
  const totalSteps = 4;

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps + 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));
  
  const handleSubmit = () => {
    const tickets: Ticket[] = Array.from({ length: formData.ticketCount }, (_, i) => ({
        number: i + 1,
        status: 'available',
    }));

    const newRaffle: Raffle = {
        ...formData,
        id: formData.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
        tickets,
        seller: 'Você',
    };

    addRaffle(newRaffle);
    navigate(`/raffle/${newRaffle.id}`);
  };

  const StepIndicator = ({ currentStep }: { currentStep: number }) => (
    <div className="flex justify-center items-center space-x-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;
        return (
          <React.Fragment key={stepNumber}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
              {stepNumber}
            </div>
            {stepNumber < totalSteps && <div className={`h-1 w-12 rounded-full ${isActive ? 'bg-primary' : 'bg-gray-200'}`}></div>}
          </React.Fragment>
        );
      })}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
      <StepIndicator currentStep={step} />
      
      {step === 1 && (
        <div>
          <h2 className="font-display text-2xl font-bold text-center mb-6">Informações da Rifa</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Foto do Produto*</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="mx-auto h-48 w-auto rounded-md" />
                  ) : (
                    <CameraIcon className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-light focus-within:outline-none">
                      <span>Carregar um arquivo</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                    </label>
                    <p className="pl-1">ou arraste e solte</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
                </div>
              </div>
            </div>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Produto*</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" maxLength={100} />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição*</label>
                <div className="relative">
                    <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} rows={4} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" maxLength={500}></textarea>
                    <button onClick={handleGenerateDescription} disabled={isGenerating} className="absolute bottom-2 right-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-secondary hover:bg-secondary/90 focus:outline-none disabled:bg-gray-300">
                        <SparklesIcon className="h-4 w-4 mr-1" />
                        {isGenerating ? 'Gerando...' : 'Gerar com IA'}
                    </button>
                </div>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoria*</label>
              <select id="category" name="category" value={formData.category} onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                {CATEGORIES.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="font-display text-2xl font-bold text-center mb-6">Cartelas e Preço</h2>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tamanho da Cartela</label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                        {TICKET_SIZES.map(size => (
                            <button key={size} onClick={() => setFormData(p => ({ ...p, ticketCount: size }))} className={`p-4 border-2 rounded-lg text-center font-bold transition-all ${formData.ticketCount === size ? 'border-primary bg-primary/10 text-primary scale-105' : 'border-gray-300 hover:border-primary'}`}>
                                🎟️ {size}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="ticketPrice" className="block text-sm font-medium text-gray-700">Preço por Cartela (R$)</label>
                    <input type="number" name="ticketPrice" id="ticketPrice" value={formData.ticketPrice} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" min="0.01" step="0.01" />
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-gray-600">Total arrecadado estimado:</p>
                    <p className="text-2xl font-bold text-success">R$ {(formData.ticketPrice * formData.ticketCount).toFixed(2).replace('.', ',')}</p>
                </div>
            </div>
        </div>
      )}
      
      {step === 3 && (
        <div>
          <h2 className="font-display text-2xl font-bold text-center mb-6">Pagamento (PIX)</h2>
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 mb-6">
            <p className="font-bold">🔐 Seu Pix estará seguro</p>
            <p>Apenas o administrador verá essas informações.</p>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="pixKeyType" className="block text-sm font-medium text-gray-700">Tipo de Chave Pix</label>
              <select id="pixKeyType" name="pixKeyType" value={formData.pixKeyType} onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                {PIX_KEY_TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="pixKey" className="block text-sm font-medium text-gray-700">Sua Chave Pix</label>
              <input type="text" name="pixKey" id="pixKey" value={formData.pixKey} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h2 className="font-display text-2xl font-bold text-center mb-6">Data do Sorteio</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="drawDate" className="block text-sm font-medium text-gray-700">Data e Hora</label>
              <input type="datetime-local" name="drawDate" id="drawDate" value={formData.drawDate} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
            </div>
             <div className="p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-700">
                <p>O sorteio será vinculado ao 1º prêmio da Loteria Federal na data escolhida.</p>
            </div>
          </div>
        </div>
      )}

      {step === 5 && (
        <div>
            <h2 className="font-display text-3xl font-bold text-center mb-4">✨ Tudo Pronto! ✨</h2>
            <p className="text-center text-gray-600 mb-6">Revise as informações antes de publicar sua rifa.</p>
            <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
                <div className="flex items-center space-x-4">
                    <img src={formData.image} alt={formData.name} className="w-24 h-24 object-cover rounded-md" />
                    <div>
                        <h3 className="text-xl font-bold">{formData.name}</h3>
                        <p className="text-sm text-gray-500">{formData.category}</p>
                    </div>
                </div>
                <p className="text-sm">{formData.description}</p>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white p-2 rounded-md">
                        <p className="text-sm text-gray-500">Preço / Cartela</p>
                        <p className="font-bold text-lg text-primary">R$ {formData.ticketPrice.toFixed(2)}</p>
                    </div>
                    <div className="bg-white p-2 rounded-md">
                        <p className="text-sm text-gray-500">Total Cartelas</p>
                        <p className="font-bold text-lg text-primary">{formData.ticketCount}</p>
                    </div>
                </div>
                <div className="bg-white p-2 rounded-md text-center">
                    <p className="text-sm text-gray-500">Data do Sorteio</p>
                    <p className="font-bold text-lg">{new Date(formData.drawDate).toLocaleString('pt-BR')}</p>
                </div>
            </div>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        {step > 1 && (
          <button onClick={prevStep} className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Voltar
          </button>
        )}
        <div className="flex-grow"></div>
        {step < totalSteps + 1 && step < 5 && (
          <button onClick={nextStep} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-light">
            {step === totalSteps ? 'Revisar' : 'Próximo'}
            <ArrowRightIcon className="h-5 w-5 ml-2" />
          </button>
        )}
        {step === 5 && (
            <button onClick={handleSubmit} className="w-full bg-gradient-to-r from-success to-green-400 text-white font-bold py-3 px-4 rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300 ease-in-out flex items-center justify-center gap-2">
                <CheckCircleIcon className="h-6 w-6" />
                PUBLICAR RIFA AGORA
            </button>
        )}
      </div>
    </div>
  );
};

export default CreateRafflePage;
