
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import toast from "react-hot-toast";

function Login() {
  const { setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await loginUser(formData);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      toast.success("Login successful!");
      navigate(data.user.role === "admin" ? "/admin/dashboard" : "/employee/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 space-y-6">
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Cantill<span className="text-blue-600">.ai</span></h1>
          <h2 className="text-2xl font-semibold text-slate-800">Welcome Back</h2>
          <p className="text-slate-500 text-sm">Sign in to your account to continue</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Email Address</label>
          <input type="email" placeholder="Enter your email" required
            className="w-full p-3.5 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Password</label>
          <input type="password" placeholder="Enter your password" required
            className="w-full p-3.5 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-lg disabled:opacity-60">
          {loading ? "Logging in..." : "Sign In"}
        </button>

        <p className="text-center text-sm text-slate-500">
          Don't have an account? <Link to="/register" className="text-blue-600 font-semibold">Create account</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
