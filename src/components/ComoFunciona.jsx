// src/components/ComoFunciona.jsx
import React from 'react';
import { BookPlus, BookOpenText, History } from 'lucide-react';

export const ComoFunciona = () => {
  const passos = [
    {
      icon: <BookPlus size={36} />,
      titulo: "Crie livros",
      desc: "Cada livro representa uma parte especial da sua história.",
      color: "bg-memoria-lavender"
    },
    {
      icon: <BookOpenText size={36} />,
      titulo: "Preencha páginas",
      desc: "Adicione fotos, textos, músicas e tudo que te faz lembrar.",
      color: "bg-memoria-pink"
    },
    {
      icon: <History size={36} />,
      titulo: "Reviva sempre",
      desc: "Volte no tempo sempre que quiser e sinta tudo de novo.",
      color: "bg-memoria-peach"
    }
  ];

  return (
    <section className="py-24 text-center">
      <h2 className="text-5xl font-bold text-memoria-purple mb-6">
        Suas memórias, organizadas como livros.
      </h2>
      <p className="text-xl text-memoria-purple/60 mb-20 max-w-2xl mx-auto">
        Cada livro guarda momentos, pessoas e fases da sua vida.
      </p>
      
      <div className="flex flex-col md:flex-row justify-center items-start gap-20">
        {passos.map((passo, index) => (
          <div key={index} className="flex flex-col items-center max-w-[280px] group relative">
            
            {/* Forma Irregular Brilhante Atrás */}
            <div className={`absolute -top-6 w-32 h-32 ${passo.color} opacity-40 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700 -z-10`}></div>
            
            <div className="w-24 h-24 bg-white/50 backdrop-blur-sm rounded-[2rem] shadow-sm flex items-center justify-center text-memoria-purple mb-8 border border-memoria-purple/5 group-hover:-translate-y-2 transition-all duration-300">
              {passo.icon}
            </div>
            
            <h3 className="font-bold text-2xl mb-4 text-memoria-purple">{passo.titulo}</h3>
            <p className="text-base text-memoria-purple/70 leading-relaxed">{passo.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};