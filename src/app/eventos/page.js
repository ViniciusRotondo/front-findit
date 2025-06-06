'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // <-- Importado useSearchParams
import { FaSearch, FaEdit, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Header from '@/components/Header/page';
import Footer from '@/components/Footer/page';
import Image from 'next/image';
import axios from 'axios';

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
  const searchParams = useSearchParams(); // <-- Instanciado useSearchParams
  const searchInputRef = useRef(null);

  // ───────────────────────── Estado / UI ─────────────────────────
  const [eventos, setEventos] = useState([]);
  const [eventosFiltrados, setEventosFiltrados] = useState([]);

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

  // ───────────────────────── Carregamento dos eventos e aplicação do filtro da URL ─────────────────────────
  useEffect(() => {
    const carregarEventos = async () => {
      const data = await fetchEventos();
      setEventos(data);
      
      // Lógica para ler e aplicar o filtro de categoria da URL
      const categoriaFromUrl = searchParams.get('categoria');
      if (categoriaFromUrl && categoriaFromUrl !== 'TODAS') { // 'TODAS' pode ser um sinal para não filtrar
        setTempFiltroCategoria(categoriaFromUrl); // Atualiza o visual do dropdown
        setFiltroCategoriaAplicada(categoriaFromUrl); // Atualiza o estado que realmente filtra
      } else {
        setTempFiltroCategoria('');
        setFiltroCategoriaAplicada('');
      }

      // Chama a função de filtragem inicial aqui, pois os estados de filtro já foram atualizados
      // (O segundo useEffect já vai reagir a essa mudança, mas é bom ter certeza)
      // Ou você pode chamar filtrarEventos diretamente aqui com os parâmetros iniciais
      const initialFilteredEvents = data.filter(evento => {
        const catMatch = (categoriaFromUrl && categoriaFromUrl !== 'TODAS') 
                         ? evento.categoria === categoriaFromUrl 
                         : true;
        return catMatch;
      });
      setEventosFiltrados(initialFilteredEvents);

    };
    carregarEventos();
  }, [searchParams]); // <-- Depende de searchParams para reagir a mudanças na URL

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
  // Este useEffect continua observando os estados de filtro 'aplicados'
  useEffect(() => {
    const resultado = eventos.filter((evento) => {
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
  }, [buscaNomeAplicada, filtroLocalAplicado, filtroCategoriaAplicada, filtroDataAplicada, eventos]);


  const aplicarFiltros = () => {
    setBuscaNomeAplicada(tempBuscaNome);
    setFiltroLocalAplicado(tempFiltroLocal);
    setFiltroCategoriaAplicada(tempFiltroCategoria);
    setFiltroDataAplicada(tempFiltroData);
    setShowFiltersDropdown(false);
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
  
  // NATIVOS DA PÁGINA EVENTOS, REINTRODUZINDO PARA MANTER FUNCIONALIDADE DE ADMIN
  const handleEdit = (id) => router.push(`/editEvent/${id}`); // Redireciona para página de edição

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    if (eventToDelete) {
      try {
        const res = await axios.delete(`http://localhost:8080/event/${eventToDelete.idEvento}`);
        if (res.status === 204) {
          alert('Evento excluído com sucesso!');
          // Recarregar os eventos após a exclusão
          const todosAtualizados = await fetchEventos();
          setEventos(todosAtualizados); // Atualiza todos os eventos, pois esta página mostra todos
          setEventosFiltrados(todosAtualizados); // Recarrega os filtrados também
        } else {
          alert('Erro ao excluir evento.');
        }
      } catch (err) {
        console.error('Erro ao excluir evento:', err);
        alert('Erro ao excluir evento.');
      } finally {
        setShowDeletePopup(false);
        setEventToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
    setEventToDelete(null);
  };
  // FIM NATIVOS DA PÁGINA EVENTOS
  
  // ───────────────────────── Render ─────────────────────────
  if (status === 'loading') { // Removido status de autenticação para esta página
    return <div className="min-h-screen flex items-center justify-center text-xl font-medium text-[#EE6405]">Carregando...</div>;
  }
  
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
      
      {/* Popup de confirmação de exclusão (Apenas para fins de teste no Eventos.js, não deve ser usado aqui em produção) */}
      {/* ATENÇÃO: ESTE POPUP E SUAS FUNÇÕES (handleDeleteClick, confirmDelete, cancelDelete)
                  SÃO PARA PÁGINAS ADMINISTRATIVAS (como MeusEventos).
                  NÃO É RECOMENDADO EM UMA PÁGINA PÚBLICA DE LISTAGEM DE EVENTOS.
                  Foi incluído apenas para demonstração da sua funcionalidade. */}
      {/* {showDeletePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center text-black font-lato">
            <h2 className="text-xl font-semibold mb-4">Tem certeza que deseja excluir este evento?</h2>
            <p className="mb-6 text-lg font-bold">{eventToDelete?.nome_do_evento}</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 text-white py-2 px-5 rounded-lg hover:bg-red-600 transition-colors font-semibold"
                onClick={confirmDelete}
              >
                Sim, Excluir
              </button>
              <button
                className="bg-gray-300 text-gray-800 py-2 px-5 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                onClick={cancelDelete}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}