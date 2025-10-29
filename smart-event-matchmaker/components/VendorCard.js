import { motion } from 'framer-motion';

export default function VendorCard({ vendor, score, reason }) {
  return (
    <motion.div
      className="rounded-xl bg-white p-5 shadow-soft"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{vendor.name}</h3>
          <p className="text-sm font-medium text-brand-primary">{vendor.category}</p>
        </div>
        {typeof score === 'number' && (
          <span className="rounded-full bg-brand-primary/10 px-3 py-1 text-sm font-bold text-brand-primary">
            {score.toFixed(1)}
          </span>
        )}
      </div>
      <p className="mt-3 text-sm text-slate-600">{vendor.description}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span className="rounded-full bg-slate-100 px-2 py-1">City: {vendor.city}</span>
        <span className="rounded-full bg-slate-100 px-2 py-1">
          Budget: ₹{vendor.priceRange[0].toLocaleString('en-IN')} – ₹{vendor.priceRange[1].toLocaleString('en-IN')}
        </span>
        <span className="rounded-full bg-slate-100 px-2 py-1">Rating: {vendor.rating}</span>
      </div>
      {reason ? <p className="mt-4 text-sm text-slate-700">{reason}</p> : null}
    </motion.div>
  );
}

