
import { Category, Raffle, PixKeyType } from './types';

export const CATEGORIES = [
  { value: Category.ELECTRONICS, label: '📱 Eletrônicos' },
  { value: Category.FASHION, label: '👗 Moda & Acessórios' },
  { value: Category.HOME, label: '🏠 Casa & Decoração' },
  { value: Category.GAMES, label: '🎮 Games & Entretenimento' },
  { value: Category.TRAVEL, label: '✈️ Viagens & Experiências' },
  { value: Category.JEWELRY, label: '💎 Joias & Relógios' },
  { value: Category.VEHICLES, label: '🚗 Veículos & Acessórios' },
  { value: Category.OTHER, label: '🎁 Outros' },
];

export const TICKET_SIZES = [50, 100, 200, 300, 400, 500, 1000];

export const PIX_KEY_TYPES = [
    { value: PixKeyType.CPF, label: '☎️ CPF' },
    { value: PixKeyType.EMAIL, label: '📧 Email' },
    { value: PixKeyType.PHONE, label: '📱 Telefone' },
    { value: PixKeyType.RANDOM, label: '🔑 Chave Aleatória' },
];

export const MOCK_RAFFLES: Raffle[] = [
  {
    id: 'iphone-15-pro-max',
    name: 'iPhone 15 Pro Max',
    description: 'Novo, lacrado, com 1 ano de garantia. A última geração da tecnologia Apple na palma da sua mão.',
    category: Category.ELECTRONICS,
    image: 'https://picsum.photos/seed/iphone/800/600',
    ticketPrice: 50,
    tickets: Array.from({ length: 100 }, (_, i) => ({
      number: i + 1,
      status: i < 75 ? 'sold' : 'available',
      buyerName: i < 75 ? 'Comprador Anônimo' : undefined,
    })),
    drawDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    pixKeyType: PixKeyType.CPF,
    pixKey: '***.***.***-**',
    seller: 'M***o S***',
  },
  {
    id: 'playstation-5',
    name: 'PlayStation 5',
    description: 'Console de última geração com leitor de disco. Inclui um controle DualSense.',
    category: Category.GAMES,
    image: 'https://picsum.photos/seed/ps5/800/600',
    ticketPrice: 30,
    tickets: Array.from({ length: 300 }, (_, i) => ({
      number: i + 1,
      status: i < 50 ? 'sold' : 'available',
      buyerName: i < 50 ? 'Comprador Anônimo' : undefined,
    })),
    drawDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    pixKeyType: PixKeyType.EMAIL,
    pixKey: 'vendedor@email.com',
    seller: 'Jo***o S***',
  },
  {
    id: 'bolsa-coach',
    name: 'Bolsa Coach Original',
    description: 'Bolsa de couro genuíno, modelo Tabby, na cor marrom. Perfeita para qualquer ocasião.',
    category: Category.FASHION,
    image: 'https://picsum.photos/seed/bag/800/600',
    ticketPrice: 20,
    tickets: Array.from({ length: 100 }, (_, i) => ({
      number: i + 1,
      status: i < 25 ? 'sold' : 'available',
      buyerName: i < 25 ? 'Comprador Anônimo' : undefined,
    })),
    drawDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    pixKeyType: PixKeyType.PHONE,
    pixKey: '(11) 9****-XXXX',
    seller: 'Ma***a C***',
  },
];
