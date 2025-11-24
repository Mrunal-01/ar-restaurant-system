// api/middleware/auth.js
const { supabase } = require("../lib/supabaseClient");

async function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization;

    if (!auth) {
      return res.status(401).json({ success: false, error: { message: "Missing token" } });
    }

    const token = auth.split(" ")[1];

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ success: false, error: { message: "Invalid token" } });
    }

    req.user = data.user;
    next();
  } catch (err) {
    return res.status(500).json({ success: false, error: { message: "Server error" } });
  }
}

function requireRole(...allowed) {
  return (req, res, next) => {
    const role = req.user.user_metadata.role;

    if (!allowed.includes(role)) {
      return res.status(403).json({ success: false, error: { message: "Forbidden" } });
    }

    next();
  };
}

module.exports = { requireAuth, requireRole };
