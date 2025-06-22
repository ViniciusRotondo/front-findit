'use client';

import Header from "@/components/Header/page";
import Footer from "@/components/Footer/page";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PerfilUsuario() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    data_nascimento: "",
    telefone: "",
    email: "",
    tipo: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Para guardar a senha digitada no modal de exclusão
  const [deletePassword, setDeletePassword] = useState("");

  const alertaBonitao = (mensagem) => {
    toast[mensagem.toLowerCase().includes('sucesso') ? 'success' : 'error'](mensagem, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  // Função para pegar URL base conforme tipo do usuário
  const getUserBaseUrl = () => {
    const userId = session?.user?.id;
    const userType = session?.user?.tipo;
    if (!userId || !userType) return null;
    return userType === "ORGANIZADOR"
      ? `http://localhost:8080/organizer/${userId}`
      : `http://localhost:8080/user/${userId}`;
  };

  useEffect(() => {
    if (!session?.user?.id) {
      router.push("/login");
      return;
    }

    const url = getUserBaseUrl();
    if (!url) return;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar dados");
        return res.json();
      })
      .then((data) => {
        // Formata a data dd/MM/yyyy para yyyy-MM-dd
        const convertDateToISO = (dateStr) => {
          if (!dateStr) return "";
          const parts = dateStr.split("/"); // ["10", "09", "2000"]
          if (parts.length !== 3) return "";
          return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        };

        const userType = session.user.tipo;

        if (userType === "ORGANIZADOR") {
          setFormData({
            nome: data.nome || "",
            data_nascimento: convertDateToISO(data.data_nascimento),
            telefone: data.telefone || "",
            email: data.email || "",
            cpf: data.cpf || "",
            tipo: userType,
          });
        } else {
          setFormData({
            nome: data.nome || "",
            data_nascimento: convertDateToISO(data.data_nascimento),
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
  }, [session, router]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordChangeInput = (e) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Salvar dados do usuário
  const handleSaveInfo = async () => {
    try {
      const url = getUserBaseUrl();
      if (!url) throw new Error("Usuário não autenticado");

      const bodyData = {
        nome: formData.nome,
        data_nascimento: formData.data_nascimento,
        telefone: formData.telefone,
        email: formData.email,
      };

      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) throw new Error("Erro ao salvar dados");

      alertaBonitao("Informações atualizadas com sucesso!");
      setEditMode(false);
    } catch (error) {
      alertaBonitao("Erro ao salvar as informações: " + error.message);
    }
  };

  // Alterar senha
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      alertaBonitao("A nova senha e a confirmação não coincidem.");
      return;
    }
    try {
      const userId = session.user.id;
      const userType = session.user.tipo;

      const baseUrl = userType === "ORGANIZADOR"
        ? `http://localhost:8080/organizer/${userId}`
        : `http://localhost:8080/user/${userId}`;

      const url = `${baseUrl}/change-password`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao alterar a senha");
      }

      alertaBonitao("Senha alterada com sucesso!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setShowChangePassword(false);
    } catch (error) {
      alertaBonitao("Erro ao alterar a senha: " + error.message);
    }
  };

  // Excluir conta - envia senha para confirmação no backend (se necessário)
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!deletePassword) {
      alertaBonitao("Por favor, digite sua senha para confirmar.");
      return;
    }

    try {
      const userId = session.user.id;
      const userType = session.user.tipo;

      const baseUrl = userType === "ORGANIZADOR"
        ? `http://localhost:8080/organizer/${userId}`
        : `http://localhost:8080/user/${userId}`;

      // Ajuste aqui se seu backend aceitar senha via body para confirmação de exclusão
      const response = await fetch(baseUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: deletePassword }),
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir a conta");
      }

      alertaBonitao("Conta excluída com sucesso.");
      setShowModal(false);
      router.push("/login");
    } catch (error) {
      alertaBonitao("Erro ao excluir a conta: " + error.message);
    }
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

              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editMode) {
                    handleSaveInfo();
                  } else {
                    setEditMode(true);
                  }
                }}
              >
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

                {formData.tipo === "USUARIO" && (
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
                )}
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
                    type="submit"
                    className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition"
                  >
                    {editMode ? "Salvar Informações" : "Atualizar Minhas Informações"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowChangePassword(!showChangePassword)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    {showChangePassword ? "Cancelar Alteração de Senha" : "Alterar Senha"}
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

              {showChangePassword && (
                <div className="mt-6 p-4 border rounded-md bg-gray-50">
                  <h3 className="text-lg font-semibold mb-4">Alterar Senha</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium">Senha Atual</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChangeInput}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Nova Senha</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChangeInput}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Confirmar Nova Senha</label>
                      <input
                        type="password"
                        name="confirmNewPassword"
                        value={passwordData.confirmNewPassword}
                        onChange={handlePasswordChangeInput}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleChangePassword}
                        className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
                      >
                        Salvar Senha
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>

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
        <ToastContainer />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirmar Exclusão de Conta</h3>
            <p className="mb-2 text-sm text-gray-700">
              Digite sua senha para confirmar a exclusão da conta. Esta ação é irreversível.
            </p>

            <form onSubmit={handleDeleteAccount}>
              <input
                type="password"
                placeholder="Senha"
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                required
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                >
                  Excluir Conta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}