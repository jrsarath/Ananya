'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: '/' },
  { label: 'Inventory', href: '/inventory' },
  { label: 'Components', href: '/components' },
  { label: 'Locations', href: '/locations' },
  { label: 'Manufacturers', href: '/manufacturers' },
  { label: 'Units', href: '/units' },
  { label: 'Transactions', href: '/transactions' },
  { label: 'Projections', href: '/projections' },
  { label: 'Reservations', href: '/reservations' },
  { label: 'Batches', href: '/batches' },
  { label: 'Serials', href: '/serials' },
  { label: 'Settings', href: '/settings' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <header className="top-header">
      <div className="brand-section">
        <Link href="/" className="brand-logo">
          <span>ANANYA</span>
          <span className="brand-tag">48 STUDIOS</span>
        </Link>
      </div>

      <nav className="nav-links">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
