import axios from "axios";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        // Aqui destruturamos email e password:
        const { email, password } = credentials;

        try {
          const res = await axios.post(
            "http://localhost:8080/auth/login",
            { email, senha: password },              // note que o body chama a prop "senha"
            { headers: { "Content-Type": "application/json" } }
          );

          console.log("Resposta da API:", res.data); 

          // Se chegou aqui, status foi 2xx
          const user = res.data;
          console.log("Usuário logado:", user); 
          return { id: user.id, nome: user.nome, cpf: user.cpf, tipo: user.tipo };

        } catch (err) {
          // Se deu erro 4xx/5xx, retorna null pro NextAuth
          return null;
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.nome = user.nome;
        token.cpf = user.cpf;
        token.tipo = user.tipo;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.nome = token.nome;
      session.user.cpf = token.cpf;
      session.user.tipo = token.tipo;
      return session;
    }
  }
};

// No App Router, exporte assim:
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };