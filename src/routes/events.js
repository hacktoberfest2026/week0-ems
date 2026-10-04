import express from 'express';
import { db } from '../db.js';

export const eventsRouter = express.Router();

// GET all events
eventsRouter.get('/', (req, res) => {
  const { status, category } = req.query;
  const events = db.getEvents({ status, category });
  res.json({ success: true, count: events.length, data: events });
});

// GET single event with full relations
eventsRouter.get('/:id', (req, res) => {
  const event = db.getEventById(req.params.id);
  if (!event) {
    return res.status(404).json({ success: false, message: "Event not found" });
  }

  const schedules = db.getSchedules(event.id);
  const sponsors = db.getSponsors(event.id);
  const vendors = db.getVendors(event.id);

  res.json({
    success: true,
    data: {
      ...event,
      schedules,
      sponsors,
      vendors
    }
  });
});

// POST create event
eventsRouter.post('/', (req, res) => {
  const { title, category, description, date, endDate, time, venue, organizer, coordinator, coordinatorContact, maxCapacity, budget, bannerUrl } = req.body;

  if (!title || !category || !date || !venue) {
    return res.status(400).json({ success: false, message: "Missing required fields: title, category, date, venue" });
  }

  const created = db.createEvent({
    title,
    category,
    description: description || "",
    date,
    endDate: endDate || date,
    time: time || "09:00 AM - 05:00 PM",
    venue,
    organizer: organizer || "University Event Committee",
    coordinator: coordinator || "Faculty In-Charge",
    coordinatorContact: coordinatorContact || "coordinator@university.edu",
    maxCapacity: Number(maxCapacity) || 200,
    budget: Number(budget) || 50000,
    bannerUrl: bannerUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60"
  });

  res.status(201).json({ success: true, message: "Event created successfully", data: created });
});

// PUT update event
eventsRouter.put('/:id', (req, res) => {
  const updated = db.updateEvent(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: "Event not found" });
  }
  res.json({ success: true, message: "Event updated", data: updated });
});

// DELETE event
eventsRouter.delete('/:id', (req, res) => {
  const deleted = db.deleteEvent(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: "Event not found" });
  }
  res.json({ success: true, message: "Event deleted" });
});
