// frontend/src/components/DishCard.jsx
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

function DishCard({ dish }) {
  const navigate = useNavigate();
  const { addItem } = useCart();

  const handleViewDetails = () => {
    navigate(`/dish/${dish.id}`);
  };

  const handleViewAR = () => {
    const url = `/ar/${dish.id}?modelUrl=${encodeURIComponent(dish.model_url)}`;
    navigate(url);
  };

  const handleAddToCart = () => {
    addItem(
      {
        id: dish.id,
        name: dish.name,
        price: dish.price,
        image_url: dish.image_url,
        model_url: dish.model_url,
        description: dish.description,
        category: dish.category,
      },
      1
    );
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 shadow-sm shadow-slate-900/40 overflow-hidden flex flex-col">
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={dish.image_url}
          alt={dish.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex-1 p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-sm sm:text-base">
              {dish.name}
            </h3>
            <p className="text-xs text-slate-400">{dish.category}</p>
          </div>
          <div className="text-sm font-semibold text-emerald-400">
            ₹{dish.price}
          </div>
        </div>

        <p className="text-xs text-slate-300 line-clamp-2">
          {dish.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={handleViewDetails}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-800 text-slate-100 hover:bg-slate-700 transition-colors"
          >
            Details
          </button>

          <button
            onClick={handleViewAR}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors"
          >
            View in AR
          </button>

          <button
            onClick={handleAddToCart}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-950 hover:bg-white transition-colors ml-auto"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default DishCard;
