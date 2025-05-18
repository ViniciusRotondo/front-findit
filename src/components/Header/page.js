'use client';

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import Logo from "../../../public/logotipo.png";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [isDropdownOpen, setDropdownOpen] = useState(false); // Para controle do dropdown

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen); // Alterna o estado do dropdown

  return (
    <header className="bg-white text-black py-4 px-6 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-8">
        <Link href="/">
          <Image src={Logo} alt="FindIt Logo" width={220} height={300} priority />
        </Link>
        <nav>
          <ul className="flex space-x-10">
            <li>
              <Link href="/eventos" className="hover:text-[#EE6405] transition-all ease-in-out duration-500 font-lato font-semibold">
                EVENTOS
              </Link>
            </li>
            <li>
              <Link href="/localizacao" className="hover:text-[#EE6405] transition-all ease-in-out duration-500 font-lato font-semibold">
                LOCALIZAÇÃO
              </Link>
            </li>
            <li>
              <Link href="/sobre-nos" className="hover:text-[#EE6405] transition-all ease-in-out duration-500 font-lato font-semibold">
                SOBRE NÓS
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div>
        <ul className="flex space-x-6 items-center">
          {session ? (
            <li className="relative">
              {/* Exibe o nome do usuário */}
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-md border border-gray-300 transition-all duration-300 font-semibold"
              >
                <span>{session.user.nome}</span>
                <FaUser />
              </button>

              {/* Dropdown de opções */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md w-48 py-2 z-50 animate-dropdown border border-gray-200">
                  <Link href="/meus-dados" className="block px-4 py-2 text-black hover:bg-gray-100 transition-colors">
                    Meus dados
                  </Link>
                  <Link href="/eventos-curtidos" className="block px-4 py-2 text-black hover:bg-gray-100 transition-colors">
                    Meus eventos
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 transition-colors"
                  >
                    Sair
                  </button>
                </div>
              )}
            </li>
          ) : (
            <li>
              <Link href="/login" className="hover:text-[#EE6405] transition-all ease-in-out duration-500 flex items-center px-24">
                <FaUser className="mr-2" /> Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}