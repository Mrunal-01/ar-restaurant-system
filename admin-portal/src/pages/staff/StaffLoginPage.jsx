// frontend/src/pages/staff/StaffLoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/auth";

function StaffLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
      setError(error.message);
      return;
    }
  
    const user = data.user;
    const role = user?.user_metadata?.role;
  
    if (role !== "staff" && role !== "owner") {
      setError("You are not authorized.");
      return;
    }
  
    // 🔑 save token for API auth
    const token = data.session?.access_token;
    if (token) {
      localStorage.setItem("sb_token", token);
    }
  
    // 🔑 save role for UI
    if (role) {
      localStorage.setItem("sb_role", role);
    }
  
    // Go to staff orders by default
    navigate("/staff/orders");
  };


  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Staff Login</h2>
      {error && <p className="text-red-400">{error}</p>}

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="border px-2 py-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border px-2 py-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-emerald-500 px-4 py-2 rounded text-black">
          Login
        </button>
      </form>
    </div>
  );
}

export default StaffLoginPage;
