import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { 
  Plus, Search, Bookmark, Heart, X, Type, 
  ArrowLeft, Save, Upload, Trash2, Edit3, MoreHorizontal, Camera, Palette, Star, History 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, auth } from '../lib/firebase'; // Certifique-se de que o auth está exportado no seu firebase.js
import { 
  collection, onSnapshot, query, addDoc, 
  serverTimestamp, orderBy, where, deleteDoc, doc, updateDoc 
} from 'firebase/firestore';
import { uploadImageToCloudinary } from '../services/cloudinary';
import logoUrl from '../assets/logo.png';

export const Estante = () => {
  const [view, setView] = useState('all');
  const [livroAberto, setLivroAberto] = useState(null);
  const [showModalLivro, setShowModalLivro] = useState(false);
  const [showModalMemoria, setShowModalMemoria] = useState(false);
  const [showModalTexto, setShowModalTexto] = useState(false); 
  const [showModalOpcoes, setShowModalOpcoes] = useState(false);
  const [showModalLivroOpcoes, setShowModalLivroOpcoes] = useState(false);
  
  const [livros, setLivros] = useState([]);
  const [memorias, setMemorias] = useState([]); 
  const [memoriaSelecionada, setMemoriaSelecionada] = useState(null);
  const [livroSelecionado, setLivroSelecionado] = useState(null);

  // Estados para novos dados
  const [novoTitulo, setNovoTitulo] = useState('');
  const [corSelecionada, setCorSelecionada] = useState({ bg: 'bg-[#d9ccff]', border: 'border-[#9475EA]' });
  const [notaTexto, setNotaTexto] = useState(''); 
  const [imagemCapa, setImagemCapa] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(0);

  const coresDisponiveis = [
    { name: 'Lilás', bg: 'bg-[#d9ccff]', border: 'border-[#9475EA]' },
    { name: 'Pêssego', bg: 'bg-[#FFBC99]', border: 'border-[#E8A37D]' },
    { name: 'Rosa', bg: 'bg-[#FF99C8]', border: 'border-[#FF7EB6]' },
    { name: 'Menta', bg: 'bg-[#55D8C1]', border: 'border-[#45B09E]' },
  ];

  // 1. Busca os livros filtrados por Usuário Logado
  useEffect(() => {
    if (!auth.currentUser) return;

    const userRef = auth.currentUser.uid;
    let q;

    if (view === 'favorites') {
      q = query(
        collection(db, 'livros'), 
        where('userId', '==', userRef),
        where('isFavorite', '==', true), 
        where('isDeleted', '==', false)
      );
    } else if (view === 'trash') {
      q = query(
        collection(db, 'livros'), 
        where('userId', '==', userRef),
        where('isDeleted', '==', true), 
        orderBy('deletedAt', 'desc')
      );
    } else {
      q = query(
        collection(db, 'livros'), 
        where('userId', '==', userRef),
        where('isDeleted', '==', false), 
        orderBy('createdAt', 'desc')
      );
    }

    return onSnapshot(q, (snapshot) => {
      setLivros(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, [view, auth.currentUser]);

  // 2. Busca memórias do livro aberto
  useEffect(() => {
    if (livroAberto) {
      const q = query(collection(db, 'memorias'), where('livroId', '==', livroAberto.id), orderBy('createdAt', 'asc'));
      return onSnapshot(q, (snapshot) => {
        setMemorias(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
    }
  }, [livroAberto]);

  // Handlers de gerenciamento
  const handleToggleFavorite = async (livro, e) => {
    e.stopPropagation();
    await updateDoc(doc(db, 'livros', livro.id), { isFavorite: !livro.isFavorite });
  };

  const handleMoveToTrash = async () => {
    await updateDoc(doc(db, 'livros', livroSelecionado.id), { isDeleted: true, deletedAt: serverTimestamp() });
    setShowModalLivroOpcoes(false);
  };

  const handleRecoverLivro = async () => {
    await updateDoc(doc(db, 'livros', livroSelecionado.id), { isDeleted: false });
    setShowModalLivroOpcoes(false);
  };

  const handlePermanentDelete = async () => {
    if(window.confirm("Essa ação não pode ser desfeita. Excluir para sempre?")) {
      await deleteDoc(doc(db, 'livros', livroSelecionado.id));
      setShowModalLivroOpcoes(false);
    }
  };

  const handleAddLivro = async (e) => {
    e.preventDefault();
    if (!novoTitulo || !imagemCapa || !auth.currentUser) return;
    setLoading(true);
    try {
      const urlCapa = await uploadImageToCloudinary(imagemCapa);
      await addDoc(collection(db, 'livros'), {
        userId: auth.currentUser.uid,
        titulo: novoTitulo,
        ano: new Date().getFullYear().toString(),
        cor: corSelecionada.bg,
        border: corSelecionada.border,
        img: urlCapa,
        isFavorite: false,
        isDeleted: false,
        createdAt: serverTimestamp(),
      });
      setShowModalLivro(false);
      setNovoTitulo('');
      setImagemCapa(null);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleSaveTexto = async (e) => {
    e.preventDefault();
    try {
      if (memoriaSelecionada) {
        await updateDoc(doc(db, 'memorias', memoriaSelecionada.id), { texto: notaTexto });
      } else {
        await addDoc(collection(db, 'memorias'), {
          livroId: livroAberto.id,
          tipo: 'texto',
          texto: notaTexto,
          createdAt: serverTimestamp(),
        });
      }
      setShowModalTexto(false);
      setNotaTexto('');
    } catch (error) { console.error(error); }
  };

  const handleAddMemoriaFoto = async (arquivo) => {
    setLoading(true);
    try {
      const urlMidia = await uploadImageToCloudinary(arquivo);
      await addDoc(collection(db, 'memorias'), {
        livroId: livroAberto.id,
        url: urlMidia,
        tipo: 'foto',
        texto: "Nova memória registrada", 
        createdAt: serverTimestamp(),
      });
      setShowModalMemoria(false);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleDeleteMemoria = async () => {
    if(window.confirm("Deseja descartar esta página?")) {
      await deleteDoc(doc(db, 'memorias', memoriaSelecionada.id));
      setShowModalOpcoes(false);
      setMemoriaSelecionada(null);
    }
  };

 return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FFF9F5] font-sans relative overflow-x-hidden">
      <Sidebar setView={setView} currentView={view} className="z-30 lg:w-72" />

      <main className="flex-1 p-4 md:p-8 relative z-10 min-h-screen lg:h-screen lg:overflow-y-auto no-scrollbar pb-24 lg:pb-8">
        {!livroAberto ? (
          <div className="animate-in fade-in duration-700">
            <header className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10">
              <img src={logoUrl} alt="Hello, Samy" className="h-16 md:h-23 w-auto" />
              <button 
                onClick={() => setShowModalLivro(true)} 
                className="w-full sm:w-auto bg-[#4E2A3E] text-[#d9ccff] font-black px-6 py-4 md:px-8 md:py-5 rounded-[1.5rem] md:rounded-[2rem] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
              >
                <Plus size={20} /> Novo capítulo
              </button>
            </header>

            <div className="bg-[#5C3D2E]/5 rounded-[2rem] md:rounded-[4rem] p-6 md:p-12 border border-white/50 shadow-inner relative">
               <h3 className="text-3xl md:text-5xl font-black text-[#4E2A3E] tracking-tighter italic mb-8 md:ml-2 uppercase">
                {view === 'favorites' ? 'Favoritos' : view === 'trash' ? 'Lixeira' : 'Minha Estante'}
               </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {livros.map((livro) => (
                  <div 
                    key={livro.id} 
                    onClick={() => !livro.isDeleted && setLivroAberto(livro)} 
                    className={`${livro.cor} rounded-3xl p-4 md:p-5 border-l-[8px] md:border-l-[12px] ${livro.border} shadow-2xl hover:-translate-y-2 lg:hover:-translate-y-4 transition-all duration-500 cursor-pointer group relative`}
                  >
                    {/* Botão de Favorito: p-3 e stopPropagation para não abrir o livro */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(livro, e);
                      }} 
                      className="absolute top-2 left-2 p-3 bg-white/30 backdrop-blur-md rounded-full text-white lg:opacity-0 lg:group-hover:opacity-100 hover:scale-110 active:scale-90 z-20 transition-all"
                    >
                      <Star size={20} fill={livro.isFavorite ? "white" : "none"} />
                    </button>

                    {/* Botão de Opções: Área de clique maior (p-3) e z-index para ficar no topo */}
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setLivroSelecionado(livro); 
                        setShowModalLivroOpcoes(true); 
                      }} 
                      className="absolute top-2 right-2 p-3 bg-white/30 backdrop-blur-md rounded-full text-white lg:opacity-0 lg:group-hover:opacity-100 hover:scale-110 active:scale-90 z-20 transition-all"
                    >
                      <MoreHorizontal size={22} strokeWidth={3} />
                    </button>

                    <div className="text-center mb-4 relative z-10 font-black text-white uppercase tracking-tighter">
                      <h5 className="text-xl md:text-2xl leading-none mb-1 truncate px-2">{livro.titulo}</h5>
                      <span className="text-white/60 text-[10px]">{livro.ano}</span>
                    </div>

                    <div className="aspect-[3/4] bg-white/20 rounded-2xl overflow-hidden border border-white/30 relative z-10">
                      <img 
                        src={livro.img} 
                        className="w-full h-full object-cover lg:group-hover:scale-105 transition-all duration-700" 
                        alt={livro.titulo} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col animate-in fade-in duration-500">
            <button onClick={() => setLivroAberto(null)} className="flex items-center gap-2 text-[#4E2A3E] font-black uppercase text-xs mb-8 hover:text-[#FF99C8] transition-colors">
              <ArrowLeft size={18} /> Voltar para a estante
            </button>

            <div className="flex-1 flex items-center justify-center lg:perspective-[2000px] pb-10">
              <div className="relative w-full max-w-5xl lg:h-[600px] flex flex-col lg:flex-row shadow-2xl lg:shadow-[0_50px_100px_rgba(78,42,62,0.2)] rounded-[2rem] lg:rounded-[3rem] overflow-hidden bg-white">
                <div className={`w-full lg:w-1/2 ${livroAberto.cor} p-8 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-black/10`}>
                   <h2 className="text-4xl lg:text-6xl font-black italic text-white tracking-tighter uppercase leading-none break-words">{livroAberto.titulo}</h2>
                   <div className="mt-6 lg:mt-0 bg-white/10 p-4 lg:p-6 rounded-2xl lg:rounded-3xl text-white font-bold uppercase text-[10px] lg:text-xs tracking-widest text-center lg:text-left">Capítulo: {livroAberto.ano}</div>
                </div>

                <div className="w-full lg:w-1/2 bg-[#FFF9F5] p-6 lg:p-12 flex flex-col relative shadow-[inset_0_20px_40px_rgba(0,0,0,0.02)] lg:shadow-[inset_20px_0_40px_rgba(0,0,0,0.05)]">
                  <header className="flex justify-between items-center mb-6">
                    <h4 className="text-[#4E2A3E] font-black text-[10px] lg:text-xs uppercase tracking-widest">Pág {paginaAtual + 1} de {memorias.length || 1}</h4>
                    <button onClick={() => setShowModalMemoria(true)} className="p-3 bg-[#d9ccff]/20 text-[#4E2A3E] rounded-full hover:bg-[#d9ccff]/40 shadow-sm"><Plus size={20} /></button>
                  </header>

                  <div className="flex-1 flex flex-col items-center justify-center relative min-h-[300px]">
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={paginaAtual} 
                        initial={{ rotateY: 90, opacity: 0 }} 
                        animate={{ rotateY: 0, opacity: 1 }} 
                        exit={{ rotateY: -90, opacity: 0 }} 
                        transition={{ duration: 0.4 }} 
                        onClick={() => { if(memorias[paginaAtual]) { setMemoriaSelecionada(memorias[paginaAtual]); setShowModalOpcoes(true); }}} 
                        className="bg-white p-3 pb-8 md:pb-10 shadow-lg border border-[#4E2A3E]/5 w-full max-w-[260px] md:max-w-[80%] rotate-1 hover:rotate-0 transition-transform cursor-pointer group relative"
                      >
                        {memorias[paginaAtual] ? (
                          <>
                            <div className="absolute top-2 right-2 p-1 bg-[#4E2A3E]/5 rounded-full text-[#4E2A3E]/30"><MoreHorizontal size={14} /></div>
                            {memorias[paginaAtual].url && <img src={memorias[paginaAtual].url} className="aspect-square w-full object-cover rounded-sm mb-3" alt="Memória" />}
                            <p className="text-[#4E2A3E] font-bold italic text-[10px] md:text-xs text-center px-2 leading-tight break-words">{memorias[paginaAtual].texto}</p>
                          </>
                        ) : <p className="text-[#4E2A3E]/40 italic font-medium text-sm">Folha em branco...</p>}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="flex justify-between mt-8 pt-4 border-t border-[#4E2A3E]/5">
                    <button disabled={paginaAtual === 0} onClick={() => setPaginaAtual(prev => prev - 1)} className="p-4 bg-white shadow-md rounded-2xl text-[#4E2A3E] disabled:opacity-20 active:scale-90 transition-all"><ArrowLeft size={24} /></button>
                    <button disabled={paginaAtual >= memorias.length - 1 || memorias.length === 0} onClick={() => setPaginaAtual(prev => prev + 1)} className="p-4 bg-white shadow-md rounded-2xl text-[#4E2A3E] disabled:opacity-20 active:scale-90 transition-all rotate-180"><ArrowLeft size={24} /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL OPÇÕES LIVRO */}
      {showModalLivroOpcoes && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#4E2A3E]/60 backdrop-blur-sm" onClick={() => setShowModalLivroOpcoes(false)} />
          <div className="bg-white w-full max-w-xs rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 relative z-10 shadow-2xl border-4 border-[#4E2A3E] animate-in zoom-in-95">
             <h4 className="text-[#4E2A3E] font-black italic text-lg md:text-xl mb-6 text-center uppercase tracking-tighter">Opções</h4>
             <div className="space-y-4">
                {livroSelecionado?.isDeleted ? (
                  <>
                    <button onClick={handleRecoverLivro} className="w-full flex items-center justify-center gap-3 py-3 md:py-4 bg-green-50 text-green-600 font-black rounded-xl md:rounded-2xl active:scale-95 transition-transform"><History size={18} /> Recuperar</button>
                    <button onClick={handlePermanentDelete} className="w-full flex items-center justify-center gap-3 py-3 md:py-4 bg-red-50 text-red-500 font-black rounded-xl md:rounded-2xl active:scale-95 transition-transform"><Trash2 size={18} /> Excluir de vez</button>
                  </>
                ) : (
                  <>
                    <div className="space-y-2 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#4E2A3E]/40 flex items-center justify-center gap-2"><Palette size={12} /> Mudar Cor</p>
                      <div className="flex gap-2 justify-center">
                        {coresDisponiveis.map((c) => (<button key={c.name} onClick={() => { updateDoc(doc(db, 'livros', livroSelecionado.id), { cor: c.bg, border: c.border }); setShowModalLivroOpcoes(false); }} className={`w-7 h-7 md:w-8 md:h-8 rounded-full ${c.bg} ${c.border} border-2 hover:scale-110 active:scale-90 transition-transform`} />))}
                      </div>
                    </div>
                    <button onClick={handleMoveToTrash} className="w-full flex items-center justify-center gap-3 py-3 md:py-4 bg-red-50 text-red-500 font-black rounded-xl md:rounded-2xl active:scale-95 transition-transform"><Trash2 size={18} /> Mover para Lixeira</button>
                  </>
                )}
                <button onClick={() => setShowModalLivroOpcoes(false)} className="w-full py-2 text-[#4E2A3E]/40 font-bold text-xs uppercase tracking-widest">Voltar</button>
             </div>
          </div>
        </div>
      )}

      {/* MODAL NOVO LIVRO */}
      {showModalLivro && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#4E2A3E]/40 backdrop-blur-md" onClick={() => setShowModalLivro(false)} />
          <div className="bg-white w-full max-w-xl rounded-[2rem] md:rounded-[3.5rem] shadow-2xl border-4 border-[#4E2A3E] relative z-10 p-6 md:p-10 animate-in zoom-in-95">
            <h3 className="text-2xl md:text-4xl font-black text-[#4E2A3E] italic mb-6 md:mb-8 uppercase tracking-tighter leading-none">Novo Capítulo</h3>
            <form onSubmit={handleAddLivro} className="space-y-5 md:space-y-6">
              <input value={novoTitulo} onChange={(e) => setNovoTitulo(e.target.value)} type="text" placeholder="Nome do Livro" className="w-full px-6 py-4 md:px-8 md:py-5 bg-[#4E2A3E]/5 rounded-2xl md:rounded-[2rem] border-none text-[#4E2A3E] font-bold focus:ring-4 focus:ring-[#d9ccff]/20" />
              <div className="flex gap-3 md:gap-4 ml-2">
                {coresDisponiveis.map((c) => (<button key={c.name} type="button" onClick={() => setCorSelecionada(c)} className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${c.bg} ${c.border} border-4 transition-transform ${corSelecionada.bg === c.bg ? 'scale-125 border-white shadow-lg' : 'opacity-40 active:scale-90'}`} />))}
              </div>
              <div className="flex items-center justify-center w-full h-32 md:h-40 border-4 border-dashed border-[#4E2A3E]/10 rounded-2xl md:rounded-[2rem] bg-[#4E2A3E]/5 relative">
                {imagemCapa ? <img src={URL.createObjectURL(imagemCapa)} className="w-full h-full object-cover rounded-[1.2rem] md:rounded-[1.8rem]" alt="Preview" /> : <div className="text-center text-[#4E2A3E]/40 uppercase text-[10px] font-black"><Upload className="mx-auto mb-2" /> Foto da Capa</div>}
                <input type="file" accept="image/*" onChange={(e) => setImagemCapa(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
              <button disabled={loading} className="w-full bg-[#4E2A3E] text-white font-black py-4 md:py-5 rounded-2xl md:rounded-[2rem] shadow-xl active:scale-95 transition-transform uppercase tracking-widest">{loading ? "Enviando..." : "Criar Capítulo"}</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: OPÇÕES DE MEMÓRIA */}
      {showModalOpcoes && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#4E2A3E]/60 backdrop-blur-sm" onClick={() => setShowModalOpcoes(false)} />
          <div className="bg-white w-full max-w-xs rounded-[2.5rem] p-8 relative z-10 shadow-2xl border-4 border-[#4E2A3E] animate-in zoom-in-95">
             <div className="space-y-3">
                <button onClick={() => { setNotaTexto(memoriaSelecionada.texto); setShowModalTexto(true); setShowModalOpcoes(false); }} className="w-full flex items-center justify-center gap-3 py-4 bg-[#d9ccff]/20 text-[#4E2A3E] font-black rounded-2xl hover:bg-[#d9ccff]/30 transition-all shadow-sm"><Edit3 size={18} /> Editar legenda</button>
                <button onClick={handleDeleteMemoria} className="w-full flex items-center justify-center gap-3 py-4 bg-red-50 text-red-500 font-black rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={18} /> Descartar página</button>
                <button onClick={() => { setShowModalOpcoes(false); setMemoriaSelecionada(null); }} className="w-full py-2 text-[#4E2A3E]/40 font-bold text-xs uppercase tracking-widest">Voltar</button>
             </div>
          </div>
        </div>
      )}

      {/* MODAL DE TEXTO */}
      {showModalTexto && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#4E2A3E]/60 backdrop-blur-sm" onClick={() => { setShowModalTexto(false); setMemoriaSelecionada(null); setNotaTexto(''); }} />
          <div className="bg-white w-full max-w-lg rounded-[3.5rem] border-4 border-[#4E2A3E] relative z-10 p-10 shadow-2xl animate-in zoom-in-95">
            <header className="flex justify-between items-center mb-6">
              <h3 className="text-3xl font-black text-[#4E2A3E] italic">{memoriaSelecionada ? "Refinar Memória" : "Nova Nota"}</h3>
              <button onClick={() => { setShowModalTexto(false); setMemoriaSelecionada(null); setNotaTexto(''); }}><X size={24} /></button>
            </header>
            <form onSubmit={handleSaveTexto} className="space-y-6">
              <textarea value={notaTexto} onChange={(e) => setNotaTexto(e.target.value)} placeholder="O que você está pensando? ✨" className="w-full h-40 p-6 bg-[#4E2A3E]/5 rounded-[2rem] border-none text-[#4E2A3E] font-medium resize-none focus:ring-4 focus:ring-[#d9ccff]/20" />
              <button disabled={loading || !notaTexto} className="w-full bg-[#d9ccff] text-[#4E2A3E] font-black py-5 rounded-[2rem] shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                {loading ? "Processando..." : (memoriaSelecionada ? "Atualizar legenda" : "Adicionar à página")}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NOVO FRAGMENTO */}
      {showModalMemoria && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#4E2A3E]/40 backdrop-blur-md" onClick={() => setShowModalMemoria(false)} />
          <div className="bg-white w-full max-w-lg rounded-[3.5rem] border-4 border-[#4E2A3E] relative z-10 p-10 animate-in slide-in-from-bottom-10">
            <h3 className="text-3xl font-black text-[#4E2A3E] italic mb-8 uppercase tracking-tighter leading-none">Novo Fragmento</h3>
            <div className="grid grid-cols-2 gap-4">
               <div className="relative flex flex-col items-center gap-3 p-8 bg-[#FFBC99]/10 rounded-[2.5rem] border-2 border-transparent hover:border-[#FFBC99] transition-all cursor-pointer">
                  <Camera className="text-[#FFBC99]" size={32} />
                  <span className="text-[10px] font-black uppercase">Fotografia</span>
                  <input type="file" accept="image/*" onChange={(e) => handleAddMemoriaFoto(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" disabled={loading} />
               </div>
               <button onClick={() => setShowModalTexto(true)} className="flex flex-col items-center gap-3 p-8 bg-[#d9ccff]/10 rounded-[2.5rem] border-2 border-transparent hover:border-[#d9ccff] transition-all">
                  <Type className="text-[#d9ccff]" size={32} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#4E2A3E]">Anotação</span>
               </button>
            </div>
            <button onClick={() => setShowModalMemoria(false)} className="w-full mt-8 py-4 text-[#4E2A3E]/40 font-bold uppercase text-xs tracking-widest">Voltar</button>
          </div>
        </div>
      )}
    </div>
  );
};