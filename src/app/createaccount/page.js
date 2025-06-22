'use client';

import Header from "@/components/Header/page";
import Footer from "@/components/Footer/page";
import Link from 'next/link';
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CadastroOrg() {
    const formatDateToBR = (isoDate) => {
        if (!isoDate) return "";
        const date = new Date(isoDate + "T00:00:00");
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: "",
        telefone: "",
        data_nascimento: ""

    });
    const router = useRouter();

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form data:", formData);  // Para depurar se os dados estão sendo capturados corretamente

        // Validação dos campos
        if (!formData.nome || !formData.email || !formData.senha || !formData.telefone || !formData.data_nascimento || !formData.confirmarSenha) {
            alertaBonitao('Por favor, preencha todos os campos!', 'error');
            return;
        }

        // Validação de e-mail
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(formData.email)) {
            alertaBonitao('Por favor, insira um e-mail válido!', 'error');
            return;
        }

        // Validação de telefone
        const telefoneRegex = /^\d{11}$/; // (XX) XXXXX-XXXX
        if (!telefoneRegex.test(formData.telefone)) {
            alertaBonitao('Por favor, insira um telefone válido!', 'error');
            return;
        }

        // Validação de senha
        if (formData.senha.length < 6) {
            alertaBonitao('A senha deve ter pelo menos 6 caracteres!', 'error');
            return;
        }

        // Validação de senha de confirmação
        if (formData.senha !== formData.confirmarSenha) {
            alertaBonitao('As senhas não coincidem!', 'error');
            return;
        }

        const dadosParaEnviar = {
            ...formData,
            data_nascimento: formatDateToBR(formData.data_nascimento),
        };

        // Se todas as validações passarem, envia os dados
        try {
            // Enviando dados para o servidor
            const response = await axios.post("http://localhost:8080/user", dadosParaEnviar);
            console.log("Resposta do servidor:", response);  // Para verificar a resposta do servidor

            // Exibindo alerta de sucesso
            alertaBonitao("Usuário criado com sucesso!", "success");

            // Redirecionando para a página de login
            setTimeout(() => {
                router.push("/login");
            }, 2000); // Espera 2 segundos antes de redirecionar
        } catch (error) {
            console.warn("Erro ao criar usuário:", error.response?.data?.message || error.message);
            if (error.response && error.response.data && error.response.data.message) {
                alertaBonitao(`Erro ao criar usuario: ${error.response.data.message}`, 'error');
            } else {
                alertaBonitao("Erro ao criar usuario. Tente novamente.", 'error');
            }
        }
    };

    return (
        <>
            <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center bg-[url('/page3.png')] bg-cover bg-center py-24">
                    <div className="w-full max-w-3xl bg-white/90 rounded-3xl shadow-xl p-10">
                        <h2 className="text-2xl font-bold text-black flex items-center gap-2 mb-6">
                            <img src="/icon.jpg" alt="Ícone de usuário" className="w-6 h-6" />
                            CADASTRE-SE
                        </h2>
                        <hr className="border-t-2 border-gray-300 mb-8" />
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nome</label>
                                <input
                                    name="nome"
                                    type="text"
                                    className="w-full p-2 mt-2 text-black bg-white border border-black focus:outline-none focus:ring-1 focus:ring-black rounded-md"
                                    placeholder="Nome Completo"
                                    value={formData.nome}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Telefone</label>
                                <input
                                    name="telefone"
                                    type="text"
                                    className="w-full p-2 mt-2 text-black bg-white border border-black focus:outline-none focus:ring-1 focus:ring-black rounded-md"
                                    placeholder="(00) 000000000"
                                    value={formData.telefone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
                                <input
                                    name="data_nascimento"
                                    type="date"
                                    className="w-full p-2 mt-2 text-black bg-white border border-black focus:outline-none focus:ring-1 focus:ring-black rounded-md"
                                    placeholder="DD/MM/AAAA"
                                    value={formData.data_nascimento}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">E-mail</label>
                                <input
                                    name="email"
                                    type="email"
                                    className="w-full p-2 mt-2 text-black bg-white border border-black focus:outline-none focus:ring-1 focus:ring-black rounded-md"
                                    placeholder="Insira um e-mail"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Senha</label>
                                <input
                                    name="senha"
                                    type="password"
                                    className="w-full p-2 mt-2 text-black bg-white border border-black focus:outline-none focus:ring-1 focus:ring-black rounded-md"
                                    placeholder="Insira uma senha"
                                    value={formData.senha}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Confirme a Senha</label>
                                <input
                                    name="confirmarSenha"
                                    type="password"
                                    className="w-full p-2 mt-2 text-black bg-white border border-black focus:outline-none focus:ring-1 focus:ring-black rounded-md"
                                    placeholder="Confirme sua senha"
                                    value={formData.confirmarSenha}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="md:col-span-2 flex flex-col items-center gap-4 mt-6">
                                <p className="text-sm text-gray-700">
                                    Já é de casa?{' '}
                                    <Link href="/login" className="text-[#EE6405] hover:text-[#FFA567] transition-colors underline">
                                        Entre
                                    </Link>
                                </p>
                                <button type="submit" className="w-1/3 py-3 px-6 bg-black text-white text-lg font-semibold rounded-full hover:bg-gray-900 transition-all">
                                    CRIAR
                                </button>
                                <Link href="/register-company" className="text-sm underline text-gray-700 hover:text-[#EE6405] transition-all">
                                    Cadastrar-se como empresa
                                </Link>
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
