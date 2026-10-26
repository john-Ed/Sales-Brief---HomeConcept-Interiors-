import type { AppDatabase, Enquiry, Product } from '../lib/types';

export const seedProducts: Product[] = [
  { id: 'prod-sofa', name: 'Luxe 3-Seater Velvet Sofa', price: 680000, category: 'Sofas', imageUrl: '/images/velvet-sofa.jpg', description: 'A generous, softly tailored centrepiece in premium velvet.' },
  { id: 'prod-lounge', name: 'Marlow Lounge Sofa', price: 545000, category: 'Sofas', imageUrl: '/images/beige-sofa.jpg', description: 'Relaxed proportions and warm natural upholstery.' },
  { id: 'prod-accent', name: 'Noma Accent Chair', price: 285000, category: 'Chairs', imageUrl: '/images/lounge-sofa.jpg', description: 'A sculptural accent for a considered living room.' },
];

const makeEnquiry = (data: Omit<Enquiry, 'productImage'> & { productImage?: string }): Enquiry => ({
  ...data,
  productImage: data.productImage ?? '/images/velvet-sofa.jpg',
});

export const seedEnquiries: Enquiry[] = [
  makeEnquiry({
    id: 'enq-01', customerName: 'Amara Okafor', phone: '08034567891', source: 'Instagram', productId: 'prod-sofa', productName: 'Luxe 3-Seater Velvet Sofa', status: 'New', submittedAt: '2026-10-26T09:20:00.000Z',
    answers: { customerName: 'Amara Okafor', phone: '08034567891', roomType: 'Living room', dimensions: '4.2m × 3.6m', style: 'Modern', colorMaterial: 'Warm grey velvet', budget: '₦500k–₦1M', state: 'Lagos', area: 'Lekki Phase 1', floor: '3rd floor · lift available', timeline: 'Within 2 weeks' },
    transcript: [{ role: 'assistant', text: 'What does your room look like and what would feel right in it?' }, { role: 'customer', text: 'Small living room, about 4.2 by 3.6 metres. Modern and warm grey velvet, please.' }, { role: 'assistant', text: 'Where should we deliver, and what is your budget range?' }, { role: 'customer', text: 'Lekki Phase 1, third floor with a lift. Around ₦500k–₦1M.' }],
  }),
  makeEnquiry({
    id: 'enq-02', customerName: 'Tunde Adeyemi', phone: '08061234567', source: 'WhatsApp', productId: 'prod-lounge', productName: 'Marlow Lounge Sofa', productImage: '/images/beige-sofa.jpg', status: 'Brief Ready', submittedAt: '2026-10-26T08:05:00.000Z',
    answers: { customerName: 'Tunde Adeyemi', phone: '08061234567', roomType: 'Family lounge', dimensions: '5m × 4m', style: 'Minimalist', colorMaterial: 'Beige linen', budget: '₦500k–₦1M', state: 'Abuja', area: 'Maitama', floor: 'Ground floor', timeline: 'This week' },
    transcript: [{ role: 'assistant', text: 'Tell me a little about the room and the feeling you want.' }, { role: 'customer', text: 'A family lounge in Maitama. Minimalist beige linen, about five by four metres.' }, { role: 'assistant', text: 'When would you like it delivered?' }, { role: 'customer', text: 'This week if possible.' }],
  }),
  makeEnquiry({
    id: 'enq-03', customerName: 'Chika Nwosu', phone: '08099887766', source: 'Website', productId: 'prod-sofa', productName: 'Luxe 3-Seater Velvet Sofa', status: 'Quoted', submittedAt: '2026-10-25T15:42:00.000Z',
    answers: { customerName: 'Chika Nwosu', phone: '08099887766', roomType: 'Apartment lounge', dimensions: '', style: 'Scandinavian', colorMaterial: 'Olive green fabric', budget: '₦200k–₦500k', state: 'Enugu', area: 'New Haven', floor: '2nd floor · no lift', timeline: 'In the next month' },
    transcript: [{ role: 'assistant', text: 'Do you have room measurements, or would a quick estimate help?' }, { role: 'customer', text: 'I am not sure of the exact size yet. It is a compact apartment lounge.' }, { role: 'assistant', text: 'And how should the sofa feel in the space?' }, { role: 'customer', text: 'Scandinavian, maybe olive green fabric.' }],
  }),
  makeEnquiry({
    id: 'enq-04', customerName: 'Bisi Bello', phone: '08072345678', source: 'Instagram', productId: 'prod-accent', productName: 'Noma Accent Chair', productImage: '/images/lounge-sofa.jpg', status: 'New', submittedAt: '2026-10-25T12:15:00.000Z',
    answers: { customerName: 'Bisi Bello', phone: '08072345678', roomType: 'Bedroom reading corner', dimensions: '2.5m × 2m', style: 'Luxury', colorMaterial: 'Cream boucle', budget: '', state: 'Lagos', area: 'Victoria Island', floor: 'Ground floor', timeline: 'Flexible' },
    transcript: [{ role: 'assistant', text: 'Which piece caught your eye?' }, { role: 'customer', text: 'The accent chair, for a little reading corner.' }, { role: 'assistant', text: 'What budget would you like us to work within?' }, { role: 'customer', text: 'I am still figuring that out.' }],
  }),
  makeEnquiry({
    id: 'enq-05', customerName: 'Emeka Eze', phone: '08055443322', source: 'WhatsApp', productId: 'prod-lounge', productName: 'Marlow Lounge Sofa', productImage: '/images/beige-sofa.jpg', status: 'Closed', submittedAt: '2026-10-24T10:30:00.000Z',
    answers: { customerName: 'Emeka Eze', phone: '08055443322', roomType: 'Open-plan living room', dimensions: '6m × 4.5m', style: 'Classic', colorMaterial: 'Navy performance fabric', budget: '₦1M+', state: 'Abuja', area: 'Wuse 2', floor: '1st floor · wide staircase', timeline: 'Ready now' },
    transcript: [{ role: 'assistant', text: 'What sort of room are we furnishing?' }, { role: 'customer', text: 'Open-plan living room in Wuse 2, Abuja. Six by four and a half metres.' }, { role: 'assistant', text: 'What finish are you drawn to?' }, { role: 'customer', text: 'Classic navy performance fabric, and I am ready now.' }],
  }),
];

export const initialDatabase: AppDatabase = { products: seedProducts, enquiries: seedEnquiries };
