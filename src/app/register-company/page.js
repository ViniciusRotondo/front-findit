'use client';

import Header from "@/components/Header/page";
import Footer from "@/components/Footer/page";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CadastroOrg() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // redireciona pra login se não estiver logado
    }
  }, [status, router]);

  if (status === "loading") {
    // Enquanto carrega a sessão, pode mostrar um loading ou nada
    return <p>Carregando...</p>;
  }

  // Se chegou aqui, o usuário está autenticado
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
                { label: "Endereço", type: "text" },
                { label: "CPF", type: "text" },
                { label: "CNPJ", type: "text" },
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