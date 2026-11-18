
import { useContext, useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import Navbar from "../../components/Navbar";
import { AuthContext } from "../../context/AuthContext";
import { getAdminDecisions } from "../../services/requestService";

function Decisions() {
  const { token } = useContext(AuthContext);
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDecisions(token)
      .then((res) => setDecisions(res.data.decisions || []))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-6">
            Procurement Decisions
          </h1>

          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="w-full text-left">
              <thead className="bg-slate-200 text-slate-700">
                <tr>
                  <th className="p-4">Item</th>
                  <th className="p-4">Policy</th>
                  <th className="p-4">Outcome</th>
                  <th className="p-4">Approval Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="p-6 text-center">
                      Loading decisions...
                    </td>
                  </tr>
                ) : decisions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-6 text-center">
                      No decisions found.
                    </td>
                  </tr>
                ) : (
                  decisions.map((decision) => (
                    <tr key={decision._id} className="border-t">
                      <td className="p-4">
                        {decision.request?.itemName || "N/A"}
                      </td>
                      <td className="p-4">
                        {decision.policy?.title || "N/A"}
                      </td>
                      <td className="p-4">
                        {decision.outcome || "N/A"}
                      </td>
                      <td className="p-4">
                        {decision.approvalStatus || "N/A"}
                      </td>
                      <td className="p-4">
                        {decision.createdAt
                          ? new Date(decision.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Decisions;
