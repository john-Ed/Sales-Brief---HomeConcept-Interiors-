import type { Enquiry } from './types';

export function getBriefSummary(enquiry: Enquiry): string {
  const a = enquiry.answers;
  const room = a.roomType ? `a ${a.roomType.toLowerCase()}` : 'their home';
  const location = [a.area, a.state].filter(Boolean).join(', ') || 'their preferred location';
  const style = a.style ? `${a.style.toLowerCase()} ${a.colorMaterial || 'look'}` : 'a look that suits their space';
  const size = a.dimensions ? ` (${a.dimensions})` : '';
  const budget = a.budget || 'budget not yet confirmed';
  const delivery = a.floor ? `Delivery is to ${location}, ${a.floor.toLowerCase()}` : `Delivery is to ${location}`;
  return `${enquiry.customerName} is looking for the ${enquiry.productName.toLowerCase()} for ${room}${size}, with a ${style} finish and a ${budget} budget. ${delivery}; they are hoping for ${a.timeline || 'a timeline to be confirmed'}.`;
}

export function getMissingInfo(enquiry: Enquiry): string[] {
  const a = enquiry.answers;
  const missing: string[] = [];
  if (!a.dimensions || /not sure|unknown/i.test(a.dimensions)) missing.push('No confirmed room measurement provided — ask for a quick wall-to-wall estimate or room photo.');
  if (!a.budget) missing.push('Budget range is not confirmed.');
  if (!a.floor) missing.push('Delivery floor/access details are missing.');
  if (!a.area || !a.state) missing.push('Delivery area or state is missing.');
  if (!a.timeline) missing.push('Customer timeline is not confirmed.');
  if (!a.colorMaterial) missing.push('Colour or material preference is still open.');
  if (a.floor && /floor|upstairs|storey/i.test(a.floor) && !/ground|lift|elevator|staircase|stairs/i.test(a.floor)) missing.push('Confirm lift access and stairway dimensions for the upstairs delivery.');
  if (a.state && !/lagos/i.test(a.state)) missing.push(`Confirm delivery fee and lead time to ${a.state}.`);
  return missing;
}

export function getRecommendedActions(enquiry: Enquiry): string[] {
  const a = enquiry.answers;
  const actions: string[] = [];
  const cap = a.budget || 'the customer’s confirmed budget';
  if (a.style || a.colorMaterial) actions.push(`Send 2–3 ${a.style || 'style-matched'} options in ${a.colorMaterial || 'their preferred finish'} within ${cap}.`);
  else actions.push(`Share a concise selection of ${enquiry.productName} finishes and confirm the customer’s preferred style.`);
  if (a.floor && !/ground/i.test(a.floor)) actions.push(`Confirm ${a.floor.toLowerCase()} lift access, doorway and stairway clearance before scheduling delivery.`);
  if (a.state && !/lagos/i.test(a.state)) actions.push(`Quote delivery fee and realistic lead time for ${[a.area, a.state].filter(Boolean).join(', ')}.`);
  if (!a.dimensions || /not sure|unknown/i.test(a.dimensions)) actions.push('Ask for wall-to-wall room dimensions or a quick room photo to confirm fit.');
  if (!a.budget) actions.push('Ask for a comfortable spend range so the team can shortlist accurately.');
  if (a.timeline && /this week|ready now|urgent|asap/i.test(a.timeline)) actions.push('Prioritise availability check and offer the earliest feasible delivery slot.');
  else actions.push(`Confirm the preferred timing (${a.timeline || 'not yet shared'}) and next step.`);
  return actions.slice(0, 4);
}

export function createWhatsAppReply(enquiry: Enquiry): string {
  const a = enquiry.answers;
  const firstName = enquiry.customerName.split(' ')[0] || 'there';
  const destination = [a.area, a.state].filter(Boolean).join(', ');
  return `Hi ${firstName}, thank you for asking us about the ${enquiry.productName}. We’ve noted your ${a.style ? `${a.style.toLowerCase()} ` : ''}${a.colorMaterial ? `${a.colorMaterial.toLowerCase()} ` : ''}preference${a.budget ? ` and ${a.budget} budget` : ''}${destination ? `, with delivery to ${destination}` : ''}. We’re checking the best options${a.dimensions ? ` for your ${a.dimensions} space` : ''} and will share a tailored quote shortly. Is there anything else you’d like us to keep in mind?`;
}

export function formatNaira(value: number): string {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(value);
}
