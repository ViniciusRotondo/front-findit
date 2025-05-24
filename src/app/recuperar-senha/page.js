'use client'

import { useState } from "react";
import Header from "@/components/Header/page";
import Footer from "@/components/Footer/page";

export default function RecuperarSenha() {
  const [mostrarCamposSenha, setMostrarCamposSenha] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    novaSenha: '',
    confirmarSenha: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVerificar = (e) => {
    e.preventDefault();
    if (formData.nome && formData.email) {
      setMostrarCamposSenha(true);
    } else {
      alert("Por favor, preencha Nome e Email.");
    }
  };

  const handleTrocarSenha = (e) => {
    e.preventDefault();
    if (formData.novaSenha !== formData.confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }
    alert("Senha alterada com sucesso! (Simulado)");
    // Aqui entraria futuramente a integração com a API
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/page3.png')" }}>
        
        <div className="bg-white p-8 rounded-3xl shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">Recuperar Senha</h1>
          
          <form onSubmit={mostrarCamposSenha ? handleTrocarSenha : handleVerificar}>

            {/* Campos iniciais */}
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Nome"
              className="w-full p-2 mb-4 border rounded-full"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-2 mb-4 border rounded-full"
              required
            />

            {/* Botão verificar ou trocar */}
            {!mostrarCamposSenha && (
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-full hover:bg-gray-800 mb-4"
              >
                Verificar
              </button>
            )}

            {/* Campos de senha, aparecem depois */}
            {mostrarCamposSenha && (
              <>
                <input
                  type="password"
                  name="novaSenha"
                  value={formData.novaSenha}
                  onChange={handleChange}
                  placeholder="Nova Senha"
                  className="w-full p-2 mb-4 border rounded-full"
                  required
                />
                <input
                  type="password"
                  name="confirmarSenha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  placeholder="Confirmar Nova Senha"
                  className="w-full p-2 mb-4 border rounded-full"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded-full hover:bg-gray-800"
                >
                  Trocar Senha
                </button>
              </>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
