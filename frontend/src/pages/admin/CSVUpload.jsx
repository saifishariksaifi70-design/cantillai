
import { useContext, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import Navbar from "../../components/Navbar";
import { AuthContext } from "../../context/AuthContext";
import { uploadCSV } from "../../services/csvService";
import toast from "react-hot-toast";
import { Upload, FileSpreadsheet } from "lucide-react";

function CSVUpload() {
  const { token } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setResults(null);

      const res = await uploadCSV(formData, token);
      setResults(res.data);
      toast.success("CSV uploaded successfully");
      setFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "CSV upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-6">
            CSV Upload
          </h1>

          <div className="max-w-2xl bg-white p-8 rounded-xl shadow">
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center">
              <FileSpreadsheet
                size={48}
                className="mx-auto text-green-600 mb-4"
              />

              <h2 className="text-lg font-semibold mb-2">
                Upload Purchase Requests CSV
              </h2>

              <p className="text-sm text-slate-500 mb-5">
                Select your CSV file to process purchase requests.
              </p>

              <input
                type="file"
                accept=".csv,text/csv"
                onChange={(e) => setFile(e.target.files[0] || null)}
                className="block w-full text-sm"
              />

              {file && (
                <p className="text-sm text-blue-600 mt-3">
                  Selected: {file.name}
                </p>
              )}

              <button
                onClick={handleUpload}
                disabled={loading}
                className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
              >
                <Upload size={18} />
                {loading ? "Uploading..." : "Upload CSV"}
              </button>
            </div>
          </div>

          {results && (
            <div className="max-w-4xl bg-white rounded-xl shadow mt-6 p-6">
              <h2 className="text-xl font-bold mb-4">
                Upload Results
              </h2>

              <div className="flex gap-8 mb-5">
                <p>Total Rows: <b>{results.totalRows}</b></p>
                <p>Processed: <b>{results.processed}</b></p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-3">Item</th>
                      <th className="p-3">Outcome</th>
                      <th className="p-3">Reason</th>
                    </tr>
                  </thead>

                  <tbody>
                    {results.results?.map((item) => (
                      <tr key={item.requestId} className="border-t">
                        <td className="p-3">{item.itemName}</td>
                        <td className="p-3">{item.outcome}</td>
                        <td className="p-3">
                          {item.reasons?.join(", ") || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CSVUpload;
