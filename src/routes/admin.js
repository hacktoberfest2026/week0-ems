import express from 'express';
import { db } from '../db.js';

export const adminRouter = express.Router();

// GET admin dashboard stats
adminRouter.get('/stats', (req, res) => {
  const stats = db.getStatistics();
  res.json({ success: true, data: stats });
});

// POST update event status (Approve / Reject)
adminRouter.post('/events/:id/status', (req, res) => {
  const { status, remarks } = req.body;
  if (!['approved', 'rejected', 'pending_approval', 'draft'].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status value" });
  }

  const updated = db.updateEvent(req.params.id, { status, adminRemarks: remarks || null });
  if (!updated) {
    return res.status(404).json({ success: false, message: "Event not found" });
  }

  res.json({ success: true, message: `Event marked as ${status}`, data: updated });
});

// POST update participant registration status (Approve / Reject)
adminRouter.post('/registrations/:id/status', (req, res) => {
  const { status, remarks } = req.body;
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status value" });
  }

  const updated = db.updateRegistrationStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ success: false, message: "Registration not found" });
  }

  res.json({ success: true, message: `Participant registration marked as ${status}`, data: updated });
});

// POST reset to seed data
adminRouter.post('/reset', (req, res) => {
  db.init();
  res.json({ success: true, message: "Database reloaded with initial university fest seed data." });
});
