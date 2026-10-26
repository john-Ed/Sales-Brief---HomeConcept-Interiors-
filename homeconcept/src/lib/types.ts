export type EnquiryStatus = 'New' | 'Brief Ready' | 'Quoted' | 'Closed';
export type EnquirySource = 'WhatsApp' | 'Instagram' | 'Website';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  description?: string;
}

export interface EnquiryAnswers {
  customerName: string;
  phone: string;
  roomType: string;
  dimensions: string;
  roomPhoto?: string;
  style: string;
  colorMaterial: string;
  budget: string;
  state: string;
  area: string;
  floor: string;
  timeline: string;
  inspirationImage?: string;
}

export interface ChatMessage {
  role: 'assistant' | 'customer';
  text: string;
  timestamp?: string;
}

export interface Enquiry {
  id: string;
  customerName: string;
  phone: string;
  source: EnquirySource;
  productId: string;
  productName: string;
  productImage: string;
  answers: EnquiryAnswers;
  status: EnquiryStatus;
  transcript: ChatMessage[];
  submittedAt: string;
  quoteSent?: boolean;
}

export interface AppDatabase {
  products: Product[];
  enquiries: Enquiry[];
}
