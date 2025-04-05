import Link from 'next/link';
import { FaFacebook, FaInstagram, FaYoutube, FaUser } from 'react-icons/fa';
import Logo from "../../../public/logotipo.png"
import Image from 'next/image';

export default function Footer() {
    return (
        <>
        <div className='w-full h-4 bg-[#FFA567]'></div>
        <div className='w-full h-4 bg-[#EE6405]'></div>
        <div className='w-full h-4 bg-black'></div>
        <footer className="bg-[#FAC7A4] text-black py-10 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                    <Image src={Logo} alt="FindIt Logo" width={220} height={300} priority />
                </div>
                <div>
                    <h3 className="font-semibold">Institucional</h3>
                    <ul className="mt-2 space-y-1">
                        <li>
                            <Link className="hover:underline cursor-pointer" href="/">Home</Link>
                        </li>
                        <li>
                            <Link className="hover:underline cursor-pointer" href="/sobre-nos">Sobre nós</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold">Legal</h3>
                    <ul className="mt-2 space-y-1">
                        <li>
                            <Link className="hover:underline" href="/termos">Termos de uso</Link>
                        </li>
                        <li>
                            <Link className="hover:underline" href="/privacidade">Política de privacidade</Link>
                        </li>
                    </ul>
                </div>

                <div className="">
                <h3 className="font-semibold">Redes Sociais</h3>
                    <div className="flex space-x-4 mt-4 md:mt-0 py-2">
                    <a
                        href="https://www.facebook.com/?locale=pt_BR"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaFacebook className="text-2xl hover:text-white cursor-pointer transition-transform ease-in-out duration-500 hover:scale-150" />
                    </a>
                    <a
                        href="https://www.instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaInstagram className="text-2xl hover:text-white cursor-pointer transition-transform ease-in-out duration-500 hover:scale-150" />
                    </a>
                    <a
                        href="www.youtube.com/?gl=BR&hl=pt"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaYoutube className="text-2xl hover:text-white cursor-pointer transition-transform ease-in-out duration-500 hover:scale-150" />
                    </a>
                    </div>
                </div>
            </div>
            <div className="mt-6 border-t border-black flex flex-col md:flex-colum justify-center items-center"> 
                <div className="md:mt-0 py-6">
                    <input type="email" placeholder="Seu e-mail" className="px-4 py-2 text-black focus:outline-none rounded-l-lg" />
                    <button className="bg-black text-white px-4 py-2 hover:bg-[#4C4C4C] rounded-r-lg">Inscrever-se</button>
                </div>
                <p className="text-sm">© 2025 FINDIT LTDA. 00.000.000/0001-00 | Rua 1.0 - Cidade, SP</p>
            </div>
        </footer>
        </>
    );
};
