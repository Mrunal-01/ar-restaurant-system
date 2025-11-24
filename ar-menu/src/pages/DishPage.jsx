import { useParams, useNavigate } from 'react-router-dom';
import { apiGetDish } from '../services/api';
import { useEffect, useState } from 'react';
import { useCart } from '../contexts/CartContext';

function DishPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await apiGetDish(id);
        setDish(data);
      } catch (err) {
        console.error('DishPage error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <p className="py-8">Loading dish...</p>;
  if (error) return <p className="py-8 text-red-400">{error}</p>;
  if (!dish) return null;

  const handleAdd = () => addItem(dish, 1);
  const handleAR = () =>
    navigate(`/ar/${dish.id}?modelUrl=${encodeURIComponent(dish.model_url)}`);

  return (
    <section className="py-8 grid gap-6 sm:grid-cols-2">
      <img
        src={dish.image_url}
        alt={dish.name}
        className="w-full h-64 object-cover rounded-xl"
      />

      <div className="space-y-3">
        <h2 className="text-2xl font-semibold">{dish.name}</h2>
        <p className="text-slate-300">{dish.description}</p>
        <p className="text-xl text-emerald-400 font-semibold">
          ₹{dish.price}
        </p>

        <div className="flex gap-3 pt-3">
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-slate-200 text-slate-900 rounded-full"
          >
            Add to Cart
          </button>

          <button
            onClick={handleAR}
            className="px-4 py-2 bg-emerald-500 text-slate-900 rounded-full"
          >
            View in AR
          </button>
        </div>
      </div>
    </section>
  );
}

export default DishPage;
