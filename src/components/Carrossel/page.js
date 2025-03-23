'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";

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

export default function Carrossel() {
    const [eventos, setEventos] = useState([]);
    const [activeImage, setActiveImage] = useState(0);
    const router = useRouter(); 
    
    const clicNext = () => {
        setActiveImage((prev) => (prev === eventos.length - 1 ? 0 : prev + 1));
    };

    const clickPrev = () => {
        setActiveImage((prev) => (prev === 0 ? eventos.length - 1 : prev - 1));
    };

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

    useEffect(() => {
        const timer = setTimeout(() => {
            clicNext();
        }, 5000);
        return () => clearTimeout(timer);
    }, [activeImage]);

    return (
        <div className="grid grid-cols-2 w-full mx-auto max-w-5xl shadow-2xl rounded-2xl overflow-hidden">
            {/* Imagem */}
            <div className="w-full h-[80vh]">
                {eventos.map((evento, id) => (
                    <div key={id} className={id === activeImage ? "block w-full h-full" : "hidden"}>
                        <Image
                            src={`/${evento.url_imagem}.jpg`}
                            alt={evento.nome_do_evento}
                            width={800}
                            height={800}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Texto */}
            <div className="w-full h-[80vh] flex flex-col justify-center items-center px-8 bg-gray-100 relative">
                {eventos.map((evento, id) => (
                    <div key={id} className={id === activeImage ? "block w-full text-center" : "hidden"}>
                        <h2 className="text-5xl font-extrabold text-[#FFA567] p-5">{evento.nome_do_evento}</h2>
                        <p className="leading-relaxed font-medium text-base tracking-wide h-40 italic text-black">
                            {evento.descricao}
                        </p>
                        <button onClick={() => handleViewEvent(evento.idEvento)} className="bg-[#FFA567] text-white uppercase px-6 py-3 rounded-md mt-10">
                            Mais informações
                        </button>
                        <div className="absolute ml-44 bottom-4 w-full flex justify-center gap-4">
                            <button onClick={clickPrev} className="bg-[#FFA567] rounded-3xl p-1 cursor-pointer">
                                <FaArrowLeft size={24} />
                            </button>
                            <button onClick={clicNext} className="bg-[#FFA567] rounded-3xl p-1 cursor-pointer">
                                <FaArrowRight size={24} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}