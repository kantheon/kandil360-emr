import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HomeIcon,
  UsersIcon,
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

const navItems = [
  { to: '/', icon: HomeIcon, label: 'Dashboard', end: true },
  { to: '/patients', icon: UsersIcon, label: 'Patients' },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#f0f4f8]">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen bg-white border-r border-border-light flex flex-col transition-all duration-300 ease-in-out ${
        mobileOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full lg:translate-x-0'
      } ${collapsed ? 'lg:w-[72px]' : 'lg:w-[260px]'}`}>
        {/* Brand - click heart to collapse */}
        <div className={`flex items-center h-16 border-b border-border-light shrink-0 ${collapsed ? 'justify-center px-0' : 'gap-3 px-5'}`}>
          <button
            onClick={() => {
              if (window.innerWidth >= 1024) {
                setCollapsed(!collapsed);
              } else {
                setMobileOpen(false);
              }
            }}
            className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-sm shrink-0 cursor-pointer hover:shadow-md transition-shadow"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </button>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-base font-bold text-text-primary leading-tight whitespace-nowrap">CareFlow</h1>
              <p className="text-[11px] text-text-muted font-medium whitespace-nowrap">Case Management EMR</p>
            </div>
          )}
          {!collapsed && (
            <button className="ml-auto lg:hidden text-text-muted hover:text-text-primary cursor-pointer" onClick={() => setMobileOpen(false)}>
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 py-4 space-y-1 overflow-y-auto ${collapsed ? 'px-2' : 'px-3'}`}>
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  collapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5'
                } ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                    : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className={`border-t border-border-light shrink-0 ${collapsed ? 'p-2' : 'p-3'}`}>
          {collapsed ? (
            <div className="flex flex-col items-center gap-2">
              <img
                src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'U')}&background=3b82f6&color=fff&bold=true&size=36`}
                alt=""
                className="w-9 h-9 rounded-xl object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={logout}
                className="p-2 rounded-lg text-text-muted hover:text-danger-500 hover:bg-danger-50 transition-colors cursor-pointer"
                title="Sign out"
              >
                <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-3 py-2">
              <img
                src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'U')}&background=3b82f6&color=fff&bold=true&size=36`}
                alt=""
                className="w-9 h-9 rounded-xl object-cover shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">{user?.displayName}</p>
                <p className="text-[11px] text-text-muted truncate">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg text-text-muted hover:text-danger-500 hover:bg-danger-50 transition-colors cursor-pointer"
                title="Sign out"
              >
                <ArrowRightStartOnRectangleIcon className="w-4.5 h-4.5" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 bg-white/80 backdrop-blur-md border-b border-border-light flex items-center px-4 lg:px-6 shrink-0">
          <button className="lg:hidden p-2 -ml-2 rounded-lg text-text-secondary hover:bg-surface-hover cursor-pointer" onClick={() => setMobileOpen(true)}>
            <Bars3Icon className="w-5 h-5" />
          </button>
          <button
            className="hidden lg:flex p-1.5 rounded-lg text-text-muted hover:bg-surface-hover hover:text-text-primary transition-colors cursor-pointer"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRightIcon className="w-4 h-4" /> : <ChevronLeftIcon className="w-4 h-4" />}
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <div className="w-2 h-2 bg-accent-400 rounded-full" />
            Connected
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
