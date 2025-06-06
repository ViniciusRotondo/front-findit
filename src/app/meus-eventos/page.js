'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaSearch, FaEdit, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Importa FaEdit e FaTrash, FaChevronDown/Up
import Header from '@/components/Header/page';
import Footer from '@/components/Footer/page';
import Image from 'next/image'; // Para usar o componente Image do Next.js
import axios from 'axios'; // Para as chamadas de DELETE

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
  const searchInputRef = useRef(null);

  // ───────────────────────── Estado / UI ─────────────────────────
  const [eventos, setEventos] = useState([]); // Todos os eventos do organizador
  const [eventosFiltrados, setEventosFiltrados] = useState([]); // Eventos após aplicar busca/filtros

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

  // Estados para o popup de exclusão
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  // ───────────────────────── Autenticação e Carregamento dos eventos ─────────────────────────
  useEffect(() => {
    // Redireciona se não autenticado
    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    } 
    // Redireciona se autenticado mas não for organizador
    if (status === 'authenticated' && (session?.user?.tipo !== 'ORGANIZADOR' || !session.user.id)) {
      router.replace('/acesso-negado'); // Você pode criar esta página ou redirecionar para '/'
      return;
    }

    // Carrega eventos somente se autenticado E for organizador
    if (status === 'authenticated' && session?.user?.tipo === 'ORGANIZADOR' && session.user.id) {
      const carregarMeusEventos = async () => {
        const todos = await fetchEventos();
        const meus = todos.filter((e) => e.organizador?.idOrganizador === session.user.id);
        setEventos(meus);
        // Inicializa os eventos filtrados com os eventos do usuário
        setEventosFiltrados(meus);
      };
      carregarMeusEventos();
    }
  }, [status, session, router]);

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
  // useEffect para aplicar filtros APENAS quando os estados 'oficiais' mudarem
  useEffect(() => {
    const resultado = eventos.filter((evento) => {
      const nomeMatch = evento.nome_do_evento.toLowerCase().includes(buscaNomeAplicada.toLowerCase());
      const localMatch = filtroLocalAplicado ? evento.local?.nome === filtroLocalAplicado : true;
      const categoriaMatch = filtroCategoriaAplicada ? evento.categoria === filtroCategoriaAplicada : true;
      
      const dataEvento = new Date(evento.data_hora);
      const dataFiltro = filtroDataAplicada ? new Date(filtroDataAplicada) : null;
      // Compara apenas a data (ignora a hora)
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
    // Atualiza os estados 'oficiais' com os valores temporários
    setBuscaNomeAplicada(tempBuscaNome);
    setFiltroLocalAplicado(tempFiltroLocal);
    setFiltroCategoriaAplicada(tempFiltroCategoria);
    setFiltroDataAplicada(tempFiltroData);
    // Fechar todos os dropdowns de filtro após aplicar
    setShowFiltersDropdown(false); // Fecha o dropdown principal
    setShowLocalDropdown(false);
    setShowCategoryDropdown(false);
    setShowDateDropdown(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      aplicarFiltros();
      if (searchInputRef.current) {
        searchInputRef.current.blur(); // Tira o foco do input após apertar Enter
      }
    }
  };

  // ───────────────────────── Handlers de Ações ─────────────────────────
  const handleView = (id) => router.push(`/event/${id}`);
  const handleEdit = (id) => router.push(`/editEvent/${id}`); // Redireciona para página de edição

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    if (eventToDelete) {
      try {
        const res = await axios.delete(`http://localhost:8080/event/${eventToDelete.idEvento}`);
        if (res.status === 204) { // 204 No Content para DELETE bem-sucedido
          alert('Evento excluído com sucesso!');
          // Recarregar os eventos após a exclusão
          const todosAtualizados = await fetchEventos();
          const meusAtualizados = todosAtualizados.filter((e) => e.organizador?.idOrganizador === session.user.id);
          setEventos(meusAtualizados);
          setEventosFiltrados(meusAtualizados);
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

  // ───────────────────────── Render ─────────────────────────
  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center text-xl font-medium text-[#EE6405]">Carregando...</div>;
  }
  // Se não for organizador, já redirecionou acima. Aqui só se cair de alguma forma.
  if (status === 'authenticated' && (session?.user?.tipo !== 'ORGANIZADOR' || !session.user.id)) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-medium text-red-600">Acesso Negado: Você não é um organizador.</div>;
  }
  
  // Se chegou aqui, é porque está autenticado e é organizador
  return (
    <div className="min-h-screen bg-cover bg-center font-lato" style={{ backgroundImage: "url('/page1.png')" }}>
      <Header />

      {/* Barra de busca e Botão de Filtros */}
      <div className="bg-black w-full h-20 flex items-center justify-center shadow-md">
        <div className="relative flex items-center w-full max-w-5xl px-4">
          {/* Input de busca */}
          <input
            ref={searchInputRef}
            className="bg-white rounded-3xl h-10 flex-grow pl-4 pr-44 p-4 focus:text-black focus:outline-none" // Ajuste pr para a lupa ficar visível
            placeholder="Buscar por nome do evento..."
            value={tempBuscaNome}
            onChange={(e) => setTempBuscaNome(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          {/* Lupa à direita do input */}
          <FaSearch
            onClick={aplicarFiltros}
            className="absolute right-40 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-[#EE6405] transition-colors" // Ajuste right para a lupa
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

      {/* Conteúdo principal */}
      <main className="flex-grow p-10 flex flex-col items-center">
        {/* Botão Criar Evento */}
        <button
          onClick={() => router.push('/createEvent')}
          className="mb-8 bg-[#EE6405] text-white font-bold py-3 px-8 rounded-full hover:bg-[#d65400] transition-all shadow-lg text-lg"
        >
          Criar Novo Evento
        </button>

        <div className="flex flex-wrap justify-center gap-12 pt-8 max-w-5xl mx-auto">
          {eventosFiltrados.length === 0 ? (
            <p className="text-xl font-medium text-gray-700">Nenhum evento encontrado.</p>
          ) : (
            eventosFiltrados.map((ev) => (
              <div key={ev.idEvento} className="w-64 bg-white shadow-md rounded-b-md mb-4 text-left relative overflow-hidden group">
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
                    priority // Para carregar mais rápido
                  />
                </div>

                {/* Conteúdo do Card */}
                <div className="px-3 py-2 pb-4"> {/* Aumenta o padding inferior */}
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

                {/* Botões de Ação (Editar/Deletar) - Centralizados no rodapé do card */}
                <div className="absolute bottom-0 left-0 right-0 h-10 flex items-center justify-center bg-gray-100 rounded-b-md border-t border-gray-200">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleEdit(ev.idEvento); }}
                    className="flex-1 text-blue-600 hover:text-blue-800 p-2 flex justify-center items-center group-hover:scale-110 transition-transform"
                    title="Editar Evento"
                  >
                    <FaEdit className="text-lg" />
                  </button>
                  <div className="w-px h-full bg-gray-300"></div> {/* Divisor */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteClick(ev); }}
                    className="flex-1 text-red-600 hover:text-red-800 p-2 flex justify-center items-center group-hover:scale-110 transition-transform"
                    title="Excluir Evento"
                  >
                    <FaTrash className="text-lg" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />

      {/* Popup de confirmação de exclusão */}
      {showDeletePopup && (
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
      )}
    </div>
  );
}