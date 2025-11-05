"use client";

import { useState } from "react";

const faqs = [
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
];

export function FAQSection() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <section className="relative z-10 px-6 lg:px-12 py-20 bg-white/50">
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
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 group"
              >
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors pr-8">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  <svg
                    className={`w-6 h-6 text-blue-600 transition-transform duration-300 ${
                      openFaqIndex === index ? 'rotate-180' : ''
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
                  openFaqIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
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
          ))}
        </div>
      </div>
    </section>
  );
}

