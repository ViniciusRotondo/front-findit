'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header/page';
import Footer from '@/components/Footer/page';
import axios from 'axios';

const ViewEvent = () => {
  const [evento, setEvento] = useState(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchEvento = async () => {
      if (!id) return;
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
    return (
      <div className="flex justify-center items-center min-h-screen bg-white font-lato">
        <p className="text-xl font-medium text-[#EE6405]">Carregando...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center font-lato text-black"
      style={{ backgroundImage: "url('/page1.png')" }}
    >
      <div className="bg-white/80 min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow flex flex-col items-center px-4 py-10">
          <h1 className="text-4xl font-bold text-[#EE6405] mb-8 text-center">
            {evento.nome_do_evento}
          </h1>

          <div className="w-full max-w-2xl space-y-6 bg-white rounded-3xl shadow-lg p-8 text-black">
            <div>
              <h2 className="text-xl font-semibold text-[#EE6405]">Descrição</h2>
              <p>{evento.descricao}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#EE6405]">Data e Hora</h2>
              <p>{new Date(evento.data_hora).toLocaleString()}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#EE6405]">Local</h2>
              <p>{evento.local ? evento.local.nome : "Sem Local"}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#EE6405]">Preço</h2>
              <p>R$ {evento.preco.toFixed(2)}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#EE6405]">Duração</h2>
              <p>{evento.duracao} horas</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#EE6405]">Indicativo de Idade</h2>
              <p>{evento.indicativo_idade} anos</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#EE6405]">Telefone</h2>
              <p>{evento.telefone}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#EE6405]">Status</h2>
              <p>{evento.status}</p>
            </div>
          </div>

          <button
            onClick={() => router.push('/')}
            className="mt-8 bg-[#EE6405] hover:bg-[#d65400] text-white font-semibold py-3 px-6 rounded-2xl transition-all"
          >
            Voltar para a lista
          </button>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default ViewEvent;
