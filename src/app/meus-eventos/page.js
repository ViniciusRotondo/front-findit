// eventos/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import Header from '@/components/Header/page';
import Footer from '@/components/Footer/page';
import { useRouter } from 'next/navigation';

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

  const [eventos, setEventos] = useState([]);
  const [eventosFiltrados, setEventosFiltrados] = useState([]);
  const [buscaNome, setBuscaNome] = useState('');
  const [filtroLocal, setFiltroLocal] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const carregarEventos = async () => {
      const data = await fetchEventos();
      setEventos(data);
      setEventosFiltrados(data);
    };
    carregarEventos();
  }, []);

  const locaisUnicos = Array.from(new Set(eventos.map(e => e.local?.nome).filter(Boolean)));
  const categoriasUnicas = Array.from(new Set(eventos.map(e => e.categoria).filter(Boolean)));

  const filtrarEventos = () => {
    const resultado = eventos.filter((evento) => {
      const nomeMatch = evento.nome_do_evento.toLowerCase().includes(buscaNome.toLowerCase());
      const localMatch = filtroLocal ? evento.local?.nome === filtroLocal : true;
      const categoriaMatch = filtroCategoria ? evento.categoria === filtroCategoria : true;
      return nomeMatch && localMatch && categoriaMatch;
    });

    setEventosFiltrados(resultado);
  };

  const handleSearchClick = () => {
    filtrarEventos();
  };

  const handleViewEvent = (id) => router.push(`/event/${id}`);
  const handleEditEvent = (id) => router.push(`/editEvent/${id}`);

  const excluirEvento = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/event/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('Evento excluído com sucesso!');
        const atualizados = await fetchEventos();
        setEventos(atualizados);
        setEventosFiltrados(atualizados);
      } else {
        alert('Erro ao excluir evento.');
      }
    } catch (err) {
      console.error('Erro ao excluir evento:', err);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center text-black font-lato"
      style={{ backgroundImage: "url('/page1.png')" }}
    >
      <Header />

      {/* Barra de busca com o mesmo estilo da Home */}
      <div className="bg-black w-full h-20 flex items-center justify-center">
        <div className="relative w-3/4">
          <input
            className="bg-white rounded-3xl h-10 w-full pl-4 pr-10 p-4 focus:text-black focus:outline-none"
            placeholder="Buscar por nome do evento..."
            value={buscaNome}
            onChange={(e) => setBuscaNome(e.target.value)}
            onFocus={() => setMostrarFiltros(true)}
          />
          <FaSearch
            onClick={handleSearchClick}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Filtros (dropdowns) abaixo da barra quando focado */}
      {mostrarFiltros && (
        <div className="flex flex-wrap gap-4 justify-center mt-4">
          <select
            value={filtroLocal}
            onChange={(e) => setFiltroLocal(e.target.value)}
            className="px-4 py-2 rounded-2xl border border-gray-300 shadow bg-white"
          >
            <option value="">Todos os Locais</option>
            {locaisUnicos.map((local) => (
              <option key={local} value={local}>
                {local}
              </option>
            ))}
          </select>
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="px-4 py-2 rounded-2xl border border-gray-300 shadow bg-white"
          >
            <option value="">Todas as Categorias</option>
            {categoriasUnicas.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Conteúdo principal */}
      <main className="flex-grow p-10 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-[#EE6405] mb-6">Eventos</h1>

        <button
          className="bg-[#EE6405] text-white font-semibold py-2 px-6 rounded-2xl hover:bg-[#d65400] mb-6 shadow-lg"
          onClick={() => router.push('/createEvent')}
        >
          Criar Evento
        </button>

        {/* Tabela */}
        <div className="flex flex-wrap justify-center gap-12 pt-8">
  {eventosFiltrados.length === 0 ? (
    <p className="text-4xl font-bold text-[#EE6405] mb-6">Nenhum evento encontrado.</p>
  ) : (
    eventosFiltrados.map((evento) => (
      <div
        key={evento.idEvento}
        className="flex flex-col items-center hover:translate-y-1 transition-transform cursor-pointer"
        onClick={() => handleViewEvent(evento.idEvento)}
      >
        <div className="w-64 h-80 bg-white shadow-md rounded-t-md mb-4 text-left">
          <img
            className="w-full h-3/4 rounded-t-md object-cover"
            src={`/${evento.url_imagem}.jpg`}
            alt={evento.nome_do_evento}
          />
          <div className="px-3 py-2">
            <p className="text-black font-lato font-bold text-md">
              {evento.nome_do_evento}
            </p>
            <p className="text-gray-500 font-lato text-sm">
              {evento.local?.nome || 'Local não informado'} - {evento.data_hora}
            </p>
            <p className="text-black font-extrabold font-lato">
              R${evento.preco},00
            </p>
          </div>
        </div>
      </div>
    ))
  )}
</div>
      </main>

      <Footer />

      {/* Popup de confirmação */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center">
            <h2 className="text-xl font-semibold mb-4 text-black">Tem certeza que deseja excluir?</h2>
            <p className="mb-4 text-black">{eventoSelecionado?.nome_do_evento}</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                onClick={() => {
                  excluirEvento(eventoSelecionado.idEvento);
                  setShowPopup(false);
                }}
              >
                Excluir
              </button>
              <button
                className="bg-gray-300 py-2 px-4 rounded hover:bg-gray-400"
                onClick={() => setShowPopup(false)}
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
