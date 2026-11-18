
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  getAllRequests,
  approveRequest,
  rejectRequest,
} from "../../services/requestService";
import AdminSidebar from "../../components/AdminSidebar";
import Navbar from "../../components/Navbar";
import toast from "react-hot-toast";
import { CheckCircle, XCircle } from "lucide-react";

function Approvals() {
  const { token } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = () => {
    getAllRequests(token)
      .then(({ data }) => {
        setRequests(
          (data.requests || []).filter(
            (item) => item.status === "needs_approval"
          )
        );
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Could not load approvals");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) fetchRequests();
  }, [token]);

  const handleApprove = async (id) => {
    try {
      await approveRequest(id, token);
      toast.success("Request approved successfully");
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Approval failed");
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Enter rejection reason:");

    if (!reason?.trim()) return;

    try {
      await rejectRequest(id, reason, token);
      toast.success("Request rejected successfully");
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Rejection failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="flex-1 min-w-0">
        <Navbar />

        <main className="p-8">
          <h1 className="text-2xl font-bold text-slate-800">
            Pending Approvals
          </h1>

          <p className="text-slate-500 mt-1">
            Review and manage purchase requests.
          </p>

          <div className="bg-white rounded-xl border shadow-sm mt-8 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-600 text-sm">
                <tr>
                  <th className="p-4">Item</th>
                  <th className="p-4">Employee</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Purpose</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-6 text-center">
                      Loading approvals...
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-slate-500">
                      No pending approvals found.
                    </td>
                  </tr>
                ) : (
                  requests.map((request) => (
                    <tr key={request._id} className="border-t text-sm">
                      <td className="p-4 font-medium">
                        {request.itemName}
                      </td>

                      <td className="p-4">
                        {request.employee?.name || "Unknown"}
                      </td>

                      <td className="p-4">{request.quantity}</td>

                      <td className="p-4">
                        {request.currency || "INR"}{" "}
                        {request.quantity * request.unitPrice}
                      </td>

                      <td className="p-4">{request.purpose || "-"}</td>

                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(request._id)}
                            className="flex items-center gap-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
                          >
                            <CheckCircle size={16} />
                            Approve
                          </button>

                          <button
                            onClick={() => handleReject(request._id)}
                            className="flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700"
                          >
                            <XCircle size={16} />
                            Reject
                          </button>
                        </div>
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

export default Approvals;
