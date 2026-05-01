import React from 'react';
import { Link } from 'react-router-dom';
import { BookHeart } from 'lucide-react';
import logoUrl from '../assets/logo.png';

export const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 px-6 py-4">
      <nav className="max-w-7xl mx-auto bg-white/40 backdrop-blur-md border border-memoria-purple/10 px-8 py-4 rounded-[2.5rem] shadow-sm flex justify-between items-center">
        
        {/* Logo que redireciona para a Home */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <img src={logoUrl} alt="Logo" className="h-10 w-auto" />
        </Link>

        {/* Menu de Navegação - Estilo Cozy Tech */}
        <div className="hidden md:flex gap-10 font-bold text-memoria-purple/70 uppercase text-xs tracking-widest">
          <a href="#como-funciona" className="hover:text-memoria-purple transition">Como funciona</a>
          <a href="#" className="hover:text-memoria-purple transition">Recursos</a>
          <a href="#" className="hover:text-memoria-purple transition">Sobre</a>
        </div>

        {/* Ações: Entrar e Começar */}
        <div className="flex items-center gap-6">
          <Link 
            to="/login" 
            className="text-memoria-purple font-bold hover:opacity-70 transition"
          >
            Entrar
          </Link>
          
          <Link 
            to="/cadastro" 
            className="bg-memoria-lavender text-memoria-purple font-bold px-8 py-3 rounded-full shadow-md hover:scale-105 transition-all flex items-center gap-2"
          >
            <BookHeart size={18} />
            Começar
          </Link>
        </div>
      </nav>
    </div>
  );
};