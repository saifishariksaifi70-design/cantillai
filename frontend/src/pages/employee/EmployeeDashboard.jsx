
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

function EmployeeDashboard() {
  const stats = [
    { title: "Total Requests", value: 0 },
    { title: "Pending Requests", value: 0 },
    { title: "Approved Requests", value: 0 },
    { title: "Rejected Requests", value: 0 },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="p-8">
          <h1 className="text-2xl font-bold text-slate-800">Employee Dashboard</h1>
          <p className="text-slate-500 mt-2">Welcome to your procurement workspace.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {stats.map((item) => (
              <div key={item.title} className="bg-white p-6 rounded-xl border shadow-sm">
                <p className="text-sm text-slate-500">{item.title}</p>
                <h2 className="text-3xl font-bold mt-3">{item.value}</h2>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
