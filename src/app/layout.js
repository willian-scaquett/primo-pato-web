import { ThemeProvider } from "../theme/ThemeProvider";

export const metadata = {
  title: "Primo Pato",
  description:
    "Sistema de monitoramento, classificação e captura de patos primordiais para pesquisa",
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
