import Footer from "@/components/Footer/page";
import Header from "@/components/Header/page";
import Link from "next/link";

export default function NotFoundPage() {
    return (
        <div
            className="flex flex-col min-h-screen font-lato text-black bg-cover bg-center"
            style={{ backgroundImage: "url('/erro.png')" }}
        >
            <Header />
            <main className="flex-grow flex flex-col justify-center items-center px-4 py-24">
                <h1 className="text-6xl font-bold text-black mb-6">404</h1>
                <h2 className="text-2xl font-semibold mb-6">Página não encontrada</h2>

                <div className="bg-[#FFF4ED] border border-[#FFA567] rounded-3xl p-8 max-w-xl w-full shadow-md text-center">
                    <p className="text-lg leading-relaxed mb-6">
                        Opa! Parece que a página que você está procurando não existe ou foi movida.
                    </p>
                    <Link
                        href="/home"
                        className="text-white bg-[#EE6405] px-6 py-2 rounded-full font-semibold hover:bg-[#FFA567] transition-colors duration-300"
                    >
                        Voltar para a página inicial
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}
