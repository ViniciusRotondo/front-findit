"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import Header from "@/components/Header/page";
import Footer from "@/components/Footer/page";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Para os ícones de dropdown

export default function CreateEvent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

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

  // Estados para controlar a abertura dos dropdowns estilizados
  const [showLocalDropdown, setShowLocalDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

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

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Fechar o dropdown após a seleção
    if (name === "local_id") setShowLocalDropdown(false);
    if (name === "categoria_id") setShowCategoryDropdown(false);
    if (name === "status") setShowStatusDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/event", formData);
      alert("Evento criado com sucesso!");
      router.push("/eventos"); // Redireciona para a lista de eventos
    } catch (error) {
      console.error("Erro ao criar evento:", error);
      alert("Erro ao criar evento.");
    }
  };

  // Classes para os inputs e labels (com arredondamento mais forte)
  const inputClasses = "border border-gray-300 w-full p-3 rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#EE6405] focus:border-transparent text-black font-normal bg-white";
  const labelClasses = "text-black font-semibold mb-1 block";
  // Classes para os botões de seleção de drilldown
  const selectButtonClasses = `${inputClasses} flex items-center justify-between cursor-pointer`;


  return (
    <>
      <Header /> {/* Header fica fora do div de background */}
      
      {/* Container principal com o background da página */}
      <div 
        className="flex-grow bg-cover bg-center font-lato text-black py-10" // Adicionado py-10 para espaçamento
        style={{ backgroundImage: "url('/page1.png')" }}
      >
        <div className="mx-auto max-w-6xl w-full px-4 py-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg">
          <h1 className="text-3xl font-extrabold text-black mb-4 font-lato text-center">CADASTRO DE EVENTO</h1>
          <hr className="border-black mb-8 border-t-2 w-full" />

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {/* Coluna Esquerda */}
            <div className="space-y-6">
              <div>
                <label htmlFor="nome_do_evento" className={labelClasses}>Nome do Evento</label>
                <input
                  type="text"
                  id="nome_do_evento"
                  name="nome_do_evento"
                  value={formData.nome_do_evento}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                />
              </div>

              <div>
                <label htmlFor="descricao" className={labelClasses}>Descrição</label>
                <textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  rows="4" // Aumenta o número de linhas para a textarea
                  className={inputClasses}
                  required
                />
              </div>

              <div>
                <label htmlFor="data_hora" className={labelClasses}>Data e Hora</label>
                <input
                  type="datetime-local"
                  id="data_hora"
                  name="data_hora"
                  value={formData.data_hora}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                />
              </div>

              <div>
                <label htmlFor="telefone" className={labelClasses}>Telefone</label>
                <input
                  type="text"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                />
              </div>

               {/* Dropdown de Status estilizado */}
               <div className="relative z-10">
                <label htmlFor="status" className={labelClasses}>Status</label>
                <button
                  type="button"
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className={selectButtonClasses}
                >
                  {formData.status}
                  {showStatusDropdown ? <FaChevronUp className="ml-2 text-gray-500" /> : <FaChevronDown className="ml-2 text-gray-500" />}
                </button>
                {showStatusDropdown && (
                  <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    <ul className="py-1">
                      {['Ativo', 'Inativo'].map(statusOption => (
                        <li key={statusOption}>
                          <button
                            type="button"
                            onClick={() => handleSelectChange('status', statusOption)}
                            className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                          >
                            {statusOption}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Coluna Direita */}
            <div className="space-y-6">
              <div>
                <label htmlFor="preco" className={labelClasses}>Preço</label>
                <input
                  type="number"
                  id="preco"
                  name="preco"
                  value={formData.preco}
                  onChange={handleChange}
                  step="0.01"
                  className={inputClasses}
                  required
                />
              </div>

              <div>
                <label htmlFor="duracao" className={labelClasses}>Duração (horas)</label>
                <input
                  type="number"
                  id="duracao"
                  name="duracao"
                  value={formData.duracao}
                  onChange={handleChange}
                  step="0.1"
                  className={inputClasses}
                  required
                />
              </div>

              <div>
                <label htmlFor="indicativo_idade" className={labelClasses}>Indicativo de Idade</label>
                <input
                  type="number"
                  id="indicativo_idade"
                  name="indicativo_idade"
                  value={formData.indicativo_idade}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                />
              </div>

              <div>
                <label htmlFor="url_imagem" className={labelClasses}>URL da Imagem</label>
                <input
                  type="text"
                  id="url_imagem"
                  name="url_imagem"
                  value={formData.url_imagem}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                />
              </div>

              {/* Drilldown de Local Estilizado e Botão "Cadastrar Local" ao lado */}
              <div className="relative z-0">
                <label htmlFor="local_id" className={labelClasses}>Local</label>
                <div className="flex items-center gap-2"> {/* Flex container para o select e o botão */}
                    <button
                        type="button"
                        onClick={() => setShowLocalDropdown(!showLocalDropdown)}
                        className={`${selectButtonClasses} flex-grow`}
                    >
                        {locais.find(l => l.idLocal === formData.local_id)?.nome || "Selecione o local"}
                        {showLocalDropdown ? <FaChevronUp className="ml-2 text-gray-500" /> : <FaChevronDown className="ml-2 text-gray-500" />}
                    </button>
                    {/* Botão "Cadastrar novo local" */}
                    <button
                        type="button"
                        onClick={() => router.push("/createLocation")}
                        className="bg-black text-white font-semibold py-2 px-4 rounded-3xl hover:bg-gray-800 transition-colors shadow-md text-sm whitespace-nowrap"
                    >
                        Cadastrar
                    </button>
                </div>
                {showLocalDropdown && (
                  <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    <ul className="py-1">
                      {locais.map(local => (
                        <li key={local.idLocal}>
                          <button
                            type="button"
                            onClick={() => handleSelectChange('local_id', local.idLocal)}
                            className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                          >
                            {local.nome}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Drilldown de Categoria Estilizado (sem botão ao lado) */}
              <div className="relative z-0">
                <label htmlFor="categoria_id" className={labelClasses}>Categoria</label>
                <button
                  type="button"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className={selectButtonClasses}
                >
                  {categorias.find(c => c.idCategoria === formData.categoria_id)?.nome || "Selecione a categoria"}
                  {showCategoryDropdown ? <FaChevronUp className="ml-2 text-gray-500" /> : <FaChevronDown className="ml-2 text-gray-500" />}
                </button>
                {showCategoryDropdown && (
                  <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    <ul className="py-1">
                      {categorias.map(categoria => (
                        <li key={categoria.idCategoria}>
                          <button
                            type="button"
                            onClick={() => handleSelectChange('categoria_id', categoria.idCategoria)}
                            className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                          >
                            {categoria.nome}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Botão de Criar Evento - Ocupa a largura total na parte inferior */}
            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                className="w-full bg-[#EE6405] text-white font-bold py-3 rounded-lg hover:bg-[#d65500] transition-all shadow-lg text-lg"
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