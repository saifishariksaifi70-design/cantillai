
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getAdminOrders } from "../../services/requestService";
import AdminSidebar from "../../components/AdminSidebar";
import Navbar from "../../components/Navbar";

function PurchaseOrders() {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    getAdminOrders(token)
      .then(({ data }) => setOrders(data.orders || []))
      .catch((error) =>
        console.log("Orders Error:", error.response?.data || error.message)
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
            Purchase Orders
          </h1>

          <p className="text-slate-500 mt-1">
            View and manage all purchase orders.
          </p>

          <div className="bg-white rounded-xl border shadow-sm mt-8 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-600 text-sm">
                <tr>
                  <th className="p-4">PO Number</th>
                  <th className="p-4">Item</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-6 text-center">
                      Loading orders...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-slate-500">
                      No purchase orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="border-t text-sm">
                      <td className="p-4 font-medium text-blue-600">
                        {order.poNumber}
                      </td>

                      <td className="p-4">
                        {order.request?.itemName || "-"}
                      </td>

                      <td className="p-4">
                        {order.request?.quantity || "-"}
                      </td>

                      <td className="p-4 font-medium">
                        {order.request?.currency || "INR"}{" "}
                        {order.totalAmount}
                      </td>

                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                          {order.status}
                        </span>
                      </td>

                      <td className="p-4 text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString()}
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

export default PurchaseOrders;
