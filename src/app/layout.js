import { ThemeProvider } from "../theme/ThemeProvider";

export const metadata = {
  title: "Sistema de Monitoramento de Patos Primordiais",
  description:
    "Sistema avançado de monitoramento e classificação para pesquisa de patos primordiais",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
