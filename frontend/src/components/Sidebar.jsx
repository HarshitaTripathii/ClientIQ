import { BarChart3, FileText, Home, Settings, Users, Workflow } from "lucide-react";

const menuItems = [
  { label: "Dashboard", icon: Home },
  { label: "Projects", icon: FileText },
  { label: "Clients", icon: Users },
  { label: "Analytics", icon: BarChart3 },
  { label: "Automation", icon: Workflow },
  { label: "Settings", icon: Settings },
];

function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 bg-slate-950 p-5 text-white lg:block">
      <div className="mb-8 text-3xl font-bold">
        Client<span className="text-teal-400">IQ</span>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const active = index === 0;

          return (
            <button
              key={item.label}
              className={`flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-sm ${
                active ? "bg-teal-600 text-white" : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-10 rounded-md border border-slate-700 p-4">
        <p className="text-sm text-slate-300">Project Flow</p>
        <p className="mt-2 text-2xl font-semibold">5 steps</p>
        <p className="mt-2 text-xs text-slate-400">Create, upload, analyze, generate, automate.</p>
      </div>
    </aside>
  );
}

export default Sidebar;

