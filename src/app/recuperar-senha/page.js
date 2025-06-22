'use client';

import { useState } from "react";
import Header from "@/components/Header/page";
import Footer from "@/components/Footer/page";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");

  const alertaBonitao = (mensagem, tipo = "info") => {
    toast[tipo](mensagem, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      alertaBonitao("Digite um e-mail válido.", "error");
      return;
    }

    const urls = [
      "http://localhost:8080/user/reset-password",
      "http://localhost:8080/organizer/reset-password"
    ];

    let response;
    let responseText;

    for (const url of urls) {
      try {
        response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        responseText = await response.text();

        if (response.ok) {
          alertaBonitao(responseText, "success");
          setEmail(""); // limpa campo após sucesso
          return;
        }
        // Se não ok, tenta próxima URL
      } catch (error) {
        // Erro de rede ou outro, tenta próxima URL
        continue;
      }
    }

    alertaBonitao("E-mail não encontrado em nenhum cadastro.", "error");
  };

  return (
    <>
      <Header />
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/page3.png')" }}
      >
        <div className="bg-white p-8 rounded-3xl shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">Recuperar Senha</h1>

          <form onSubmit={handleResetPassword}>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              className="w-full p-2 mb-4 border rounded-full"
              required
            />
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-full hover:bg-gray-800"
            >
              Redefinir Senha
            </button>
          </form>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
}