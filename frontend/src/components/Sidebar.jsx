
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { LayoutDashboard, MessageSquare, FileText, ShoppingBag, LogOut } from "lucide-react";

function Sidebar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const links = [
    { name: "Dashboard", path: "/employee/dashboard", icon: LayoutDashboard },
    { name: "AI Chat", path: "/employee/chat", icon: MessageSquare },
    { name: "My Requests", path: "/employee/requests", icon: FileText },
    { name: "My Orders", path: "/employee/orders", icon: ShoppingBag },
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-5">
      <h1 className="text-2xl font-bold mb-10">Cantill<span className="text-blue-400">.ai</span></h1>

      <nav className="space-y-2">
        {links.map(({ name, path, icon: Icon }) => (
          <NavLink key={path} to={path} className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg ${isActive ? "bg-blue-600" : "hover:bg-slate-800"}`
          }>
            <Icon size={19} /> {name}
          </NavLink>
        ))}
      </nav>

      <button onClick={() => { logout(); navigate("/login"); }}
        className="flex items-center gap-3 mt-10 p-3 w-full hover:bg-slate-800 rounded-lg">
        <LogOut size={19} /> Logout
      </button>
    </aside>
  );
}

export default Sidebar;
