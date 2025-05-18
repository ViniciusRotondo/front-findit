'use client';

import Header from "@/components/Header/page";
import Footer from "@/components/Footer/page";
import { useState } from "react";
import { signOut } from "next-auth/react";

export default function PerfilUsuario() {
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nome: "João da Silva",
    dataNascimento: "1990-01-01",
    telefone: "(11) 91234-5678",
    email: "joao@email.com",
  });

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDeleteAccount = (e) => {
    e.preventDefault();
    console.log("Conta excluída (simulado)");
    setShowModal(false);
    signOut({ callbackUrl: '/' });
  };

  return (
    <>
      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/page3.png')" }}
      >
        <Header />
        <main className="flex-grow relative z-10 container mx-auto px-6 py-16">
          <p className="text-sm text-black-500 mb-2">Perfil / Gerenciar minha conta</p>
          <h1 className="text-2xl font-bold border-b-2 border-black pb-2 w-fit mb-10">
            GERENCIAR MINHA CONTA
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Bloco de informações do usuário */}
            <section className="bg-white p-6 rounded-xl border shadow-md md:col-span-2">
              <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-4">
                INFORMAÇÕES DO USUÁRIO
              </h2>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Nome</label>
                  <input
                    type="text"
                    name="nome"
                    onChange={handleInputChange}
                    readOnly={!editMode}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Data de Nascimento</label>
                  <input
                    type="date"
                    name="dataNascimento"
                    onChange={handleInputChange}
                    readOnly={!editMode}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Telefone</label>
                  <input
                    type="tel"
                    name="telefone"
                    onChange={handleInputChange}
                    readOnly={!editMode}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    onChange={handleInputChange}
                    readOnly={!editMode}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditMode(!editMode)}
                    className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition"
                  >
                    {editMode ? "Salvar Informações" : "Atualizar Minhas Informações"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
                  >
                    Excluir Conta
                  </button>
                </div>
              </form>
            </section>

            {/* Bloco de cadastro de organizador */}
            <section className="bg-white p-6 rounded-xl shadow-md md:col-span-1 focus:outline-none focus:ring-0">
              <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-4 text-center">
                CADASTRO DE ORGANIZADOR DE EVENTOS
              </h2>
              <p className="text-sm text-gray-700 mb-4 text-center">
                Quer divulgar seu estabelecimento ou evento?
                <br />
                Faça o cadastro de Organizador de Eventos para iniciar.
              </p>
              <div className="flex justify-center">
                <a
                  href="/register-company"
                  className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition"
                >
                  IR PARA CADASTRO
                </a>
              </div>
            </section>
          </div>
        </main>
        <Footer />
      </div>

      {/* Modal de confirmação de exclusão */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirmar Exclusão de Conta</h3>
            <p className="mb-2 text-sm text-gray-700">
              Digite sua senha para confirmar a exclusão da conta. Esta ação é irreversível.
            </p>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
