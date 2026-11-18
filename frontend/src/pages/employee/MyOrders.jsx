
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getMyOrders } from "../../services/requestService";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

function MyOrders() {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders(token)
      .then(({ data }) => setOrders(data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-8">
          <h1 className="text-2xl font-bold text-slate-800">My Orders</h1>
          <p className="text-slate-500 mt-1">View your purchase orders.</p>

          <div className="mt-6 bg-white rounded-xl border overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  {["PO Number", "Item", "Quantity", "Total Amount", "Status", "Date"].map((heading) => (
                    <th key={heading} className="p-4">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="p-8 text-center">Loading orders...</td></tr>
                ) : orders.length ? (
                  orders.map((order) => (
                    <tr key={order._id} className="border-t hover:bg-slate-50">
                      <td className="p-4 font-medium">{order.poNumber}</td>
                      <td className="p-4">{order.request?.itemName || "-"}</td>
                      <td className="p-4">{order.request?.quantity || "-"}</td>
                      <td className="p-4">₹{order.totalAmount}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          {order.status.replaceAll("_", " ")}
                        </span>
                      </td>
                      <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="p-8 text-center text-slate-500">No orders found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default MyOrders;
