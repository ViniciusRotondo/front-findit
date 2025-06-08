'use client';

import React, { useState, useEffect, useRef } from 'react'; // Removidos useMemo, useSearchParams
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa'; // Apenas FaSearch
import Header from '@/components/Header/page';
import Footer from '@/components/Footer/page';
import Image from 'next/image';

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

export default function Eventos() {
  const router = useRouter();
  // searchParams removido
  const searchInputRef = useRef(null);

  // ───────────────────────── Estado / UI ─────────────────────────
  const [eventos, setEventos] = useState([]);
  const [eventosFiltrados, setEventosFiltrados] = useState([]);

  // Estados para a busca por nome
  const [tempBuscaNome, setTempBuscaNome] = useState('');
  const [buscaNomeAplicada, setBuscaNomeAplicada] = useState('');

  // Estados para controle dos dropdowns de filtro - REMOVIDOS
  // const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  // const [showLocalDropdown, setShowLocalDropdown] = useState(false);
  // const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // ───────────────────────── Carregamento dos eventos ─────────────────────────
  useEffect(() => {
    const carregarEventos = async () => {
      const data = await fetchEventos();
      setEventos(data);
      // Ao carregar, inicializa eventos filtrados com todos
      setEventosFiltrados(data);
    };
    carregarEventos();
  }, []); // Sem dependência de searchParams, pois não há filtro de URL mais

  // ───────────────────────── Filtro por Nome (apenas) ─────────────────────────
  useEffect(() => {
    const resultado = eventos.filter((evento) => {
      const nomeMatch = evento.nome_do_evento.toLowerCase().includes(buscaNomeAplicada.toLowerCase());
      return nomeMatch;
    });
    setEventosFiltrados(resultado);
  }, [buscaNomeAplicada, eventos]); // Depende apenas da busca por nome

  const aplicarBusca = () => { // Renomeado de aplicarFiltros para ser mais específico
    setBuscaNomeAplicada(tempBuscaNome);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      aplicarBusca(); // Chamada para aplicarBusca
      if (searchInputRef.current) {
        searchInputRef.current.blur();
      }
    }
  };

  // ───────────────────────── Handlers de Ações ─────────────────────────
  const handleView = (id) => router.push(`/event/${id}`);
  
  // ───────────────────────── Render ─────────────────────────
  return (
    <div className="min-h-screen bg-cover bg-center font-lato" style={{ backgroundImage: "url('/page1.png')" }}>
      <Header />

      {/* Apenas a Barra de Busca por Nome */}
      <div className="bg-black w-full h-20 flex items-center justify-center shadow-md">
        <div className="relative w-3/4 max-w-xl"> {/* Reduzido max-w para a busca ficar mais centralizada */}
          <input
            ref={searchInputRef}
            className="bg-white rounded-3xl h-10 w-full pl-4 pr-10 p-4 focus:text-black focus:outline-none" // pr-10 para lupa padrão
            placeholder="Buscar por nome do evento..."
            value={tempBuscaNome}
            onChange={(e) => setTempBuscaNome(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          {/* Lupa à direita do input */}
          <FaSearch
            onClick={aplicarBusca} // Chamada para aplicarBusca
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-[#EE6405] transition-colors" // right-4 para lupa padrão
          />
        </div>
      </div>

      {/* Conteúdo principal (Eventos) */}
      <main className="flex-grow p-10 flex flex-col items-center">
        <div className="flex flex-wrap justify-center gap-12 pt-8 max-w-5xl mx-auto">
          {eventosFiltrados.length === 0 ? (
            <p className="text-xl font-medium text-gray-700">Nenhum evento encontrado.</p>
          ) : (
            eventosFiltrados.map((ev) => (
              <div key={ev.idEvento} className="w-64 bg-white shadow-md rounded-t-md mb-4 text-left relative overflow-hidden group">
                {/* Imagem do Evento */}
                <div 
                  className="w-full h-48 cursor-pointer relative" 
                  onClick={() => handleView(ev.idEvento)}
                >
                  <Image 
                    src={`/${ev.url_imagem}.jpg`} 
                    alt={ev.nome_do_evento} 
                    layout="fill" 
                    objectFit="cover" 
                    className="rounded-t-md"
                    priority
                  />
                </div>

                {/* Conteúdo do Card */}
                <div className="px-3 py-2">
                  <p className="font-lato font-bold text-md text-black leading-tight mb-1">
                    {ev.nome_do_evento}
                  </p>
                  <p className="font-lato text-sm text-gray-500 mb-1">
                    {ev.local?.nome ?? 'Local não informado'} - {new Date(ev.data_hora).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="font-lato font-extrabold text-black">
                    R$ {ev.preco ? ev.preco.toFixed(2).replace('.', ',') : '0,00'}
                  </p>
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