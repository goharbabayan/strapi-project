'use client'

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/header/Header';
import AnnouncementBar from '@/components/announcementBar/AnnouncementBar';
import Client from '@/lib/apolloClient';
import { ApolloProvider } from '@apollo/client';
import Loading from './loading';
import Footer from '@/components/footer/Footer';
import globalStyles from '../app/global.css';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <html lang="en">
      <body>
        <ApolloProvider client={Client}>
          {/* <AnnouncementBar/> */}
          <Header />
          <main className="main-wrapper">{children}</main>
          {/* <Footer/> */}
        </ApolloProvider>
      </body>
    </html>
  )
}
