// frontend/src/components/staff/StaffOrderCard.jsx
import { useState } from "react";
import { apiUpdateOrderStatus } from "../../services/api";

function StaffOrderCard({ order }) {
  const [updating, setUpdating] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const changeStatus = async (status) => {
    try {
      setUpdating(true);
      await apiUpdateOrderStatus(order.id, status);
      // UI will refresh automatically via polling in StaffOrdersPage
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(false);
    }
  };

  const created =
    order.created_at && new Date(order.created_at).toLocaleString();

  return (
    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-lg">
            Table #{order.table_number || "N/A"}
          </p>
          <p className="text-xs text-slate-400">
            Status: <span className="text-slate-100">{order.status}</span>
          </p>
          {created && (
            <p className="text-xs text-slate-500">Created: {created}</p>
          )}
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-xs px-3 py-1 rounded-full border border-slate-600 text-slate-100 hover:bg-slate-800"
        >
          {expanded ? "Hide details" : "View details"}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 space-y-2 text-sm text-slate-100">
          <div>
            <p className="font-semibold mb-1">Items:</p>
            <ul className="list-disc list-inside space-y-1">
              {order.items?.map((item, idx) => (
                <li key={idx}>
                  {item.name} × {item.quantity} — ₹
                  {Number(item.price || 0) * Number(item.quantity || 0)}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-slate-300">
            Total:{" "}
            <span className="font-semibold text-emerald-400">
              ₹{order.total_amount}
            </span>
          </p>

          {order.note && (
            <p className="text-xs text-slate-400">Note: {order.note}</p>
          )}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          disabled={updating}
          onClick={() => changeStatus("preparing")}
          className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs hover:bg-blue-500 disabled:opacity-50"
        >
          Preparing
        </button>
        <button
          disabled={updating}
          onClick={() => changeStatus("ready")}
          className="px-3 py-1 rounded-full bg-yellow-400 text-slate-900 text-xs hover:bg-yellow-300 disabled:opacity-50"
        >
          Ready
        </button>
        <button
          disabled={updating}
          onClick={() => changeStatus("completed")}
          className="px-3 py-1 rounded-full bg-emerald-500 text-slate-900 text-xs hover:bg-emerald-400 disabled:opacity-50"
        >
          Completed
        </button>
      </div>
    </div>
  );
}

export default StaffOrderCard;
