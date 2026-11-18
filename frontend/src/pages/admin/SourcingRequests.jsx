
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getAdminSourcing } from "../../services/requestService";
import AdminSidebar from "../../components/AdminSidebar";
import Navbar from "../../components/Navbar";
import { Truck } from "lucide-react";

function SourcingRequests() {
  const { token } = useContext(AuthContext);
  const [sourcing, setSourcing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    getAdminSourcing(token)
      .then(({ data }) => setSourcing(data.sourcing || []))
      .catch((error) =>
        console.log("Sourcing Error:", error.response?.data || error.message)
      )
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="flex-1 min-w-0">
        <Navbar />

        <main className="p-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
              <Truck size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Sourcing Requests
              </h1>
              <p className="text-slate-500">
                Manage all procurement sourcing requests.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm mt-8 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-600 text-sm">
                <tr>
                  <th className="p-4">Item</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Purpose</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="p-6 text-center">
                      Loading sourcing requests...
                    </td>
                  </tr>
                ) : sourcing.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-slate-500">
                      No sourcing requests found.
                    </td>
                  </tr>
                ) : (
                  sourcing.map((item) => (
                    <tr key={item._id} className="border-t text-sm">
                      <td className="p-4 font-medium">
                        {item.request?.itemName || "-"}
                      </td>

                      <td className="p-4">
                        {item.request?.quantity || "-"}
                      </td>

                      <td className="p-4">
                        {item.request?.purpose || "-"}
                      </td>

                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs">
                          {item.status || "Sourcing"}
                        </span>
                      </td>

                      <td className="p-4 text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default SourcingRequests;
