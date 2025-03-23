'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from "next/navigation";
import Header from '@/components/Header/page';
import Footer from '@/components/Footer/page';
import axios from "axios";

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
    status: "Ativo"
  });

  const [locais, setLocais] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [organizadores, setOrganizadores] = useState([]);
  const router = useRouter();
  const { id } = useParams(); // Captura o ID da rota dinâmica

  // Buscar dados ao carregar a página
  useEffect(() => {
    if (!id) return; // Não faz nada se não tiver ID
    const fetchData = async () => {
      try {
        const [resLocais, resCategorias, resOrganizadores, resEvento] = await Promise.all([
          axios.get("http://localhost:8080/location"),
          axios.get("http://localhost:8080/category"),
          axios.get("http://localhost:8080/organizer"),
          axios.get(`http://localhost:8080/event/${id}`) // Buscar dados do evento
        ]);

        setLocais(resLocais.data);
        setCategorias(resCategorias.data);
        setOrganizadores(resOrganizadores.data);
        setFormData(resEvento.data); // Preencher os dados no formulário
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Enviar dados para o backend
      await axios.put(`http://localhost:8080/event/${id}`, formData);
      alert("Evento atualizado com sucesso!");
      router.push('/event'); // Redirecionar para a página de lista de eventos
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
      alert("Erro ao atualizar evento.");
    }
  };

  if (!formData.nome_do_evento) {
    return <p>Carregando...</p>;
  }

  return (
    <>
      <div className="min-h-screen bg-white">
      <Header />
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Editar Evento</h1>
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6 bg-gray-100 p-6 rounded-lg shadow-md">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Nome do Evento</label>
            <input
              type="text"
              name="nome_do_evento"
              value={formData.nome_do_evento}
              onChange={handleChange}
              placeholder="Digite o nome do evento"
              className="block w-full p-3 border border-gray-300 rounded text-gray-900 focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Descrição</label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Digite a descrição do evento"
              className="block w-full p-3 border border-gray-300 rounded text-gray-900 focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Data e Hora</label>
            <input
              type="datetime-local"
              name="data_hora"
              value={formData.data_hora}
              onChange={handleChange}
              className="block w-full p-3 border border-gray-300 rounded text-gray-900 focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Preço</label>
            <input
              type="number"
              name="preco"
              value={formData.preco}
              onChange={handleChange}
              placeholder="Digite o preço do evento"
              className="block w-full p-3 border border-gray-300 rounded text-gray-900 focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Duração (horas)</label>
            <input
              type="number"
              name="duracao"
              value={formData.duracao}
              onChange={handleChange}
              placeholder="Digite a duração do evento"
              className="block w-full p-3 border border-gray-300 rounded text-gray-900 focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Indicativo de Idade</label>
            <input
              type="number"
              name="indicativo_idade"
              value={formData.indicativo_idade}
              onChange={handleChange}
              placeholder="Digite o indicativo de idade"
              className="block w-full p-3 border border-gray-300 rounded text-gray-900 focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Telefone</label>
            <input
              type="text"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="Digite o telefone para contato"
              className="block w-full p-3 border border-gray-300 rounded text-gray-900 focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition"
          >
            Atualizar Evento
          </button>
        </form>
      <Footer />
      </div>
    </>
  );
}