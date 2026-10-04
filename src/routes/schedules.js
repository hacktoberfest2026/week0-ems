import express from 'express';
import { db } from '../db.js';

export const schedulesRouter = express.Router();

// GET schedules
schedulesRouter.get('/', (req, res) => {
  const { eventId } = req.query;
  const list = db.getSchedules(eventId);
  res.json({ success: true, count: list.length, data: list });
});

// POST add schedule
schedulesRouter.post('/', (req, res) => {
  const { eventId, title, time, venue, speakerOrLead, notes } = req.body;
  if (!eventId || !title || !time) {
    return res.status(400).json({ success: false, message: "Missing required fields: eventId, title, time" });
  }

  const created = db.addSchedule({
    eventId,
    title,
    time,
    venue: venue || "Main Stage",
    speakerOrLead: speakerOrLead || "TBA",
    notes: notes || ""
  });

  res.status(201).json({ success: true, message: "Schedule item added", data: created });
});

// DELETE schedule
schedulesRouter.delete('/:id', (req, res) => {
  const ok = db.deleteSchedule(req.params.id);
  if (!ok) return res.status(404).json({ success: false, message: "Schedule item not found" });
  res.json({ success: true, message: "Schedule item deleted" });
});
