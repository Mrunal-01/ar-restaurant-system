// backend/routes/uploads.js
const express = require('express');
const multer = require('multer');
const { requireAuth, requireRole } = require('../middleware/auth');
const { uploadToSupabase } = require('../lib/uploadToSupabase');

const router = express.Router();

// Store file in memory, then upload buffer to Supabase
const upload = multer({ storage: multer.memoryStorage() });

function createUploadHandler(folderName) {
  return async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { message: 'No file uploaded', code: 'NO_FILE' },
      });
    }

    try {
      const { buffer, originalname, mimetype } = req.file;

      const result = await uploadToSupabase(
        buffer,
        originalname,
        mimetype,
        folderName
      );

      return res.status(201).json({
        success: true,
        data: {
          path: result.path,
          publicUrl: result.publicUrl,
        },
      });
    } catch (err) {
      console.error('Upload error:', err);
      return res.status(500).json({
        success: false,
        error: {
          message: 'File upload failed',
          code: 'UPLOAD_FAILED',
        },
      });
    }
  };
}

// Only owner can upload images/models for dishes
router.post(
  '/image',
  requireAuth,
  requireRole('owner'),
  upload.single('file'),
  createUploadHandler('dishes/images')
);

router.post(
  '/model',
  requireAuth,
  requireRole('owner'),
  upload.single('file'),
  createUploadHandler('dishes/models')
);

module.exports = router;
