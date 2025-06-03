'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header/page'; // Importa o Header
import Footer from '@/components/Footer/page'; // Importa o Footer
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Para os ícones de dropdown

export default function CreateLocation() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Estados para armazenar dados do formulário
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({
    nome: '',
    endereco: '',
    capacidade_de_pessoas: '',
    url_mapa: '',
    telefone: '',
    estado_id: '',
    cidade_id: '',
  });

  const [loadingCities, setLoadingCities] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Estados para controlar a abertura dos dropdowns estilizados
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login'); 
    }
  }, [status, router]);

  
  useEffect(() => {
    async function fetchStates() {
      try {
        const res = await fetch('http://localhost:8080/state'); 
        if (!res.ok) throw new Error('Falha ao buscar estados');
        const data = await res.json();
        setStates(data);
      } catch (error) {
        console.error("Erro ao buscar estados:", error);
      }
    }
    fetchStates();
  }, []);

  // Pega as cidades quando o estado mudar
  useEffect(() => {
    if (!form.estado_id) {
      setCities([]);
      return;
    }
    async function fetchCities() {
      setLoadingCities(true);
      try {
        const res = await fetch(`http://localhost:8080/city`); // ajuste rota conforme backend
        if (!res.ok) throw new Error('Falha ao buscar cidades');
        const data = await res.json();
        setCities(data);
      } catch (error) {
        console.error("Erro ao buscar cidades:", error);
        setCities([]); // Garante que a lista de cidades seja limpa em caso de erro
      } finally {
        setLoadingCities(false);
      }
    }
    fetchCities();
  }, [form.estado_id]);

  // Manipula mudanças no formulário para inputs normais
  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  // Manipula mudanças para selects estilizados (dropdowns)
  function handleSelectChange(name, value, dropdownSetter) {
    setForm(prev => ({ ...prev, [name]: value }));
    if (dropdownSetter) {
      dropdownSetter(false); // Fecha o dropdown após a seleção
    }
  }

  // Envia o formulário
  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      nome: form.nome,
      endereco: form.endereco,
      capacidade_de_pessoas: Number(form.capacidade_de_pessoas),
      url_mapa: form.url_mapa,
      telefone: form.telefone,
      estado_id: form.estado_id,
      cidade_id: form.cidade_id,
      pais_id: 'BR' 
    };

    try {
      const res = await fetch('http://localhost:8080/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setModalOpen(true);
        setTimeout(() => {
          setModalOpen(false);
          router.push('/eventos'); // Redireciona para a página de eventos, ou outra de sua escolha
        }, 2000);
      } else {
        const errorData = await res.json();
        alert(`Erro ao criar local: ${errorData.message || res.statusText}`);
      }
    } catch (err) {
      console.error('Erro ao criar local:', err);
      alert('Erro de conexão ao criar local.');
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white font-lato">
        <p className="text-xl font-medium text-[#EE6405]">Carregando...</p>
      </div>
    );
  }

  // Classes de estilização
  const inputClasses = "border border-gray-300 w-full p-3 rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#EE6405] focus:border-transparent text-black font-normal bg-white";
  const labelClasses = "text-black font-semibold mb-1 block";
  const selectButtonClasses = `${inputClasses} flex items-center justify-between cursor-pointer`;


  return (
    <>
      <Header />
      
      {/* Container principal com o background da página */}
      <div 
        className="flex-grow bg-cover bg-center font-lato text-black py-10"
        style={{ backgroundImage: "url('/page1.png')" }}
      >
        {/* Quadro branco do formulário */}
        <div className="mx-auto max-w-4xl w-full px-4 py-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg">
          <h1 className="text-3xl font-extrabold text-black mb-4 font-lato text-center">CADASTRO DE NOVO LOCAL</h1>
          <hr className="border-black mb-8 border-t-2 w-full" />

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {/* Coluna Esquerda */}
            <div className="space-y-6">
              <div>
                <label htmlFor="nome" className={labelClasses}>Nome do Local</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="endereco" className={labelClasses}>Endereço</label>
                <input
                  type="text"
                  id="endereco"
                  name="endereco"
                  value={form.endereco}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                />
              </div>

              <div>
                <label htmlFor="capacidade_de_pessoas" className={labelClasses}>Capacidade de Pessoas</label>
                <input
                  type="number"
                  id="capacidade_de_pessoas"
                  name="capacidade_de_pessoas"
                  value={form.capacidade_de_pessoas}
                  onChange={handleChange}
                  min={1}
                  className={inputClasses}
                  required
                />
              </div>
            </div>

            {/* Coluna Direita */}
            <div className="space-y-6">
              <div>
                <label htmlFor="url_mapa" className={labelClasses}>URL do Mapa</label>
                <input
                  type="url"
                  id="url_mapa"
                  name="url_mapa"
                  value={form.url_mapa}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="Ex: http://maps.google.com/link-do-local"
                />
              </div>
              
              <div>
                <label htmlFor="telefone" className={labelClasses}>Telefone</label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={form.telefone}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                />
              </div>

              {/* Drilldown de Estado Estilizado */}
              <div className="relative z-10">
                <label htmlFor="estado_id" className={labelClasses}>Estado</label>
                <button
                  type="button"
                  onClick={() => setShowStateDropdown(!showStateDropdown)}
                  className={selectButtonClasses}
                  required // Necessário para validação de formulário
                >
                  {states.find(s => s.sigla === form.estado_id)?.nome || "Selecione o estado"}
                  {showStateDropdown ? <FaChevronUp className="ml-2 text-gray-500" /> : <FaChevronDown className="ml-2 text-gray-500" />}
                </button>
                {showStateDropdown && (
                  <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    <ul className="py-1">
                      <li key="empty_state">
                        <button
                          type="button"
                          onClick={() => handleSelectChange('estado_id', '', setShowStateDropdown)}
                          className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                        >
                          Selecione o estado
                        </button>
                      </li>
                      {states.map(state => (
                        <li key={state.sigla}>
                          <button
                            type="button"
                            onClick={() => handleSelectChange('estado_id', state.sigla, setShowStateDropdown)}
                            className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                          >
                            {state.nome}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Drilldown de Cidade Estilizado */}
              <div className="relative z-0">
                <label htmlFor="cidade_id" className={labelClasses}>Cidade</label>
                <button
                  type="button"
                  onClick={() => setShowCityDropdown(!showCityDropdown)}
                  className={`${selectButtonClasses} ${(!form.estado_id || loadingCities) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!form.estado_id || loadingCities}
                  required
                >
                  {loadingCities ? 'Carregando cidades...' : cities.find(c => c.id === form.cidade_id)?.nome || "Selecione a cidade"}
                  {showCityDropdown ? <FaChevronUp className="ml-2 text-gray-500" /> : <FaChevronDown className="ml-2 text-gray-500" />}
                </button>
                {showCityDropdown && (
                  <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    <ul className="py-1">
                      <li key="empty_city">
                        <button
                          type="button"
                          onClick={() => handleSelectChange('cidade_id', '', setShowCityDropdown)}
                          className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                        >
                          Selecione a cidade
                        </button>
                      </li>
                      {cities.map(city => (
                        <li key={city.id}>
                          <button
                            type="button"
                            onClick={() => handleSelectChange('cidade_id', city.id, setShowCityDropdown)}
                            className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                          >
                            {city.nome}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Botão de Cadastrar Local - Ocupa a largura total na parte inferior */}
            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                className="w-full bg-[#EE6405] text-white font-bold py-3 rounded-lg hover:bg-[#d65500] transition-all shadow-lg text-lg"
              >
                Cadastrar Local
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />

      {/* Modal de sucesso */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center">
            <p className="text-green-600 font-semibold text-lg">Local cadastrado com sucesso!</p>
          </div>
        </div>
      )}
    </>
  );
}