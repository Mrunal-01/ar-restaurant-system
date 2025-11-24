// frontend/src/pages/staff/StaffDishesPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGetDishes, apiDeleteDish } from "../../services/api";
import StaffNavbar from "../../components/staff/StaffNavbar";

function StaffDishesPage() {
  const [dishes, setDishes] = useState([]);

  async function load() {
    try {
      const data = await apiGetDishes();
      setDishes(data);
    } catch (err) {
      console.error("Failed to load dishes:", err);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this dish?")) return;
    try {
      await apiDeleteDish(id);
      load();
    } catch (err) {
      console.error("Failed to delete dish:", err);
    }
  };

  return (
    <>
      <StaffNavbar />

      <section className="py-8 max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Manage Dishes</h1>
          <Link
            to="/staff/dishes/new"
            className="px-3 py-1.5 rounded-full bg-emerald-500 text-slate-900 text-sm font-medium"
          >
            + Add Dish
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {dishes.map((dish) => (
            <div
              key={dish.id}
              className="rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden"
            >
              <img
                src={dish.image_url}
                alt={dish.name}
                className="h-40 w-full object-cover"
              />
              <div className="p-3 space-y-1">
                <h3 className="font-semibold">{dish.name}</h3>
                <p className="text-xs text-slate-400">{dish.category}</p>
                <p className="text-sm text-emerald-400 font-semibold">
                  ₹{dish.price}
                </p>

                <div className="mt-3 flex gap-2">
                  <Link
                    to={`/staff/dishes/edit/${dish.id}`}
                    className="px-3 py-1 rounded-full bg-blue-500 text-white text-xs"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(dish.id)}
                    className="px-3 py-1 rounded-full bg-red-500 text-white text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default StaffDishesPage;
