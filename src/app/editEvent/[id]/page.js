"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Header from "@/components/Header/page";
import Footer from "@/components/Footer/page";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditEvent() {
  const [formData, setFormData] = useState({
    nome_do_evento: "",
    descricao: "",
    data_hora: "",
    url_imagem: "",
    preco: 0,
    duracao: 0,
    indicativo_idade: 0,
    telefone: "",
    status: "Ativo",
  });

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

  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const resEvento = await axios.get(`http://localhost:8080/event/${id}`);
        setFormData(resEvento.data);
      } catch (error) {
        console.error("Erro ao buscar dados do evento:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/event/${id}`, formData);
      alertaBonitao("Evento atualizado com sucesso!", "success");

      setTimeout(() => {
        router.push("/meus-eventos");

      }, 3000)

    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
      alertaBonitao("Erro ao atualizar evento.", "error");
    }
  };

  if (!formData.nome_do_evento) return <p className="text-center mt-10">Carregando...</p>;

  return (
    <>
      <div
        className="bg-cover bg-center min-h-screen"
        style={{ backgroundImage: "url('/page3.png')" }}
      >
        <Header />
        <div className="min-h-screen px-4 py-10 text-white">
          <form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto bg-white bg-opacity-95 text-gray-900 p-10 rounded-2xl shadow-2xl space-y-6"
          >
            <h1 className="text-3xl font-bold text-center text-black mb-2">Editar Evento</h1>
            {[
              { label: "Nome do Evento", name: "nome_do_evento", type: "text" },
              { label: "Descrição", name: "descricao", type: "textarea" },
              { label: "Data e Hora", name: "data_hora", type: "datetime-local" },
              { label: "URL da Imagem", name: "url_imagem", type: "text" },
              { label: "Preço", name: "preco", type: "number" },
              { label: "Duração (horas)", name: "duracao", type: "number" },
              { label: "Indicativo de Idade", name: "indicativo_idade", type: "number" },
              { label: "Telefone", name: "telefone", type: "text" },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label className="block text-gray-800 font-bold text-base mb-2">{label}</label>
                {type === "textarea" ? (
                  <textarea
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900"
                    required
                  ></textarea>
                ) : (
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900"
                    required
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition shadow-md"
            >
              Atualizar Evento
            </button>
          </form>
        </div>
        <Footer />
        <ToastContainer />
      </div>
    </>
  );
}
