import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import EventForm from '../../components/EventForm.js';
import MatchResults from '../../components/MatchResults.js';

export default function SmartEventMatchmakerPage() {
  const [matches, setMatches] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleMatch = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        budgetMin: formData.budgetMin === '' ? null : Number(formData.budgetMin),
        budgetMax: formData.budgetMax === '' ? null : Number(formData.budgetMax)
      };

      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Match request failed');
      }

      const data = await response.json();
      setMatches(data.matches || []);
      setAnalytics(data.analytics || null);
    } catch (err) {
      console.error('Failed to match vendors', err);
      setError('Unable to match vendors right now. Please try again in a moment.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <header className="rounded-2xl bg-white p-8 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary">Featured Project</p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900">Smart Event Matchmaker</h1>
        <p className="mt-3 text-lg text-slate-600">
          A demo platform that recommends the top vendors for any event using OpenAI embeddings with a deterministic
          fallback. Designed for a quick client walkthrough but engineered with production-ready structure.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1">Next.js</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">Tailwind CSS</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">OpenAI</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">Framer Motion</span>
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          <motion.a
            href="#demo"
            whileHover={{ scale: 1.03 }}
            className="inline-flex items-center rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-primary/90"
          >
            Open Demo
          </motion.a>
          <motion.div whileHover={{ scale: 1.03 }}>
            <Link
              href="/projects"
              className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-100"
            >
              Back to Projects
            </Link>
          </motion.div>
        </div>
      </header>

      <section className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-soft">
          <h2 className="text-2xl font-semibold text-slate-900">Why it matters</h2>
          <p className="mt-3 text-sm text-slate-600">
            Event planners spend days shortlisting vendors. This prototype turns a simple form submission into a curated
            shortlist with reasons and performance analytics. It feels like magic but is grounded in explainable signals.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>• Embedding-powered similarity scoring plus deterministic bonuses for budget and location fit.</li>
            <li>• Cached embeddings for instant responses and a fallback keyword scorer when AI isn&apos;t available.</li>
            <li>• Lightweight analytics to surface vendor category coverage and average match confidence.</li>
          </ul>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-soft">
          <h2 className="text-2xl font-semibold text-slate-900">How the matching works</h2>
          <ol className="mt-4 space-y-3 text-sm text-slate-600">
            <li>1. Join event inputs into a single event brief and embed it with OpenAI (or use fallback text scoring).</li>
            <li>2. Compare against cached vendor embeddings, then add bonuses for budget overlaps and local presence.</li>
            <li>3. Return the top three vendors with transparent reasons and small-footprint analytics.</li>
          </ol>
          <p className="mt-4 text-sm text-slate-600">
            Ready for Vercel. Next steps include plugging into a real vendor database, adding planner accounts, and
            exposing performance dashboards.
          </p>
        </div>
      </section>

      <section id="demo" className="mt-12 space-y-6">
        <h2 className="text-3xl font-semibold text-slate-900">Try the demo</h2>
        <p className="text-sm text-slate-600">
          Enter any event brief and see the top vendor recommendations in under a second. All data lives in the repo —
          no external databases required.
        </p>
        <div className="grid gap-6 lg:grid-cols-2">
          <EventForm onSubmit={handleMatch} isLoading={isLoading} />
          <div className="space-y-4">
            {error ? (
              <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 shadow-soft">{error}</div>
            ) : null}
            <MatchResults matches={matches} analytics={analytics} isLoading={isLoading} />
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
        title: 'Smart Event Matchmaker | Project Case Study'
      }
    }
  };
}

