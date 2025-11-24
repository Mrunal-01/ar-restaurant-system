// frontend/src/pages/staff/EditDishPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StaffNavbar from "../../components/staff/StaffNavbar";
import {
  apiGetDish,
  apiUpdateDish,
  apiUploadImage,
  apiUploadModel,
} from "../../services/api";

function EditDishPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [modelFile, setModelFile] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const dish = await apiGetDish(id);
        setForm({
          name: dish.name || "",
          description: dish.description || "",
          price: dish.price || "",
          category: dish.category || "",
          imageUrl: dish.image_url || "",
          modelUrl: dish.model_url || "",
          isAvailable: dish.is_available,
        });
      } catch (err) {
        console.error("Failed to load dish:", err);
        setError(err.message || "Failed to load dish");
      }
    }
    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form) return;

    setError("");
    setSaving(true);

    try {
      let imageUrl = form.imageUrl;
      let modelUrl = form.modelUrl;

      if (imageFile) {
        const imgRes = await apiUploadImage(imageFile);
        imageUrl = imgRes.url || imgRes.publicUrl || imageUrl;
      }

      if (modelFile) {
        const modelRes = await apiUploadModel(modelFile);
        modelUrl = modelRes.url || modelRes.publicUrl || modelUrl;
      }

      await apiUpdateDish(id, {
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
      console.error("Update dish failed:", err);
      setError(err.message || "Failed to update dish");
    } finally {
      setSaving(false);
    }
  };

  if (!form) {
    return (
      <>
        <StaffNavbar />
        <section className="py-8 max-w-3xl mx-auto px-4">
          <p>Loading dish…</p>
        </section>
      </>
    );
  }

  return (
    <>
      <StaffNavbar />
      <section className="py-8 max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-4">Edit Dish</h1>

        {error && <p className="text-red-400 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Same fields as AddDishPage, using form state */}
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

          {/* Existing preview + upload */}
          <div className="space-y-2">
            <label className="block text-sm mb-1">Dish Image</label>
            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt={form.name}
                className="h-24 w-24 object-cover rounded-lg mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="text-xs"
            />
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs mt-1"
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm mb-1">3D Model (.glb)</label>
            <input
              type="file"
              accept=".glb"
              onChange={(e) => setModelFile(e.target.files?.[0] || null)}
              className="text-xs"
            />
            <input
              name="modelUrl"
              value={form.modelUrl}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs mt-1"
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
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </section>
    </>
  );
}

export default EditDishPage;
