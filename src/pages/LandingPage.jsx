import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ComoFunciona } from '../components/ComoFunciona';
import { ArrowRight, Sparkles } from 'lucide-react';
import ursinhoUrl from '../assets/ursinho-hero.png';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-memoria-cream overflow-x-hidden selection:bg-memoria-lavender">
      <Navbar />
      
      <main className="container mx-auto px-12 pt-32 md:pt-40">
        
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-32">
          
          <div className="lg:w-1/2 flex flex-col gap-8 text-center lg:text-left">
            <h1 className="text-6xl md:text-7xl font-bold leading-[1.1] text-memoria-purple tracking-tight">
              Se lembre do que <br />
              <span className="italic font-serif text-memoria-pink">realmente importa.</span>
            </h1>
            
            <p className="text-xl text-memoria-purple/70 max-w-lg leading-relaxed font-medium">
              Suas memórias merecem mais do que um feed que desaparece. 
              Guarde, reviva e compartilhe o que faz sua história única.
            </p>

            <div className="flex flex-col items-center lg:items-start gap-6">
              {/* Link para a página de Cadastro */}
              <Link 
                to="/cadastro" 
                className="bg-memoria-purple text-memoria-lavender text-2xl font-bold px-12 py-6 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-4 active:scale-95"
              >
                Começar agora
                <ArrowRight size={28} strokeWidth={3} />
              </Link>
              
              <span className="text-base font-semibold opacity-60 text-memoria-purple flex items-center gap-2">
                <Sparkles size={20} className="text-memoria-pink" /> 
                É grátis para começar
              </span>
            </div>
          </div>

          <div className="lg:w-1/2 flex justify-center relative">
             <div className="absolute inset-0 bg-memoria-lavender/20 blur-[100px] rounded-full -z-10"></div>
             
             <img 
               src={ursinhoUrl} 
               alt="Ursinho lendo na poltrona" 
               className="w-full max-w-162.5 h-auto drop-shadow-[0_20px_50px_rgba(78,42,62,0.15)] animate-float"
             />
          </div>
        </section>

        {/* Seção com formas irregulares brilhantes */}
        <div id="como-funciona">
          <ComoFunciona />
        </div>
        
      </main>

      <Footer />
    </div>
  );
};