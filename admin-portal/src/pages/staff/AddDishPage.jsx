// frontend/src/pages/staff/AddDishPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StaffNavbar from "../../components/staff/StaffNavbar";
import {
  apiCreateDish,
  apiUploadImage,
  apiUploadModel,
} from "../../services/api";

function AddDishPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
    modelUrl: "",
    isAvailable: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [modelFile, setModelFile] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      let imageUrl = form.imageUrl;
      let modelUrl = form.modelUrl;

      // If files chosen, upload them to Supabase
      if (imageFile) {
        const imgRes = await apiUploadImage(imageFile);
        imageUrl = imgRes.url || imgRes.publicUrl || imageUrl;
      }

      if (modelFile) {
        const modelRes = await apiUploadModel(modelFile);
        modelUrl = modelRes.url || modelRes.publicUrl || modelUrl;
      }

      if (!imageUrl || !modelUrl) {
        throw new Error("Image and model URL are required.");
      }

      await apiCreateDish({
        name: form.name,
        description: form.description,
        price: form.price,
        category: form.category,
        imageUrl,
        modelUrl,
        isAvailable: form.isAvailable,
      });

      navigate("/staff/dishes");
    } catch (err) {
      console.error("Create dish failed:", err);
      setError(err.message || "Failed to create dish");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <StaffNavbar />
      <section className="py-8 max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-4">Add New Dish</h1>

        {error && <p className="text-red-400 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
              rows={3}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Category</label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Image upload */}
          <div className="space-y-2">
            <label className="block text-sm mb-1">Dish Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="text-xs"
            />
            <p className="text-xs text-slate-500">
              Or paste a direct URL:
            </p>
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs"
              placeholder="https://..."
            />
          </div>

          {/* Model upload */}
          <div className="space-y-2">
            <label className="block text-sm mb-1">3D Model (.glb)</label>
            <input
              type="file"
              accept=".glb"
              onChange={(e) => setModelFile(e.target.files?.[0] || null)}
              className="text-xs"
            />
            <p className="text-xs text-slate-500">
              Or paste a direct URL:
            </p>
            <input
              name="modelUrl"
              value={form.modelUrl}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs"
              placeholder="https://..."
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isAvailable"
              checked={form.isAvailable}
              onChange={handleChange}
            />
            Available
          </label>

          <button
            type="submit"
            disabled={saving}
            className="mt-2 px-4 py-2 rounded-full bg-emerald-500 text-slate-900 text-sm font-medium disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Dish"}
          </button>
        </form>
      </section>
    </>
  );
}

export default AddDishPage;
