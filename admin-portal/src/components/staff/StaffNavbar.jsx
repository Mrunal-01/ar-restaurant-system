// frontend/src/components/staff/StaffNavbar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../services/auth";

function StaffNavbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("sb_role"); // "staff" or "owner"
  const isOwner = role === "owner";

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("sb_token");
    localStorage.removeItem("sb_role");
    navigate("/staff/login");
  };

  const base =
    "px-3 py-1.5 rounded-full text-sm font-medium transition-colors";
  const inactive = "text-slate-300 hover:text-white hover:bg-slate-800";
  const active = "bg-slate-100 text-slate-900";

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <h1 className="text-lg font-semibold text-white">Staff Dashboard</h1>

        <nav className="flex items-center gap-2">
          <NavLink
            to="/staff/orders"
            className={({ isActive }) =>
              `${base} ${isActive ? active : inactive}`
            }
          >
            Orders
          </NavLink>

          {/* 🔒 Owner-only links */}
          {isOwner && (
            <>

          <NavLink
            to="/staff/dishes"
            className={({ isActive }) =>
              `${base} ${isActive ? active : inactive}`
            }
          >
            Dishes
          </NavLink>

          <NavLink
            to="/staff/dishes/new"
            className={({ isActive }) =>
              `${base} ${isActive ? active : inactive}`
            }
          >
            Add Dish
          </NavLink>
            </>
            )}
          <button
            onClick={logout}
            className="ml-3 px-3 py-1.5 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-400"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}

export default StaffNavbar;
