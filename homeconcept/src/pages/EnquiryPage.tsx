import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronLeft, Clock3, ImagePlus, MapPin, MessageCircle, Ruler, ShieldCheck, Sparkles, Upload, X } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppData } from '../lib/context';
import { assistantPrompts, chatSteps } from '../lib/chatFlow';
import type { ChatMessage, Enquiry, EnquiryAnswers, EnquirySource } from '../lib/types';

const toSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const formatPrice = (price: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(price);

function normalizeNigerianPhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (/^0[789][01]\d{8}$/.test(digits)) return `234${digits.slice(1)}`;
  if (/^234[789][01]\d{8}$/.test(digits)) return digits;
  if (/^[789][01]\d{8}$/.test(digits)) return `234${digits}`;
  return '';
}

export function EnquiryPage() {
  const { productSlug } = useParams();
  const navigate = useNavigate();
  const { database, saveEnquiry } = useAppData();
  const product = useMemo(() => database.products.find((item) => toSlug(item.name) === productSlug) ?? database.products[0], [database.products, productSlug]);
  const [stepIndex, setStepIndex] = useState(-1);
  const [answers, setAnswers] = useState<Partial<EnquiryAnswers>>({});
  const [textValue, setTextValue] = useState('');
  const [choiceValue, setChoiceValue] = useState('');
  const [otherValue, setOtherValue] = useState('');
  const [imageValue, setImageValue] = useState('');
  const [error, setError] = useState('');
  const [source, setSource] = useState<EnquirySource>('Website');
  const [submitted, setSubmitted] = useState(false);
  const [savedEnquiry, setSavedEnquiry] = useState<Enquiry | null>(null);

  const step = stepIndex >= 0 ? chatSteps[stepIndex] : undefined;
  const progress = stepIndex < 0 ? 0 : Math.round(((stepIndex + 1) / chatSteps.length) * 100);

  useEffect(() => {
    if (!step) return;
    const value = answers[step.key as keyof EnquiryAnswers];
    setTextValue(typeof value === 'string' && step.kind !== 'photo' ? value : '');
    setChoiceValue(step.kind === 'choice' && typeof value === 'string' ? value : '');
    setOtherValue('');
    setImageValue(step.kind === 'photo' && typeof value === 'string' ? value : '');
    setError('');
  }, [answers, stepIndex]);

  const begin = () => { setStepIndex(0); };
  const recordAnswer = (rawValue: string) => {
    if (!step) return;
    const value = (rawValue ?? '').trim();
    if (step.key === 'customerName' && value.length < 2) { setError('Please share at least two characters so we know what to call you.'); return; }
    if (step.key === 'phone' && !normalizeNigerianPhone(value)) { setError('Please enter a valid Nigerian mobile number, such as 080 1234 5678 or +234 801 234 5678.'); return; }
    if (step.key === 'dimensions' && value.length < 4) { setError('A rough estimate is perfect — for example, “about 4 by 3 metres”.'); return; }
    if (step.key === 'area' && value.length < 2) { setError('Please share your delivery area or neighbourhood so our team can plan the journey.'); return; }
    if (step.key === 'budget' && !value) { setError('No problem — even a broad range helps us recommend pieces that feel right.'); return; }
    setAnswers((current) => ({ ...current, [step.key]: value }));
    setError('');
    setStepIndex((current) => current + 1);
  };

  const handleContinue = (event?: FormEvent) => {
    event?.preventDefault();
    if (!step) return;
    if (step.kind === 'choice') {
      const selected = choiceValue === 'Other' && otherValue.trim() ? otherValue.trim() : choiceValue;
      if (step.key === 'state' && selected === 'Other') { setError('Please type the state where you would like us to deliver.'); return; }
      if (!selected) { if (step.key === 'budget') setError('Could you choose a budget range? It helps us find the right options for you.'); return; }
      recordAnswer(selected);
    } else if (step.kind === 'photo') {
      recordAnswer(imageValue);
    } else recordAnswer(textValue);
  };

  const readImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please choose an image file.'); return; }
    if (file.size > 250 * 1024) { setError('Please choose an image under 250 KB so both optional photos can save reliably in this browser.'); return; }
    const reader = new FileReader();
    reader.onload = () => setImageValue(String(reader.result ?? ''));
    reader.readAsDataURL(file);
    setError('');
  };

  const buildTranscript = (finalAnswers: Partial<EnquiryAnswers>): ChatMessage[] => chatSteps.slice(0, stepIndex + 1).flatMap((item): ChatMessage[] => {
    const response = finalAnswers[item.key as keyof EnquiryAnswers];
    if (response === undefined || response === '') return [{ role: 'assistant', text: assistantPrompts[item.key] }];
    const customerText = item.kind === 'photo' ? response ? '[Image shared]' : 'I’ll skip this for now.' : String(response);
    const extra: ChatMessage[] = [{ role: 'assistant', text: assistantPrompts[item.key] }, { role: 'customer', text: customerText }];
    if (item.key === 'dimensions' && /not sure/i.test(String(response))) extra.push({ role: 'assistant', text: 'No worries. A simple estimate works: measure the longest wall and the wall beside it, or send a photo and we can help you think it through.' });
    return extra;
  });

  const submitEnquiry = () => {
    const complete: EnquiryAnswers = {
      customerName: answers.customerName || 'HomeConcept customer', phone: answers.phone || '',
      roomType: answers.roomType || '', dimensions: answers.dimensions || '', roomPhoto: answers.roomPhoto || '',
      style: answers.style || '', colorMaterial: answers.colorMaterial || '', budget: answers.budget || '',
      state: answers.state || '', area: answers.area || '', floor: answers.floor || '', timeline: answers.timeline || '', inspirationImage: answers.inspirationImage || '',
    };
    const enquiry: Enquiry = {
      id: `enq-${Date.now()}`, customerName: complete.customerName, phone: complete.phone, source,
      productId: product?.id || '', productName: product?.name || 'Furniture enquiry', productImage: product?.imageUrl || '/images/velvet-sofa.jpg',
      answers: complete, status: 'New', transcript: buildTranscript(complete), submittedAt: new Date().toISOString(),
    };
    if (!saveEnquiry(enquiry)) {
      window.alert('Your enquiry could not be saved in this browser. Please free some storage or try again with smaller photos. Your answers are still here.');
      return;
    }
    setSavedEnquiry(enquiry);
    setSubmitted(true);
  };

  const backStep = () => { setStepIndex((current) => Math.max(0, current - 1)); setError(''); };
  const showSummary = stepIndex >= chatSteps.length;

  if (submitted && savedEnquiry) return <div className="customer-wrap submitted-wrap"><div className="submitted-card"><div className="success-seal"><Check size={28} /></div><div className="eyebrow"><span className="eyebrow-line" />ALL SET</div><h1>Thank you, {savedEnquiry.customerName.split(' ')[0]}<span className="title-period">.</span></h1><p>Your enquiry is with the HomeConcept team. We’ll reach out on WhatsApp with a thoughtful next step.</p><div className="submitted-reference"><span>YOUR ENQUIRY</span><strong>{savedEnquiry.productName}</strong><span>{savedEnquiry.answers.area ? `${savedEnquiry.answers.area}, ` : ''}{savedEnquiry.answers.state} · {savedEnquiry.answers.budget}</span></div><button onClick={() => navigate('/dashboard')} className="button button-primary"><CheckCircle2 size={16} />See it in the sales dashboard</button><Link to="/dashboard" className="submitted-back-link">Back to HomeConcept</Link></div></div>;

  return <div className="customer-wrap">
    <div className="customer-page-intro"><div><div className="eyebrow"><span className="eyebrow-line" />A MORE THOUGHTFUL WAY TO FIND YOUR PIECE</div><h1>Let’s find the right fit<br />for your room<span className="title-period">.</span></h1><p>Tell us a little about your space. We’ll help you find a piece that feels like it belongs.</p></div><div className="customer-promise"><span><ShieldCheck size={15} />A real person will follow up</span><span><Clock3 size={15} />Usually within one business day</span></div></div>
    <div className="customer-experience">
      <aside className="customer-product-panel"><img className="customer-product-image" src={product?.imageUrl || '/images/velvet-sofa.jpg'} alt={product?.name || 'HomeConcept furniture'} onError={(event) => { event.currentTarget.src = '/images/velvet-sofa.jpg'; }} /><span className="image-caption"><span>CURATED FOR COMFORT</span><span>01 / HOME</span></span><div className="customer-product-copy"><span className="field-eyebrow">THE PIECE YOU’RE ASKING ABOUT</span><h2>{product?.name || 'Luxe 3-Seater Velvet Sofa'}</h2><div className="customer-product-price">{product ? formatPrice(product.price) : '₦680,000'} <span>incl. VAT</span></div><p>{product?.description || 'Softly tailored and made for the moments that make a home.'}</p><div className="product-detail-pills"><span>Thoughtfully made</span><span>Delivery across Nigeria</span></div></div><div className="customer-image-note"><span className="small-sofa-mark"><span /></span><p>Good design begins with understanding how you live.</p></div></aside>

      <section className="conversation-panel" aria-label="HomeConcept customer enquiry assistant">
        <div className="conversation-top"><div className="assistant-avatar"><Sparkles size={16} /></div><div className="assistant-identity"><strong>HomeConcept assistant</strong><span><i />Here to help you find your fit</span></div><span className="conversation-secure"><ShieldCheck size={14} /> PRIVATE</span></div>
        {stepIndex < 0 ? <div className="conversation-welcome"><span className="assistant-greeting-icon"><MessageCircle size={20} /></span><div className="assistant-message"><span>HOME CONCEPT <small>· JUST NOW</small></span><p>Hi there. I can help you find a piece that suits your space, style and budget. A few quick details will help our team put together the right options.</p></div><div className="source-picker"><span>WHERE DID YOU FIND US?</span><div>{(['Website', 'Instagram', 'WhatsApp'] as const).map((item) => <button key={item} type="button" className={source === item ? 'source-option selected' : 'source-option'} onClick={() => setSource(item)}>{item}</button>)}</div></div><button className="button button-primary conversation-start" onClick={begin}>Let’s get started <ArrowRight size={16} /></button><div className="conversation-trust"><ShieldCheck size={13} />Your details stay with the HomeConcept team.</div></div>
        : showSummary ? <div className="conversation-scroll summary-scroll"><div className="conversation-step-meta"><span>YOUR BRIEF AT A GLANCE</span><span><CheckCircle2 size={14} />READY TO SEND</span></div><div className="assistant-message summary-intro"><span>HOME CONCEPT <small>· JUST NOW</small></span><p>Here’s what I captured... Have a look and make sure it feels right.</p></div><div className="customer-summary-card"><div className="summary-product"><img src={product?.imageUrl || '/images/velvet-sofa.jpg'} alt="" /><div><span>PRODUCT OF INTEREST</span><strong>{product?.name || 'Furniture piece'}</strong></div></div><SummaryRow label="Name & WhatsApp" value={`${answers.customerName || '—'} · ${answers.phone || '—'}`} /><SummaryRow label="Space" value={[answers.roomType, answers.dimensions].filter(Boolean).join(' · ') || 'Not shared'} /><SummaryRow label="Style & finish" value={[answers.style, answers.colorMaterial].filter(Boolean).join(' · ') || 'Not shared'} /><SummaryRow label="Budget" value={answers.budget || 'Not shared'} /><SummaryRow label="Delivery" value={[[answers.area, answers.state].filter(Boolean).join(', '), answers.floor].filter(Boolean).join(' · ') || 'Not shared'} /><SummaryRow label="Timeline" value={answers.timeline || 'Not shared'} />{answers.roomPhoto && <div className="summary-image-row"><span>ROOM PHOTO</span><img src={answers.roomPhoto} alt="Your room" /></div>}{answers.inspirationImage && <div className="summary-image-row"><span>INSPIRATION</span><img src={answers.inspirationImage} alt="Your inspiration" /></div>}</div><div className="summary-action-row"><button className="text-button" onClick={() => setStepIndex(chatSteps.length - 1)}><ChevronLeft size={15} />Review last answer</button><button className="button button-primary send-to-team" onClick={submitEnquiry}><SendIcon />Send to HomeConcept Team</button></div><div className="conversation-trust"><ShieldCheck size={13} />A friendly member of our team will follow up with you.</div></div>
        : step ? <div className="conversation-scroll"><div className="conversation-progress"><span>LET’S GET TO KNOW YOUR SPACE</span><span>{String(stepIndex + 1).padStart(2, '0')} <i>/</i> {String(chatSteps.length).padStart(2, '0')}</span></div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div><div className="assistant-message active-prompt"><span>HOME CONCEPT <small>· JUST NOW</small></span><p>{step.key === 'budget' && error ? 'That’s completely okay. Even a broad range helps us find something that feels right for you.' : step.prompt}</p>{step.helper && <div className="prompt-helper"><Sparkles size={13} />{step.helper}</div>}</div>
          <form onSubmit={handleContinue} className="answer-area">
            {step.kind === 'choice' && <><div className={`choice-list ${step.key === 'style' ? 'style-choices' : ''} ${step.key === 'budget' ? 'budget-choices' : ''}`}>{step.options?.map((option, index) => <button type="button" key={option} className={`choice-chip ${choiceValue === option ? 'choice-selected' : ''}`} onClick={() => { setChoiceValue(option); setError(''); }}>{step.key === 'style' && <span className={`style-swatch style-swatch-${index + 1}`} />}{step.key === 'budget' && <span className="budget-symbol">{['<', '↗', '◈', '✳'][index]}</span>}{option}{choiceValue === option && <Check size={14} />}</button>)}</div>{choiceValue === 'Other' && <input className="chat-text-input other-input" value={otherValue} onChange={(event) => setOtherValue(event.target.value)} placeholder={step.key === 'state' ? 'Type your state' : 'Tell us what you have in mind'} />}</>}
            {(step.kind === 'text' || step.kind === 'textarea') && <><div className="chat-input-wrap">{step.kind === 'textarea' ? <textarea autoFocus rows={3} value={textValue} onChange={(event) => setTextValue(event.target.value)} placeholder={step.placeholder} /> : <input autoFocus className="chat-text-input" value={textValue} onChange={(event) => setTextValue(event.target.value)} placeholder={step.placeholder} />}{step.key === 'dimensions' && <Ruler size={16} />}</div>{step.key === 'dimensions' && <button className="dont-know-button" type="button" onClick={() => { setTextValue('Not sure yet — please help me estimate'); setError(''); }}><span className="estimate-icon"><Ruler size={15} /></span><span><strong>I’m not sure of the size</strong><small>That’s okay — we’ll help you estimate it.</small></span><ArrowRight size={14} /></button>}{step.key === 'dimensions' && /not sure/i.test(textValue) && <div className="estimate-help-card"><strong>A quick way to estimate</strong><p>Measure the longest wall and the wall beside it with a tape measure, or send a room photo and our team can help you think it through.</p></div>}</>}
            {step.kind === 'photo' && <div className="upload-zone">{imageValue ? <div className="image-preview"><img src={imageValue} alt="Selected upload preview" /><button type="button" className="remove-image" onClick={() => setImageValue('')} aria-label="Remove image"><X size={15} /></button><span><CheckCircle2 size={14} />Image added</span></div> : <label className="upload-label"><input type="file" accept="image/*" onChange={readImage} /><span><ImagePlus size={20} /></span><strong>{step.imageLabel}</strong><small>JPG, PNG or HEIC · up to 250 KB</small><i><Upload size={13} />Browse photos</i></label>}</div>}
            {error && <div className="inline-error">{error}</div>}
            <div className="chat-control-row">{stepIndex > 0 && <button type="button" className="text-button" onClick={backStep}><ArrowLeft size={14} />Back</button>}{step.optional && !imageValue && <button type="button" className="skip-button" onClick={() => recordAnswer('')}>Skip for now</button>}<button className="button button-primary chat-continue" type="submit">{stepIndex === chatSteps.length - 1 ? 'Review my answers' : 'Continue'}<ArrowRight size={15} /></button></div>
          </form><div className="conversation-side-note"><span><MapPin size={13} />DELIVERING ACROSS NIGERIA</span><span><ShieldCheck size={13} />YOUR DETAILS ARE PRIVATE</span></div></div>
        : null}
      </section>
    </div>
    <Link className="customer-back-link" to="/dashboard"><ArrowLeft size={14} />Back to HomeConcept staff view</Link>
  </div>;
}

function SummaryRow({ label, value }: { label: string; value: string }) { return <div className="summary-row"><span>{label}</span><strong>{value}</strong></div>; }
function SendIcon() { return <MessageCircle size={15} />; }
