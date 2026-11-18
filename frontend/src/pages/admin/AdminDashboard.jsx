
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getAdminDashboard } from "../../services/requestService";
import AdminSidebar from "../../components/AdminSidebar";
import Navbar from "../../components/Navbar";

import {
  FileText,
  ShoppingBag,
  Truck,
  ClipboardCheck,
} from "lucide-react";

function AdminDashboard() {
  const { token } = useContext(AuthContext);

  const [stats, setStats] = useState({
    total: 0,
    orders: 0,
    sourcing: 0,
    pending: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    getAdminDashboard(token)
      .then(({ data }) => {
        setStats(data);
      })
      .catch((error) => {
        console.log(
          "Dashboard Error:",
          error.response?.data || error.message
        );
      })
      .finally(() => setLoading(false));
  }, [token]);

  const cards = [
    {
      title: "Total Requests",
      value: stats.total,
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Purchase Orders",
      value: stats.orders,
      icon: ShoppingBag,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Sourcing Requests",
      value: stats.sourcing,
      icon: Truck,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Pending Approvals",
      value: stats.pending,
      icon: ClipboardCheck,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="flex-1 min-w-0">
        <Navbar />

        <main className="p-8">
          <h1 className="text-2xl font-bold text-slate-800">
            Admin Dashboard
          </h1>

          <p className="text-slate-500 mt-1">
            Manage your procurement activities.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
            {cards.map(({ title, value, icon: Icon, color }) => (
              <div
                key={title}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-slate-500">
                    {title}
                  </p>

                  <div className={`p-3 rounded-lg ${color}`}>
                    <Icon size={22} />
                  </div>
                </div>

                <h2 className="text-3xl font-bold mt-5 text-slate-800">
                  {loading ? "..." : value ?? 0}
                </h2>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 mt-8">
            <h2 className="text-lg font-semibold text-slate-800">
              Welcome to Admin Panel
            </h2>

            <p className="text-slate-500 mt-2">
              Manage employee requests, purchase orders, approvals and sourcing activities from here.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
