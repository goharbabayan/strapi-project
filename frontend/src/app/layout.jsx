'use client'

import { createContext, Suspense, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/header/Header';
import AnnouncementBar from '@/components/announcementBar/AnnouncementBar';
import Client from '@/lib/apolloClient';
import { ApolloProvider } from '@apollo/client';
import Loading from './loading';
import Footer from '@/components/footer/Footer';
import globalStyles from '../app/global.css';
import { AuthContext } from './Context';

export default function RootLayout({ children }) {
  const [customerToken, setCustomerToken] = useState('');
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const customerTokenFromLocalStorage = JSON.parse(localStorage.getItem('token'));

    if (customerTokenFromLocalStorage) setCustomerToken(customerTokenFromLocalStorage);
  }, []);

  return (
    <html lang="en">
      <body>
        <ApolloProvider client={Client}>
          {/* <AnnouncementBar/> */}
          <AuthContext.Provider value={{customerToken, setCustomerToken}}>
            <Header />
            <main className="main-wrapper">{children}</main>
            <Footer />
          </AuthContext.Provider>
        </ApolloProvider>
      </body>
    </html>
  )
}
