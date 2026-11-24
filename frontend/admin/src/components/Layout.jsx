import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Layout({ children }) {
  const nav = useNavigate();
  const logout = async () => { await api.post('/auth/logout'); nav('/login'); };

  return (
    <div className="flex min-h-screen bg-background text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border bg-surface flex items-center px-6 justify-between shadow-sm">
          <span className="text-muted font-semibold text-sm">Admin Console</span>
          <button onClick={logout} className="text-sm font-bold text-primary hover:text-white transition">Logout</button>
        </header>
        <main className="p-6 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}