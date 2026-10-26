export type StepKind = 'text' | 'choice' | 'textarea' | 'photo';
export interface ChatStep {
  key: string;
  prompt: string;
  helper?: string;
  kind: StepKind;
  options?: string[];
  placeholder?: string;
  optional?: boolean;
  imageLabel?: string;
}

export const styleOptions = ['Modern', 'Minimalist', 'Luxury', 'Classic', 'Scandinavian'];
export const budgetOptions = ['Under ₦200k', '₦200k–₦500k', '₦500k–₦1M', '₦1M+'];

export const chatSteps: ChatStep[] = [
  { key: 'customerName', prompt: 'First, what should we call you?', helper: 'We’ll make sure your enquiry gets to the right person.', kind: 'text', placeholder: 'Your full name' },
  { key: 'phone', prompt: 'And what’s the best WhatsApp number to reach you on?', helper: 'Use a Nigerian mobile number, either 080 1234 5678 or +234 801 234 5678. We’ll only use it for this enquiry.', kind: 'text', placeholder: '080 1234 5678 or +234 801 234 5678' },
  { key: 'roomType', prompt: 'Which room are we helping you furnish?', kind: 'choice', options: ['Living room', 'Family lounge', 'Bedroom', 'Dining room', 'Office', 'Other'] },
  { key: 'dimensions', prompt: 'Do you have a rough idea of your room size?', helper: 'A quick estimate helps us check that the furniture will fit comfortably.', kind: 'text', placeholder: 'e.g. about 4 metres by 3 metres' },
  { key: 'roomPhoto', prompt: 'A room photo can help us picture the space. Would you like to add one?', helper: 'This is completely optional.', kind: 'photo', optional: true, imageLabel: 'Add a room photo' },
  { key: 'style', prompt: 'Which style feels most like home to you?', helper: 'Choose the direction that catches your eye.', kind: 'choice', options: ['Modern', 'Minimalist', 'Luxury', 'Classic', 'Scandinavian'] },
  { key: 'colorMaterial', prompt: 'Any colour or material you’re drawn to?', helper: 'Pick a suggestion or tell us in your own words.', kind: 'choice', options: ['Warm grey velvet', 'Natural beige linen', 'Olive green fabric', 'Cream boucle', 'Rich brown leather', 'Other'] },
  { key: 'budget', prompt: 'What budget range should we have in mind?', helper: 'A comfortable estimate helps us recommend the right options.', kind: 'choice', options: budgetOptions },
  { key: 'state', prompt: 'Which state should we deliver to?', kind: 'choice', options: ['Lagos', 'Abuja', 'Enugu', 'Rivers', 'Oyo', 'Other'] },
  { key: 'area', prompt: 'What area or neighbourhood are you in?', kind: 'text', placeholder: 'e.g. Lekki Phase 1, Abuja' },
  { key: 'floor', prompt: 'What floor is the delivery for?', helper: 'This helps us plan the right delivery team.', kind: 'choice', options: ['Ground floor', '1st floor', '2nd floor', '3rd floor or higher', 'Not sure yet'] },
  { key: 'timeline', prompt: 'When are you hoping to have it delivered?', kind: 'choice', options: ['Ready now', 'Within 2 weeks', 'This month', 'In the next month', 'Flexible'] },
  { key: 'inspirationImage', prompt: 'Have an inspiration image you’d like us to see?', helper: 'Optional — a saved look, room or colour palette is perfect.', kind: 'photo', optional: true, imageLabel: 'Add an inspiration image' },
];

export const assistantPrompts: Record<string, string> = {
  customerName: 'Let’s start with a name so we can make this personal.',
  phone: 'Lovely to meet you. What’s the best number for us to reach you?',
  roomType: 'Now, which room are we helping you make feel more like home?',
  dimensions: 'A rough room size helps us think about the right proportions.',
  roomPhoto: 'A picture can sometimes say more than measurements. Only if you’d like.',
  style: 'What kind of look makes you feel at home?',
  colorMaterial: 'And what colour or material would you love to live with?',
  budget: 'One last helpful detail for the right shortlist — what range feels comfortable?',
  state: 'Where will your new piece be making itself at home?',
  area: 'Which neighbourhood should our delivery team plan for?',
  floor: 'A quick logistics question so delivery goes smoothly: which floor?',
  timeline: 'When would you ideally like everything in place?',
  inspirationImage: 'Anything you’ve saved that captures the look? You can skip this.',
};
