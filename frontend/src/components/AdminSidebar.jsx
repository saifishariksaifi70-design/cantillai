
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import {
  LayoutDashboard,
  FileText,
  ShoppingBag,
  ClipboardCheck,
  Truck,
  ShieldCheck,
  Upload,
  LogOut,
  Brain,
} from "lucide-react";

function AdminSidebar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const links = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "All Requests", path: "/admin/requests", icon: FileText },
    { name: "Approvals", path: "/admin/approvals", icon: ClipboardCheck },
    { name: "Purchase Orders", path: "/admin/orders", icon: ShoppingBag },
    { name: "Sourcing", path: "/admin/sourcing", icon: Truck },
    { name: "Policies", path: "/admin/policies", icon: ShieldCheck },
    { name: "Decisions", path: "/admin/decisions", icon: Brain },
    { name: "CSV Upload", path: "/admin/csv-upload", icon: Upload },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-5 flex flex-col">
      <h1 className="text-2xl font-bold mb-10">
        Cantill<span className="text-blue-400">.ai</span>
      </h1>

      <nav className="space-y-2 flex-1">
        {links.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <Icon size={19} />
            <span>{name}</span>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 p-3 w-full rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
      >
        <LogOut size={19} />
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default AdminSidebar;
  