import { useEffect, useState } from 'react';

export default function Footer() {
  const [year, setYear] = useState('');

  useEffect(() => {
    setYear(String(new Date().getFullYear()));
  }, []);

  return (
    <footer className="border-t border-slate-200 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-6 text-center text-sm text-slate-500 sm:flex-row sm:text-left">
        <p>
          &copy; {year && `${year} `}Achintya. Crafted with React, Next.js, and AI.
        </p>
        <div className="flex items-center gap-4">
          <a href="mailto:achintya8122005@gmail.com" className="hover:text-slate-900">
            achintya8122005@gmail.com
          </a>
          <a href="https://www.linkedin.com/in/iamachintya/" className="hover:text-slate-900" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}

