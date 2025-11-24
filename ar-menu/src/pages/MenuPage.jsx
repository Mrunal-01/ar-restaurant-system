import { useEffect, useState } from 'react';
import DishCard from '../components/DishCard';
import { apiGetDishes } from '../services/api';

function MenuPage() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await apiGetDishes();
        setDishes(data);
      } catch (err) {
        console.error('MenuPage error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p className="py-8">Loading menu...</p>;
  if (error) return <p className="py-8 text-red-400">Error: {error}</p>;

  return (
    <section className="py-8">
      <h2 className="text-2xl font-semibold mb-4">Menu</h2>

      {dishes.length === 0 && (
        <p className="text-slate-400">No dishes found.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {dishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </div>
    </section>
  );
}

export default MenuPage;
