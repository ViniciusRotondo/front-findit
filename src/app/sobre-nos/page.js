import Footer from "@/components/Footer/page";
import Header from "@/components/Header/page";

export default function SobreNos() {
    return (
        <div
            className="min-h-screen bg-cover bg-center font-lato text-black"
            style={{ backgroundImage: "url('/page1.png')" }}
        >
            <div className="min-h-screen flex flex-col">
                <Header />

                <main className="flex-grow flex flex-col items-center px-4 py-16">
                    <h1 className="text-4xl font-bold mb-8 text-center text-[#EE6405]">
                        Sobre Nós
                    </h1>
                    <div className="bg-[#FFF4ED] border border-[#FFA567] rounded-3xl p-10 max-w-4xl w-full shadow-md">
                        <p className="text-lg leading-relaxed text-justify">
                            Este trabalho de graduação tem como objetivo documentar o processo de desenvolvimento do software de localização de eventos <strong>FIND IT</strong>. 
                            A proposta é criar uma plataforma de busca de eventos filtrado por uma determinada cidade, especialmente para viajantes que desejam descobrir 
                            atividades culturais, esportivas e de entretenimento em sua localização atual ou em destinos específicos.
                            <br /><br />
                            De Araujo Miyahira, Guilherme; Romanini Rocha, Henrique; Augait Romagnoli, Isabela; Oliveira Rodrigues, Kauê; Rotondo Silva, Vinícius. <strong>(FIND IT: Sistema de Localização de Eventos).</strong>
                        </p>
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
}
