'use client'

import Header from "@/components/Header/page"
import Footer from "@/components/Footer/page"
import { FaSearch } from "react-icons/fa"
import Carrossel from "@/components/Carrossel/page"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import Link from "next/link"

const fetchEventos = async () => {
    try {
        const response = await fetch('http://localhost:8080/event');
        if (!response.ok) {
            throw new Error('Falha ao buscar eventos');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erro na requisição:", error);
        return [];
    }
};

export default function Home() {
    const [eventos, setEventos] = useState([]);
    const router = useRouter(); 

    const handleViewEvent = (id) => {
        router.push(`/event/${id}`); // Redireciona para a página de visualização
    };

    useEffect(() => {
        const obterEventos = async () => {
            const eventosData = await fetchEventos();
            setEventos(eventosData);
        };
        obterEventos();
    }, []);
    return (
        <>
            <Header />
            <div className="bg-black w-full h-20 flex items-center justify-center">
                <div className="relative w-3/4">
                    <input
                        className="bg-white rounded-3xl h-10 w-full pl-4 pr-10 p-4 focus:text-black focus:outline-none"
                        placeholder="Buscar"
                    />
                    <Link href={"#"}>
                        <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" />
                    </Link>
                </div>
            </div>
            <main
                className="bg-cover bg-center w-full min-h-screen mx-auto grid place-items-center pt-12"
                style={{ backgroundImage: "url('/home.png')" }}
            >
                <div className="w-full h-full">
                    <Carrossel />

                    <div className="flex flex-col self-start w-full mx-auto max-w-5xl pt-12">
                    <h1 className="font-lato text-black font-bold text-xl w-full">CATEGORIAS</h1>
                    <hr className="border-black border-t-2 w-full" />

                    <div>
                        <div className="flex flex-wrap justify-center gap-8 max-w-full pt-4">
                            <button className="flex-1 bg-[#EE6405] px-16 py-4 rounded-r-full rounded-bl-full text-black text-xl font-extrabold m-2 hover:bg-[#FFA567] hover:transition-all duration-1000 ease-in-out">
                                SHOW
                            </button>
                            <button className="flex-1 bg-[#FFA567] px-16 py-4 rounded-l-full rounded-br-full text-black text-xl font-extrabold m-2 hover:bg-[#EE6405] hover:transition-all duration-1000 ease-in-out">
                                RESTAURANTES
                            </button>
                            <button className="flex-1 bg-[#EE6405] px-16 py-4 rounded-r-full rounded-bl-full text-black text-xl font-extrabold m-2 hover:bg-[#FFA567] hover:transition-all duration-1000 ease-in-out">
                                PASSEIOS <br /> TURÍSTICOS
                            </button>
                            <button className="flex-1 bg-black px-16 py-7 rounded-r-full rounded-tl-full text-white text-xl font-extrabold m-2 hover:bg-gray-700 hover:transition-all duration-1000 ease-in-out">
                                BARES
                            </button>
                            <button className="flex-1 bg-[#46240C] px-16 py-7 rounded-l-full rounded-tr-full text-white text-xl font-extrabold m-2 hover:bg-[#46240cbe]  hover:transition-all duration-1000 ease-in-out">
                                BALADAS
                            </button>
                            <button className="flex-1 bg-[#FFA567] px-16 py-4 rounded-r-full rounded-tl-full text-black text-xl font-extrabold m-2 hover:bg-[#EE6405] hover:transition-all duration-1000 ease-in-out">
                                CATEGORIAS
                            </button>
                        </div>
                    </div>
                    </div>
                    <div className="flex flex-col self-start w-full mx-auto max-w-5xl pt-8">
                        <h1 className="font-lato text-black font-bold text-xl w-full">TODOS OS EVENTOS</h1>
                        <hr className="border-black border-t-2 w-full" />
                        <div className="flex flex-wrap justify-center gap-12 pt-4 ">
                            {eventos.map((evento, id) => (
                                <div className="flex flex-wrap justify-center gap-4 max-w-full pt-4 hover:translate-y-1 transition-transform" key={id}>
                                    <button onClick={() => handleViewEvent(evento.idEvento)}>
                                        <div className="w-64 h-80 shadow-md rounded-t-md mb-4 text-left">
                                            <Image
                                                className="w-full h-3/4 rounded-t-md"
                                                src={`/${evento.url_imagem}.jpg`}
                                                width={258}
                                                height={350}
                                                alt={evento.nome_do_evento}
                                            />
                                            <p className="text-black font-lato">{evento.nome_do_evento}</p>
                                            <p className="text-gray-400 font-extralight font-lato text-sm">Allianz Parque - {evento.data_hora}</p>
                                            <p className="text-black font-extrabold font-lato">R${evento.preco},00</p>
                                        </div>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}