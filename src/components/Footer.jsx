import React from 'react';
import { ArrowRight } from 'lucide-react';
import logoUrl from '../assets/logo.png';

export const Footer = () => {
  return (
    <footer className="w-full bg-[#FFF9F5] py-12 px-6">
      {/* Container Principal Estilo Card Arredondado conforme imagem_8163a7.png */}
      <div className="max-w-[1200px] mx-auto bg-white rounded-[3rem] p-8 shadow-sm border border-[#4E2A3E]/5 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* LADO ESQUERDO: LOGO E FRASE MANTIDAS */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <img src={logoUrl} alt="Hello, Samy" className="h-10 w-auto" />
          <p className="text-[#4E2A3E]/60 font-medium italic text-sm text-center md:text-left">
            "Memórias são pequenos tesouros que guardamos no coração."
          </p>
        </div>

        {/* CENTRO: NAVEGAÇÃO EM TABS (ESTÉTICA DO PROJETO) */}
        <nav className="flex flex-wrap justify-center gap-2 bg-[#4E2A3E]/5 p-2 rounded-2xl">
          {['Como funciona', 'Recursos', 'Sobre'].map((item) => (
            <button 
              key={item} 
              className="px-6 py-2 rounded-xl text-[#4E2A3E] font-bold text-sm hover:bg-white hover:shadow-sm transition-all"
            >
              {item}
            </button>
          ))}
        </nav>

        {/* LADO DIREITO: ACTIONS (CORES HELLO, SAMY) */}
        <div className="flex items-center gap-4">
          <button className="hidden md:flex items-center gap-2 px-6 py-3 bg-white border-2 border-[##4E2A3E]/20 rounded-2xl text-[#4E2A3E] text-sm font-black hover:border-[##4E2A3E] transition-all group">
            <ArrowRight size={18} className="text-[#4E2A3E] group-hover:translate-x-1 transition-transform" />
            Portfólio
          </button>

          <button className="px-8 py-3 bg-[#4E2A3E] text-[#FFFFFF] font-black rounded-2xl shadow-lg shadow-[##4E2A3E]/20 hover:scale-105 active:scale-95 transition-all">
            Contato
          </button>
        </div>
      </div>

      {/* RODAPÉ INFERIOR: CRÉDITOS PERSONALIZADOS */}
      <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4 text-[10px] font-black text-[#4E2A3E]/30 uppercase tracking-[0.2em]">
        <p>© 2026 • Hello, Samy • Todos os direitos reservados</p>
        <div className="hidden md:block h-1 w-1 bg-[#4E2A3E]/10 rounded-full" />
        <p>Desenvolvido com carinho por Samyra Alves</p>
      </div>
    </footer>
  );
};