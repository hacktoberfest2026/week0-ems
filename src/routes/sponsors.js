import express from 'express';
import { db } from '../db.js';

export const sponsorsRouter = express.Router();

// GET sponsors
sponsorsRouter.get('/', (req, res) => {
  const { eventId } = req.query;
  const list = db.getSponsors(eventId);
  res.json({ success: true, count: list.length, data: list });
});

// POST add sponsor
sponsorsRouter.post('/', (req, res) => {
  const { eventId, companyName, tier, contributionAmount, contactPerson, contactEmail, perks, logoUrl } = req.body;
  if (!eventId || !companyName || !tier) {
    return res.status(400).json({ success: false, message: "Missing required fields: eventId, companyName, tier" });
  }

  const created = db.addSponsor({
    eventId,
    companyName,
    tier,
    contributionAmount: Number(contributionAmount) || 0,
    contactPerson: contactPerson || "Partnership Desk",
    contactEmail: contactEmail || "sponsor@company.com",
    perks: perks || "",
    logoUrl: logoUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=60"
  });

  res.status(201).json({ success: true, message: "Sponsor added", data: created });
});

// DELETE sponsor
sponsorsRouter.delete('/:id', (req, res) => {
  const ok = db.deleteSponsor(req.params.id);
  if (!ok) return res.status(404).json({ success: false, message: "Sponsor not found" });
  res.json({ success: true, message: "Sponsor removed" });
});
