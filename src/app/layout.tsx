import "./globals.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { mantineTheme } from "../lib/providers/mantineTheme";
import { ToastContainer } from "react-toastify";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { Rubik } from "next/font/google";
import { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import TransitionProvider from "../lib/providers/TransitionProvider";

export const metadata: Metadata = {
  title: "Niva Bupa Health Insurance",
  description:
    "Niva Bupa Health insurance is the number one health insurance in India",
};

const rubik = Rubik({ subsets: ["latin"] });

const mainClasses = `${rubik.className} bg-[#F3F7F8] w-full h-screen overflow-y-auto overflow-x-hidden`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className={mainClasses}>
          <ColorSchemeScript defaultColorScheme="light" />
          <MantineProvider theme={mantineTheme}>
            <ToastContainer />
            <TransitionProvider>
              <AntdRegistry>{children}</AntdRegistry>
            </TransitionProvider>
          </MantineProvider>
        </main>
      </body>
    </html>
  );
}
