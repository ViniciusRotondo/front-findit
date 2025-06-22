'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Ícones de busca e dropdowns
import Header from '@/components/Header/page';
import Footer from '@/components/Footer/page';
import Image from 'next/image';
import axios from 'axios';




export default function EventosCurtidos() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchInputRef = useRef(null);



  // ───────────────────────── Estado / UI ─────────────────────────
  const [eventosCurtidos, setEventosCurtidos] = useState([]); // Eventos curtidos pelo usuário
  const [eventosFiltrados, setEventosFiltrados] = useState([]); // Eventos curtidos filtrados

  // Estados temporários para os filtros (para aplicar ao clique/enter)
  const [tempBuscaNome, setTempBuscaNome] = useState('');
  const [tempFiltroLocal, setTempFiltroLocal] = useState('');
  const [tempFiltroCategoria, setTempFiltroCategoria] = useState('');
  const [tempFiltroData, setTempFiltroData] = useState('');

  // Estados aplicados que disparam a filtragem
  const [buscaNomeAplicada, setBuscaNomeAplicada] = useState('');
  const [filtroLocalAplicado, setFiltroLocalAplicado] = useState('');
  const [filtroCategoriaAplicada, setFiltroCategoriaAplicada] = useState('');
  const [filtroDataAplicada, setFiltroDataAplicada] = useState('');

  // Estados para controle dos dropdowns de filtro
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const [showLocalDropdown, setShowLocalDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  // ───────────────────────── Autenticação e Carregamento dos eventos ────────────────────────
  const fetchLikedEvents = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/user/${userId}/curtidos`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar eventos curtidos:", error);
      return [];
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.id) {
      const carregarEventos = async () => {
        const data = await fetchLikedEvents(session.user.id);
        setEventosCurtidos(data);
        setEventosFiltrados(data);
      };
      carregarEventos();
    }
  }, [status, session, router]);
  // ───────────────────────── Dados derivados (memo) ─────────────────────────
  const locaisUnicos = useMemo(
    () => Array.from(new Set(eventosCurtidos.map((e) => e.local?.nome).filter(Boolean))),
    [eventosCurtidos]
  );

  const categoriasUnicas = useMemo(
    () => Array.from(new Set(eventosCurtidos.map((e) => e.categoria).filter(Boolean))),
    [eventosCurtidos]
  );

  // ───────────────────────── Filtro ─────────────────────────
  useEffect(() => {
    const resultado = eventosCurtidos.filter((evento) => { // Filtra sobre eventosCurtidos
      const nomeMatch = evento.nome_do_evento.toLowerCase().includes(buscaNomeAplicada.toLowerCase());
      const localMatch = filtroLocalAplicado ? evento.local?.nome === filtroLocalAplicado : true;
      const categoriaMatch = filtroCategoriaAplicada ? evento.categoria === filtroCategoriaAplicada : true;

      const dataEvento = new Date(evento.data_hora);
      const dataFiltro = filtroDataAplicada ? new Date(filtroDataAplicada) : null;
      const dataMatch = dataFiltro ?
        dataEvento.getFullYear() === dataFiltro.getFullYear() &&
        dataEvento.getMonth() === dataFiltro.getMonth() &&
        dataEvento.getDate() === dataFiltro.getDate()
        : true;

      return nomeMatch && localMatch && categoriaMatch && dataMatch;
    });
    setEventosFiltrados(resultado);
  }, [buscaNomeAplicada, filtroLocalAplicado, filtroCategoriaAplicada, filtroDataAplicada, eventosCurtidos]);


  const aplicarFiltros = () => {
    setBuscaNomeAplicada(tempBuscaNome);
    setFiltroLocalAplicado(tempFiltroLocal);
    setFiltroCategoriaAplicada(tempFiltroCategoria);
    setFiltroDataAplicada(tempFiltroData);
    setShowFiltersDropdown(false); // Fecha o dropdown principal
    setShowLocalDropdown(false);
    setShowCategoryDropdown(false);
    setShowDateDropdown(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      aplicarFiltros();
      if (searchInputRef.current) {
        searchInputRef.current.blur();
      }
    }
  };

  // ───────────────────────── Handlers de Ações ─────────────────────────
  const handleView = (id) => router.push(`/event/${id}`);

  // ───────────────────────── Render ─────────────────────────
  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center text-xl font-medium text-[#EE6405]">Carregando...</div>;
  }
  // Se não for autenticado, já redirecionou acima.

  return (
    <div className="min-h-screen bg-cover bg-center font-lato" style={{ backgroundImage: "url('/page1.png')" }}>
      <Header />

      {/* Barra de busca e Botão de Filtros */}
      <div className="bg-black w-full h-20 flex items-center justify-center shadow-md">
        <div className="relative flex items-center w-full max-w-5xl px-4">
          <input
            ref={searchInputRef}
            className="bg-white rounded-3xl h-10 flex-grow pl-4 pr-44 p-4 focus:text-black focus:outline-none"
            placeholder="Buscar por nome do evento..."
            value={tempBuscaNome}
            onChange={(e) => setTempBuscaNome(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <FaSearch
            onClick={aplicarFiltros}
            className="absolute right-40 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-[#EE6405] transition-colors"
          />

          {/* Botão para mostrar/esconder o dropdown principal de filtros */}
          <button
            onClick={() => setShowFiltersDropdown(!showFiltersDropdown)}
            className="ml-4 bg-[#EE6405] text-white py-2 px-4 rounded-3xl flex items-center shadow-md hover:bg-[#d65400] transition-colors min-w-[120px] justify-center"
          >
            Filtros
            {showFiltersDropdown ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
          </button>
        </div>
      </div>

      {/* Dropdown de Filtros (Local, Categoria, Data) */}
      {showFiltersDropdown && (
        <div
          className="w-full bg-white/90 backdrop-blur-sm shadow-lg py-4 flex flex-wrap justify-center gap-6 z-10 border-b border-gray-200"
          onMouseLeave={() => {
            setShowFiltersDropdown(false);
            setShowLocalDropdown(false);
            setShowCategoryDropdown(false);
            setShowDateDropdown(false);
          }}
        >

          {/* Filtro de Locais Estilizado */}
          <div
            className="relative"
            onMouseEnter={() => setShowLocalDropdown(true)}
            onMouseLeave={() => setShowLocalDropdown(false)}
          >
            <button
              onClick={() => setShowLocalDropdown(!showLocalDropdown)}
              className="bg-black text-white font-semibold py-2 px-6 rounded-3xl hover:bg-gray-700 transition-all duration-300 shadow-md flex items-center justify-between min-w-[180px]"
            >
              Local: {tempFiltroLocal || 'Todos'}
              <span className="ml-2">{showLocalDropdown ? '▲' : '▼'}</span>
            </button>
            {showLocalDropdown && (
              <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto ring-1 ring-black ring-opacity-5">
                <ul className="py-1">
                  <li>
                    <button
                      type="button"
                      onClick={() => { setTempFiltroLocal(''); setShowLocalDropdown(false); aplicarFiltros(); }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Todos os Locais
                    </button>
                  </li>
                  {locaisUnicos.map((local) => (
                    <li key={local}>
                      <button
                        type="button"
                        onClick={() => { setTempFiltroLocal(local); setShowLocalDropdown(false); aplicarFiltros(); }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {local}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Filtro de Categorias Estilizado */}
          <div
            className="relative"
            onMouseEnter={() => setShowCategoryDropdown(true)}
            onMouseLeave={() => setShowCategoryDropdown(false)}
          >
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="bg-[#46240C] text-white font-semibold py-2 px-6 rounded-3xl hover:bg-[#46240cbe] transition-all duration-300 shadow-md flex items-center justify-between min-w-[180px]"
            >
              Categoria: {tempFiltroCategoria || 'Todas'}
              <span className="ml-2">{showCategoryDropdown ? '▲' : '▼'}</span>
            </button>
            {showCategoryDropdown && (
              <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto ring-1 ring-black ring-opacity-5">
                <ul className="py-1">
                  <li>
                    <button
                      type="button"
                      onClick={() => { setTempFiltroCategoria(''); setShowCategoryDropdown(false); aplicarFiltros(); }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Todas as Categorias
                    </button>
                  </li>
                  {categoriasUnicas.map((cat) => (
                    <li key={cat}>
                      <button
                        type="button"
                        onClick={() => { setTempFiltroCategoria(cat); setShowCategoryDropdown(false); aplicarFiltros(); }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Filtro de Data Estilizado */}
          <div className="relative">
            <input
              type="date"
              value={tempFiltroData}
              onChange={(e) => { setTempFiltroData(e.target.value); aplicarFiltros(); }}
              className="px-4 py-2 rounded-3xl border border-gray-300 shadow bg-white text-black focus:outline-none focus:border-[#EE6405] font-semibold"
            />
          </div>
        </div>
      )}

      {/* Conteúdo principal (Eventos Curtidos) */}
      <main className="flex-grow p-10 flex flex-col items-center">
        <h1 className="font-lato text-black font-bold text-3xl w-full text-center mb-8">EVENTOS CURTIDOS</h1>

        <div className="flex flex-wrap justify-center gap-12 pt-8 max-w-5xl mx-auto ">
          {eventosFiltrados.length === 0 ? (
            <p className="text-xl font-medium text-gray-700">Nenhum evento curtido encontrado com os filtros aplicados.</p>
          ) : (
            eventosFiltrados.map((ev) => (
              <div key={ev.idEvento} className="w-64 bg-white shadow-md rounded-b-md mb-4 text-left relative overflow-hidden group hover:translate-y-1 transition-transform cursor-pointer">
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
                <div className="px-3 py-2 pb-4">
                  <p className="font-lato font-bold text-md text-black leading-tight mb-1">
                    {ev.nome_do_evento}
                  </p>
                  <p className="font-lato text-sm text-gray-500 mb-1">
                    {ev.local?.nome ?? 'Local não informado'} - {new Date(ev.data_hora).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="font-lato font-extrabold text-black">
                    {ev.preco === 0 || !ev.preco
                      ? 'Grátis'
                      : `R$ ${ev.preco.toFixed(2).replace('.', ',')}`}
                  </p>
                </div>

                {/* Esta página não terá botões de Editar/Deletar nos cards */}
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}