'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header/page';
import Footer from '@/components/Footer/page';
import axios from 'axios';
import Image from 'next/image';
import { FaHeart, FaRegHeart, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTicketAlt, FaInfoCircle, FaPhoneAlt, FaCheckCircle } from 'react-icons/fa';
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { GrStatusGood } from "react-icons/gr";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSession } from 'next-auth/react';


const ViewEvent = () => {
  const [evento, setEvento] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const router = useRouter();
  const { id } = useParams();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchEvento = async () => {
      if (!id) return;
      try {
        const response = await axios.get(`http://localhost:8080/event/${id}`);
        setEvento(response.data);
      } catch (error) {
        console.error("Erro ao buscar evento:", error);
        // Opcional: redirecionar ou mostrar mensagem de erro se o evento não for encontrado
      }
    };

    fetchEvento();
  }, [id]);

  useEffect(() => {
    const fetchCurtidas = async () => {
      if (!id) return;
      try {
        const response = await axios.get(`http://localhost:8080/event-with-likes/${id}`);
        setLikesCount(response.data.curtidas);
      } catch (error) {
        console.error("Erro ao buscar curtidas:", error);
      }
    };

    fetchCurtidas();
  }, [id, isLiked])

  useEffect(() => {
    const checkIsLiked = async () => {
      if (!session || !id) return;
      try {
        const userId = session.user.id;
        const response = await axios.get(`http://localhost:8080/event/${id}/liked-by/${userId}`);
        setIsLiked(response.data);
      } catch (error) {
        console.error('Erro ao verificar se usuário curtiu o evento:', error);
      }
    };
    checkIsLiked();
  }, [session, id]);

  const alertaBonitao = (mensagem, tipo) => {
    toast[mensagem.includes('sucesso') ? 'success' : 'error'](mensagem, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  const curtirEvento = async (eventId) => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }
    try {
      const userId = session?.user?.id;
      await axios.post(`http://localhost:8080/user/${userId}/curtir/${eventId}`);
      setIsLiked(true);
    } catch (err) {
      alertaBonitao("Erro ao curtir evento.", 'error')
    }
  };

  const descurtirEvento = async (eventId) => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    try {
      const userId = session.user.id;
      await axios.delete(`http://localhost:8080/user/${userId}/curtir/${eventId}`);
      setIsLiked(false);
    } catch (err) {
      alertaBonitao("Erro ao descurtir evento.", "error");
    }
  };

  const curtirOuDescurtirEvento = (eventId) => {
    if (isLiked) {
      descurtirEvento(eventId);
    } else {
      curtirEvento(eventId);
    }
  };

  if (!evento) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white font-lato">
        <p className="text-xl font-medium text-[#EE6405]">Carregando...</p>
      </div>
    );
  }

  // Verificar se a URL do mapa existe e é válida
  const mapUrl = evento.local?.url_mapa;
  const isMapUrlValid = mapUrl && mapUrl.startsWith('http'); // Uma verificação básica de URL

  return (
    <div className="flex flex-col min-h-screen font-lato text-black">
      <Header />

      <main
        className="flex-grow flex flex-col items-center px-4 py-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/page1.png')" }}
      >
        {/* Adicione uma sobreposição para melhorar a legibilidade do conteúdo sobre o background */}
        <div className="w-full max-w-4xl bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-xl flex flex-col items-center">
          {/* Banner do Evento com a imagem */}
          <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-xl mb-8">
            <Image
              src={`/${evento.url_imagem}.jpg`}
              alt={evento.nome_do_evento}
              layout="fill"
              objectFit="cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
                {evento.nome_do_evento}
              </h1>
            </div>
          </div>

          <div className="w-full flex flex-col lg:flex-row gap-8">
            {/* Coluna de Informações do Evento */}
            <div className="flex-1 bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-black mb-6">Detalhes do Evento</h2>

              <div className="space-y-4">
                <div className="flex items-center text-lg">
                  <FaCalendarAlt className="text-[#EE6405] mr-3 text-xl" />
                  <p><strong className="font-semibold">Data e Hora:</strong> {new Date(evento.data_hora).toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })}</p>
                </div>
                <div className="flex items-center text-lg">
                  <FaMapMarkerAlt className="text-[#EE6405] mr-3 text-xl" />
                  <p><strong className="font-semibold">Local:</strong> {evento.local ? evento.local.nome : "Informação indisponível"}</p>
                </div>
                <div className="flex items-center text-lg">
                  <FaTicketAlt className="text-[#EE6405] mr-3 text-xl" />
                  <p><strong className="font-semibold">Preço:</strong> R$ {evento.preco ? evento.preco.toFixed(2).replace('.', ',') : '0,00'}</p>
                </div>
                <div className="flex items-center text-lg">
                  <MdOutlineAccessTimeFilled className="text-[#EE6405] mr-3 text-xl" />
                  <p><strong className="font-semibold">Duração:</strong> {evento.duracao} horas</p>
                </div>
                <div className="flex items-center text-lg">
                  <FaInfoCircle className="text-[#EE6405] mr-3 text-xl" />
                  <p><strong className="font-semibold">Idade:</strong> {evento.indicativo_idade || 'Livre'} anos</p>
                </div>
                <div className="flex items-center text-lg">
                  <FaPhoneAlt className="text-[#EE6405] mr-3 text-xl" />
                  <p><strong className="font-semibold">Contato:</strong> {evento.telefone || 'Não informado'}</p>
                </div>
                <div className="flex items-center text-lg">
                  <GrStatusGood className="text-[#EE6405] mr-3 text-xl" />
                  <p><strong className="font-semibold">Status:</strong> {evento.status || 'Ativo'}</p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-black mt-8 mb-4">Descrição do Evento</h3>
              <p className="text-gray-700 leading-relaxed">
                {evento.descricao || 'Nenhuma descrição detalhada disponível para este evento.'}
              </p>

              {/* Botão de Curtir */}
              <button
                onClick={() => curtirOuDescurtirEvento(id)}
                className={`flex items-center justify-center mt-8 px-6 py-3 rounded-full text-lg font-bold transition-all duration-300 ease-in-out
                    ${isLiked ? 'bg-red-500 text-white shadow-md' : 'bg-[#FFA567] text-black border border-[#EE6405] hover:bg-[#EE6405] hover:text-white'}
                `}
              >
                {isLiked ? (
                  <>
                    <FaHeart className="mr-2 text-white" /> Curtido!
                  </>
                ) : (
                  <>
                    <FaRegHeart className="mr-2" /> Curtir Evento
                  </>
                )}
              </button>
              <p className="mt-2 text-center text-gray-700 font-semibold">
                {likesCount} {likesCount === 1 ? 'curtida' : 'curtidas'}
              </p>
            </div>

            {/* Coluna Lateral - Agora com o Mapa do Google */}
            <div className="flex-1 bg-white rounded-xl shadow-lg p-8 border border-gray-200 flex flex-col items-center">
              <h2 className="text-2xl font-bold text-black mb-6 text-center">Localização do Evento</h2>
              {isMapUrlValid ? (
                <div className="w-full h-80 rounded-lg overflow-hidden shadow-md border border-gray-300">
                  <iframe
                    src={mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Mapa de ${evento.nome_do_evento}`}
                  ></iframe>
                </div>
              ) : (
                <div className="text-gray-500 text-center py-10">
                  <FaMapMarkerAlt className="text-6xl text-gray-400 mb-4" />
                  <p>Mapa não disponível para este local.</p>
                  {evento.local?.nome && <p className="mt-2 text-black font-semibold">{evento.local.nome}</p>}
                </div>
              )}
              {/* Se quiser adicionar o endereço completo do local aqui também */}
              {evento.local?.endereco && isMapUrlValid && (
                <p className="text-gray-700 mt-4 text-center text-sm">
                  Endereço: {evento.local.endereco}
                </p>
              )}
            </div>
          </div>

          {/* Botão de Voltar */}
          <button
            onClick={() => router.push('/')}
            className="mt-12 bg-black hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 ease-in-out text-lg shadow-md"
          >
            Voltar para a Home
          </button>
        </div>
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default ViewEvent;