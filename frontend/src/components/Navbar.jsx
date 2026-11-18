
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user } = useContext(AuthContext);

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-8">
      <h2 className="font-semibold text-slate-800">Dashboard</h2>
      <div className="text-sm text-slate-600">
        Welcome, <span className="font-semibold">{user?.name}</span>
      </div>
    </header>
  );
}

export default Navbar;
