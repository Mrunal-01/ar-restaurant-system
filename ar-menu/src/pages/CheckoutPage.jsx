// frontend/src/pages/CheckoutPage.jsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { apiCreateOrder } from '../services/api';

function CheckoutPage() {
  const { cartItems, getTotal, clearCart, tableNumber } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = getTotal();

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return <p className="py-8">Your cart is empty.</p>;
  }

  const placeOrder = async () => {
    setLoading(true);
    setError('');

    try {
      const order = {
        tableNumber: tableNumber || null,
        items: cartItems.map((i) => ({
          dishId: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
      };

      await apiCreateOrder(order);

      clearCart();
      navigate('/success');
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-8 space-y-4">
      <h2 className="text-xl font-semibold">Checkout</h2>

      {error && <p className="text-red-400">{error}</p>}

      <div className="rounded-xl border border-slate-800 p-4 space-y-3">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex justify-between text-slate-200"
          >
            <div>
              {item.name} × {item.quantity}
            </div>
            <div>₹{item.price * item.quantity}</div>
          </div>
        ))}

        <div className="flex justify-between border-t border-slate-600 pt-2 font-semibold">
          <span>Total</span>
          <span className="text-emerald-400">₹{total}</span>
        </div>
      </div>

      <button
        disabled={loading}
        onClick={placeOrder}
        className="px-4 py-2 bg-emerald-500 text-slate-900 rounded-full"
      >
        {loading ? 'Placing order…' : 'Place Order'}
      </button>
    </section>
  );
}

export default CheckoutPage;
