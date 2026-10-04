import express from 'express';
import { gemma } from '../gemma.js';
import { db } from '../db.js';

export const aiRouter = express.Router();

// GET Gemma health & connection status
aiRouter.get('/health', async (req, res) => {
  const status = await gemma.checkConnection();
  res.json({
    success: true,
    data: status,
    openSourceAiDetails: {
      modelFamily: "Gemma (Google Open-Weight Architecture)",
      supportedRuntimes: ["Ollama", "vLLM", "llama.cpp", "HuggingFace"],
      recommendedLocalCommand: "ollama run gemma2:2b",
      features: [
        "Zero Cloud API Cost",
        "Total Student Privacy & Data Sovereignty (Runs Local)",
        "Offline-Capable for Remote University Campuses",
        "Domain-Tailored Prompt Templates"
      ]
    }
  });
});

// POST Generate Event Schedule using Gemma
aiRouter.post('/schedule', async (req, res) => {
  const { title, category, durationHours, venue, attendeeCount, specialRequirements } = req.body;
  if (!title || !category) {
    return res.status(400).json({ success: false, message: "Missing title or category" });
  }

  try {
    const result = await gemma.generateEventSchedule({
      title,
      category,
      durationHours: Number(durationHours) || 8,
      venue: venue || "Main Auditorium",
      attendeeCount: Number(attendeeCount) || 250,
      specialRequirements
    });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to generate schedule", error: err.message });
  }
});

// POST Plan Vendors & Budget Allocation using Gemma
aiRouter.post('/vendors', async (req, res) => {
  const { title, category, attendeeCount, budget, foodPreference } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: "Missing event title" });
  }

  try {
    const result = await gemma.planVendors({
      title,
      category: category || "Technical",
      attendeeCount: Number(attendeeCount) || 300,
      budget: Number(budget) || 75000,
      foodPreference: foodPreference || "Mixed Veg & Non-Veg"
    });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to plan vendor needs", error: err.message });
  }
});

// POST Draft Sponsorship Proposal using Gemma
aiRouter.post('/sponsor-pitch', async (req, res) => {
  const { title, category, expectedAttendees, targetSponsor, sponsorTier } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: "Missing event title" });
  }

  try {
    const result = await gemma.pitchSponsors({
      title,
      category: category || "Technical",
      expectedAttendees: Number(expectedAttendees) || 500,
      targetSponsor: targetSponsor || "Technology Corporation",
      sponsorTier: sponsorTier || "Title Sponsor"
    });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to draft sponsor pitch", error: err.message });
  }
});

// POST Attendee & Coordinator Concierge Chat
aiRouter.post('/chat', async (req, res) => {
  const { message, eventId } = req.body;
  if (!message) {
    return res.status(400).json({ success: false, message: "Missing message string" });
  }

  let eventContext = {};
  if (eventId) {
    const event = db.getEventById(eventId);
    if (event) {
      eventContext = event;
    }
  }

  try {
    const result = await gemma.conciergeChat(message, eventContext);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: "Concierge failed", error: err.message });
  }
});
