import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <section className="rounded-2xl bg-gradient-to-br from-white via-white to-slate-100 p-10 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary">Portfolio</p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900 sm:text-5xl">
          Achintya — Full Stack Developer • React Native • AI for Event Tech
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          I build web &amp; mobile products that connect planners and vendors using smart data.
          From rapid prototypes to production-ready experiences, I focus on pairing clean design with
          measurable business value.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <motion.div whileHover={{ scale: 1.03 }}>
            <Link
              href="/projects"
              className="inline-flex items-center rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-primary/90"
            >
              View Projects
            </Link>
          </motion.div>
          <motion.a whileHover={{ scale: 1.03 }} href="mailto:achintya@example.com" className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-100">
            Contact
          </motion.a>
        </div>
      </section>

      <section className="mt-12 grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-slate-900">About</h2>
          <p className="mt-4 text-slate-600">
            Product-focused full stack developer with 6+ years shipping React, React Native, and Node apps. I blend
            AI-driven features with human-centered design to help teams launch faster and learn quicker.
          </p>
          <p className="mt-3 text-slate-600">
            Recently prototyped data-driven experiences for event tech startups, creator economy platforms, and B2B SaaS.
            Let&apos;s build things that convert, delight, and scale.
          </p>
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-slate-900">Featured Project</h2>
          <div className="mt-6 rounded-xl bg-slate-50 p-6">
            <h3 className="text-xl font-semibold text-slate-900">Smart Event Matchmaker</h3>
            <p className="mt-2 text-sm text-slate-600">
              AI-assisted matching that recommends the right vendors for any event brief. Built with Next.js, Tailwind, and
              OpenAI embeddings.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="rounded-full bg-white px-3 py-1">Next.js</span>
              <span className="rounded-full bg-white px-3 py-1">OpenAI</span>
              <span className="rounded-full bg-white px-3 py-1">Tailwind</span>
            </div>
            <Link
              href="/project/smart-event-matchmaker"
              className="mt-6 inline-flex items-center rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-primary/90"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      meta: {
        title: 'Achintya | Smart Event Matchmaker Portfolio'
      }
    }
  };
}

