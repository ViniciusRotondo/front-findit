"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ViewEvent() {
  const [evento, setEvento] = useState(null);
  const router = useRouter();
  const { id } = router.query; // Pega o ID da URL

  // Buscar dados do evento ao carregar a página
  useEffect(() => {
    if (!id) return; // Não faz nada se não tiver ID
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/event/${id}`);
        setEvento(res.data);
      } catch (error) {
        console.error("Erro ao buscar evento:", error);
      }
    };

    fetchEvent();
  }, [id]);

  if (!evento) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Visualizar Evento</h1>
      <div className="max-w-xl mx-auto bg-gray-100 p-6 rounded-lg shadow-md">
        <p className="font-bold text-gray-700">Nome do Evento: </p>
        <p className="mb-4">{evento.nome_do_evento}</p>

        <p className="font-bold text-gray-700">Descrição: </p>
        <p className="mb-4">{evento.descricao}</p>

        <p className="font-bold text-gray-700">Data e Hora: </p>
        <p className="mb-4">{evento.data_hora}</p>

        <p className="font-bold text-gray-700">Telefone: </p>
        <p className="mb-4">{evento.telefone}</p>

        <p className="font-bold text-gray-700">Preço: </p>
        <p className="mb-4">{evento.preco}</p>

        <p className="font-bold text-gray-700">Duração: </p>
        <p className="mb-4">{evento.duracao}</p>

        <p className="font-bold text-gray-700">Indicativo de Idade: </p>
        <p className="mb-4">{evento.indicativo_idade}</p>

        <p className="font-bold text-gray-700">Status: </p>
        <p className="mb-4">{evento.status}</p>

        <p className="font-bold text-gray-700">Local: </p>
        <p className="mb-4">{evento.local?.nome}</p>

        <p className="font-bold text-gray-700">Categoria: </p>
        <p className="mb-4">{evento.categoria?.nome}</p>

        <p className="font-bold text-gray-700">Organizador: </p>
        <p className="mb-4">{evento.organizador?.nome}</p>

        <button
          onClick={() => router.push(`/edit-event/${evento.id}`)}
          className="w-full bg-yellow-500 text-white py-3 rounded hover:bg-yellow-600 transition"
        >
          Editar Evento
        </button>
      </div>
    </div>
  );
}