"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Header from "@/components/Header/page";
import Footer from "@/components/Footer/page";

export default function CreateEvent() {
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
    local: { id: "" },
    categoria: { id: "" },
    organizador: { id: "" },
  });

  const [locais, setLocais] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [organizadores, setOrganizadores] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resLocais, resCategorias, resOrganizadores] = await Promise.all([
          axios.get("http://localhost:8080/location"),
          axios.get("http://localhost:8080/category"),
          axios.get("http://localhost:8080/organizer"),
        ]);
        setLocais(resLocais.data);
        setCategorias(resCategorias.data);
        setOrganizadores(resOrganizadores.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "categoria" || name === "organizador" || name === "local") {
      setFormData({
        ...formData,
        [name]: { id: value },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { categoria, local, organizador, ...payload } = formData;
      await axios.post("http://localhost:8080/event", payload);
      alert("Evento criado com sucesso!");
      router.push("/");
    } catch (error) {
      console.error("Erro ao criar evento:", error);
      alert("Erro ao criar evento.");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-cover bg-center font-lato text-black" style={{ backgroundImage: "url('/page1.png')" }}>
        <Header />
        <div className="mx-auto max-w-5xl w-full px-4">
          <h1 className="text-2xl font-bold text-black mb-2 mt-14 font-lato">
            CADASTRO DE EVENTO
          </h1>
          <hr className="border-black mb-6 border-t-2 w-full" />
        </div>
        <div className="mx-auto max-w-5xl w-full px-4">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-2xl shadow-lg"
          >
            <div className="space-y-8">
              <div className="flex flex-col">
                <label className="text-black font-lato font-semibold">Nome do Evento</label>
                <input
                  type="text"
                  name="nome_do_evento"
                  value={formData.nome_do_evento}
                  onChange={handleChange}
                  className="border text-black border-gray-300 w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-black font-semibold">Descrição</label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  className="border text-black border-gray-300 w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-black font-semibold">Data e Hora</label>
                <input
                  type="datetime-local"
                  name="data_hora"
                  value={formData.data_hora}
                  onChange={handleChange}
                  className="border text-black border-gray-300 w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-black font-semibold">Telefone</label>
                <input
                  type="text"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className="border text-black border-gray-300 w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex flex-col">
                <label className="text-black font-semibold">Preço</label>
                <input
                  type="number"
                  name="preco"
                  value={formData.preco}
                  onChange={handleChange}
                  className="border text-black border-gray-300 w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-black font-semibold">Duração (min)</label>
                <input
                  type="number"
                  name="duracao"
                  value={formData.duracao}
                  onChange={handleChange}
                  className="border text-black border-gray-300 w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-black font-semibold">Indicativo de Idade</label>
                <input
                  type="number"
                  name="indicativo_idade"
                  value={formData.indicativo_idade}
                  onChange={handleChange}
                  className="border text-black border-gray-300 w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-black font-semibold">URL da imagem</label>
                <input
                  type="text"
                  name="url_imagem"
                  value={formData.url_imagem}
                  onChange={handleChange}
                  className="border text-black border-gray-300 w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-black font-semibold">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="border text-black border-gray-300 w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  required
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#EE6405] text-white font-bold py-3 rounded-md hover:bg-[#d65500] transition"
              >
                Criar Evento
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
