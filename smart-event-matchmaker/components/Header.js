import Link from 'next/link';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  
];

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-semibold tracking-tight text-slate-900">
          Achintya.dev
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
          {navItems.map((item) =>
            item.external ? (
              <motion.a
                key={item.href}
                href={item.href}
                whileHover={{ scale: 1.05 }}
                className="rounded-lg px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
              >
                {item.label}
              </motion.a>
            ) : (
              <motion.div key={item.href} whileHover={{ scale: 1.05 }}>
                <Link
                  href={item.href}
                  className="rounded-lg px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  {item.label}
                </Link>
              </motion.div>
            )
          )}
        </nav>
      </div>
    </header>
  );
}

