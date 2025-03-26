import Footer from "@/components/Footer/page";
import Header from "@/components/Header/page";
import Link from "next/link";

export default function Login() {
    return (
        <>
            <div className="bg-white min-h-screen">
                <Header />
                <div className="w-2/6 border mx-auto flex justify-center self-center flex-col items-center bg-white text-black rounded-3xl m-24">
                    <h1 className="text-3xl font-lato font-bold m-4">
                        Faça login
                    </h1>
                    <p className="text-bs font-normal font-lato w-2/4 text-center mb-4">
                        Conecte-se para curtir seus eventos mais aguardados!
                    </p>
                    <form className="w-3/4 flex flex-col justify-center items-center">
                        <input type="email"
                            placeholder="E-mail"
                            name="email"
                            onChange={"#"}
                            className="border text-black border-gray-500 w-full p-2 focus:outline-none focus:text-black mb-4 rounded-sm"
                            required
                        />

                        <input type="password"
                            placeholder="Senha"
                            name="senha"
                            onChange={"#"}
                            className="border text-black border-gray-500 w-full p-2 focus:outline-none focus:text-black mb-6 rounded-sm"
                            required
                        />
                        <Link href={"#"} className="text-sm hover:underline hover:text-[#EE6405] transition-all ease-in-out duration-200 mb-6">
                            Esqueci minha senha
                        </Link>
                        <button type="submit" className="w-1/4 bg-black p-2 text-white hover:bg-gray-900 transition-all ease-in-out duration-500">
                            ENTRAR
                        </button>
                        <p className="m-6 text-sm">
                            Primeira vez aqui? <Link className="underline hover:text-[#EE6405] transition-all ease-in-out duration-200" href={"/createaccount"}>Crie uma conta</Link>
                        </p>
                    </form>
                </div>
                <Footer />
            </div>
        </>
    )
}