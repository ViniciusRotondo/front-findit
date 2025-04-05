'use client';

import Header from "@/components/Header/page";
import Footer from "@/components/Footer/page";
import Link from "next/link";

export default function Login() {
    return (
        <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/page3.png')" }}>
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center py-24 px-4">
                    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center">
                        <h2 className="text-2xl font-bold text-black mb-2">Faça login</h2>
                        <p className="text-sm text-center text-gray-700 mb-6 px-6">
                            Conecte-se para curtir seus eventos mais aguardados!
                        </p>

                        <form className="w-full grid gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">E-mail</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Digite seu e-mail"
                                    className="w-full py-2 px-3 mt-1 text-black bg-white border border-black focus:outline-none focus:ring-1 focus:ring-black rounded-md"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Senha</label>
                                <input
                                    type="password"
                                    name="senha"
                                    placeholder="Digite sua senha"
                                    className="w-full py-2 px-3 mt-1 text-black bg-white border border-black focus:outline-none focus:ring-1 focus:ring-black rounded-md"
                                    required
                                />
                            </div>

                            <div className="flex justify-end">
                                <Link
                                    href="#"
                                    className="text-sm text-gray-700 hover:text-[#EE6405] underline transition"
                                >
                                    Esqueci minha senha
                                </Link>
                            </div>

                            <div className="flex justify-center mt-2">
                                <button
                                    type="submit"
                                    className="w-1/2 py-2 bg-black text-white text-base font-semibold rounded-full hover:bg-gray-900 transition-all"
                                >
                                    ENTRAR
                                </button>
                            </div>

                            <p className="text-sm text-center text-gray-700 mt-4">
                                Primeira vez aqui?{' '}
                                <Link
                                    href="/createaccount"
                                    className="text-[#EE6405] hover:text-[#FFA567] underline transition-colors"
                                >
                                    Crie uma conta
                                </Link>
                            </p>
                        </form>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}
