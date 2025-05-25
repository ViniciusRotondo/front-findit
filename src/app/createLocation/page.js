'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'; // para autenticação
import { useRouter } from 'next/navigation';

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

  // Proteção da página: só organizadores autenticados
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login'); // redireciona para login se não autenticado
    }
  }, [status, router]);

  // Pega os estados no backend ao carregar a página
  useEffect(() => {
    async function fetchStates() {
      const res = await fetch('http://localhost:8080/state'); // ajuste para sua rota real
      const data = await res.json();
      setStates(data);
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
      const res = await fetch(`http://localhost:8080/city/state/${form.estado_id}`); // ajuste rota conforme backend
      const data = await res.json();
      console.log('Cidades:', data); 
      setCities(data);
      setLoadingCities(false);
    }
    fetchCities();
  }, [form.estado_id]);

  // Manipula mudanças no formulário
  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  // Envia o formulário
  async function handleSubmit(e) {
    e.preventDefault();

    // validar aqui se quiser

    const payload = {
      nome: form.nome,
      endereco: form.endereco,
      capacidade_de_pessoas: Number(form.capacidade_de_pessoas),
      url_mapa: form.url_mapa,
      telefone: form.telefone,
      estado_id: form.estado_id,
      cidade_id: form.cidade_id,
    };

    const res = await fetch('http://localhost:8080/location', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setModalOpen(true);
      setTimeout(() => {
        setModalOpen(false);
        router.push('/alguma-pagina'); // página após sucesso
      }, 2000);
    } else {
      alert('Erro ao criar local');
    }
  }

  if (status === 'loading') {
    return <p>Carregando...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cadastrar Novo Local</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Nome</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Endereço</label>
          <input
            type="text"
            name="endereco"
            value={form.endereco}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Capacidade de Pessoas</label>
          <input
            type="number"
            name="capacidade_de_pessoas"
            value={form.capacidade_de_pessoas}
            onChange={handleChange}
            required
            min={1}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">URL do Mapa</label>
          <input
            type="url"
            name="url_mapa"
            value={form.url_mapa}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="https://maps.google.com/?q=..."
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Telefone</label>
          <input
            type="tel"
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Estado</label>
          <select
            name="estado_id"
            value={form.estado_id}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          >
            <option value="">Selecione o estado</option>
            {states.map((state) => (
              <option key={state.sigla} value={state.sigla}>
                {state.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Cidade</label>
          <select
            name="cidade_id"
            value={form.cidade_id}
            onChange={handleChange}
            required
            disabled={!form.estado_id || loadingCities}
            className="w-full border rounded p-2"
          >
            <option value="">
              {loadingCities ? 'Carregando cidades...' : 'Selecione a cidade'}
            </option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.nome}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Cadastrar Local
        </button>
      </form>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow">
            <p className="text-green-600 font-semibold">Local cadastrado com sucesso!</p>
          </div>
        </div>
      )}
    </div>
  );
}