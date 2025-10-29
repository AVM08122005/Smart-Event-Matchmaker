import { motion } from 'framer-motion';
import VendorCard from './VendorCard';

function AnalyticsPanel({ analytics }) {
  if (!analytics) return null;

  const totalCount = Object.values(analytics.distribution || {}).reduce((acc, value) => acc + value, 0) || 1;

  return (
    <div className="rounded-xl bg-white p-5 shadow-soft">
      <h3 className="text-base font-semibold text-slate-900">Match Analytics</h3>
      <p className="mt-1 text-sm text-slate-500">
        Average match score: <span className="font-semibold text-brand-primary">{analytics.averageMatchScore}</span>
      </p>
      <div className="mt-4 space-y-3">
        {Object.entries(analytics.distribution || {}).map(([category, count]) => {
          const width = Math.round((count / totalCount) * 100);
          return (
            <div key={category}>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{category}</span>
                <span>{count}</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-brand-primary" style={{ width: `${width}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MatchResults({ matches = [], analytics, isLoading }) {
  if (isLoading) {
    return (
      <div className="rounded-xl bg-white p-6 text-center text-sm text-slate-500 shadow-soft">
        Running the match engine…
      </div>
    );
  }

  if (!matches.length) {
    return (
      <div className="rounded-xl bg-white p-6 text-center text-sm text-slate-500 shadow-soft">
        Submit the form to see your top vendor matches.
      </div>
    );
  }

  return (
    <motion.div
      className="grid gap-6 lg:grid-cols-[2fr_1fr]"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="space-y-4">
        {matches.map((match) => (
          <VendorCard key={match.vendor.id} vendor={match.vendor} score={match.score} reason={match.reason} />
        ))}
      </div>
      <AnalyticsPanel analytics={analytics} />
    </motion.div>
  );
}

