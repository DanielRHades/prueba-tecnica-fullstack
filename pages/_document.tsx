import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="es" className="h-full bg-white">
      <Head>
        <meta name="description" content="Sistema de gestión de transacciones" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <body className="h-full bg-white text-slate-900 antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}