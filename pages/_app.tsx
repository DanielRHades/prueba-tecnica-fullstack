import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "@/lib/apollo-client";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@auth0/nextjs-auth0/client";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-zinc-200">
            <Component {...pageProps} />
            <Toaster richColors position="top-right" />
          </div>
        </ThemeProvider>
      </ApolloProvider>
    </UserProvider>
  );
}
