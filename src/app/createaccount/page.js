'use client';

import Header from "@/components/Header/page";
import Footer from "@/components/Footer/page";
import Link from 'next/link';

export default function CadastroOrg() {
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
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nome</label>
                                <input type="text" className="w-full p-2 mt-2 text-black bg-white border border-black focus:outline-none focus:ring-1 focus:ring-black rounded-md" placeholder="Nome Completo" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Telefone</label>
                                <input type="text" className="w-full p-2 mt-2 text-black bg-white border border-black focus:outline-none focus:ring-1 focus:ring-black rounded-md" placeholder="(00) 000000000" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
                                <input type="text" className="w-full p-2 mt-2 text-black bg-white border border-black focus:outline-none focus:ring-1 focus:ring-black rounded-md" placeholder="DD/MM/AAAA" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">E-mail</label>
                                <input type="email" className="w-full p-2 mt-2 text-black bg-white border border-black focus:outline-none focus:ring-1 focus:ring-black rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Senha</label>
                                <input type="text" className="w-full p-2 mt-2 text-black bg-white border border-black focus:outline-none focus:ring-1 focus:ring-black rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Confirme a Senha</label>
                                <input type="password" className="w-full p-2 mt-2 text-black bg-white border border-black focus:outline-none focus:ring-1 focus:ring-black rounded-md" />
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
            </div>
        </>
    );
}
