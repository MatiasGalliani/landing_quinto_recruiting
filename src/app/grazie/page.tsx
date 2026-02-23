import type { Metadata } from "next";
import Link from "next/link";
import ConversionEvent from "@/components/ConversionEvent";

export const metadata: Metadata = {
  title: "Candidatura inviata | Grazie",
  description: "Grazie! La tua candidatura è stata inviata con successo. Un nostro responsabile ti contatterà a breve per un colloquio conoscitivo.",
  robots: { index: false, follow: false },
};

export default function GraziePage() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <ConversionEvent />

      <div className="w-full max-w-2xl">
        <div className="relative bg-white shadow-2xl border-0 rounded-3xl overflow-hidden">
          <div className="p-10 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Grazie! Candidatura inviata</h1>
            <p className="text-slate-600 mt-3">
              Un nostro responsabile ti contatterà entro <span className="font-semibold text-blue-600">24 ore</span> per un colloquio conoscitivo.
              Controlla la tua email per la conferma.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center h-12 px-6 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Torna alla Home
              </Link>
              <a
                href="https://creditplan.it"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-12 px-6 text-base font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-100 transition-all"
              >
                Visita Creditplan.it
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


