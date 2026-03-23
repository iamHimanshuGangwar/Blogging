import express from 'express';

const router = express.Router();

// Get notifications
router.get('/notifications', (req, res) => {
  try {
    // Return empty notifications array for now
    res.json({
      success: true,
      notifications: []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
