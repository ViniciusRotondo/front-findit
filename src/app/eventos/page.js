'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import Header from '@/components/Header/page';
import Footer from '@/components/Footer/page';
import Image from 'next/image';

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
  const searchParams = useSearchParams();
  const searchInputRef = useRef(null);

  const [eventos, setEventos] = useState([]);
  const [eventosFiltrados, setEventosFiltrados] = useState([]);

  const [tempBuscaNome, setTempBuscaNome] = useState('');
  const [buscaNomeAplicada, setBuscaNomeAplicada] = useState('');

  useEffect(() => {
    const carregarEventos = async () => {
      const data = await fetchEventos();
      const categoriaUrl = searchParams.get('categoria'); // pega da URL

      // Aplica filtro por categoria da URL se existir
      const filtrados = categoriaUrl && categoriaUrl.toLowerCase() !== 'todas'
        ? data.filter(e =>
            e.categoria?.nome?.toLowerCase() === categoriaUrl.toLowerCase()
          )
        : data;

      setEventos(filtrados);
      setEventosFiltrados(filtrados);
    };

    carregarEventos();
  }, [searchParams]); // roda quando muda o ?categoria=

  // Filtro por nome (aplicado ao clicar ou digitar enter)
useEffect(() => {
  const termo = buscaNomeAplicada.toLowerCase();

  const resultado = eventos.filter((evento) => {

    const nomeEvento = evento.nome_do_evento?.toLowerCase() ?? '';
    const nomeLocal = evento.local?.nome?.toLowerCase() ?? '';
   const nomeCidade = evento.local?.cidades?.nome?.toLowerCase() ?? '';
    const nomeEstado = evento.local?.estados?.nome?.toLowerCase() ?? '';
    const nomePais = evento.local?.paises?.nome?.toLowerCase() ?? '';

    return (
      nomeEvento.includes(termo) ||
      nomeLocal.includes(termo) ||
      nomeCidade.includes(termo) ||
      nomeEstado.includes(termo) ||
      nomePais.includes(termo)
    );
  });

  setEventosFiltrados(resultado);
}, [buscaNomeAplicada, eventos]);

  const aplicarBusca = () => {
    setBuscaNomeAplicada(tempBuscaNome);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      aplicarBusca();
      searchInputRef.current?.blur();
    }
  };

  const handleView = (id) => router.push(`/event/${id}`);

  return (
    <div className="min-h-screen bg-cover bg-center font-lato" style={{ backgroundImage: "url('/page1.png')" }}>
      <Header />

      <div className="bg-black w-full h-20 flex items-center justify-center shadow-md">
        <div className="relative w-3/4 max-w-xl">
          <input
            ref={searchInputRef}
            className="bg-white rounded-3xl h-10 w-full pl-4 pr-10 p-4 focus:text-black focus:outline-none"
            placeholder="Buscar por nome do evento, cidade, estado e nome do local"
            value={tempBuscaNome}
            onChange={(e) => setTempBuscaNome(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <FaSearch
            onClick={aplicarBusca}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-[#EE6405] transition-colors"
          />
        </div>
      </div>

      <main className="flex-grow p-10 flex flex-col items-center">
        <div className="flex flex-wrap justify-center gap-12 pt-8 max-w-5xl mx-auto">
          {eventosFiltrados.length === 0 ? (
            <p className="text-xl font-medium text-gray-700">Nenhum evento encontrado.</p>
          ) : (
            eventosFiltrados.map((ev) => (
              <div key={ev.idEvento} className="w-64 bg-white shadow-md rounded-t-md mb-4 text-left relative overflow-hidden group hover:translate-y-1 transition-transform cursor-pointer">
                <div
                  className="w-full h-48 cursor-pointer relative "
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
                <div className="px-3 py-2">
                  <p className="font-lato font-bold text-md text-black leading-tight mb-1">{ev.nome_do_evento}</p>
                  <p className="font-lato text-sm text-gray-500 mb-1">
                    {ev.local?.nome ?? 'Local não informado'} - {new Date(ev.data_hora).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="font-lato font-extrabold text-black">
                    {ev.preco === 0 || !ev.preco ? 'Grátis' : `R$ ${ev.preco.toFixed(2).replace('.', ',')}`}
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