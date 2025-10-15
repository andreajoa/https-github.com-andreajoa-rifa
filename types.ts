
export enum Category {
  ELECTRONICS = 'Eletrônicos',
  FASHION = 'Moda & Acessórios',
  HOME = 'Casa & Decoração',
  GAMES = 'Games & Entretenimento',
  TRAVEL = 'Viagens & Experiências',
  JEWELRY = 'Joias & Relógios',
  VEHICLES = 'Veículos & Acessórios',
  OTHER = 'Outros',
}

export enum PixKeyType {
  CPF = 'CPF',
  EMAIL = 'Email',
  PHONE = 'Telefone',
  RANDOM = 'Chave Aleatória',
}

export interface Ticket {
  number: number;
  status: 'available' | 'sold' | 'selected';
  buyerName?: string;
  buyerContact?: string;
}

export interface Raffle {
  id: string;
  name: string;
  description: string;
  category: Category;
  image: string;
  ticketPrice: number;
  tickets: Ticket[];
  drawDate: string;
  pixKeyType: PixKeyType;
  pixKey: string;
  seller: string;
}
