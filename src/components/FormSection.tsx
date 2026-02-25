"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

const TOTAL_STEPS = 4;

const formSchema = z.object({
  nome: z.string().min(2, "Il nome deve contenere almeno 2 caratteri"),
  cognome: z.string().min(2, "Il cognome deve contenere almeno 2 caratteri"),
  mail: z.string().email("Inserisci un indirizzo email valido"),
  telefono: z.string().min(10, "Il numero di telefono deve contenere almeno 10 cifre"),
  iscrittoOAM: z.enum(["si", "no"]).optional(),
  anniOAM: z.string().optional(),
  esperienzaMutui: z.enum(["si", "no"]).optional(),
  esperienzaPrestiti: z.enum(["si", "no"]).optional(),
  esperienzaCessioneQuinto: z.enum(["si", "no"]).optional(),
  esperienzaCondomini: z.enum(["si", "no"]).optional(),
  esperienzaAziende: z.enum(["si", "no"]).optional(),
  esperienzaPolizze: z.enum(["si", "no"]).optional(),
});

type FormValues = z.infer<typeof formSchema>;
type SiNo = "si" | "no";

const STEP_INFO: Record<number, { title: string; subtitle: string }> = {
  1: { title: "Unisciti alla rete Creditplan", subtitle: "Inserisci i tuoi dati di contatto" },
  2: { title: "Iscrizione OAM", subtitle: "Verifica i requisiti minimi" },
  3: { title: "Esperienza OAM", subtitle: "Da quanti anni sei iscritto?" },
  4: { title: "Il tuo profilo professionale", subtitle: "Indica la tua esperienza nel settore" },
};

const EXPERIENCE_QUESTIONS: { field: keyof FormValues; label: string }[] = [
  { field: "esperienzaMutui", label: "Hai esperienza nella gestione di mutui casa?" },
  { field: "esperienzaPrestiti", label: "Hai gestito pratiche di prestito personale?" },
  { field: "esperienzaCessioneQuinto", label: "Hai esperienza nella cessione del quinto?" },
  { field: "esperienzaCondomini", label: "Hai gestito pratiche di credito ai condomini?" },
  { field: "esperienzaAziende", label: "Hai esperienza nei finanziamenti alle aziende?" },
  { field: "esperienzaPolizze", label: "Hai trattato polizze assicurative?" },
];

function SiNoField({
  value,
  onChange,
  error,
}: {
  value: SiNo | undefined;
  onChange: (v: SiNo) => void;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onChange("si")}
          className={`flex-1 h-11 rounded-xl font-semibold border-2 transition-all text-sm ${
            value === "si"
              ? "border-blue-600 bg-blue-600 text-white shadow-md"
              : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"
          }`}
        >
          Sì
        </button>
        <button
          type="button"
          onClick={() => onChange("no")}
          className={`flex-1 h-11 rounded-xl font-semibold border-2 transition-all text-sm ${
            value === "no"
              ? "border-slate-500 bg-slate-600 text-white shadow-md"
              : "border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
          }`}
        >
          No
        </button>
      </div>
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}

export function FormSection() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [disqualified, setDisqualified] = useState<"oam" | "anni" | null>(null);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      cognome: "",
      mail: "",
      telefono: "",
      anniOAM: "",
    },
  });

  const goBack = (step: number) => {
    setDisqualified(null);
    setCurrentStep(step);
  };

  const onNextStep1 = async () => {
    const isValid = await form.trigger(["nome", "cognome", "mail", "telefono"]);
    if (isValid) {
      setCurrentStep(2);
      setSubmitError(null);
    }
  };

  const onNextStep2 = () => {
    const iscrittoOAM = form.getValues("iscrittoOAM");
    if (!iscrittoOAM) {
      form.setError("iscrittoOAM", { type: "required", message: "Seleziona un'opzione per procedere" });
      return;
    }
    if (iscrittoOAM === "no") {
      setDisqualified("oam");
      return;
    }
    setCurrentStep(3);
  };

  const onNextStep3 = () => {
    const raw = form.getValues("anniOAM");
    if (!raw || raw.trim() === "") {
      form.setError("anniOAM", { type: "required", message: "Inserisci gli anni di iscrizione" });
      return;
    }
    const anni = Math.floor(parseFloat(raw));
    if (isNaN(anni) || anni < 1) {
      form.setError("anniOAM", { type: "min", message: "Inserisci un valore valido (numero intero)" });
      return;
    }
    if (anni <= 1) {
      setDisqualified("anni");
      return;
    }
    setCurrentStep(4);
  };

  const onSubmitStep4 = async () => {
    const values = form.getValues();
    let hasError = false;

    for (const { field } of EXPERIENCE_QUESTIONS) {
      if (!values[field]) {
        form.setError(field, { type: "required", message: "Seleziona un'opzione" });
        hasError = true;
      }
    }
    if (hasError) return;

    setIsLoading(true);
    setSubmitError(null);

    try {
      const payload = {
        nome: values.nome,
        cognome: values.cognome,
        mail: values.mail,
        telefono: values.telefono,
        iscrittoOAM: values.iscrittoOAM,
        anniOAM: values.anniOAM ? Math.floor(parseFloat(values.anniOAM)) : null,
        esperienzaMutui: values.esperienzaMutui,
        esperienzaPrestiti: values.esperienzaPrestiti,
        esperienzaCessioneQuinto: values.esperienzaCessioneQuinto,
        esperienzaCondomini: values.esperienzaCondomini,
        esperienzaAziende: values.esperienzaAziende,
        esperienzaPolizze: values.esperienzaPolizze,
        submittedAt: new Date().toISOString(),
      };

      const response = await fetch("/api/forms/form-quinto-recruiting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Errore sconosciuto" }));
        throw new Error(errorData.error || `Errore HTTP: ${response.status}`);
      }

      setIsLoading(false);
      router.push("/grazie");
    } catch (error) {
      setIsLoading(false);
      const errorMessage =
        error instanceof Error ? error.message : "Si è verificato un errore. Riprova più tardi.";
      setSubmitError(errorMessage);
    }
  };

  if (disqualified) {
    return (
      <div className="relative" id="form-section">
        <Card className="relative bg-white shadow-2xl border-0 overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-orange-400 via-red-500 to-orange-400" />
          <CardContent className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Non possiamo procedere</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {disqualified === "oam"
                  ? "Per collaborare con noi è necessario essere iscritti al registro OAM. Una volta completata l'iscrizione, ti invitiamo a ripresentare la candidatura."
                  : "Per collaborare con noi è necessario avere almeno 2 anni di iscrizione al registro OAM."}
              </p>
            </div>
            <Button
              type="button"
              onClick={() => goBack(disqualified === "oam" ? 2 : 3)}
              variant="outline"
              className="w-full h-11"
            >
              ← Torna indietro
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative" id="form-section">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl opacity-10" />
      <Card className="relative bg-white shadow-2xl border-0 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500" />

        <CardHeader className="space-y-3 pb-4">
          {/* Progress bar */}
          <div className="flex gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                  i + 1 <= currentStep ? "bg-blue-600" : "bg-slate-200"
                }`}
              />
            ))}
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
              Passo {currentStep} di {TOTAL_STEPS}
            </p>
            <CardTitle className="text-xl lg:text-2xl font-bold text-slate-900 mt-1">
              {STEP_INFO[currentStep].title}
            </CardTitle>
            <p className="text-sm text-slate-500 mt-0.5">{STEP_INFO[currentStep].subtitle}</p>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-5">
          {submitError && !isLoading && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Errore nell&apos;invio</p>
                  <p className="text-sm text-red-700 mt-1">{submitError}</p>
                </div>
                <button onClick={() => setSubmitError(null)} className="text-red-600 hover:text-red-800" aria-label="Chiudi errore">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <Form {...form}>
            {/* ── Step 1: Contact info ── */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <Input placeholder="Inserisci il tuo nome" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cognome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cognome</FormLabel>
                      <Input placeholder="Inserisci il tuo cognome" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <Input type="email" placeholder="Inserisci la tua email" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefono</FormLabel>
                      <Input type="tel" placeholder="Inserisci il tuo telefono" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  onClick={onNextStep1}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg"
                >
                  Continua →
                </Button>
              </div>
            )}

            {/* ── Step 2: OAM registration ── */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="iscrittoOAM"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold text-slate-800">
                        Sei iscritto OAM?
                      </FormLabel>
                      <SiNoField
                        value={field.value as SiNo | undefined}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                      />
                    </FormItem>
                  )}
                />
                <div className="flex gap-3">
                  <Button type="button" onClick={() => setCurrentStep(1)} variant="outline" className="flex-1 h-11">
                    ← Indietro
                  </Button>
                  <Button
                    type="button"
                    onClick={onNextStep2}
                    className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold"
                  >
                    Continua →
                  </Button>
                </div>
              </div>
            )}

            {/* ── Step 3: Years of OAM ── */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="anniOAM"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold text-slate-800">
                        Da quanti anni sei iscritto OAM?
                      </FormLabel>
                      <Input
                        type="number"
                        min={1}
                        step={1}
                        placeholder="Es. 3"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-3">
                  <Button type="button" onClick={() => setCurrentStep(2)} variant="outline" className="flex-1 h-11">
                    ← Indietro
                  </Button>
                  <Button
                    type="button"
                    onClick={onNextStep3}
                    className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold"
                  >
                    Continua →
                  </Button>
                </div>
              </div>
            )}

            {/* ── Step 4: Experience questions ── */}
            {currentStep === 4 && (
              <div className="space-y-4">
                {EXPERIENCE_QUESTIONS.map(({ field, label }) => (
                  <FormField
                    key={field}
                    control={form.control}
                    name={field}
                    render={({ field: f, fieldState }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-slate-700 leading-snug">
                          {label}
                        </FormLabel>
                        <SiNoField
                          value={f.value as SiNo | undefined}
                          onChange={f.onChange}
                          error={fieldState.error?.message}
                        />
                      </FormItem>
                    )}
                  />
                ))}
                <div className="flex gap-3 pt-2">
                  <Button type="button" onClick={() => setCurrentStep(3)} variant="outline" className="flex-1 h-11">
                    ← Indietro
                  </Button>
                  <Button
                    type="button"
                    onClick={onSubmitStep4}
                    disabled={isLoading}
                    className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold"
                  >
                    {isLoading ? "Invio in corso..." : "Invia candidatura →"}
                  </Button>
                </div>
              </div>
            )}
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
