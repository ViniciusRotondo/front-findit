'use client';

import Header from "@/components/Header/page";
import Footer from "@/components/Footer/page";
import Link from "next/link";
import { useState } from "react"; // Removido useEffect e useSession pois este cadastro cria o user/org do zero
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputMask from 'react-input-mask-next';

export default function CadastroOrg() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Renomeado para formDataOrganizer para clareza
  const [formDataOrganizer, setFormDataOrganizer] = useState({
    nome: "", // Nome do usuário/responsável
    email: "",
    senha: "",
    confirmarSenha: "", // Campo adicional para validação no frontend
    cnpj: "",
    cpf: "",
    endereco_empresa: "",
    nome_empresa: "",
  });

  const alertaBonitao = (mensagem, tipo) => {
    toast[tipo || 'success'](mensagem, { // 'success' como tipo padrão
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };


  const formatCPF = (value) => {
    return value
      .replace(/\D/g, '') // Remove tudo que não for dígito
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const formatCNPJ = (value) => {
  return value
    .replace(/\D/g, '') // Remove tudo que não for dígito
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .slice(0, 18); // Garante que não passa do tamanho
};


const handleChange = (e) => {
  const { name, value } = e.target;

  let formattedValue = value;
  if (name === "cpf") {
    formattedValue = formatCPF(value);
  } else if (name === "cnpj") {
    formattedValue = formatCNPJ(value);
  }

  setFormDataOrganizer({
    ...formDataOrganizer,
    [name]: formattedValue,
  });
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Validação dos campos
    const requiredFields = [
      'nome', 'email', 'senha', 'confirmarSenha',
      'cnpj', 'cpf', 'endereco_empresa', 'nome_empresa'
    ];
    for (const field of requiredFields) {
      if (!formDataOrganizer[field]) {
        alertaBonitao(`Por favor, preencha o campo ${field.replace(/_/g, ' ')}!`, 'error');
        return;
      }
    }

    // Validação de e-mail
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(formDataOrganizer.email)) {
      alertaBonitao('Por favor, insira um e-mail válido!', 'error');
      return;
    }

    // Validação de senha
    if (formDataOrganizer.senha.length < 6) {
      alertaBonitao('A senha deve ter pelo menos 6 caracteres!', 'error');
      return;
    }
    if (formDataOrganizer.senha !== formDataOrganizer.confirmarSenha) {
      alertaBonitao('As senhas não coincidem!', 'error');
      return;
    }

    // Validação de CNPJ e CPF (pode ser mais robusta, mas aqui é um exemplo simples)
    if (formDataOrganizer.cnpj.length < 14) { // Exemplo simples, CNPJ tem 14 dígitos
      alertaBonitao('CNPJ inválido!', 'error');
      return;
    }
    if (formDataOrganizer.cpf.length < 11) { // Exemplo simples, CPF tem 11 dígitos
      alertaBonitao('CPF inválido!', 'error');
      return;
    }

    // Preparar payload de acordo com o OrganizerRecordDto
    const payload = {
      email: formDataOrganizer.email,
      nome: formDataOrganizer.nome,
      senha: formDataOrganizer.senha,
      cnpj: formDataOrganizer.cnpj,
      cpf: formDataOrganizer.cpf,
      endereco_empresa: formDataOrganizer.endereco_empresa,
      nome_empresa: formDataOrganizer.nome_empresa,
    };

    try {
      // Endpoint POST para /organizer
      const response = await axios.post("http://localhost:8080/organizer", payload);
      console.log("Resposta do servidor:", response);

      alertaBonitao("Organizador criado com sucesso!", "success");

      setTimeout(() => {
        router.push("/login"); // Redireciona para o login após o cadastro
      }, 2000);
    } catch (error) {
      console.error("Erro ao criar organizador:", error);
      if (error.response && error.response.data && error.response.data.message) {
        alertaBonitao(`Erro ao criar organizador: ${error.response.data.message}`, 'error');
      } else {
        alertaBonitao("Erro ao criar organizador. Tente novamente.", 'error');
      }
    }
    setIsLoading(false);
  };

  const inputClasses = "w-full py-2 px-3 mt-1 text-black bg-white border border-black focus:outline-none focus:ring-1 focus:ring-black rounded-3xl"; // rounded-3xl para arredondamento
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1"; // Adicionado mb-1 para espaçamento

  return (
    <>
      <div className="min-h-screen bg-[url('/page3.png')] bg-cover bg-center flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center py-12 md:py-24 px-4">
          <div className="w-full max-w-3xl bg-white/90 rounded-3xl shadow-xl p-10">
            <h2 className="text-2xl font-bold text-black flex items-center gap-2 mb-6">
              <img src="/icon.jpg" alt="Ícone de empresa" className="w-6 h-6" />
              CADASTRE SUA EMPRESA E COMECE A DIVULGAR
            </h2>
            <hr className="border-t-2 border-gray-300 mb-8" />
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
              {/* Campos do Organizador/Empresa */}
              <div>
                <label className={labelClasses}>Nome do Responsável</label>
                <input
                  type="text"
                  name="nome"
                  value={formDataOrganizer.nome}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="Seu nome completo"
                  required
                />
              </div>
              <div>
                <label className={labelClasses}>Nome da Empresa</label>
                <input
                  type="text"
                  name="nome_empresa"
                  value={formDataOrganizer.nome_empresa}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="Nome da sua empresa"
                  required
                />
              </div>
              <div>
                <label className={labelClasses}>Endereço da Empresa</label>
                <input
                  type="text"
                  name="endereco_empresa"
                  value={formDataOrganizer.endereco_empresa}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="Endereço completo da empresa"
                  required
                />
              </div>
              <div>
                <label className={labelClasses}>CNPJ</label>
                <input
                  type="text"
                  name="cnpj"
                  value={formDataOrganizer.cnpj}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="XX.XXX.XXX/YYYY-ZZ"
                  required
                />
              </div>
              <div>
                <label className={labelClasses}>CPF do Responsável</label>


                <input
                  type="text"
                  name="cpf"
                  value={formDataOrganizer.cpf}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="Digite o CPF do responsável"
                  required
                />
              </div>
              <div>
                <label className={labelClasses}>E-mail</label>
                <input
                  type="email"
                  name="email"
                  value={formDataOrganizer.email}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="seu.email@empresa.com"
                  required
                />
              </div>
              <div>
                <label className={labelClasses}>Senha</label>
                <input
                  type="password"
                  name="senha"
                  value={formDataOrganizer.senha}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>
              <div>
                <label className={labelClasses}>Confirme a Senha</label>
                <input
                  type="password"
                  name="confirmarSenha"
                  value={formDataOrganizer.confirmarSenha}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="Confirme sua senha"
                  required
                />
              </div>

              <div className="md:col-span-2 flex flex-col items-center gap-3 mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`rounded-3xl py-3 px-10 bg-black text-white ... ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-900'}`}
                >
                  {isLoading ? 'Cadastrando...' : 'CRIAR CONTA DE ORGANIZADOR'}
                </button>
                <p className="text-sm text-gray-700">
                  Já tem uma conta de organizador?{' '}
                  <Link href="/login" className="text-[#EE6405] hover:text-[#FFA567] transition-colors underline">
                    Entre aqui
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </main>
        <Footer />
        <ToastContainer />
      </div>
    </>
  );
}