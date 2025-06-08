'use client'

import Header from "@/components/Header/page"
import Footer from "@/components/Footer/page"
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
        router.push(`/event/${id}`);
    };

    const handleCategoryClick = (category) => {
        router.push(`/eventos?categoria=${category}`);
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
            {/* Faixa preta superior */}
            <div className="bg-black w-full h-20 flex items-center justify-center">
                {/* Vazia, como combinado */}
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
                                <button 
                                    onClick={() => handleCategoryClick('SHOW')}
                                    className="flex-1 bg-[#EE6405] px-16 py-4 rounded-r-full rounded-bl-full text-black text-xl font-extrabold m-2 hover:bg-[#FFA567] hover:transition-all duration-1000 ease-in-out"
                                >
                                    SHOW
                                </button>
                                <button 
                                    onClick={() => handleCategoryClick('RESTAURANTES')}
                                    className="flex-1 bg-[#FFA567] px-16 py-4 rounded-l-full rounded-br-full text-black text-xl font-extrabold m-2 hover:bg-[#EE6405] hover:transition-all duration-1000 ease-in-out"
                                >
                                    RESTAURANTES
                                </button>
                                <button 
                                    onClick={() => handleCategoryClick('PASSEIOS TURISTICOS')}
                                    className="flex-1 bg-[#EE6405] px-16 py-4 rounded-r-full rounded-bl-full text-black text-xl font-extrabold m-2 hover:bg-[#FFA567] hover:transition-all duration-1000 ease-in-out"
                                >
                                    PASSEIOS <br /> TURÍSTICOS
                                </button>
                                <button 
                                    onClick={() => handleCategoryClick('BARES')}
                                    className="flex-1 bg-black px-16 py-7 rounded-r-full rounded-tl-full text-white text-xl font-extrabold m-2 hover:bg-gray-700 hover:transition-all duration-1000 ease-in-out"
                                >
                                    BARES
                                </button>
                                <button 
                                    onClick={() => handleCategoryClick('BALADAS')}
                                    className="flex-1 bg-[#46240C] px-16 py-7 rounded-l-full rounded-tr-full text-white text-xl font-extrabold m-2 hover:bg-[#46240cbe] hover:transition-all duration-1000 ease-in-out"
                                >
                                    BALADAS
                                </button>
                                <button 
                                    onClick={() => handleCategoryClick('TODAS')}
                                    className="flex-1 bg-[#FFA567] px-16 py-4 rounded-r-full rounded-tl-full text-black text-xl font-extrabold m-2 hover:bg-[#EE6405] hover:transition-all duration-1000 ease-in-out"
                                >
                                    TODAS AS CATEGORIAS
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col self-start w-full mx-auto max-w-5xl pt-8">
                        <h1 className="font-lato text-black font-bold text-xl w-full">TODOS OS EVENTOS</h1>
                        <hr className="border-black border-t-2 w-full" />
                        <div className="flex flex-wrap justify-center gap-12 pt-4 ">
                            {eventos.map((evento) => (
                                <div 
                                    className="flex flex-col items-center hover:translate-y-1 transition-transform cursor-pointer" 
                                    key={evento.idEvento}
                                    onClick={() => handleViewEvent(evento.idEvento)}
                                >
                                    <div className="w-64 h-80 shadow-md rounded-t-md mb-4 text-left">
                                        <Image
                                            className="w-full h-3/4 rounded-t-md object-cover"
                                            src={`/${evento.url_imagem}.jpg`}
                                            width={256}
                                            height={240}
                                            alt={evento.nome_do_evento}
                                        />
                                        <div className="px-3 py-2">
                                            <p className="text-black font-lato">{evento.nome_do_evento}</p>
                                            <p className="text-gray-400 font-extralight font-lato text-sm">
                                                {evento.local?.nome ?? 'Local não informado'} - {new Date(evento.data_hora).toLocaleDateString('pt-BR')}
                                            </p>
                                            <p className="text-black font-extrabold font-lato">R${evento.preco ? evento.preco.toFixed(2).replace('.', ',') : '0,00'}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* Botão "MOSTRAR MAIS EVENTOS" com o estilo do botão RESTAURANTES */}
                            <button onClick={() => router.push("/eventos")} className="bg-[#FFA567] px-16 py-4 rounded-l-full rounded-br-full text-black text-xl font-extrabold m-2 hover:bg-[#EE6405] hover:transition-all duration-1000 ease-in-out">
                                MOSTRAR MAIS EVENTOS
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}