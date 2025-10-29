import Link from 'next/link';
import { motion } from 'framer-motion';

const projects = [
  {
    slug: 'smart-event-matchmaker',
    title: 'Smart Event Matchmaker',
    summary: 'AI-powered matching engine that recommends the top vendors for any event brief.',
    tech: ['Next.js', 'OpenAI', 'Tailwind CSS'],
    href: '/project/smart-event-matchmaker'
  },
  {
    slug: 'book-notes',
    title: 'Book Notes App',
    summary: 'Lightweight React Native app to capture highlights, quotes, and micro-reviews from daily reading.',
    tech: ['React Native', 'Expo', 'Firebase'],
    href: '#'
  }
];

export default function Projects() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-4xl font-bold text-slate-900">Projects</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        A snapshot of prototypes and production work I&apos;ve shipped recently. Want a deeper dive? Reach out and I can
        share walkthroughs, dashboards, and code samples.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <motion.div
            key={project.slug}
            className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-soft"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="text-2xl font-semibold text-slate-900">{project.title}</h2>
            <p className="mt-3 text-sm text-slate-600">{project.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
              {project.tech.map((tech) => (
                <span key={tech} className="rounded-full bg-slate-100 px-3 py-1">
                  {tech}
                </span>
              ))}
            </div>
            <div className="mt-auto pt-6">
              <Link
                href={project.href}
                className="inline-flex items-center rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-primary/90"
              >
                View Project
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      meta: {
        title: 'Projects | Achintya'
      }
    }
  };
}

