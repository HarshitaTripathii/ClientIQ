import { AlertTriangle, BarChart3, MapPin, Users } from "lucide-react";

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-md border bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-md bg-teal-50 p-2 text-teal-700">
          <Icon size={22} />
        </div>
        <div>
          <p className="text-2xl font-semibold">{value}</p>
          <p className="text-sm text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

function AnalysisSummary({ analysis }) {
  return (
    <section className="border-t p-5">
      <h2 className="text-lg font-semibold">Analysis Summary</h2>
      <p className="mt-1 text-sm text-slate-500">Simple Pandas calculations from the uploaded file.</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Rows Analyzed" value={analysis.total_rows || 0} icon={Users} />
        <StatCard label="Average Spend" value={analysis.average_spend || 0} icon={BarChart3} />
        <StatCard label="Retention Risk" value={analysis.retention_risk || "N/A"} icon={AlertTriangle} />
        <StatCard label="Top Risk City" value={analysis.top_risk_city || "N/A"} icon={MapPin} />
      </div>
    </section>
  );
}

export default AnalysisSummary;

