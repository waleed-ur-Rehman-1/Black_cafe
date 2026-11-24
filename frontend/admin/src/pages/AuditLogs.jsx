export default function AuditLogs() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">System Audit Logs</h1>
      <div className="bg-card border border-border p-12 rounded-xl text-center shadow-lg">
        <span className="material-symbols-outlined text-4xl text-muted mb-2">history</span>
        <p className="text-muted font-medium">
          Admin actions (logins, price changes, cancellations) will appear here.
        </p>
      </div>
    </div>
  );
}