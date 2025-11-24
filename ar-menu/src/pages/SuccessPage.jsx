// frontend/src/pages/SuccessPage.jsx
import { useNavigate } from 'react-router-dom';

function SuccessPage() {
  const navigate = useNavigate();

  return (
    <section className="py-8 space-y-4">
      <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-6">
        <h2 className="text-2xl font-semibold text-emerald-400">
          Order Confirmed 🎉
        </h2>
        <p className="mt-2 text-sm text-slate-200">
          Your order has been placed. The staff will start preparing it
          shortly.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => navigate('/menu')}
          className="px-4 py-2.5 rounded-full text-sm font-medium bg-slate-800 text-slate-100 hover:bg-slate-700"
        >
          Continue Browsing
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2.5 rounded-full text-sm font-medium bg-slate-100 text-slate-950 hover:bg-white"
        >
          Back to Home
        </button>
      </div>
    </section>
  );
}

export default SuccessPage;
