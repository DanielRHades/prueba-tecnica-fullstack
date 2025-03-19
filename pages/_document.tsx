import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="es" className="h-full bg-white">
      <Head>
        <meta name="description" content="Sistema de gestión de transacciones" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="h-full bg-white text-slate-900 antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
