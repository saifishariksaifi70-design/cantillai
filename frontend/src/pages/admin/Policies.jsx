
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  getPolicies,
  createPolicy,
  publishPolicy,
} from "../../services/policyService";
import AdminSidebar from "../../components/AdminSidebar";
import Navbar from "../../components/Navbar";
import toast from "react-hot-toast";
import { Plus, Upload } from "lucide-react";

function Policies() {
  const { token } = useContext(AuthContext);

  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    autoPOUnder: "",
    sourcingAtOrAbove: "",
  });

  const fetchPolicies = () => {
    getPolicies(token)
      .then(({ data }) => setPolicies(data.policies || []))
      .catch((error) =>
        toast.error(error.response?.data?.message || "Could not load policies")
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) fetchPolicies();
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();

    const autoPOUnder = Number(form.autoPOUnder);
    const sourcingAtOrAbove = Number(form.sourcingAtOrAbove);

    if (
      !form.title.trim() ||
      form.autoPOUnder === "" ||
      form.sourcingAtOrAbove === ""
    ) {
      return toast.error("Please fill all fields");
    }

    if (
      !Number.isFinite(autoPOUnder) ||
      !Number.isFinite(sourcingAtOrAbove) ||
      autoPOUnder < 0 ||
      sourcingAtOrAbove < 0
    ) {
      return toast.error("Enter valid threshold amounts");
    }

    if (autoPOUnder > sourcingAtOrAbove) {
      return toast.error("Auto-PO threshold cannot exceed sourcing threshold");
    }

    try {
      setSaving(true);

      await createPolicy(
        {
          title: form.title,
          rules: { autoPOUnder, sourcingAtOrAbove },
        },
        token
      );

      toast.success("Policy created successfully");
      setForm({ title: "", autoPOUnder: "", sourcingAtOrAbove: "" });
      setShowForm(false);
      fetchPolicies();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not create policy");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async (id) => {
    try {
      await publishPolicy(id, token);
      toast.success("Policy published successfully");
      fetchPolicies();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not publish policy");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="flex-1 min-w-0">
        <Navbar />

        <main className="p-8">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Procurement Policies
              </h1>
              <p className="text-slate-500 mt-1">
                Create and manage procurement rules.
              </p>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700"
            >
              <Plus size={18} />
              Create Policy
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={handleCreate}
              className="bg-white border rounded-xl p-6 mt-8 shadow-sm"
            >
              <h2 className="text-lg font-semibold mb-5">
                Create New Policy
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Policy Title
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="Enter policy title"
                    className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Auto PO Under (INR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.autoPOUnder}
                    onChange={(e) =>
                      setForm({ ...form, autoPOUnder: e.target.value })
                    }
                    placeholder="Example: 5000"
                    className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Sourcing At Or Above (INR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.sourcingAtOrAbove}
                    onChange={(e) =>
                      setForm({ ...form, sourcingAtOrAbove: e.target.value })
                    }
                    placeholder="Example: 50000"
                    className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Creating..." : "Save Policy"}
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
            {loading ? (
              <p>Loading policies...</p>
            ) : policies.length === 0 ? (
              <p className="text-slate-500">No policies found.</p>
            ) : (
              policies.map((policy) => (
                <div
                  key={policy._id}
                  className="bg-white border rounded-xl p-6 shadow-sm"
                >
                  <div className="flex justify-between items-center gap-3">
                    <span className="text-sm font-medium text-blue-600">
                      Version {policy.version}
                    </span>

                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        policy.status === "active"
                          ? "bg-green-100 text-green-700"
                          : policy.status === "archived"
                          ? "bg-slate-200 text-slate-600"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {policy.status}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-800 mt-4">
                    {policy.title}
                  </h2>

                  <div className="mt-5 space-y-3 text-sm text-slate-600">
                    <p>
                      Auto PO Under:{" "}
                      <strong>₹{policy.rules?.autoPOUnder ?? "-"}</strong>
                    </p>

                    <p>
                      Sourcing At Or Above:{" "}
                      <strong>
                        ₹{policy.rules?.sourcingAtOrAbove ?? "-"}
                      </strong>
                    </p>
                  </div>

                  {policy.status !== "active" && (
                    <button
                      onClick={() => handlePublish(policy._id)}
                      className="flex items-center justify-center gap-2 w-full mt-6 bg-slate-900 text-white py-3 rounded-lg hover:bg-slate-700"
                    >
                      <Upload size={17} />
                      Publish Policy
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Policies;
