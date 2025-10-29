import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children, title = 'Smart Event Matchmaker | Achintya' }) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Smart Event Matchmaker prototype by Achintya" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content="AI-assisted event vendor recommendations for planners." />
        <meta property="og:type" content="website" />
      </Head>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

