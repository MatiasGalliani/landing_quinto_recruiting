"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useCallback, memo } from "react";

const formSchema = z.object({
  nome: z.string().min(2, "Il nome deve contenere almeno 2 caratteri"),
  cognome: z.string().min(2, "Il cognome deve contenere almeno 2 caratteri"),
  mail: z.string().email("Inserisci un indirizzo email valido"),
  telefono: z.string().min(10, "Il numero di telefono deve contenere almeno 10 cifre"),
});

export function FormSection() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAmountSelection, setShowAmountSelection] = useState(false);
  const [loanAmount, setLoanAmount] = useState(37500);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      cognome: "",
      mail: "",
      telefono: "",
    },
  });

  const onSubmit = useCallback((values: z.infer<typeof formSchema>) => {
    console.log(values);
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setShowAmountSelection(true);
    }, 2500);
  }, []);

  const handleLoanAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLoanAmount(Number(e.target.value));
  }, []);

  const handleContinue = useCallback(() => {
    setIsSubmitted(true);
    setShowAmountSelection(false);
  }, []);

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl opacity-10"></div>
      <Card className="relative bg-white shadow-2xl border-0 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500"></div>
        
        <CardHeader className="space-y-3 pb-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-4 border-indigo-200 rounded-full"></div>
                <div className="absolute inset-2 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900 mb-2">Caricamento...</CardTitle>
              <p className="text-slate-600">Stiamo elaborando la tua richiesta</p>
            </div>
          ) : showAmountSelection ? (
            <>
              <div className="text-center">
                <CardTitle className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
                  Quanto denaro vuoi prendere in prestito?
                </CardTitle>
                <p className="text-slate-600">Scegli l'importo desiderato</p>
              </div>
            </>
          ) : isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900">Richiesta inviata!</CardTitle>
              <p className="text-slate-600 mt-2">Ti contatteremo entro 2 ore</p>
            </div>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-fit">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Offerta limitata
              </div>
              <CardTitle className="text-3xl font-bold text-slate-900">
                Richiedi ora
              </CardTitle>
              <p className="text-slate-600">
                Compila il form e ricevi una risposta in <span className="font-bold text-blue-600">meno di 2 ore</span>
              </p>
            </>
          )}
        </CardHeader>

        {showAmountSelection && (
          <CardContent className="pt-0 space-y-6">
            <div className="text-center py-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
              <div className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 mb-2">
                {loanAmount.toLocaleString('it-IT')} €
              </div>
              <div className="text-sm text-slate-600 font-medium">
                Importo selezionato
              </div>
            </div>

            <div className="space-y-4">
              <input
                type="range"
                min="1000"
                max="75000"
                step="1000"
                value={loanAmount}
                onChange={handleLoanAmountChange}
                className="w-full h-3 bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${((loanAmount - 1000) / (75000 - 1000)) * 100}%, rgb(226, 232, 240) ${((loanAmount - 1000) / (75000 - 1000)) * 100}%, rgb(226, 232, 240) 100%)`
                }}
              />
              
              <div className="flex justify-between text-sm text-slate-500 font-medium">
                <span>1.000 €</span>
                <span>75.000 €</span>
              </div>
            </div>

            <Button 
              onClick={handleContinue}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              Continua
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </CardContent>
        )}

        {!isSubmitted && !isLoading && !showAmountSelection && (
          <CardContent className="pt-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">Nome</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Mario" 
                          {...field}
                          className="h-12 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cognome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">Cognome</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Rossi" 
                          {...field}
                          className="h-12 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="mario.rossi@esempio.it" 
                          {...field}
                          className="h-12 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">Telefono</FormLabel>
                      <FormControl>
                        <Input 
                          type="tel" 
                          placeholder="+39 333 123 4567" 
                          {...field}
                          className="h-12 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                >
                  Richiedi informazioni gratuite
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
                <p className="text-xs text-center text-slate-500 pt-2">
                  🔒 I tuoi dati sono protetti e non verranno condivisi con terzi
                </p>
              </form>
            </Form>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

