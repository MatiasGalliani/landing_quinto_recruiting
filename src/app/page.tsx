'use client';

import { useState, memo, useCallback, useMemo, lazy, Suspense, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import dynamic from 'next/dynamic';
import { StructuredData } from "@/components/StructuredData";

// Lazy load heavy sections below the fold for faster initial load
const FormSection = dynamic(() => import('@/components/FormSection').then(mod => ({ default: mod.FormSection })), {
  loading: () => <div className="h-[600px] animate-pulse bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl" />
});

// Extract static data outside component to prevent recreation
const FAQ_ITEMS = [
  {
    question: "Cosa fa un agente di cessione del quinto?",
    answer: "L'agente di cessione del quinto supporta clienti (dipendenti e pensionati) nell'ottenere finanziamenti tramite trattenuta diretta sullo stipendio o sulla pensione. Si occupa di acquisire nuovi clienti, gestire le pratiche e collaborare con gli istituti bancari convenzionati."
  },
  {
    question: "Devo essere già iscritto all'OAM per candidarmi?",
    answer: "Sì, l'iscrizione al registro OAM (Organismo Agenti e Mediatori) è un requisito indispensabile per operare come intermediario creditizio in Italia. È necessario avere almeno 2 anni di iscrizione per collaborare con Creditplan."
  },
  {
    question: "Che tipo di rapporto di collaborazione viene offerto?",
    answer: "Collaboriamo con agenti in regime di collaborazione professionale con provvigioni competitive legate alle pratiche chiuse con successo. Hai la flessibilità di gestire il tuo tempo e il tuo portafoglio clienti in autonomia."
  },
  {
    question: "Quali prodotti posso collocare nella rete Creditplan?",
    answer: "Come agente Creditplan avrai accesso all'intero portafoglio prodotti: cessione del quinto, delegazione di pagamento, mutui, prestiti personali e polizze assicurative a protezione del credito."
  },
  {
    question: "Creditplan mi fornirà supporto e formazione?",
    answer: "Sì! Il nostro team ti accompagna con formazione continua, supporto back-office dedicato, materiali di vendita e accesso alle nostre convenzioni con i primari istituti bancari del mercato."
  },
  {
    question: "Quanto posso guadagnare come agente Creditplan?",
    answer: "Il guadagno dipende dal volume di pratiche chiuse. Le nostre provvigioni sono tra le più competitive del settore, e i migliori agenti della rete raggiungono ottime remunerazioni mensili grazie all'ampiezza del portafoglio prodotti."
  },
  {
    question: "Posso lavorare su tutto il territorio nazionale?",
    answer: "Sì, la nostra rete è attiva su tutto il territorio italiano. Puoi operare nella tua area di riferimento o su tutto il territorio nazionale, a seconda degli accordi stabiliti."
  },
  {
    question: "Quanto tempo richiede il processo di selezione?",
    answer: "Il nostro processo è rapido: dopo l'invio della candidatura, un responsabile ti contatterà entro 24-48 ore per un primo colloquio conoscitivo. Se tutto va bene, puoi iniziare a operare nel giro di pochi giorni."
  },
  {
    question: "Cosa succede se non ho esperienza specifica nella cessione del quinto?",
    answer: "Valutiamo positivamente anche chi proviene dal mondo dei mutui, dei prestiti personali o delle polizze. La formazione specifica sulla cessione del quinto viene fornita dal nostro team durante l'onboarding."
  },
  {
    question: "Perché scegliere Creditplan come rete di riferimento?",
    answer: "Le nostre convenzioni bancarie con i primari partner sul mercato ci permettono di offrire ai clienti tassi competitivi e tempi rapidi, rendendo il tuo lavoro più efficace e i tuoi risultati più soddisfacenti."
  }
] as const;

const STAR_RATINGS = [1, 2, 3, 4, 5] as const;

const GOOGLE_REVIEWS = [
  {
    author: "Fede",
    rating: 5,
    timeAgo: "2 anni fa",
    text: "Dei professionisti nel settore. Mi sono affidato a loro per l'acquisto di due case, affidabili, seri e professionali. Anche nel caso di pratiche un po complicate sono sempre stati in grado di trovare soluzioni adeguate….spero non ci sarà il bisogno di una terza, ma nel caso tornerò sicuramente. Consigliatissimi."
  },
  {
    author: "Luca Stucchi",
    rating: 5,
    timeAgo: "2 anni fa",
    text: "Ottima professionalità!"
  },
  {
    author: "Stefania Salmoiraghi",
    rating: 5,
    timeAgo: "2 anni fa",
    text: "Cordiali e attenti alle esigenze del cliente. Molto disponibili e preparati."
  },
  {
    author: "Federico Mantovani",
    rating: 5,
    timeAgo: "2 anni fa",
    text: "Servizio impeccabile, affrontano ogni situazione con serenità. Senza il loro intervento non sarei mai riuscito ad arrivare al rogito del nuovo appartamento."
  },
  {
    author: "Fabiana Pinardi",
    rating: 5,
    timeAgo: "2 anni fa",
    text: "Dopo diverse porte in faccia e svariate ricerche su internet, ci siamo imbattuti in Creditplan.... E come si suol dire, mai scelta fu più azzeccata!!! Avevamo bisogno di una rinegoziazione mutuo più consolidamento debiti, e dove tutti ci avevano detto che era praticamente impossibile, lo staff di Creditplan ha risolto tutti i nostri problemi. NICHOLAS, ci ha seguito in modo impeccabile!!!! Cordiale, disponibile, preparato, sempre attento ad ascoltare ogni nostra esigenza e... anche quando si è presentato qualche piccolo ostacolo, la sua bravura e professionalità ci hanno portato a raggiungere il traguardo prestabilito. Consigliatissimo a chiunque abbia bisogno di un supporto nell'apertura di un mutuo, di una surroga o quant'altro. Grazie di cuore a Nicholas e a Creditplan per il prezioso aiuto!"
  },
  {
    author: "Filippo Malusardi",
    rating: 5,
    timeAgo: "2 anni fa",
    text: "Azienda ottima e professionale, specificatamente nella persona Andrea Daví , molto cortese e sempre disponibile , con conseguente raggiungimento dell'obbiettivo preposto . Grazie di tutto"
  },
  {
    author: "Anna Gatti",
    rating: 5,
    timeAgo: "2 anni fa",
    text: "Andrea Davì ci ha seguito per l'acquisto della nostra prima casa: senza di lui probabilmente non ce l'avremmo fatta. Disponibile, gentile, preparato, preciso e simpatico: è stata una delle scelte migliori che abbiamo fatto! Grazie ancora"
  },
  {
    author: "Maria Grazia Piva",
    rating: 5,
    timeAgo: "2 anni fa",
    text: "Andrea Davì ci ha seguite in un'operazione di richiesta mutuo per l'acquisto della nostra prima casa, con pazienza precisione ed estrema affidabilità. Mi era stato consigliato da amici e raccomanderei vivamente il suo supporto perché è una persona tanto competente quanto meritevole di fiducia."
  },
  {
    author: "Silvia M.",
    rating: 5,
    timeAgo: "2 anni fa",
    text: "Professionali e molto disponibili mi hanno aiutato a gestire le pratiche relative all'acquisto della prima casa e del mutuo dissipando ogni mio eventuale dubbio. Marco Albertin in particolare mi ha seguito con molta cura e disponibilità, non solo dal punto di vista professionale ma anche umano. Non esiterei a consigliare la loro consulenza!"
  }
] as const;

const BENEFITS_DATA = [
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    color: "blue",
    title: "Provvigioni competitive",
    description: "Tra le più alte del settore",
    detailedContent: "Le provvigioni Creditplan sono tra le più competitive del mercato del credito. Ogni pratica chiusa genera un guadagno immediato e trasparente, senza ritardi. I migliori agenti della nostra rete raggiungono ottimi risultati economici mensili grazie alla varietà del portafoglio prodotti disponibile."
  },
  {
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    color: "green",
    title: "Rete certificata",
    description: "OAM M30 — affidabilità garantita",
    detailedContent: "Creditplan è iscritta al registro OAM M30 e opera nel settore da oltre 15 anni. Collaborare con una rete certificata e consolidata ti offre credibilità sul mercato, accesso a convenzioni bancarie esclusive e la certezza di lavorare in un contesto professionale e trasparente."
  },
  {
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "indigo",
    title: "Supporto completo",
    description: "Back-office e formazione dedicati",
    detailedContent: "Non sei mai solo: il nostro team di back-office gestisce la parte burocratica e amministrativa di ogni pratica, permettendoti di concentrarti sulla relazione con il cliente e sull'acquisizione. Offriamo inoltre formazione continua, materiali di vendita professionali e un referente dedicato per ogni agente."
  }
] as const;

const WHY_CHOOSE_BENEFITS_DATA = [
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    color: "blue",
    title: "Onboarding rapido",
    description: "Inizia a operare in sole 48 ore lavorative",
    detailedContent: "Con Creditplan, puoi passare dalla candidatura all'operatività in sole 48 ore lavorative. Il nostro team dedicato gestisce tutto l'iter di attivazione in modo efficiente, garantendoti una risposta rapida e un avvio senza intoppi. Grazie alle nostre convenzioni bancarie già attive, sei subito pronto a chiudere le tue prime pratiche.",
    gradientFrom: "from-blue-500",
    gradientTo: "to-blue-600",
    borderColor: "border-blue-200",
    bgColor: "bg-blue-500/5",
    textColor: "text-blue-600"
  },
  {
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    color: "green",
    title: "Flessibilità totale",
    description: "Gestisci il tuo lavoro in piena autonomia",
    detailedContent: "Come agente Creditplan, sei libero di organizzare il tuo tempo e il tuo portafoglio clienti come preferisci. Non ci sono vincoli d'orario o di zona geografica: puoi operare nel tuo territorio di riferimento o su scala nazionale, costruendo il tuo business con la massima autonomia e flessibilità.",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-emerald-600",
    borderColor: "border-emerald-200",
    bgColor: "bg-emerald-500/5",
    textColor: "text-emerald-600"
  },
  {
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "amber",
    title: "Massimo supporto",
    description: "Back-office dedicato, formazione e materiali inclusi",
    detailedContent: "Con Creditplan, non sei mai solo. Il nostro back-office gestisce l'intera parte burocratica e amministrativa di ogni pratica, liberandoti per quello che sai fare meglio: acquisire clienti e chiudere trattative. Offriamo formazione continua, materiali di vendita professionali e un referente dedicato sempre disponibile.",
    gradientFrom: "from-amber-500",
    gradientTo: "to-amber-600",
    borderColor: "border-amber-200",
    bgColor: "bg-amber-500/5",
    textColor: "text-amber-600"
  }
] as const;

const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: "Invia la candidatura",
    description: "Compila il form con i tuoi dati in meno di 2 minuti. Nessun documento richiesto in questa fase.",
    detailedContent: "Il primo passo è semplicissimo: compila il form online con i tuoi dati personali e professionali. Non serve alcun documento in questa fase — bastano pochi minuti. Il form è completamente sicuro e i tuoi dati sono trattati con la massima riservatezza. Una volta inviata, la tua candidatura viene immediatamente presa in carico dal nostro team di selezione."
  },
  {
    step: 2,
    title: "Colloquio conoscitivo",
    description: "Un nostro responsabile ti contatterà entro 24 ore per un colloquio telefonico gratuito e senza impegno.",
    detailedContent: "Entro 24 ore dall'invio della candidatura, un nostro responsabile ti contatterà telefonicamente. Durante questa chiamata gratuita e senza impegno, avrai l'opportunità di presentarti, discutere la tua esperienza nel settore finanziario e scoprire in dettaglio le condizioni di collaborazione. Il nostro team ti guiderà attraverso tutti i passi successivi e risponderà a ogni tua domanda."
  },
  {
    step: 3,
    title: "Inizia a lavorare",
    description: "Dopo l'attivazione, hai accesso immediato alle convenzioni bancarie, al back-office e ai materiali di lavoro.",
    detailedContent: "Una volta completato l'onboarding, ricevi accesso immediato all'intera piattaforma Creditplan: convenzioni bancarie esclusive, supporto back-office dedicato, materiali di vendita professionali e formazione continua. Sei pronto per acquisire i tuoi primi clienti e chiudere le tue prime pratiche di cessione del quinto in modo rapido ed efficiente."
  }
] as const;

// Memoized Benefit Card Component
const BenefitCard = memo(({ icon, color, title, description, onClick }: {
  icon: string;
  color: string;
  title: string;
  description: string;
  onClick: () => void;
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
    <button
      onClick={onClick}
      className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 transition-all duration-300 hover:shadow-md cursor-pointer text-left w-full"
    >
      <div className={`flex-shrink-0 w-10 h-10 ${bgClass} rounded-xl flex items-center justify-center`}>
        <svg className={`w-5 h-5 ${textClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
      </div>
      <div>
        <h3 className="font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </button>
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
  <div className={`group relative bg-white/90 backdrop-blur-sm rounded-2xl border transition-all duration-300 overflow-hidden ${
    isOpen 
      ? 'border-blue-200 shadow-lg shadow-blue-100/50' 
      : 'border-slate-200 shadow-sm hover:border-blue-100 hover:shadow-md'
  }`} itemScope itemType="https://schema.org/Question">
    {/* Gradient accent line - only visible when open */}
    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 transition-opacity duration-300 ${
      isOpen ? 'opacity-100' : 'opacity-0'
    }`}></div>
    
    <button
      onClick={onToggle}
      className="w-full px-6 lg:px-8 py-6 text-left flex items-start justify-between gap-4 group"
    >
      <div className="flex items-start gap-4 flex-1">
        {/* Question number badge */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-300 ${
          isOpen 
            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md' 
            : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600'
        }`}>
          {index + 1}
        </div>
        
        <h3 className={`text-base lg:text-lg font-bold transition-colors duration-300 ${
          isOpen 
            ? 'text-blue-600' 
            : 'text-slate-900 group-hover:text-blue-600'
        }`} itemProp="name">
          {faq.question}
        </h3>
      </div>
      
      {/* Arrow icon */}
      <div className="flex-shrink-0 mt-1">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
          isOpen 
            ? 'bg-blue-50 rotate-180' 
            : 'bg-slate-50 group-hover:bg-blue-50'
        }`}>
          <svg
            className={`w-5 h-5 transition-colors duration-300 ${
              isOpen ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </button>
    
    {/* Answer section */}
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <div className="px-6 lg:px-8 pb-6">
        <div className="pl-12 pr-4">
          <div className="pt-2 border-t border-slate-100" itemScope itemType="https://schema.org/Answer">
            <p className="text-slate-600 leading-relaxed pt-4 text-[15px] lg:text-base" itemProp="text">
              {faq.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
));

FAQItem.displayName = 'FAQItem';

// Benefit Modal Component
const BenefitModal = memo(({ 
  isOpen, 
  onClose, 
  benefit 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  benefit: typeof BENEFITS_DATA[number] | null;
}) => {
  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !benefit) return null;

  const bgClass = benefit.color === 'blue' ? 'bg-blue-100' : benefit.color === 'green' ? 'bg-green-100' : benefit.color === 'indigo' ? 'bg-indigo-100' : 'bg-amber-100';
  const textClass = benefit.color === 'blue' ? 'text-blue-600' : benefit.color === 'green' ? 'text-green-600' : benefit.color === 'indigo' ? 'text-indigo-600' : 'text-amber-600';
  const borderClass = benefit.color === 'blue' ? 'border-blue-200' : benefit.color === 'green' ? 'border-green-200' : benefit.color === 'indigo' ? 'border-indigo-200' : 'border-amber-200';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      style={{
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div 
        className={`relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 border-2 ${borderClass}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'slideUpAndScale 0.3s ease-out'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Chiudi"
        >
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          <div className={`w-16 h-16 ${bgClass} rounded-2xl flex items-center justify-center mb-6`}>
            <svg className={`w-8 h-8 ${textClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={benefit.icon} />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">{benefit.title}</h2>
          <p className="text-lg text-slate-600 leading-relaxed">{benefit.detailedContent}</p>
        </div>
      </div>
    </div>
  );
});

BenefitModal.displayName = 'BenefitModal';

// Why Choose Benefit Modal Component
const WhyChooseModal = memo(({ 
  isOpen, 
  onClose, 
  benefit 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  benefit: typeof WHY_CHOOSE_BENEFITS_DATA[number] | null;
}) => {
  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !benefit) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      style={{
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div 
        className={`relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 border-2 ${benefit.borderColor}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'slideUpAndScale 0.3s ease-out'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Chiudi"
        >
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          <div className={`w-16 h-16 bg-gradient-to-br ${benefit.gradientFrom} ${benefit.gradientTo} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={benefit.icon} />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">{benefit.title}</h2>
          <p className="text-lg text-slate-600 leading-relaxed">{benefit.detailedContent}</p>
        </div>
      </div>
    </div>
  );
});

WhyChooseModal.displayName = 'WhyChooseModal';

// Google Reviews Modal Component
const ReviewsModal = memo(({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      style={{
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div 
        className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-8 border-2 border-blue-200 my-8"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'slideUpAndScale 0.3s ease-out'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors z-10"
          aria-label="Chiudi"
        >
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
              <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
              <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
              <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
              <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
            </svg>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">ECCELLENTE</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  {STAR_RATINGS.map((i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="text-lg font-semibold text-slate-900">4.9/5</span>
                <span className="text-sm text-slate-600">• Oltre 98 recensioni su Google</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          {GOOGLE_REVIEWS.map((review, index) => (
            <div key={index} className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{review.author}</h3>
                  <p className="text-xs text-slate-500">{review.timeAgo}</p>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

ReviewsModal.displayName = 'ReviewsModal';

// How It Works Step Modal Component
const HowItWorksModal = memo(({ 
  isOpen, 
  onClose, 
  step 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  step: typeof HOW_IT_WORKS_STEPS[number] | null;
}) => {
  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !step) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      style={{
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div 
        className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 border-2 border-blue-200"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'slideUpAndScale 0.3s ease-out'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Chiudi"
        >
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <span className="text-3xl font-bold text-white">{step.step}</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">{step.title}</h2>
          <p className="text-lg text-slate-600 leading-relaxed">{step.detailedContent}</p>
        </div>
      </div>
    </div>
  );
});

HowItWorksModal.displayName = 'HowItWorksModal';

export default function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [openBenefitIndex, setOpenBenefitIndex] = useState<number | null>(null);
  const [openWhyChooseIndex, setOpenWhyChooseIndex] = useState<number | null>(null);
  const [openReviewsModal, setOpenReviewsModal] = useState(false);
  const [openHowItWorksIndex, setOpenHowItWorksIndex] = useState<number | null>(null);

  // Memoize scroll handler
  const scrollToForm = useCallback(() => {
    const formSection = document.getElementById('form-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // Fallback: try to find the form
      const formElement = document.querySelector('form');
      formElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  // Memoize FAQ toggle handlers
  const handleFaqToggle = useCallback((index: number) => {
    setOpenFaqIndex(prev => prev === index ? null : index);
  }, []);

  // Memoize benefit modal handlers
  const handleBenefitClick = useCallback((index: number) => {
    setOpenBenefitIndex(index);
  }, []);

  const handleCloseBenefitModal = useCallback(() => {
    setOpenBenefitIndex(null);
  }, []);

  // Memoize Why Choose modal handlers
  const handleWhyChooseClick = useCallback((index: number) => {
    setOpenWhyChooseIndex(index);
  }, []);

  const handleCloseWhyChooseModal = useCallback(() => {
    setOpenWhyChooseIndex(null);
  }, []);

  // Memoize reviews modal handlers
  const handleOpenReviewsModal = useCallback(() => {
    setOpenReviewsModal(true);
  }, []);

  const handleCloseReviewsModal = useCallback(() => {
    setOpenReviewsModal(false);
  }, []);

  // Memoize How It Works modal handlers
  const handleHowItWorksClick = useCallback((index: number) => {
    setOpenHowItWorksIndex(index);
  }, []);

  const handleCloseHowItWorksModal = useCallback(() => {
    setOpenHowItWorksIndex(null);
  }, []);

  const selectedBenefit = openBenefitIndex !== null ? BENEFITS_DATA[openBenefitIndex] : null;
  const selectedWhyChooseBenefit = openWhyChooseIndex !== null ? WHY_CHOOSE_BENEFITS_DATA[openWhyChooseIndex] : null;
  const selectedStep = openHowItWorksIndex !== null ? HOW_IT_WORKS_STEPS[openHowItWorksIndex] : null;

  return (
    <main className="min-h-screen relative overflow-hidden" itemScope itemType="https://schema.org/WebPage">
      <StructuredData />

      {/* Header */}
      <header className="relative z-10 px-6 lg:px-12 py-4 lg:py-6" role="banner">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex flex-col md:block">
              <Image
                src="https://creditplan.it/wp-content/uploads/2023/02/LOGO-CREDITPLAN.png"
                alt="Creditplan - Logo aziendale servizi di mediazione creditizia per cessione del quinto"
                width={280}
                height={96}
                quality={60}
                priority
                sizes="(max-width: 768px) 200px, 280px"
                className="w-auto h-8 lg:h-10 mt-4 lg:mt-0"
                itemProp="logo"
              />
            </div>
          
            <div className="flex items-center gap-4">
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
                  alt="Creditplan iscritto al registro OAM M30 - Organismo Agenti e Mediatori - Verifica autorizzazione"
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
      <section className="relative z-10 px-6 lg:px-12 pt-0 lg:pt-8 pb-20" itemScope itemType="https://schema.org/FinancialProduct">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left: Content */}
            <article className="space-y-8">
              
              {/* Main Headline */}
              <header className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-semibold lg:font-bold leading-[1.05] tracking-tight" itemProp="name">
                  <span className="block bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                    Diventa agente{' '}
                    <span className="relative inline-block">
                      <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent font-extrabold">
                        Creditplan
                      </span>
                      <span className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-blue-600/20 blur-xl -z-10 rounded-lg"></span>
                    </span>
                  </span>
                  <span className="block bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
                    di cessione del quinto
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-slate-600 font-light max-w-xl leading-relaxed" itemProp="description">
                  Candidati in 2 minuti. Provvigioni competitive, supporto completo, rete consolidata.
                </p>
              </header>
            </article>

            {/* Right: Form Card + Social Proof */}
            <div className="space-y-6">
              <FormSection />
              
              {/* Google Reviews Social Proof - Debajo del formulario */}
              <button
                onClick={handleOpenReviewsModal}
                className="inline-flex items-center gap-4 bg-white px-5 py-3.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 cursor-pointer text-left w-full"
              >
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
                      La reputazione che ti rappresenta
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Creditplan Section */}
      <section className="relative z-10 px-6 lg:px-12 py-10 lg:py-20" aria-labelledby="why-creditplan-heading">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-10 lg:mb-16">
            <h2 id="why-creditplan-heading" className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Perché collaborare con Creditplan?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Tutto ciò di cui hai bisogno per far crescere il tuo business nel credito
            </p>
          </header>

          {/* 3 Benefit Cards originales de Hero movidas aquí */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {BENEFITS_DATA.map((benefit, idx) => (
              <button
                key={idx}
                onClick={() => handleBenefitClick(idx)}
                className="flex flex-col items-start gap-3 p-6 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg cursor-pointer text-left w-full"
              >
                <div className={`flex-shrink-0 w-12 h-12 ${
                  benefit.color === 'blue' ? 'bg-blue-100' : 
                  benefit.color === 'green' ? 'bg-green-100' : 
                  benefit.color === 'indigo' ? 'bg-indigo-100' : 
                  'bg-amber-100'
                } rounded-xl flex items-center justify-center`}>
                  <svg className={`w-6 h-6 ${
                    benefit.color === 'blue' ? 'text-blue-600' : 
                    benefit.color === 'green' ? 'text-green-600' : 
                    benefit.color === 'indigo' ? 'text-indigo-600' : 
                    'text-amber-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={benefit.icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-slate-600">{benefit.description}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {WHY_CHOOSE_BENEFITS_DATA.map((benefit, idx) => (
              <button
                key={idx}
                onClick={() => handleWhyChooseClick(idx)}
                className={`group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 ${
                  benefit.color === 'blue' ? 'hover:border-blue-200' : 
                  benefit.color === 'green' ? 'hover:border-emerald-200' : 
                  'hover:border-amber-200'
                } text-left w-full cursor-pointer`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.bgColor} rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300`}></div>
                <div className="relative">
                  <div className={`w-14 h-14 bg-gradient-to-br ${benefit.gradientFrom} ${benefit.gradientTo} rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={benefit.icon} />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {benefit.description.includes('48 ore') ? (
                      <>
                        Inizia a operare in sole <span className={`font-bold ${benefit.textColor}`}>48 ore</span> lavorative
                      </>
                    ) : benefit.description.includes('autonomia') ? (
                      <>
                        Gestisci il tuo lavoro in <span className={`font-bold ${benefit.textColor}`}>piena autonomia</span>
                      </>
                    ) : (
                      <>
                        <span className={`font-bold ${benefit.textColor}`}>Back-office dedicato</span>, formazione e materiali inclusi
                      </>
                    )}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 px-6 lg:px-12 py-20 bg-white/50" aria-labelledby="how-it-works-heading" itemScope itemType="https://schema.org/HowTo">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-16">
            <h2 id="how-it-works-heading" className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4" itemProp="name">
              Come funziona la selezione
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto" itemProp="description">
              Dalla candidatura all'operatività in soli 3 semplici passaggi
            </p>
          </header>

          {/* Trust Image */}
          <div className="max-w-sm mx-auto">
            <Image
              src="/business_man.png"
              alt="Agente professionale Creditplan - Unisciti alla rete di agenti di cessione del quinto"
              width={400}
              height={500}
              quality={80}
              loading="lazy"
              sizes="(max-width: 768px) 80vw, 400px"
              className="w-full h-auto object-contain"
              style={{ mixBlendMode: 'multiply' }}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {HOW_IT_WORKS_STEPS.map((step, idx) => (
              <button
                key={idx}
                onClick={() => handleHowItWorksClick(idx)}
                className="relative group text-left w-full" 
                itemScope
                itemType="https://schema.org/HowToStep" 
                itemProp="step"
              >
                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-blue-200 cursor-pointer">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white" itemProp="position">{step.step}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3" itemProp="name">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed" itemProp="text">
                    {step.description}
                  </p>
                </div>
              </button>
            ))}
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
                  src="/team_image.png"
                  alt="Team Creditplan - Rete di agenti di cessione del quinto"
                  width={800}
                  height={600}
                  quality={80}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 800px"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  className="w-full h-auto object-cover select-none"
                  style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', mixBlendMode: 'multiply' }}
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
                    <span>Rete attiva su tutto il territorio nazionale</span>
                  </div>
                  <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
                    Pronto a far parte del team?
                  </h2>
                  <p className="text-lg lg:text-xl text-blue-100 mb-8 leading-relaxed">
                    Unisciti alla rete Creditplan. Inizia a guadagnare con le tue pratiche di cessione del quinto.
                  </p>
                  <Button 
                    onClick={scrollToForm}
                    className="bg-white text-blue-600 hover:bg-blue-50 h-14 px-8 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    Invia la candidatura
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/20">
                    <div>
                      <div className="text-3xl font-bold text-white">24h</div>
                      <div className="text-sm text-blue-100">Risposta garantita</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-white">15+</div>
                      <div className="text-sm text-blue-100">Anni nel settore</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bank Partnerships Section */}
      {false && (
      <section className="relative z-10 px-6 lg:px-12 py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30" aria-labelledby="bank-partnerships-heading">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-12">
            <h2 id="bank-partnerships-heading" className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Le nostre convenzioni bancarie
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Collaboriamo con i primari partner sul mercato per garantirti tassi competitivi e tempi rapidi
            </p>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Banca Sistema */}
            <div className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-300 flex items-center justify-center min-h-[120px]">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/7/79/Banca_Sistema_logo.svg"
                alt="Banca Sistema - Partner bancario Creditplan per cessione del quinto"
                width={200}
                height={80}
                className="w-full h-auto max-h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                loading="lazy"
              />
            </div>

            {/* Capital Fin */}
            <div className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-300 flex items-center justify-center min-h-[120px]">
              <Image
                src="https://www.bancaifis.it/app/uploads/2025/03/CAPITALFIN_Logo_Footer_Blu.svg"
                alt="Capital Fin - Partner bancario Creditplan per prestiti e finanziamenti"
                width={260}
                height={104}
                className="w-full h-auto max-h-[5.5rem] object-contain grayscale group-hover:grayscale-0 transition-all duration-300 mt-4 ml-2"
                loading="lazy"
              />
            </div>

            {/* Fincontinuo */}
            <div className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-300 flex items-center justify-center min-h-[120px]">
              <Image
                src="https://www.fincontinuo.com/hubfs/fincontinuo-logo.svg"
                alt="Fincontinuo - Partner finanziario Creditplan per cessione del quinto"
                width={200}
                height={80}
                className="w-full h-auto max-h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                loading="lazy"
              />
            </div>

            {/* Bank Logo 4 */}
            <div className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-300 flex items-center justify-center min-h-[120px]">
              <Image
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ68VRQtS9RBsKX4NXmQNzByi5hqhEGf7vc1w&s"
                alt="Partner bancario convenzionato Creditplan per prestiti e finanziamenti"
                width={200}
                height={80}
                className="w-full h-auto max-h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                loading="lazy"
              />
            </div>

            {/* Last 3 logos - centered */}
            <div className="col-span-2 md:col-span-3 lg:col-span-4 flex flex-wrap justify-center gap-6 lg:gap-8">
              {/* Bank Logo 5 */}
              <div className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-300 flex items-center justify-center min-h-[120px] w-full sm:w-auto sm:min-w-[200px]">
                <Image
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2_zu4rkVrkobpR88917ZnpI4RPD3zz3tXRw&s"
                  alt="Partner bancario convenzionato Creditplan per cessione del quinto"
                  width={200}
                  height={80}
                  className="w-full h-auto max-h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                />
              </div>

              {/* IBL Banca */}
              <div className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-300 flex items-center justify-center min-h-[120px] w-full sm:w-auto sm:min-w-[200px]">
                <Image
                  src="https://thebanks.eu/img/logos/IBL_Banca.png"
                  alt="IBL Banca - Partner bancario Creditplan per cessione del quinto e prestiti"
                  width={200}
                  height={80}
                  className="w-full h-auto max-h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                />
              </div>

              {/* Bank Logo 7 */}
              <div className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-300 flex items-center justify-center min-h-[120px] w-full sm:w-auto sm:min-w-[200px]">
                <Image
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3zTLQW74Q-2PPo5vC0p0tkJ_xOYRUJUbDiA&s"
                  alt="Partner bancario convenzionato Creditplan per finanziamenti e prestiti"
                  width={200}
                  height={80}
                  className="w-full h-auto max-h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">Partner convenzionati INPS</span> - Garantiamo sicurezza e affidabilità
            </p>
          </div>
        </div>
      </section>
      )}

      {/* FAQ Section */}
      <section className="relative z-10 px-6 lg:px-12 py-24 overflow-hidden" aria-labelledby="faq-heading" itemScope itemType="https://schema.org/FAQPage">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzk0YTNiOCIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-40"></div>
        
        <div className="relative max-w-5xl mx-auto">
          {/* Header */}
          <header className="text-center mb-16">
            <h2 id="faq-heading" className="text-4xl lg:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
              Domande Frequenti
            </h2>
            <p className="text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Tutto quello che devi sapere per diventare collaboratore Creditplan.
            </p>
          </header>

          {/* FAQ Grid */}
          <div className="grid gap-4 lg:gap-5">
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

          {/* Bottom CTA */}
          <div className="mt-16 text-center px-4 sm:px-0">
            <div className="flex flex-col items-center gap-3 lg:gap-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg p-10 sm:p-8 lg:p-10 w-full max-w-lg mx-auto">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-1.5 sm:mb-2">
                  Hai altre domande?
                </h3>
                <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">
                  Il nostro team è pronto a risponderti. Nessun impegno, colloquio gratuito.
                </p>
                <Button 
                  onClick={scrollToForm}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Invia la tua candidatura
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 lg:px-12 py-8 border-t border-slate-200 bg-white/50 backdrop-blur-sm" role="contentinfo" itemScope itemType="https://schema.org/WPFooter">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-6">
              <Image
                src="https://creditplan.it/wp-content/uploads/2023/02/LOGO-CREDITPLAN.png"
                alt="Creditplan - Logo aziendale servizi di mediazione creditizia"
                width={280}
                height={96}
                quality={60}
                loading="lazy"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="w-auto h-8 select-none"
                style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none' }}
              />
              <p className="text-sm text-slate-600 text-center md:text-left" itemProp="copyrightHolder">
                © 2025 Creditplan Italia Network di Mediazione Credizia. Tutti i diritti riservati.
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
              Designed and developed by Matias Galliani
            </p>
          </div>
        </div>
      </footer>

      {/* Benefit Modal */}
      <BenefitModal
        isOpen={openBenefitIndex !== null}
        onClose={handleCloseBenefitModal}
        benefit={selectedBenefit}
      />

      {/* Why Choose Modal */}
      <WhyChooseModal
        isOpen={openWhyChooseIndex !== null}
        onClose={handleCloseWhyChooseModal}
        benefit={selectedWhyChooseBenefit}
      />

      {/* Reviews Modal */}
      <ReviewsModal
        isOpen={openReviewsModal}
        onClose={handleCloseReviewsModal}
      />

      {/* How It Works Modal */}
      <HowItWorksModal
        isOpen={openHowItWorksIndex !== null}
        onClose={handleCloseHowItWorksModal}
        step={selectedStep}
      />

    </main>
  );
}
