// frontend/src/services/api.js

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ||
  'http://localhost:5000/api';

// ---------- Common helper ----------

async function handleResponse(res) {
  const contentType = res.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    throw new Error(`Expected JSON but got: ${contentType}`);
  }

  const json = await res.json();

  if (!json.success) {
    throw new Error(json?.error?.message || 'API error');
  }

  return json.data;
}

// auth header for staff/admin APIs
function authHeaders() {
  const token = localStorage.getItem('sb_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ---------- PUBLIC (customer) APIs ----------

// GET all dishes
export async function apiGetDishes() {
  console.log('API → GET dishes');
  const res = await fetch(`${API_BASE_URL}/v1/dishes`);
  return handleResponse(res);
}

// GET one dish
export async function apiGetDish(id) {
  console.log('API → GET dish', id);
  const res = await fetch(`${API_BASE_URL}/v1/dishes/${id}`);
  return handleResponse(res);
}

// POST new order
// ⚠️ order is ALREADY built in CheckoutPage
export async function apiCreateOrder(order) {
  console.log('API → POST order', order);

  const res = await fetch(`${API_BASE_URL}/v1/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });

  return handleResponse(res);
}

// ---------- STAFF / OWNER APIs ----------

// GET all orders
export async function apiGetOrders() {
  console.log('API → GET orders');
  const res = await fetch(`${API_BASE_URL}/v1/orders`, {
    headers: {
      ...authHeaders(),
    },
  });

  return handleResponse(res);
}

// PATCH order status
export async function apiUpdateOrderStatus(id, status) {
  console.log('API → UPDATE order status', id, status);

  const res = await fetch(`${API_BASE_URL}/v1/orders/status/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ status }),
  });

  return handleResponse(res);
}


// ---- Uploads (owner) ----
export async function apiUploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/v1/uploads/image`, {
    method: 'POST',
    headers: {
      ...authHeaders(), // must send Authorization for owner
    },
    body: formData,
  });

  return handleResponse(res); // expect { url: 'https://...' }
}

export async function apiUploadModel(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/v1/uploads/model`, {
    method: 'POST',
    headers: {
      ...authHeaders(),
    },
    body: formData,
  });

  return handleResponse(res);
}

// ---- Dish CRUD (owner) ----
export async function apiCreateDish(payload) {
  const res = await fetch(`${API_BASE_URL}/v1/dishes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function apiUpdateDish(id, payload) {
  const res = await fetch(`${API_BASE_URL}/v1/dishes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function apiDeleteDish(id) {
  const res = await fetch(`${API_BASE_URL}/v1/dishes/${id}`, {
    method: 'DELETE',
    headers: {
      ...authHeaders(),
    },
  });
  return handleResponse(res);
}
