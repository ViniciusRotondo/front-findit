'use client';

import Header from "@/components/Header/page";
import Footer from "@/components/Footer/page";
import Link from "next/link";

export default function CadastroOrg() {
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
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { label: "Nome da Empresa", type: "text" },
                            { label: "Telefone Comercial", type: "tel" },
                            { label: "Endereço", type: "text" },
                            { label: "Complemento", type: "text" },
                            { label: "Email Comercial", type: "email" },
                            { label: "CPF/CNPJ", type: "text" },
                            { label: "Senha", type: "password" },
                            { label: "Confirme a Senha", type: "password" },
                        ].map((field, idx) => (
                            <div key={idx}>
                            <label className="block text-sm font-medium text-gray-700">
                                {field.label}
                            </label>
                            <input
                                type={field.type}
                                className="w-full py-2 px-3 mt-1 text-black bg-white border border-black focus:outline-none focus:ring-1 focus:ring-black rounded-md"
                            />
                            </div>
                        ))}

                        <div className="md:col-span-2 flex flex-col items-center gap-3 mt-6">
                            <button
                            type="submit"
                            className="py-2 px-10 bg-black text-white text-base font-semibold rounded-full hover:bg-gray-900 transition-all"
                            >
                            CRIAR
                            </button>

                            <p className="text-sm text-gray-700">
                            Já possui conta?{' '}
                            <Link
                                href="/login"
                                className="text-[#EE6405] hover:text-[#FFA567] transition-colors underline"
                            >
                                Faça login
                            </Link>
                            </p>
                        </div>
                        </form>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}
