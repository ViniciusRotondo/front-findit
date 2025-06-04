'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaSearch } from 'react-icons/fa';
import Header from '@/components/Header/page';
import Footer from '@/components/Footer/page';

/**
 * Busca todos os eventos na API
 */
const fetchEventos = async () => {
  try {
    const res = await fetch('http://localhost:8080/event');
    if (!res.ok) throw new Error('Erro ao buscar eventos');
    return await res.json();
  } catch (err) {
    console.error('Erro na requisição:', err);
    return [];
  }
};


export default function MeusEventos() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ───────────────────────── Estado / UI ─────────────────────────
  const [eventos, setEventos] = useState([]);
  const [eventosFiltrados, setEventosFiltrados] = useState([]);

  const [buscaNome, setBuscaNome] = useState('');
  const [filtroLocal, setFiltroLocal] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // ───────────────────────── Carregamento dos eventos ─────────────────────────
  useEffect(() => {
    console.log("Status da sessão:", status);
    console.log("Sessão atual:", session);

    if (status !== 'authenticated') return;

    const user = session?.user;
    console.log("Usuário logado (useEffect):", user);

    if (user?.tipo !== 'ORGANIZADOR' || !user?.id) {
      console.warn('Usuário logado não é organizador ou dados incompletos.');
      return;
    }

    const carregar = async () => {
      const todos = await fetchEventos();
      console.log('Eventos da API:', todos);

      const meus = todos.filter((e) => {
        console.log("Evento.organizador:", e.organizador);
        return e.organizador?.idOrganizador === user.id;
      });

      console.log('Eventos filtrados:', meus);
      setEventos(meus);
      setEventosFiltrados(meus);
    };

    carregar();
  }, [status, session]);
  // ───────────────────────── Dados derivados (memo) ─────────────────────────
  const locaisUnicos = useMemo(
    () => Array.from(new Set(eventos.map((e) => e.local?.nome).filter(Boolean))),
    [eventos]
  );

  const categoriasUnicas = useMemo(
    () => Array.from(new Set(eventos.map((e) => e.categoria).filter(Boolean))),
    [eventos]
  );

  // ───────────────────────── Filtro ─────────────────────────
  const filtrarEventos = () => {
    const res = eventos.filter((e) => {
      const nomeOk = e.nome_do_evento.toLowerCase().includes(buscaNome.toLowerCase());
      const localOk = filtroLocal ? e.local?.nome === filtroLocal : true;
      const catOk = filtroCategoria ? e.categoria === filtroCategoria : true;
      return nomeOk && localOk && catOk;
    });
    setEventosFiltrados(res);
  };

  // ───────────────────────── Handlers ─────────────────────────
  const handleSearchClick = () => filtrarEventos();
  const handleView = (id) => router.push(`/event/${id}`);
  
  //───────────────────────── Autenticação ─────────────────────────
    useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    } else if (status === 'authenticated') {
      if (session?.user?.tipo !== 'ORGANIZADOR' || !session.user.id) {
        router.replace('/acesso-negado'); // Ou outra página, como '/'
      }
    }
  }, [status, session, router]);

  // ───────────────────────── Render ─────────────────────────
  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Carregando…</div>;
  }

  <pre className="bg-white text-black p-4 m-4 rounded shadow-md">
    {JSON.stringify(session, null, 2)}
  </pre>
  return (
    <div className="min-h-screen bg-cover bg-center font-lato" style={{ backgroundImage: "url('/page1.png')" }}>
      <Header />

      {/* Barra de busca */}
      <div className="bg-black w-full h-20 flex items-center justify-center">
        <div className="relative w-3/4">
          <input
            className="bg-white rounded-3xl h-10 w-full pl-4 pr-10 p-4 focus:outline-none"
            placeholder="Buscar por nome do evento..."
            value={buscaNome}
            onChange={(e) => setBuscaNome(e.target.value)}
            onFocus={() => setMostrarFiltros(true)}
          />
          <FaSearch onClick={handleSearchClick} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer" />
        </div>
      </div>

      {mostrarFiltros && (
        <div className="flex flex-wrap gap-4 justify-center mt-4">
          <select value={filtroLocal} onChange={(e) => setFiltroLocal(e.target.value)} className="px-4 py-2 rounded-2xl border">
            <option value="">Todos os Locais</option>
            {locaisUnicos.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} className="px-4 py-2 rounded-2xl border">
            <option value="">Todas as Categorias</option>
            {categoriasUnicas.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      )}

      {/* Lista */}
      <main className="flex-grow p-10 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-[#EE6405] mb-6">Meus Eventos</h1>

        {/* Cards */}
        <div className="flex flex-wrap justify-center gap-12 pt-8">
          {eventosFiltrados.length === 0 ? (
            <p className="text-2xl text-[#EE6405]">Nenhum evento encontrado.</p>
          ) : (
            eventosFiltrados.map((ev) => (
              <div key={ev.idEvento} className="flex flex-col items-center hover:-translate-y-1 transition cursor-pointer" onClick={() => handleView(ev.idEvento)}>
                <div className="w-64 h-80 bg-white shadow rounded-t-md mb-4">
                  <img src={`/${ev.url_imagem}.jpg`} alt={ev.nome_do_evento} className="w-full h-3/4 object-cover rounded-t-md" />
                  <div className="px-3 py-2">
                    <p className="font-bold">{ev.nome_do_evento}</p>
                    <p className="text-sm text-gray-500"> {ev.local?.nome ?? 'Local não informado'} - {new Date(ev.data_hora).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    })}</p>
                    <p className="font-extrabold">R${ev.preco},00</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
