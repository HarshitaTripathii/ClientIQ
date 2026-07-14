import { Bot, LayoutDashboard, Users } from "lucide-react";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Clients", icon: Users },
  { label: "Automation", icon: Bot },
];

function Sidebar({ clientCount }) {
  return (
    <aside className="sidebar">
      <a className="brand" href="#top" aria-label="ClientIQ home">Client<span>IQ</span></a>
      <nav aria-label="Main navigation">
        {navigation.map(({ label, icon: Icon, active }) => (
          <a key={label} className={active ? "nav-link active" : "nav-link"} href={`#${label.toLowerCase()}`}>
            <Icon size={19} /> {label}
          </a>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-avatar">HT</div>
        <div><strong>Harshita</strong><span>{clientCount} clients</span></div>
      </div>
    </aside>
  );
}

export default Sidebar;
