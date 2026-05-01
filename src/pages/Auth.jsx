import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, ArrowRight, Heart, BookMarked, Image as ImageIcon } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoUrl from '../assets/logo.png';
// Importações do Firebase
import { auth } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';

export const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [loading, setLoading] = useState(false);

  // Estados dos inputs
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  useEffect(() => {
    setIsLogin(location.pathname === '/login');
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN
        await signInWithEmailAndPassword(auth, email, senha);
      } else {
        // CADASTRO
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        // Salva o nome no perfil do Firebase
        await updateProfile(userCredential.user, { displayName: nome });
      }
      
      // Redireciona para a estante após sucesso
      navigate('/estante');
    } catch (error) {
      console.error("Erro na autenticação:", error.code);
      alert("Ops! Verifique seus dados: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[1100px] h-[750px] bg-white rounded-[3rem] shadow-2xl flex overflow-hidden border border-[#4E2A3E]/5">
        
        {/* LADO ESQUERDO: FORMULÁRIO */}
        <div className="w-full lg:w-[45%] h-full p-16 flex flex-col justify-between bg-white">
          <Link to="/">
            <img src={logoUrl} alt="Logo" className="h-10 w-auto opacity-80" />
          </Link>

          <div className="space-y-8">
            <header className="space-y-2">
              <h2 className="text-4xl font-bold text-[#4E2A3E] tracking-tight">
                {isLogin ? 'Acesse sua conta' : 'Crie seu refúgio'}
              </h2>
              <p className="text-[#4E2A3E]/50 font-medium">
                {isLogin ? 'Bem-vinda de volta à sua biblioteca.' : 'Comece a guardar suas memórias hoje.'}
              </p>
            </header>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                {!isLogin && (
                  <div className="group border-b border-[#4E2A3E]/10 focus-within:border-[#4E2A3E] transition-all pb-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#4E2A3E]/40 ml-1">Nome</label>
                    <div className="flex items-center gap-3">
                      <User size={18} className="text-[#4E2A3E]/30" />
                      <input 
                        required
                        type="text" 
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Samyra Alves" 
                        className="w-full bg-transparent outline-none text-[#4E2A3E] font-semibold placeholder:text-[#4E2A3E]/20" 
                      />
                    </div>
                  </div>
                )}

                <div className="group border-b border-[#4E2A3E]/10 focus-within:border-[#4E2A3E] transition-all pb-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#4E2A3E]/40 ml-1">E-mail</label>
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-[#4E2A3E]/30" />
                    <input 
                      required
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com" 
                      className="w-full bg-transparent outline-none text-[#4E2A3E] font-semibold placeholder:text-[#4E2A3E]/20" 
                    />
                  </div>
                </div>

                <div className="group border-b border-[#4E2A3E]/10 focus-within:border-[#4E2A3E] transition-all pb-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#4E2A3E]/40 ml-1">Senha</label>
                  <div className="flex items-center gap-3">
                    <Lock size={18} className="text-[#4E2A3E]/30" />
                    <input 
                      required
                      type="password" 
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-transparent outline-none text-[#4E2A3E] font-semibold placeholder:text-[#4E2A3E]/20" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <label className="flex items-center gap-2 text-xs font-bold text-[#4E2A3E]/50 cursor-pointer">
                  <input type="checkbox" className="accent-[#4E2A3E]" /> Lembrar-me
                </label>
                <button type="button" className="text-xs font-bold text-[#4E2A3E]/50 hover:text-[#4E2A3E] transition-colors uppercase tracking-tighter">Esqueceu a senha?</button>
              </div>

              <button 
                disabled={loading}
                className="w-full bg-[#4E2A3E] text-[#FFFFFF] font-bold py-5 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? 'Processando...' : (isLogin ? 'Entrar na conta' : 'Criar minha conta')}
                <ArrowRight size={20} />
              </button>
            </form>

            <p className="text-center text-sm font-semibold text-[#4E2A3E]/40">
              {isLogin ? "Não tem uma conta?" : "Já possui conta?"} 
              <button onClick={() => setIsLogin(!isLogin)} className="ml-2 text-[#4E2A3E] font-bold hover:underline">
                {isLogin ? 'Cadastre-se' : 'Faça login'}
              </button>
            </p>
          </div>

          <footer className="flex gap-6 text-[10px] font-bold text-[#4E2A3E]/30 uppercase tracking-widest">
            <span>Instagram</span>
            <span>Linkedin</span>
            <span>Github</span>
          </footer>
        </div>

        {/* LADO DIREITO: DASHBOARD PREVIEW (ESTÉTICA DO PROJETO) */}
        <div className="hidden lg:flex w-[55%] h-full bg-[#B599FF]/10 relative items-center justify-center p-12 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #4E2A3E 1px, transparent 0)`, backgroundSize: '32px 32px' }} />

          <div className="relative w-full h-full flex items-center justify-center">
            {/* Card Principal: Mini Estante */}
            <div className="absolute bg-white p-6 rounded-3xl shadow-2xl border border-[#4E2A3E]/5 w-64 animate-bounce">
               <div className="flex justify-between items-center mb-6">
                 <div className="h-2 w-12 bg-[#B599FF] rounded-full" />
                 <Heart className="text-[#FF99C8] fill-[#FF99C8]" size={16} />
               </div>
               <div className="space-y-3">
                 <div className="h-32 bg-[#FFF9F5] rounded-2xl flex items-center justify-center">
                    <BookMarked size={40} className="text-[#4E2A3E]/20" />
                 </div>
                 <div className="h-3 w-full bg-[#FFF9F5] rounded-full" />
                 <div className="h-3 w-2/3 bg-[#FFF9F5] rounded-full" />
               </div>
            </div>
                 {/* Polaroid Flutuante */}
            <div className="absolute top-20 right-10 bg-white p-3 pt-3 pb-8 rounded-lg shadow-xl border border-memoria-purple/5 w-40 rotate-12 animate-float-delayed">
              <div className="h-32 bg-memoria-pink/20 rounded-sm overflow-hidden flex items-center justify-center">
                <ImageIcon size={24} className="text-white/40" />
              </div>
            </div>

            {/* Notificação/Chat Estilo Samy */}
            <div className="absolute bottom-20 right-4 bg-memoria-purple p-5 rounded-3xl shadow-2xl text-memoria-lavender max-w-[200px] -rotate-6 animate-float">
               <p className="text-xs font-medium leading-relaxed italic">
                 "Como quer salvar esse momento hoje?"
               </p>
               <div className="mt-4 flex justify-end">
                 <div className="bg-memoria-lavender/20 px-3 py-1 rounded-full text-[10px] font-bold">AGORA</div>
               </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};