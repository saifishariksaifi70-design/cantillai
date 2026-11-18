
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getAllRequests } from "../../services/requestService";
import AdminSidebar from "../../components/AdminSidebar";
import Navbar from "../../components/Navbar";

function AllRequests() {
  const { token } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    getAllRequests(token)
      .then(({ data }) => setRequests(data.requests || []))
      .catch((error) =>
        console.log("Requests Error:", error.response?.data || error.message)
      )
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="flex-1 min-w-0">
        <Navbar />

        <main className="p-8">
          <h1 className="text-2xl font-bold text-slate-800">
            All Requests
          </h1>

          <p className="text-slate-500 mt-1">
            Manage all employee purchase requests.
          </p>

          <div className="bg-white rounded-xl border shadow-sm mt-8 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-600 text-sm">
                <tr>
                  <th className="p-4">Employee</th>
                  <th className="p-4">Item</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Unit Price</th>
                  <th className="p-4">Purpose</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-6 text-center">
                      Loading requests...
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-6 text-center text-slate-500">
                      No requests found.
                    </td>
                  </tr>
                ) : (
                  requests.map((request) => (
                    <tr key={request._id} className="border-t text-sm">
                      <td className="p-4">
                        <p className="font-medium">
                          {request.employee?.name || "Unknown"}
                        </p>
                        <p className="text-slate-400">
                          {request.employee?.email || "-"}
                        </p>
                      </td>

                      <td className="p-4 font-medium">
                        {request.itemName}
                      </td>

                      <td className="p-4">{request.quantity}</td>

                      <td className="p-4">
                        {request.currency || "INR"} {request.unitPrice}
                      </td>

                      <td className="p-4">{request.purpose || "-"}</td>

                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                          {request.status?.replaceAll("_", " ")}
                        </span>
                      </td>

                      <td className="p-4 text-slate-500">
                        {new Date(request.createdAt).toLocaleDateString()}
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

export default AllRequests;
