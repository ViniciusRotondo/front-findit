"use client";

import { SessionProvider } from "next-auth/react";

export function NextAuthProvider({ children }) {
  return (
    // Você pode passar session aqui, se quiser:
    // <SessionProvider session={pageProps.session}>
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}