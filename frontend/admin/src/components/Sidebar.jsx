import { NavLink } from 'react-router-dom';

const links = [
  ['/dashboard', 'Dashboard'],
  ['/orders', 'Orders'],
  ['/products', 'Products'],
  ['/branches', 'Branches'],
  ['/payments', 'Payments'],
  ['/refunds', 'Refunds'],
  ['/reports', 'Reports'],
  ['/audit', 'Audit Logs'],
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col shrink-0">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-black text-primary tracking-wide">BLACK CAFE</h1>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Admin Console</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(([to, label]) => (
          <NavLink 
            key={to} 
            to={to}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                isActive ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}