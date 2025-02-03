'use client'

import { createContext, Suspense, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/header/Header';
import Client from '@/lib/apolloClient';
import { ApolloProvider } from '@apollo/client';
import Footer from '@/components/footer/Footer';
import globalStyles from '../app/global.css';
import { AuthContext } from './Context';
import { HIDE_FOOTER_FROM_SELECTED_PAGES } from './utils/constants/hideHeaderAndFooterPages';
import { AgeConfirmationPopup } from '@/components/ageConfirmationPupup/AgeConfirmationPopup';

export default function RootLayout({ children }) {
  const [customerToken, setCustomerToken] = useState('');
  const [loggedInUserData, setLoggedInUserData] = useState(null);
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isProfileReviewPage = pathname === '/profile-review';

  useEffect(() => {
    const customerTokenFromLocalStorage = JSON.parse(localStorage.getItem('token'));
    const userLoggedInData = JSON.parse(localStorage.getItem('loggedInUserdata'));

    if (customerTokenFromLocalStorage) {
      setCustomerToken(customerTokenFromLocalStorage);
      setLoggedInUserData(userLoggedInData);
    };
  }, []);

  return (
    <html lang="en">
        <head>
          <meta name="robots" content="noindex" />
        </head>
      <body>
        <ApolloProvider client={Client}>
          {/* <AgeConfirmationPopup /> */}
          <AuthContext.Provider value={{customerToken, setCustomerToken, loggedInUserData, setLoggedInUserData}}>
            {!isProfileReviewPage && <Header />}
            <main className="main-wrapper">{children}</main>
            {HIDE_FOOTER_FROM_SELECTED_PAGES.every(pagePathname => pagePathname !== pathname) && <Footer/>}
          </AuthContext.Provider>
        </ApolloProvider>
      </body>
    </html>
  )
}
