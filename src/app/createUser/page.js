import Footer from "@/components/Footer/page";
import Header from "@/components/Header/page";

export default function CreateUser() {
    return (
        <>
            <div className="bg-white min-h-screen font-lato">
                <Header />  
                <div className="w-2/6 border mx-auto flex justify-center self-center flex-col items-center bg-white text-black rounded-3xl m-24">
                    CADASTRE-SE
                </div>
            </div>
            <Footer />
        </>
    )
}