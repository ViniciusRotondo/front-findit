
'use client';

import { useSession } from "next-auth/react";
import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Header from '@/components/Header/page';
import Footer from '@/components/Footer/page';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const fetchEventos = async () => {
  try {
    const response = await fetch('http://localhost:8080/event');
    if (!response.ok) throw new Error('Erro ao buscar eventos');
    return await response.json();
  } catch (error) {
    console.error('Erro na requisição:', error);
    return [];
  }
};

export default function Eventos() {
  const router = useRouter();
  const searchInputRef = useRef(null);

  const { data: session } = useSession();
  
  const [eventos, setEventos] = useState([]);
  const [eventosFiltrados, setEventosFiltrados] = useState([]);

  const [tempBuscaNome, setTempBuscaNome] = useState('');
  const [tempFiltroLocal, setTempFiltroLocal] = useState('');
  const [tempFiltroCategoria, setTempFiltroCategoria] = useState('');
  const [tempFiltroData, setTempFiltroData] = useState('');

  const [buscaNomeAplicada, setBuscaNomeAplicada] = useState('');
  const [filtroLocalAplicado, setFiltroLocalAplicado] = useState('');
  const [filtroCategoriaAplicada, setFiltroCategoriaAplicada] = useState('');
  const [filtroDataAplicada, setFiltroDataAplicada] = useState('');

  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  // Novos estados para controlar a abertura individual dos dropdowns de filtro
  const [showLocalDropdown, setShowLocalDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);


  useEffect(() => {
    const carregarEventos = async () => {
      const data = await fetchEventos();
      setEventos(data);
      // Ao carregar, inicializa os eventos filtrados com todos os eventos
      setEventosFiltrados(data);
    };
    carregarEventos();
  }, []);

  useEffect(() => {
    const resultado = eventos.filter((evento) => {
      const nomeMatch = evento.nome_do_evento.toLowerCase().includes(buscaNomeAplicada.toLowerCase());
      const localMatch = filtroLocalAplicado ? evento.local?.nome === filtroLocalAplicado : true;
      const categoriaMatch = filtroCategoriaAplicada ? evento.categoria === filtroCategoriaAplicada : true;

      const dataEvento = new Date(evento.data_hora);
      const dataFiltro = filtroDataAplicada ? new Date(filtroDataAplicada) : null;
      const dataMatch = dataFiltro ? dataEvento.toDateString() === dataFiltro.toDateString() : true;

      return nomeMatch && localMatch && categoriaMatch && dataMatch;
    });
    setEventosFiltrados(resultado);
  }, [buscaNomeAplicada, filtroLocalAplicado, filtroCategoriaAplicada, filtroDataAplicada, eventos]);


  const locaisUnicos = Array.from(new Set(eventos.map(e => e.local?.nome).filter(Boolean)));
  const categoriasUnicas = Array.from(new Set(eventos.map(e => e.categoria).filter(Boolean)));

  const aplicarFiltros = () => {
    setBuscaNomeAplicada(tempBuscaNome);
    setFiltroLocalAplicado(tempFiltroLocal);
    setFiltroCategoriaAplicada(tempFiltroCategoria);
    setFiltroDataAplicada(tempFiltroData);
    // Fechar todos os dropdowns de filtro após aplicar
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

  const handleViewEvent = (id) => router.push(`/event/${id}`);

  return (
    <div
      className="min-h-screen bg-cover bg-center text-black font-lato"
      style={{ backgroundImage: "url('/page1.png')" }}
    >
      <Header />

      {/* Barra de busca e Botão de Filtros */}
      <div className="bg-black w-full h-20 flex items-center justify-center shadow-md">
        <div className="relative flex items-center w-full max-w-5xl px-4">
          <input
            ref={searchInputRef}
            className="bg-white rounded-3xl h-10 flex-grow pl-4 pr-10 p-4 focus:text-black focus:outline-none"
            placeholder="Buscar eventos por nome..."
            value={tempBuscaNome}
            onChange={(e) => setTempBuscaNome(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <FaSearch
            onClick={aplicarFiltros}
            className="absolute right-44 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-[#EE6405] transition-colors"
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
        <div className="w-full bg-white/90 backdrop-blur-sm shadow-lg py-4 flex flex-wrap justify-center gap-6 z-10 border-b border-gray-200">

          {/* Filtro de Locais Estilizado */}
          <div className="relative">
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
                      onClick={() => { setTempFiltroLocal(''); setShowLocalDropdown(false); aplicarFiltros(); }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Todos os Locais
                    </button>
                  </li>
                  {locaisUnicos.map((local) => (
                    <li key={local}>
                      <button
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
          <div className="relative">
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
                      onClick={() => { setTempFiltroCategoria(''); setShowCategoryDropdown(false); aplicarFiltros(); }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Todas as Categorias
                    </button>
                  </li>
                  {categoriasUnicas.map((cat) => (
                    <li key={cat}>
                      <button
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

      {session?.user?.cpf ? (
        <button
          className="bg-[#EE6405] text-white font-semibold py-2 px-6 rounded-2xl hover:bg-[#d65400] mb-6 shadow-lg"
          onClick={() => router.push('/createEvent')}
        >
          Criar Evento
        </button>
      ) : (
        null
      )}


      {/* Conteúdo principal com a lista de eventos */}
      <main className="flex-grow p-10 flex flex-col items-center">
        <div className="flex flex-wrap justify-center gap-12 pt-8 max-w-5xl mx-auto">
          {eventosFiltrados.length === 0 ? (
            <p className="text-xl font-medium text-gray-700">Nenhum evento encontrado com os filtros aplicados.</p>
          ) : (
            eventosFiltrados.map((evento) => (
              <div
                key={evento.idEvento}
                className="flex flex-col items-center hover:translate-y-1 transition-transform cursor-pointer"
                onClick={() => handleViewEvent(evento.idEvento)}
              >
                <div className="w-64 h-80 bg-white shadow-md rounded-t-md mb-4 text-left">
                  <Image
                    className="w-full h-3/4 rounded-t-md object-cover"
                    src={`/${evento.url_imagem}.jpg`}
                    alt={evento.nome_do_evento}
                    width={256}
                    height={240}
                    priority
                  />
                  <div className="px-3 py-2">
                    <p className="text-black font-lato font-bold text-md">
                      {evento.nome_do_evento}
                    </p>
                    <p className="text-gray-500 font-lato text-sm">
                      {evento.local?.nome || 'Local não informado'} - {new Date(evento.data_hora).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-black font-extrabold font-lato">
                      R$ {evento.preco ? evento.preco.toFixed(2).replace('.', ',') : '0,00'}
                    </p>
                    <p className="text-[#EE6405] text-sm font-semibold mt-1">
                      Categoria: {evento.categoria?.nome || 'Não informada'}
                    </p>
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