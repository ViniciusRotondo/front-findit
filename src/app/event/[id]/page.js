'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Para capturar o ID dinâmico da rota
import Header from '@/components/Header/page';
import Footer from '@/components/Footer/page';
import axios from 'axios';

const ViewEvent = () => {
  const [evento, setEvento] = useState(null);
  const router = useRouter();
  const { id } = useParams(); // Captura o ID da rota dinâmica

  // Buscar dados do evento ao carregar a página
  useEffect(() => {
    const fetchEvento = async () => {
      if (!id) return; // Verifica se o ID está disponível
      try {
        const response = await axios.get(`http://localhost:8080/event/${id}`);
        setEvento(response.data);
      } catch (error) {
        console.error("Erro ao buscar evento:", error);
      }
    };

    fetchEvento();
  }, [id]);

  if (!evento) {
    return <p>Carregando...</p>; // Exibe um loading enquanto o evento não é carregado
  }

  return (
    <>
    <div className="min-h-screen bg-white">
    <Header />
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">{evento.nome_do_evento}</h1>
      <div className="max-w-xl mx-auto space-y-6 bg-gray-100 p-6 rounded-lg shadow-md">
        <div>
          <h2 className="text-xl font-semibold text-gray-700">Descrição</h2>
          <p className="text-gray-800">{evento.descricao}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-700">Data e Hora</h2>
          <p className="text-gray-800">{new Date(evento.data_hora).toLocaleString()}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-700">Local</h2>
          <p className="text-gray-800">{evento.local ? evento.local.nome : "Sem Local"}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-700">Preço</h2>
          <p className="text-gray-800">R$ {evento.preco.toFixed(2)}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-700">Duração</h2>
          <p className="text-gray-800">{evento.duracao} horas</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-700">Indicativo de Idade</h2>
          <p className="text-gray-800">{evento.indicativo_idade} anos</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-700">Telefone</h2>
          <p className="text-gray-800">{evento.telefone}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-700">Status</h2>
          <p className="text-gray-800">{evento.status}</p>
        </div>
      </div>
      <button 
        onClick={() => router.push('/')} // Redireciona de volta para a lista de eventos
        className="mt-6 w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition"
      >
        Voltar para a lista
      </button>
    <Footer />
    </div>
    </>
  );
};

export default ViewEvent;