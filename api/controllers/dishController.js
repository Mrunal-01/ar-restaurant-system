// backend/controllers/dishController.js
const { supabase } = require('../lib/supabaseClient');

function sendError(res, status, message, code) {
  return res.status(status).json({
    success: false,
    error: { message, code },
  });
}

// GET /api/v1/dishes
async function getAllDishes(req, res) {
  if (!supabase) {
    return sendError(
      res,
      500,
      'Database not initialized (Supabase).',
      'DB_NOT_READY'
    );
  }

  try {
    const { data, error } = await supabase
      .from('dishes')
      .select('*')
      .eq('is_available', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('getAllDishes error:', error);
      return sendError(res, 500, 'Failed to fetch dishes', 'SERVER_ERROR');
    }

    return res.json({ success: true, data: data || [] });
  } catch (err) {
    console.error('getAllDishes exception:', err);
    return sendError(res, 500, 'Failed to fetch dishes', 'SERVER_ERROR');
  }
}

// GET /api/v1/dishes/:id
async function getDishById(req, res) {
  if (!supabase) {
    return sendError(
      res,
      500,
      'Database not initialized (Supabase).',
      'DB_NOT_READY'
    );
  }

  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('dishes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // row not found
        return sendError(res, 404, 'Dish not found', 'NOT_FOUND');
      }
      console.error('getDishById error:', error);
      return sendError(res, 500, 'Failed to fetch dish', 'SERVER_ERROR');
    }

    return res.json({ success: true, data });
  } catch (err) {
    console.error('getDishById exception:', err);
    return sendError(res, 500, 'Failed to fetch dish', 'SERVER_ERROR');
  }
}

// POST /api/v1/dishes  (protected: owner)
async function createDish(req, res) {
  if (!supabase) {
    return sendError(
      res,
      500,
      'Database not initialized (Supabase).',
      'DB_NOT_READY'
    );
  }

  try {
    const {
      name,
      description,
      price,
      category,
      imageUrl,
      modelUrl,
      isAvailable = true,
    } = req.body;

    if (!name || !price || !imageUrl || !modelUrl) {
      return sendError(
        res,
        400,
        'Missing required fields: name, price, imageUrl, modelUrl',
        'VALIDATION_ERROR'
      );
    }

    const insertPayload = {
      name,
      description: description || '',
      price: Number(price),
      category: category || 'Uncategorized',
      image_url: imageUrl,
      model_url: modelUrl,
      is_available: isAvailable,
    };

    const { data, error } = await supabase
      .from('dishes')
      .insert(insertPayload)
      .select('*')
      .single();

    if (error) {
      console.error('createDish error:', error);
      return sendError(res, 500, 'Failed to create dish', 'SERVER_ERROR');
    }

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (err) {
    console.error('createDish exception:', err);
    return sendError(res, 500, 'Failed to create dish', 'SERVER_ERROR');
  }
}

module.exports = {
  getAllDishes,
  getDishById,
  createDish,
};

// ... existing requires + helpers + getAllDishes + getDishById + createDish ...

// PUT /api/v1/dishes/:id
async function updateDish(req, res) {
  if (!supabase) {
    return sendError(res, 500, 'Database not initialized (Supabase).', 'DB_NOT_READY');
  }

  const { id } = req.params;

  const {
    name,
    description,
    price,
    category,
    imageUrl,
    modelUrl,
    isAvailable,
  } = req.body;

  const updatePayload = {};

  if (name !== undefined) updatePayload.name = name;
  if (description !== undefined) updatePayload.description = description;
  if (price !== undefined) updatePayload.price = Number(price);
  if (category !== undefined) updatePayload.category = category;
  if (imageUrl !== undefined) updatePayload.image_url = imageUrl;
  if (modelUrl !== undefined) updatePayload.model_url = modelUrl;
  if (isAvailable !== undefined) updatePayload.is_available = isAvailable;

  try {
    const { data, error } = await supabase
      .from('dishes')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('updateDish error:', error);
      return sendError(res, 500, 'Failed to update dish', 'SERVER_ERROR');
    }

    return res.json({ success: true, data });
  } catch (err) {
    console.error('updateDish exception:', err);
    return sendError(res, 500, 'Failed to update dish', 'SERVER_ERROR');
  }
}

// DELETE /api/v1/dishes/:id
async function deleteDish(req, res) {
  if (!supabase) {
    return sendError(res, 500, 'Database not initialized (Supabase).', 'DB_NOT_READY');
  }

  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('dishes')
      .delete()
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('deleteDish error:', error);
      return sendError(res, 500, 'Failed to delete dish', 'SERVER_ERROR');
    }

    return res.json({ success: true, data });
  } catch (err) {
    console.error('deleteDish exception:', err);
    return sendError(res, 500, 'Failed to delete dish', 'SERVER_ERROR');
  }
}


module.exports = {
  getAllDishes,
  getDishById,
  createDish,
  updateDish,
  deleteDish,
};
