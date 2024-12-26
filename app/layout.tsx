// golbal layout for the app

// golbal Importing
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import { ToastProvider } from '@/providers/toast-provider';

// local Importing
import { ModalProvider } from '@/providers/modal-provider';

// Importing CSS
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: 'Dashboard',
	description: 'E-Commerce Dashboard',
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider>
			<html lang='en'>
				<body className={inter.className}>
					<ToastProvider />
					<ModalProvider />
					{children}
				</body>
			</html>
		</ClerkProvider>
	);
}
