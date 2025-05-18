'use client';

import React, { useState, useEffect } from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useRouter } from "next/navigation";
import Header from '@/components/Header/page';
import Footer from '@/components/Footer/page';

const fetchEventos = async () => {
  try {
    const response = await fetch('http://localhost:8080/event');
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

  const router = useRouter();

  const handleViewEvent = (id) => {
    router.push(`/event/${id}`);
  };

  const handleEditEvent = (id) => {
    router.push(`/editEvent/${id}`);
  };

  const excluirEvento = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/event/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Evento excluído com sucesso!");
        const eventosAtualizados = await fetchEventos();
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
      setEventos(eventosData);
    };

    obterEventos();
  }, []);

  return (
    // Dentro do return
    <div
      className="min-h-screen bg-cover bg-center font-lato text-black"
      style={{ backgroundImage: "url('/page1.png')" }}
    >
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow p-10 flex flex-col items-center">
          <h1 className="text-4xl font-bold text-[#EE6405] mb-8">Lista de Eventos</h1>

          <button
            className="bg-[#EE6405] text-white font-semibold py-2 px-6 rounded-2xl hover:bg-[#d65400] mb-6 transition-all"
            onClick={() => router.push('/createEvent')}
          >
            Criar Evento
          </button>

          <div className="w-full max-w-6xl overflow-x-auto shadow-xl rounded-3xl">
            <table className="w-full text-left border-collapse bg-white rounded-xl overflow-hidden text-black">
              <thead className="bg-[#FFEFE4] border-b border-[#FFA567]">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Nome</th>
                  <th className="p-4">Data</th>
                  <th className="p-4">Local</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {eventos.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-6 font-medium text-black">
                      Nenhum evento encontrado
                    </td>
                  </tr>
                ) : (
                  eventos.map((evento) => (
                    <tr key={evento.idEvento} className="border-b border-gray-200 hover:bg-[#FFF4ED]">
                      <td className="p-4">{evento.idEvento}</td>
                      <td className="p-4">{evento.nome_do_evento}</td>
                      <td className="p-4">{evento.data_hora}</td>
                      <td className="p-4">
                        {evento.local ? evento.local.nome : "Sem Local"}
                      </td>
                      <td className="p-4 text-right flex justify-end gap-3">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => handleViewEvent(evento.idEvento)}
                        >
                          <FaEye />
                        </button>
                        <button
                          className="text-yellow-500 hover:text-yellow-700"
                          onClick={() => handleEditEvent(evento.idEvento)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => {
                            setEventoSelecionado(evento);
                            setShowPopup(true);
                          }}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>

        <Footer />
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center">
            <h2 className="text-xl font-semibold mb-4 text-black">
              Tem certeza que deseja excluir?
            </h2>
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
