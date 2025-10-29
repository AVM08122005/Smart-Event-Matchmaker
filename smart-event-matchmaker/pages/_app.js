import Layout from '../components/Layout';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  const pageTitle = pageProps?.meta?.title ?? undefined;

  return (
    <Layout title={pageTitle}>
      <Component {...pageProps} />
    </Layout>
  );
}

