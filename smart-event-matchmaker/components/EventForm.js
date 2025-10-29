import { useState } from 'react';
import { motion } from 'framer-motion';

const eventTypes = ['Wedding', 'Corporate', 'Birthday', 'Concert', 'Conference', 'Other'];

export default function EventForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    type: 'Wedding',
    budgetMin: 100000,
    budgetMax: 300000,
    location: 'Mumbai',
    date: '',
    mustHaves: ''
  });

  const handleChange = (field) => (event) => {
    const rawValue = event.target.value;
    const value = rawValue === '' ? '' : Number(rawValue);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTextChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (typeof onSubmit === 'function') {
      onSubmit(formData);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="rounded-xl bg-white p-6 shadow-soft"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Event Type
          <select
            className="rounded-lg border border-slate-200 px-3 py-2 focus:border-brand-primary focus:outline-none"
            value={formData.type}
            onChange={handleTextChange('type')}
          >
            {eventTypes.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          City / Location
          <input
            type="text"
            className="rounded-lg border border-slate-200 px-3 py-2 focus:border-brand-primary focus:outline-none"
            value={formData.location}
            onChange={handleTextChange('location')}
            placeholder="Mumbai"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Budget Min (₹)
          <input
            type="number"
            min={0}
            className="rounded-lg border border-slate-200 px-3 py-2 focus:border-brand-primary focus:outline-none"
            value={formData.budgetMin}
            onChange={handleChange('budgetMin')}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Budget Max (₹)
          <input
            type="number"
            min={formData.budgetMin || 0}
            className="rounded-lg border border-slate-200 px-3 py-2 focus:border-brand-primary focus:outline-none"
            value={formData.budgetMax}
            onChange={handleChange('budgetMax')}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Event Date
          <input
            type="date"
            className="rounded-lg border border-slate-200 px-3 py-2 focus:border-brand-primary focus:outline-none"
            value={formData.date}
            onChange={handleTextChange('date')}
          />
        </label>
        <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-700">
          Must-haves (keywords)
          <textarea
            className="min-h-[96px] rounded-lg border border-slate-200 px-3 py-2 focus:border-brand-primary focus:outline-none"
            value={formData.mustHaves}
            onChange={handleTextChange('mustHaves')}
            placeholder="E.g., vegetarian menu, LED wall, bilingual emcee"
          />
        </label>
      </div>
      <motion.button
        type="submit"
        className="mt-6 w-full rounded-lg bg-brand-primary px-4 py-2 text-base font-semibold text-white shadow-sm transition hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
        whileTap={{ scale: 0.98 }}
        disabled={isLoading}
      >
        {isLoading ? 'Finding vendors…' : 'Find Vendors'}
      </motion.button>
    </motion.form>
  );
}

