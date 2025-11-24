// backend/controllers/orderController.js
const { supabase } = require('../lib/supabaseClient');

function sendError(res, status, message, code) {
  return res.status(status).json({
    success: false,
    error: { message, code },
  });
}

// POST /api/v1/orders  (public)
async function createOrder(req, res) {
  if (!supabase) {
    return sendError(
      res,
      500,
      'Database not initialized (Supabase).',
      'DB_NOT_READY'
    );
  }

  try {
    const { tableNumber, items, note } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return sendError(
        res,
        400,
        'Order must include at least one item',
        'VALIDATION_ERROR'
      );
    }

    const totalAmount = items.reduce(
      (sum, item) =>
        sum + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );

    const insertPayload = {
      table_number: tableNumber || null,
      items,
      note: note || '',
      status: 'pending',
      total_amount: totalAmount,
    };

    const { data, error } = await supabase
      .from('orders')
      .insert(insertPayload)
      .select('*')
      .single();

    if (error) {
      console.error('createOrder error:', error);
      return sendError(res, 500, 'Failed to create order', 'SERVER_ERROR');
    }

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (err) {
    console.error('createOrder exception:', err);
    return sendError(res, 500, 'Failed to create order', 'SERVER_ERROR');
  }
}

// GET /api/v1/orders  (protected: staff/owner)
async function getAllOrders(req, res) {
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
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('getAllOrders error:', error);
      return sendError(res, 500, 'Failed to fetch orders', 'SERVER_ERROR');
    }

    return res.json({ success: true, data: data || [] });
  } catch (err) {
    console.error('getAllOrders exception:', err);
    return sendError(res, 500, 'Failed to fetch orders', 'SERVER_ERROR');
  }
}

// PATCH /api/v1/orders/status/:id  (protected: staff/owner)
async function updateOrderStatus(req, res) {
  if (!supabase) {
    return sendError(
      res,
      500,
      'Database not initialized (Supabase).',
      'DB_NOT_READY'
    );
  }

  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = [
    'pending',
    'preparing',
    'ready',
    'completed',
    'cancelled',
  ];

  if (!allowedStatuses.includes(status)) {
    return sendError(
      res,
      400,
      'Invalid status value',
      'VALIDATION_ERROR'
    );
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return sendError(res, 404, 'Order not found', 'NOT_FOUND');
      }
      console.error('updateOrderStatus error:', error);
      return sendError(
        res,
        500,
        'Failed to update order status',
        'SERVER_ERROR'
      );
    }

    return res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error('updateOrderStatus exception:', err);
    return sendError(
      res,
      500,
      'Failed to update order status',
      'SERVER_ERROR'
    );
  }
}

module.exports = {
  createOrder,
  getAllOrders,
  updateOrderStatus,
};
