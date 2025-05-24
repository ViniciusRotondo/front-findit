"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/Header/page";
import Footer from "@/components/Footer/page";
import Link from "next/link";

const alertaBonitao = (mensagem, tipo) => {
  toast[mensagem.includes("sucesso") ? "success" : "error"](mensagem, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  });
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password: senha,
    });

    setLoading(false);

    if (result?.error) {
      alertaBonitao("Erro ao fazer login, verifique seus dados.");
    } else {
      alertaBonitao("Login realizado com sucesso!");
      window.location.href = "/";
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/page3.png')" }}
    >
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center py-24 px-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-black mb-2">Faça login</h2>
            <p className="text-sm text-center text-gray-700 mb-6 px-6">
              Conecte-se para curtir seus eventos mais aguardados!
            </p>

            <form className="w-full grid gap-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">E-mail</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Digite seu e-mail"
                  className="w-full py-2 px-3 mt-1 text-black bg-white border border-black focus:outline-none focus:ring-1 focus:ring-black rounded-md"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <Link
                  href="/recuperar-senha"
                  className="text-sm text-gray-700 hover:text-[#EE6405] underline transition"
                >
                  Esqueci minha senha
                </Link>
              </div>

              <div className="flex justify-center mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 py-2 bg-black text-white text-base font-semibold rounded-full hover:bg-gray-900 transition-all disabled:opacity-50"
                >
                  {loading ? "Carregando..." : "ENTRAR"}
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
      <ToastContainer />
    </div>
  );
}
