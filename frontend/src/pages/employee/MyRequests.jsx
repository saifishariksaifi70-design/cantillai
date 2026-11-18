
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getMyRequests } from "../../services/requestService";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

function MyRequests() {
  const { token } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyRequests(token)
      .then(({ data }) => setRequests(data.requests))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const statusStyle = {
    submitted: "bg-blue-100 text-blue-700",
    needs_info: "bg-yellow-100 text-yellow-700",
    po_created: "bg-green-100 text-green-700",
    sourcing_started: "bg-purple-100 text-purple-700",
    needs_approval: "bg-orange-100 text-orange-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-8">
          <h1 className="text-2xl font-bold text-slate-800">My Requests</h1>
          <p className="text-slate-500 mt-1">Track your purchase requests.</p>

          <div className="mt-6 bg-white rounded-xl border overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  {["Item", "Quantity", "Unit Price", "Purpose", "Status", "Date"].map((heading) => (
                    <th key={heading} className="p-4">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="p-8 text-center">Loading requests...</td></tr>
                ) : requests.length ? (
                  requests.map((item) => (
                    <tr key={item._id} className="border-t hover:bg-slate-50">
                      <td className="p-4 font-medium">{item.itemName}</td>
                      <td className="p-4">{item.quantity}</td>
                      <td className="p-4">₹{item.unitPrice}</td>
                      <td className="p-4">{item.purpose || "-"}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle[item.status] || "bg-slate-100 text-slate-600"}`}>
                          {item.status.replaceAll("_", " ")}
                        </span>
                      </td>
                      <td className="p-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="p-8 text-center text-slate-500">No requests found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default MyRequests;
