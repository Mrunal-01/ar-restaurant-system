// frontend/src/pages/staff/StaffOrdersPage.jsx
import { useEffect, useState } from "react";
import { apiGetOrders } from "../../services/api";
import StaffOrderCard from "../../components/staff/StaffOrderCard";
import StaffNavbar from "../../components/staff/StaffNavbar";

function StaffOrdersPage() {
  const [orders, setOrders] = useState([]);

  async function load() {
    try {
      const data = await apiGetOrders();
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders:", err);
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 3000); // simple polling
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <StaffNavbar />

      <section className="py-8 max-w-5xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-4">Incoming Orders</h1>

        {orders.length === 0 && (
          <p className="text-slate-400">No orders yet.</p>
        )}

        <div className="space-y-4">
          {orders.map((order) => (
            <StaffOrderCard key={order.id} order={order} />
          ))}
        </div>
      </section>
    </>
  );
}

export default StaffOrdersPage;
