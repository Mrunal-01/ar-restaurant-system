import { useParams, useSearchParams } from 'react-router-dom';
import { apiGetDish } from '../services/api';
import { useEffect, useState } from 'react';

const FALLBACK_MODEL =
  'https://modelviewer.dev/shared-assets/models/Astronaut.glb';

function ARViewPage() {
  const { id } = useParams();
  const [params] = useSearchParams();

  const [dish, setDish] = useState(null);

  useEffect(() => {
    apiGetDish(id)
      .then((data) => setDish(data))
      .catch((err) => console.error(err));
  }, [id]);

  // 1️⃣ Try to get modelUrl from query string
  let modelUrlParam = params.get("modelUrl");

  // 2️⃣ If query param is missing, use dish.model_url
  let modelUrl = modelUrlParam || dish?.model_url || FALLBACK_MODEL;

  return (
    <section className="py-8 space-y-6">
      <h2 className="text-xl font-semibold">{dish?.name || 'Loading...'}</h2>

      <model-viewer
        src={modelUrl}
        ar
        ar-modes="webxr scene-viewer quick-look"
        auto-rotate
        camera-controls
        className="w-full h-80 rounded-xl bg-black"
      ></model-viewer>

      <p className="text-xs text-slate-500">
        Model URL: {modelUrl}
      </p>
    </section>
  );
}

export default ARViewPage;
