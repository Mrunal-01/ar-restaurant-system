// frontend/src/pages/HomePage.jsx
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

function HomePage() {
  const navigate = useNavigate();
  const { tableNumber } = useCart();

  const handleStartOrder = () => {
    navigate('/menu' + (tableNumber ? `?table=${tableNumber}` : ''));
  };

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Welcome to the{' '}
          <span className="text-emerald-400">AR Restaurant Menu</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Scan a QR code at your table to open this page with a{' '}
          <code className="px-1.5 py-0.5 rounded bg-slate-900/80 text-xs">
            ?table=5
          </code>{' '}
          parameter. We automatically attach your table number to your order.
        </p>

        <div className="text-sm text-slate-400">
          Current table:{' '}
          <span className="font-semibold text-slate-100">
            {tableNumber || 'Not set (no ?table= in URL)'}
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleStartOrder}
            className="px-4 py-2.5 rounded-full text-sm font-medium bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors"
          >
            View Menu
          </button>
          <button
            onClick={() => navigate('/cart')}
            className="px-4 py-2.5 rounded-full text-sm font-medium bg-slate-800 text-slate-100 hover:bg-slate-700 transition-colors"
          >
            Go to Cart
          </button>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
