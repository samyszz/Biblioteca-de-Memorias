import React from 'react';
import { 
  Home, Star, Trash2, LogOut, User, 
  Heart, Bookmark, Sparkles 
} from 'lucide-react';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import logoUrl from '../assets/logo.png';

export const Sidebar = ({ setView, currentView }) => {
  const navigate = useNavigate();
  
  // Pega o nome do usuário do Firebase ou usa o fallback "Samy"
  const userName = auth.currentUser?.displayName || "Samy";

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  const menuItems = [
    { id: 'all', label: 'Minha Estante', icon: Home },
    { id: 'favorites', label: 'Favoritos', icon: Star },
    { id: 'trash', label: 'Lixeira', icon: Trash2 },
  ];

  return (
    <aside className="w-full lg:w-72 bg-white border-t lg:border-r border-[#4E2A3E]/5 h-auto lg:h-screen flex flex-row lg:flex-col p-4 lg:p-8 fixed bottom-0 lg:sticky top-auto lg:top-0 z-30">
  {/* Ajuste os itens para ficarem lado a lado no mobile */}
      
      {/* BRANDING (MANTENDO O ESTILO HELLO, SAMY) */}
      <div className="mb-12">
    
  
      </div>

      {/* NAVEGAÇÃO PRINCIPAL */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-bold transition-all group ${
              currentView === item.id 
              ? 'bg-[#d9ccff] text-[#4E2A3E] shadow-lg scale-[1.02]' 
              : 'text-[#4E2A3E]/50 hover:bg-[#d9ccff]/10 hover:text-[#4E2A3E]'
            }`}
          >
            <item.icon size={20} strokeWidth={currentView === item.id ? 3 : 2} />
            <span className="tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* SEÇÃO DE PERFIL COM OPÇÃO DE LOGOUT */}
      <div className="pt-6 border-t border-[#4E2A3E]/5">
        <div className="bg-[#FFF9F5] p-4 rounded-[2rem] flex items-center gap-4 group relative overflow-hidden transition-all hover:bg-[#FFF9F5]/80">
          
          {/* ÍCONE DE PERFIL */}
          <div className="w-12 h-12 bg-[#FFBC99] rounded-2xl flex items-center justify-center border-2 border-white shadow-md text-white transition-transform group-hover:scale-105">
            <User size={24} />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[#4E2A3E] font-black text-sm truncate uppercase tracking-tighter">
              {userName}
            </p>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors"
            >
              <LogOut size={12} /> Sair da conta
            </button>
          </div>
        </div>

        {/* DETALHE ESTÉTICO FINAL (SPARKLES) */}
        <div className="mt-4 flex justify-center opacity-10">
          <Sparkles size={20} className="text-[#4E2A3E]" />
        </div>
      </div>
    </aside>
  );
};