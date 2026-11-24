import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Branches from './pages/Branches';
import Payments from './pages/Payments';
import Refunds from './pages/Refunds';
import Reports from './pages/Reports';
import AuditLogs from './pages/AuditLogs';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

const protect = (el) => <ProtectedRoute><Layout>{el}</Layout></ProtectedRoute>;

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={protect(<Dashboard />)} />
      <Route path="/orders" element={protect(<Orders />)} />
      <Route path="/products" element={protect(<Products />)} />
      <Route path="/branches" element={protect(<Branches />)} />
      <Route path="/payments" element={protect(<Payments />)} />
      <Route path="/refunds" element={protect(<Refunds />)} />
      <Route path="/reports" element={protect(<Reports />)} />
      <Route path="/audit" element={protect(<AuditLogs />)} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}