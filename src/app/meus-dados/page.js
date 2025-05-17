'use client';

import Header from "@/components/Header/page";
import Footer from "@/components/Footer/page";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function PerfilUsuario() {
  return (
    <>
      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/page3.png')" }}
      >
        <Header />
        <main className="flex-grow relative z-10 container mx-auto px-6 py-16">
          {/* Título e navegação */}
          <p className="text-sm text-black-500 mb-2">Perfil / Gerenciar minha conta</p>
          <h1 className="text-2xl font-bold border-b-2 border-black pb-2 w-fit mb-10">
            GERENCIAR MINHA CONTA
          </h1>

          {/* Grid de conteúdo */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Menu lateral */}
            <aside className="space-y-4 md:col-span-1">
              <h2 className="font-bold text-lg">PERFIL DO USUÁRIO</h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-orange-500">
                    Editar minhas informações
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-orange-500">
                    Meus eventos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-orange-500">
                    Gerenciar minha conta
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => signOut({ callbackUrl: '/home' })}
                    className="block w-full text-left px-0 py-0 text-red-500 hover:bg-gray-100 transition-colors"
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                    type="button"
                  >
                    Sair
                  </button>
                </li>
              </ul>
            </aside>

            {/* Formulário de exclusão */}
            <section className="bg-white p-6 rounded-xl border shadow-md md:col-span-2">
              <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-4">
                EXCLUIR MINHA CONTA
              </h2>
              <p className="text-sm text-gray-700 mb-4">
                Confirme as informações abaixo antes de prosseguir para a exclusão
              </p>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">CPF</label>
                  <input
                    type="text"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    placeholder="Digite seu CPF"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Senha</label>
                  <input
                    type="password"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    placeholder="Digite sua senha"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Confirme a Senha</label>
                  <input
                    type="password"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    placeholder="Confirme sua senha"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-4 bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
                >
                  EXCLUIR CONTA
                </button>
              </form>
            </section>

            {/* Box de cadastro do organizador */}
            <section className="bg-white p-6 rounded-xl shadow-md focus:outline-none focus:ring-0">
              <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-4 text-center">
                CADASTRO DE ORGANIZADOR DE EVENTOS
              </h2>
              <p className="text-sm text-gray-700 mb-4 text-center">
                Quer divulgar seu estabelecimento ou evento?
                <br />
                Faça o cadastro de Organizador de Eventos para iniciar.
              </p>
              <div className="flex justify-center">
                <Link
                  href="/register-company"
                  className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition"
                >
                  IR PARA CADASTRO
                </Link>
              </div>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
