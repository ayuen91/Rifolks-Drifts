import "./styles/globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
	title: "Rifolks Drifts",
	description: "Your premier destination for drifting gear and accessories",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={inter.variable}>
			<body className="min-h-screen bg-light font-sans">
				<Navigation />
				<main className="flex min-h-screen flex-col pt-20">
					{children}
				</main>
				<Footer />
			</body>
		</html>
	);
}
