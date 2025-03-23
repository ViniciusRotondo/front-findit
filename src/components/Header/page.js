'use client'

import Link from "next/link";
import { FaSearch, FaUser } from "react-icons/fa";
import Logo from "../../../public/logotipo.png"
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-white text-black py-4 px-6 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-8">
        <Link href="/home">
          <Image src={Logo} alt="FindIt Logo" width={220} height={300} priority />
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="hover:text-[#EE6405] font-lato font-semibold">EVENTOS</Link>
            </li>
            <li>
              <Link href="/localizacao" className="hover:text-[#EE6405] font-lato font-semibold">LOCALIZAÇÃO</Link>
            </li>
            <li>
              <Link href="/sobre-nos" className="hover:text-[#EE6405] font-lato font-semibold">SOBRE NÓS</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div>
        <ul className="flex space-x-6 items-center">
          <li>
            <Link href="/login" className="hover:text-[#EE6405] flex items-center px-24">
              <FaUser className="mr-2" /> Login
            </Link>
          </li>
        </ul>
      </div>
    </header>
  )
}