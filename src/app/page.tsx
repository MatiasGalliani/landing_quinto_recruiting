'use client';

import { useState, memo, useCallback, useMemo, lazy, Suspense } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import dynamic from 'next/dynamic';

// Lazy load heavy sections below the fold for faster initial load
const FormSection = dynamic(() => import('@/components/FormSection').then(mod => ({ default: mod.FormSection })), {
  loading: () => <div className="h-[600px] animate-pulse bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl" />
});

// Extract static data outside component to prevent recreation
const FAQ_ITEMS = [
  {
    question: "Cos'è la Cessione del Quinto?",
    answer: "La Cessione del Quinto è un prestito personale che ti permette di ottenere fino a 75.000€ senza dover cambiare banca. Il rimborso avviene direttamente dalla busta paga, con trattenute automatiche pari a massimo un quinto dello stipendio netto."
  },
  {
    question: "Quali sono i costi e le commissioni associate?",
    answer: "Con Creditplan, l'istruttoria è completamente gratuita e non ci sono costi nascosti. Ti garantiamo massima trasparenza su tutti i costi del finanziamento fin dall'inizio, senza sorprese."
  },
  {
    question: "Quanto tempo serve per ottenere il prestito?",
    answer: "Dopo l'approvazione preliminare in sole 24 ore lavorative, il denaro viene erogato sul tuo conto corrente in massimo 48 ore operative. Il processo è completamente digitale e veloce."
  },
  {
    question: "Quali requisiti devo avere per richiedere la Cessione del Quinto?",
    answer: "I requisiti principali sono: essere dipendente pubblico o privato con contratto a tempo indeterminato, avere un'età minima di 18 anni e massima che permetta di estinguere il prestito prima del pensionamento, e avere un reddito mensile sufficiente."
  },
  {
    question: "Esiste un limite massimo di età per la Cessione del Quinto?",
    answer: "Non esiste un limite di età fisso, ma è necessario che tu possa estinguere il prestito prima di raggiungere l'età pensionabile. Il requisito principale è che il contratto di lavoro copra l'intera durata del prestito."
  },
  {
    question: "Cosa succede se non raggiungo i requisiti per rinnovare una Cessione del Quinto già in corso?",
    answer: "Se non soddisfi più i requisiti per il rinnovo, potrai comunque continuare a estinguere il prestito in corso secondo le condizioni già stabilite. Ti consigliamo di contattarci per valutare insieme le migliori opzioni disponibili."
  },
  {
    question: "Perché dovrei scegliere Creditplan?",
    answer: "Creditplan offre un servizio rapido, trasparente e completamente digitale. Con oltre 2.000 famiglie soddisfatte, garantiamo approvazione in 24 ore, erogazione in 48 ore, istruttoria gratuita e consulenza professionale in ogni fase del processo."
  },
  {
    question: "Posso richiedere il prestito se sono stato segnalato come cattivo pagatore?",
    answer: "Ogni caso viene valutato singolarmente. Anche se sei stato segnalato in CRIF o altri registri, possiamo aiutarti a trovare una soluzione. Contattaci per una consulenza gratuita e senza impegno."
  },
  {
    question: "È possibile estinguere anticipatamente la Cessione del Quinto?",
    answer: "Sì, è possibile estinguere anticipatamente il prestito. Ti consigliamo di contattarci per conoscere le condizioni specifiche e le eventuali penali di estinzione anticipata previste dal tuo contratto."
  },
  {
    question: "Quanto costa la consulenza iniziale con Creditplan?",
    answer: "La consulenza iniziale con Creditplan è completamente gratuita e senza impegno. I nostri esperti ti guideranno nella valutazione della tua situazione e ti aiuteranno a trovare la soluzione migliore per le tue esigenze."
  }
] as const;

const STAR_RATINGS = [1, 2, 3, 4, 5] as const;

const BENEFITS_DATA = [
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    color: "blue",
    title: "Erogazione rapida",
    description: "In soli 48 ore operative"
  },
  {
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    color: "green",
    title: "100% sicuro",
    description: "Certificato e garantito"
  },
  {
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "indigo",
    title: "Senza cambio banca",
    description: "Mantieni il tuo conto"
  },
  {
    icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4",
    color: "amber",
    title: "Nessun vincolo",
    description: "Flessibilità totale"
  }
] as const;

// Memoized Benefit Card Component
const BenefitCard = memo(({ icon, color, title, description }: {
  icon: string;
  color: string;
  title: string;
  description: string;
}) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600 border-blue-200 hover:border-blue-200",
    green: "bg-green-100 text-green-600 border-green-200 hover:border-green-200",
    indigo: "bg-indigo-100 text-indigo-600 border-indigo-200 hover:border-indigo-200",
    amber: "bg-amber-100 text-amber-600 border-amber-200 hover:border-amber-200"
  };

  const bgClass = color === 'blue' ? 'bg-blue-100' : color === 'green' ? 'bg-green-100' : color === 'indigo' ? 'bg-indigo-100' : 'bg-amber-100';
  const textClass = color === 'blue' ? 'text-blue-600' : color === 'green' ? 'text-green-600' : color === 'indigo' ? 'text-indigo-600' : 'text-amber-600';

  return (
    <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 transition-all duration-300 hover:shadow-md">
      <div className={`flex-shrink-0 w-10 h-10 ${bgClass} rounded-xl flex items-center justify-center`}>
        <svg className={`w-5 h-5 ${textClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
      </div>
      <div>
        <h3 className="font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </div>
  );
});

BenefitCard.displayName = 'BenefitCard';

// Memoized FAQ Item Component
const FAQItem = memo(({ 
  faq, 
  index, 
  isOpen, 
  onToggle 
}: { 
  faq: typeof FAQ_ITEMS[number]; 
  index: number; 
  isOpen: boolean; 
  onToggle: () => void;
}) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 group"
    >
      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors pr-8">
        {faq.question}
      </h3>
      <div className="flex-shrink-0">
        <svg
          className={`w-6 h-6 text-blue-600 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <div className="px-6 pb-5">
        <div className="pt-2 border-t border-slate-100">
          <p className="text-slate-600 leading-relaxed pt-4">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  </div>
));

FAQItem.displayName = 'FAQItem';

export default function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Memoize scroll handler
  const scrollToForm = useCallback(() => {
    const formElement = document.querySelector('form');
    formElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  // Memoize FAQ toggle handlers
  const handleFaqToggle = useCallback((index: number) => {
    setOpenFaqIndex(prev => prev === index ? null : index);
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden">

      {/* Header */}
      <header className="relative z-10 px-6 lg:px-12 py-4 lg:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex flex-col md:block">
              <Image
                src="https://creditplan.it/wp-content/uploads/2023/02/LOGO-CREDITPLAN.png"
                alt="Creditplan logo"
                width={280}
                height={96}
                quality={60}
                priority
                sizes="(max-width: 768px) 200px, 280px"
                className="w-auto h-8 lg:h-10 mt-4 lg:mt-0"
              />
              
              {/* Trust Badge - Richieste elaborate - Mobile only, under logo */}
              <div className="md:hidden mt-6 mb-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-blue-100 shadow-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-slate-700">
                    Richieste elaborate oggi: <span className="text-blue-600 font-bold">127</span>
                  </span>
                </div>
              </div>
            </div>
          
            <div className="flex items-center gap-4">
              {/* Trust Badge - Richieste elaborate - Desktop only */}
              <div className="hidden md:inline-flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 bg-white rounded-full border border-blue-100 shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs lg:text-sm font-medium text-slate-700">
                  Richieste elaborate oggi: <span className="text-blue-600 font-bold">127</span>
                </span>
              </div>

            {/* OAM Badge */}
            <a 
              href="https://www.organismo-am.it/b/0/06197620963/F311BEF5-24B7-4A32-AB79-567598386DBC/g.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex flex-col gap-1 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 group"
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-xs text-slate-500 leading-tight">Iscritti al registro</span>
                  <span className="text-sm font-bold text-slate-900 leading-tight">OAM M30</span>
                </div>
                <Image
                  src="https://www.organismo-am.it/b/0/c3f18c274847902265f07537ce366a8eJO5NMdSW1LRcd_pl_8_eq_/1.png"
                  alt="Organismo Agenti e Mediatori"
                  width={44}
                  height={44}
                  quality={60}
                  loading="lazy"
                  className="w-11 h-11 object-contain"
                />
              </div>
              <div className="flex items-center justify-center gap-1.5 text-xs text-blue-600 font-medium">
                <span>Verifica in tempo reale</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 lg:px-12 pt-0 lg:pt-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left: Content */}
            <div className="space-y-8">
              
              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold lg:font-black leading-[1.05] tracking-tight">
                  <span className="block text-slate-900">
                    La tua cessione
                  </span>
                  <span className="block text-slate-900">
                    del quinto
                  </span>
                  <span className="block mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
                    in 48 ore
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-slate-600 font-light max-w-xl leading-relaxed">
                  Fino a <span className="font-bold text-slate-900">75.000€</span> senza cambio banca. Processo rapido, sicuro e completamente digitale.
                </p>
              </div>

              {/* Benefits */}
              <div className="grid sm:grid-cols-2 gap-4">
                {BENEFITS_DATA.map((benefit, idx) => (
                  <BenefitCard
                    key={idx}
                    icon={benefit.icon}
                    color={benefit.color}
                    title={benefit.title}
                    description={benefit.description}
                  />
                ))}
              </div>

              {/* Google Reviews Social Proof */}
              <div className="inline-flex items-center gap-4 pt-4 bg-white px-5 py-3.5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none">
                    <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
                    <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
                    <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
                    <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
                  </svg>
                  <div>
                    <div className="flex items-center gap-1 mb-0.5">
                      {STAR_RATINGS.map((i) => (
                        <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-tight">
                      <span className="font-bold text-slate-900">4.9/5</span> su Google
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Oltre 2.000 recensioni verificate
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Form Card */}
            <FormSection />
          </div>
        </div>
      </section>

      {/* Why Choose Creditplan Section */}
      <section className="relative z-10 px-6 lg:px-12 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Perché scegliere Creditplan?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Semplifichiamo ogni aspetto del tuo finanziamento
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Benefit 1 - Fast Approval */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-blue-200">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Velocità garantita</h3>
                <p className="text-slate-600 leading-relaxed">
                  Approvazione preliminare in sole <span className="font-bold text-blue-600">24 ore</span> lavorative
                </p>
              </div>
            </div>

            {/* Benefit 2 - Comfort */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-indigo-200">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">100% digitale</h3>
                <p className="text-slate-600 leading-relaxed">
                  Gestisci tutto comodamente da casa, dal tuo <span className="font-bold text-indigo-600">smartphone o PC</span>
                </p>
              </div>
            </div>

            {/* Benefit 3 - Predictability */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-emerald-200">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Tranquillità totale</h3>
                <p className="text-slate-600 leading-relaxed">
                  <span className="font-bold text-emerald-600">Rata fissa</span> e importo costante per tutta la durata
                </p>
              </div>
            </div>

            {/* Benefit 4 - No Hidden Costs */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-amber-200">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Massima trasparenza</h3>
                <p className="text-slate-600 leading-relaxed">
                  <span className="font-bold text-amber-600">Nessun costo nascosto</span>, istruttoria gratuita e comunicazioni incluse
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 px-6 lg:px-12 py-20 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Come funziona
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Un processo semplice e veloce in soli 3 passaggi
            </p>
          </div>

          {/* Trust Image */}
          <div className="max-w-3xl mx-auto">
            <Image
              src="https://creditplan.it/wp-content/uploads/2025/11/Progetto-senza-titolo-3.png"
              alt="Creditplan"
              width={1200}
              height={600}
              quality={60}
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              className="w-full h-auto object-cover rounded-xl"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="relative group">
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-slate-100">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Compila il form</h3>
                <p className="text-slate-600 leading-relaxed">
                  Inserisci i tuoi dati in meno di 2 minuti. Nessun documento richiesto in questa fase.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-slate-100">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Ricevi la chiamata</h3>
                <p className="text-slate-600 leading-relaxed">
                  Un nostro consulente esperto ti contatterà entro 2 ore per discutere la tua situazione.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-slate-100">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Ricevi il denaro</h3>
                <p className="text-slate-600 leading-relaxed">
                  Dopo l'approvazione, ricevi il tuo finanziamento sul conto in 48 ore.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 px-6 lg:px-12 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left: Image */}
            <div className="relative lg:order-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://creditplan.it/wp-content/uploads/2023/02/03_CSQ.jpg"
                  alt="Famiglia felice grazie a Creditplan"
                  width={800}
                  height={600}
                  quality={60}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 800px"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  className="w-full h-auto object-cover select-none"
                  style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none' }}
                />
              </div>
            </div>

            {/* Right: CTA Content */}
            <div className="lg:order-2">
              <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-500 rounded-3xl p-10 lg:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
                <div className="relative">
                  <div className="inline-flex items-center gap-2 text-sm font-medium text-white bg-white/20 px-4 py-2 rounded-full mb-6">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    <span>Oltre 2.000 famiglie soddisfatte</span>
                  </div>
                  <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
                    Pronto a iniziare?
                  </h2>
                  <p className="text-lg lg:text-xl text-blue-100 mb-8 leading-relaxed">
                    Unisciti a migliaia di clienti soddisfatti. Il tuo finanziamento è a portata di clic.
                  </p>
                  <Button 
                    onClick={scrollToForm}
                    className="bg-white text-blue-600 hover:bg-blue-50 h-14 px-8 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    Richiedi subito
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/20">
                    <div>
                      <div className="text-3xl font-bold text-white">48h</div>
                      <div className="text-sm text-blue-100">Tempo medio</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-white">98%</div>
                      <div className="text-sm text-blue-100">Soddisfazione</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 px-6 lg:px-12 py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Domande Frequenti
            </h2>
            <p className="text-xl text-slate-600">
              Tutte le risposte alle domande più comuni
            </p>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                index={index}
                isOpen={openFaqIndex === index}
                onToggle={() => handleFaqToggle(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 lg:px-12 py-8 border-t border-slate-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-6">
              <Image
                src="https://creditplan.it/wp-content/uploads/2023/02/LOGO-CREDITPLAN.png"
                alt="Creditplan logo"
                width={280}
                height={96}
                quality={60}
                loading="lazy"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="w-auto h-8 select-none"
                style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none' }}
              />
              <p className="text-sm text-slate-600">
                © 2025 Creditplan. Tutti i diritti riservati.
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <a 
                href="https://creditplan.it/wp-content/uploads/2023/04/Informativa-privacy.pdf" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                Privacy Policy
              </a>
              <a 
                href="https://creditplan.it/trasparenza/" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                Trasparenza
              </a>
            </div>
          </div>
          
          {/* Designer Credit */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-center text-sm text-slate-500">
              Designed and developed by Matias Galliani :)
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
