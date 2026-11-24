import './globals.css';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import { CartProvider } from '@/context/CartContext';
import { BranchProvider } from '@/context/BranchContext';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata = {
  title: 'Black Cafe | Premium Fast Food',
  description: 'Order premium food from Black Cafe.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${playfair.variable}`}>
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" 
          rel="stylesheet" 
        />
      </head>
      <body className="flex flex-col min-h-screen bg-background">
        <AuthProvider>
          <BranchProvider>
            <CartProvider>
              <Navbar />
              
              {/* THIS IS THE FIX: pt-[72px] pushes the page down so it doesn't hide under the navbar */}
              <main className="flex-1 pt-[72px]">
                {children}
              </main>
              
              <Footer /> 
              <ChatWidget />
            </CartProvider>
          </BranchProvider>
        </AuthProvider>
      </body>
    </html>
  );
}