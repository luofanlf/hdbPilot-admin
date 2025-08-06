'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
  { href: '/admin/users', label: 'Manage Users', icon: 'fas fa-users' },
  { href: '/admin/listings', label: 'Manage Listings', icon: 'fas fa-home' },
  { href: '/admin/analytics', label: 'Analytics', icon: 'fas fa-chart-line' },
  { href: '/admin/reviews', label: 'Reviews', icon: 'fas fa-comments' },
  { href: '/admin/settings', label: 'Settings', icon: 'fas fa-cog' },
  { href: '/', label: 'Logout', icon: 'fas fa-sign-out-alt' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[250px] fixed h-screen bg-gray-800 text-white flex flex-col px-6 py-8">
      <div className="mb-10">
        <h2 className="text-2xl font-bold">
          HDB<span className="text-blue-400">Pilot</span>
        </h2>
        <p className="text-sm text-gray-400">Admin Dashboard</p>
      </div>

      <nav className="space-y-3">
        {navItems.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              'flex items-center space-x-3 py-2 px-4 rounded-lg hover:bg-gray-700 transition',
              pathname === href && 'bg-gray-700'
            )}
          >
            <i className={`${icon} w-5`}></i>
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
