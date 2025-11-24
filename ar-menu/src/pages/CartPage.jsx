// frontend/src/pages/CartPage.jsx
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

function CartPage() {
  const { cartItems, removeItem, updateQty, getTotal } = useCart();
  const navigate = useNavigate();

  const total = getTotal();

  if (cartItems.length === 0) {
    return (
      <section className="py-8">
        <p className="text-slate-300">Your cart is empty.</p>
        <button
          onClick={() => navigate('/menu')}
          className="mt-4 px-4 py-2.5 rounded-full text-sm font-medium bg-slate-800 text-slate-100 hover:bg-slate-700"
        >
          Browse Menu
        </button>
      </section>
    );
  }

  return (
    <section className="py-8 space-y-4">
      <h2 className="text-2xl font-semibold">Your Cart</h2>

      <div className="space-y-3">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3"
          >
            <div className="h-16 w-20 overflow-hidden rounded-lg bg-slate-800">
              <img
                src={item.imageurl}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-semibold">{item.name}</h3>
                  <p className="text-xs text-slate-400">
                    ₹{item.price} each
                  </p>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-xs text-slate-400 hover:text-red-400"
                >
                  Remove
                </button>
              </div>

              <div className="mt-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Qty:</span>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQty(item.id, e.target.value)}
                    className="w-16 rounded-lg bg-slate-950 border border-slate-700 px-2 py-1 text-xs"
                  />
                </div>
                <div className="text-sm font-semibold text-emerald-400">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <div className="text-sm text-slate-300">
          Total:{' '}
          <span className="font-semibold text-emerald-400">₹{total}</span>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="px-4 py-2.5 rounded-full text-sm font-medium bg-emerald-500 text-slate-950 hover:bg-emerald-400"
        >
          Proceed to Checkout
        </button>
      </div>
    </section>
  );
}

export default CartPage;
