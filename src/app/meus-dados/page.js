'use client';

import Header from "@/components/Header/page";
import Footer from "@/components/Footer/page";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function PerfilUsuario() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    data_nascimento: "",
    telefone: "",
    email: "",
    tipo: "", // para armazenar o tipo do usuário
  });

  useEffect(() => {
  if (!session?.user?.id) {
    router.push("/login");
    return;
  }

  const userId = session.user.id;
  const userType = session.user.tipo;

  const url =
    userType === "ORGANIZADOR"
      ? `http://localhost:8080/organizer/${userId}`
      : `http://localhost:8080/user/${userId}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (userType === "ORGANIZADOR") {
        setFormData({
          nome: data.nome || "",
          data_nascimento: "", // organizador não tem data de nascimento no exemplo
          telefone: "", // organizador não tem telefone no exemplo
          email: data.email || "",
          cpf: data.cpf || "",
          tipo: userType,
        });
      } else {
        setFormData({
          nome: data.nome || "",
          data_nascimento: data.data_nascimento || "",
          telefone: data.telefone || "",
          email: data.email || "",
          tipo: userType,
        });
      }
    })
    .catch((err) => {
      console.error("Erro ao buscar dados do usuário:", err);
      router.push("/login");
    });
}, [session]);

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
    // aqui você pode limpar sessão e localStorage conforme necessário
    router.push("/login");
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
                    value={formData.nome}
                    onChange={handleInputChange}
                    readOnly={!editMode}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Data de Nascimento</label>
                  <input
                    type="date"
                    name="data_nascimento"
                    value={formData.data_nascimento}
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
                    value={formData.telefone}
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
                    value={formData.email}
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

            {/* Exibe o cadastro de organizador só se o tipo for diferente de 'organizador' */}
<section className="bg-white p-6 rounded-xl shadow-md md:col-span-1 focus:outline-none focus:ring-0">
  <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-4 text-center">
    {formData.tipo === "ORGANIZADOR"
      ? "JÁ É UM ORGANIZADOR?"
      : "CADASTRO DE ORGANIZADOR DE EVENTOS"}
  </h2>

  {formData.tipo === "ORGANIZADOR" ? (
    <>
      <p className="text-sm text-gray-700 mb-4 text-center">
        Visualize e edite seus eventos no botão abaixo.
      </p>
      <div className="flex justify-center">
        <button
          onClick={() => router.push("/meus-eventos")}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Visualizar / Editar Eventos
        </button>
      </div>
    </>
  ) : (
    <>
      <p className="text-sm text-gray-700 mb-4 text-center">
        Quer divulgar seu estabelecimento ou evento? <br />
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
    </>
  )}
</section>
          </div>
        </main>
        <Footer />
      </div>

      {/* Modal de confirmação */}
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