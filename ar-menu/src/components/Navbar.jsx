// frontend/src/components/Navbar.jsx
import { NavLink } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

function Navbar() {
  const { cartCount, tableNumber } = useCart();

  const linkBaseClasses =
    'px-3 py-1.5 rounded-full text-sm font-medium transition-colors';
  const inactiveClasses = 'text-slate-300 hover:text-white hover:bg-slate-800';
  const activeClasses = 'bg-slate-100 text-slate-900';

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm">
            AR
          </span>
          <span className="font-semibold text-sm sm:text-base">
            AR Restaurant Menu
          </span>
        </NavLink>

        <nav className="flex items-center gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkBaseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/menu"
            className={({ isActive }) =>
              `${linkBaseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            Menu
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `${linkBaseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            Cart
            {cartCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs rounded-full bg-emerald-500 text-slate-950">
                {cartCount}
              </span>
            )}
          </NavLink>
        </nav>

        <div className="hidden sm:flex text-xs text-slate-400">
          Table:{' '}
          <span className="ml-1 font-semibold text-slate-200">
            {tableNumber || 'N/A'}
          </span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
