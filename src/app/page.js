'use client';

import React, { useState, useEffect } from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useRouter } from "next/navigation";
import Header from '@/components/Header/page';
import Footer from '@/components/Footer/page';

const fetchEventos = async () => {
  try {
    const response = await fetch('http://localhost:8080/event'); // Endpoint correto
    if (!response.ok) {
      throw new Error('Falha ao buscar eventos');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro na requisição:", error);
    return [];
  }
};

export default function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const router = useRouter(); // Atualizado para next/navigation

  const handleViewEvent = (id) => {
    router.push(`/event/${id}`); // Redireciona para a página de visualização
  };

  const handleEditEvent = (id) => {
    router.push(`/editEvent/${id}`); // Redireciona para a página de edição
  };

  const excluirEvento = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/event/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Evento excluído com sucesso!");
        const eventosAtualizados = await fetchEventos(); // Atualiza a lista de eventos após a exclusão
        setEventos(eventosAtualizados);
      } else {
        alert("Erro ao excluir evento.");
      }
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
    }
  };

  useEffect(() => {
    const obterEventos = async () => {
      const eventosData = await fetchEventos();
      setEventos(eventosData); // Atualiza o estado com os eventos recebidos da API
    };

    obterEventos();
  }, []); // O array vazio significa que o useEffect roda apenas uma vez, após o componente ser montado

  return (
    <>
      <div className="font-sans bg-white min-h-screen">
        <Header />
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Lista de Eventos</h1>
        <table className="w-full border-collapse border border-gray-300 shadow-lg text-gray-800">
          <thead>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-4"
              onClick={() => router.push('/createEvent')} // Corrigido para usar router.push
            >
              Criar Evento
            </button>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-left">ID</th>
              <th className="border border-gray-300 p-3 text-left">Nome</th>
              <th className="border border-gray-300 p-3 text-left">Data</th>
              <th className="border border-gray-300 p-3 text-left">Local</th>
              <th className="border border-gray-300 p-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {eventos.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4">Nenhum evento encontrado</td>
              </tr>
            ) : (
              eventos.map((evento) => (
                <tr key={evento.idEvento} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-3 text-sm">{evento.idEvento}</td>
                  <td className="border border-gray-300 p-3">{evento.nome_do_evento}</td>
                  <td className="border border-gray-300 p-3">{evento.data_hora}</td>
                  <td className="border border-gray-300 p-3">
                    {evento.local ? evento.local.nome : "Sem Local"}
                  </td>
                  <td className="border border-gray-300 p-3 text-right flex justify-end gap-2">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleViewEvent(evento.idEvento)}
                    >
                      <FaEye size={16} />
                    </button>
                    <button
                      className="text-yellow-500 hover:text-yellow-700"
                      onClick={() => handleEditEvent(evento.idEvento)}
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => {
                        setEventoSelecionado(evento);
                        setShowPopup(true);
                      }}
                    >
                      <FaTrash size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg">
              <h2 className="text-xl font-semibold mb-4">
                Tem certeza que deseja excluir?
              </h2>
              <p className="mb-4">{eventoSelecionado?.nome_do_evento}</p>
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                  onClick={() => {
                    excluirEvento(eventoSelecionado.idEvento);
                    setShowPopup(false); // Fecha o popup após excluir
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
      <Footer />
    </>
  );
}