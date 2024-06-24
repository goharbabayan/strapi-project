import Layout from '@/components/layout'; // Your global layout component

function MyApp({ Component, pageProps }) {

  return (
    // <Layout>
      <Component {...pageProps} />
    // </Layout>
  );
}

export default MyApp;
