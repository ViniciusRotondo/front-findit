"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import Header from "@/components/Header/page";
import Footer from "@/components/Footer/page";

export default function CreateEvent() {
  const { data: session, status } = useSession();
  const router = useRouter();

    useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

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
    local_id: "",
    categoria_id: "",
    organizador_id: "" // será preenchido com o ID da sessão
  });

  const [locais, setLocais] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    if (session?.user?.id) {
      setFormData(prev => ({ ...prev, organizador_id: session.user.id }));
    }
  }, [session]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resLocais, resCategorias] = await Promise.all([
          axios.get("http://localhost:8080/location"),
          axios.get("http://localhost:8080/category"),
        ]);
        setLocais(resLocais.data);
        setCategorias(resCategorias.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/event", formData);
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
          <h1 className="text-2xl font-bold text-black mb-2 mt-14 font-lato">CADASTRO DE EVENTO</h1>
          <hr className="border-black mb-6 border-t-2 w-full" />
        </div>

        <div className="mx-auto max-w-5xl w-full px-4">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-2xl shadow-lg"
          >
            <div className="space-y-8">
              {/* Coluna Esquerda */}
              <div className="flex flex-col">
                <label className="text-black font-semibold">Nome do Evento</label>
                <input
                  type="text"
                  name="nome_do_evento"
                  value={formData.nome_do_evento}
                  onChange={handleChange}
                  className="border text-black border-gray-300 w-full p-2 rounded-md"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-black font-semibold">Descrição</label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  className="border text-black border-gray-300 w-full p-2 rounded-md"
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
                  className="border text-black border-gray-300 w-full p-2 rounded-md"
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
                  className="border text-black border-gray-300 w-full p-2 rounded-md"
                  required
                />
              </div>
            </div>

            <div className="space-y-8">
              {/* Coluna Direita */}
              <div className="flex flex-col">
                <label className="text-black font-semibold">Preço</label>
                <input
                  type="number"
                  name="preco"
                  value={formData.preco}
                  onChange={handleChange}
                  step="0.01"
                  className="border text-black border-gray-300 w-full p-2 rounded-md"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-black font-semibold">Duração (horas)</label>
                <input
                  type="number"
                  name="duracao"
                  value={formData.duracao}
                  onChange={handleChange}
                  step="0.1"
                  className="border text-black border-gray-300 w-full p-2 rounded-md"
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
                  className="border text-black border-gray-300 w-full p-2 rounded-md"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-black font-semibold">URL da Imagem</label>
                <input
                  type="text"
                  name="url_imagem"
                  value={formData.url_imagem}
                  onChange={handleChange}
                  className="border text-black border-gray-300 w-full p-2 rounded-md"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-black font-semibold">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="border text-black border-gray-300 w-full p-2 rounded-md"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-black font-semibold">Local</label>
                <select
                  name="local_id"
                  value={formData.local_id}
                  onChange={handleChange}
                  className="border text-black border-gray-300 w-full p-2 rounded-md"
                  required
                >
                  <option value="">Selecione o local</option>
                  {locais.map(local => (
                    <option key={local.idLocal} value={local.idLocal}>{local.nome}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => router.push("/createLocation")}
                  className="mt-2 text-sm text-blue-600 hover:underline self-start"
                >
                  Cadastrar novo local
                </button>
              </div>

              <div className="flex flex-col">
                <label className="text-black font-semibold">Categoria</label>
                <select
                  name="categoria_id"
                  value={formData.categoria_id}
                  onChange={handleChange}
                  className="border text-black border-gray-300 w-full p-2 rounded-md"
                  required
                >
                  <option value="">Selecione a categoria</option>
                  {categorias.map(categoria => (
                    <option key={categoria.idCategoria} value={categoria.idCategoria}>{categoria.nome}</option>
                  ))}
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