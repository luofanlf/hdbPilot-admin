'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import clsx from 'clsx';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
  { href: '/admin/users', label: 'Manage Users', icon: 'fas fa-users' },
  {
    label: 'Manage Listings',
    icon: 'fas fa-home',
    key: 'manage-listings',
    subItems: [
      { href: '/admin/listings', label: 'Property List' },
      { href: '/admin/listings/review', label: 'Review the Property' },
    ],
  },
  { href: '/admin/reviews', label: 'Reviews', icon: 'fas fa-comments' },
  { href: '/', label: 'Logout', icon: 'fas fa-sign-out-alt' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (key: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <aside className="w-[250px] fixed h-screen bg-gray-800 text-white flex flex-col px-6 py-8">
      <div className="mb-10">
        <h2 className="text-2xl font-bold">
          HDB<span className="text-blue-400">Pilot</span>
        </h2>
        <p className="text-sm text-gray-400">Admin Dashboard</p>
      </div>

      <nav className="space-y-3">
        {navItems.map(({ href, label, icon, subItems, key }) => {
          const isExpanded = key ? expandedMenus[key] : false;

          if (subItems) {
            return (
              <div key={label}>
                <button
                  onClick={() => key && toggleMenu(key)}
                  className={clsx(
                    'flex items-center justify-between w-full py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-200',
                    isExpanded && 'bg-gray-700'
                  )}
                >
                  <div className="flex items-center space-x-3 whitespace-nowrap">
                    <i className={`${icon} w-5`}></i>
                    <span>{label}</span>
                  </div>
                  <i
                    className={clsx(
                      'fas transition-transform duration-200',
                      isExpanded ? 'fa-chevron-up rotate-180' : 'fa-chevron-down'
                    )}
                  ></i>
                </button>
                {isExpanded && (
                  <div className="ml-6 mt-2 space-y-1 border-l border-gray-600 pl-3">
                    {subItems.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={clsx(
                          'block py-1.5 px-3 rounded-md text-sm hover:bg-gray-700 transition',
                          pathname === sub.href && 'bg-gray-700 text-blue-400'
                        )}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            href && (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'flex items-center space-x-3 py-2 px-4 rounded-lg hover:bg-gray-700 transition',
                  pathname === href && 'bg-gray-700 text-blue-400'
                )}
              >
                <i className={`${icon} w-5`}></i>
                <span>{label}</span>
              </Link>
            )
          );
        })}
      </nav>
    </aside>
  );
}
