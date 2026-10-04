import express from 'express';
import { db } from '../db.js';

export const vendorsRouter = express.Router();

// GET vendors
vendorsRouter.get('/', (req, res) => {
  const { eventId, category } = req.query;
  let list = db.getVendors(eventId);
  if (category) {
    list = list.filter(v => v.category.toLowerCase() === category.toLowerCase());
  }
  res.json({ success: true, count: list.length, data: list });
});

// POST add vendor
vendorsRouter.post('/', (req, res) => {
  const { eventId, category, vendorName, contactPerson, phone, quotedAmount, status, deliverables } = req.body;
  if (!eventId || !category || !vendorName) {
    return res.status(400).json({ success: false, message: "Missing required fields: eventId, category, vendorName" });
  }

  const created = db.addVendor({
    eventId,
    category, // Catering, Decor, Flowers, AV & Sound, Logistics
    vendorName,
    contactPerson: contactPerson || "Operations Desk",
    phone: phone || "Not Provided",
    quotedAmount: Number(quotedAmount) || 0,
    status: status || "Pending Quote",
    deliverables: deliverables || ""
  });

  res.status(201).json({ success: true, message: "Vendor requirement added", data: created });
});

// PUT update vendor
vendorsRouter.put('/:id', (req, res) => {
  const updated = db.updateVendor(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: "Vendor not found" });
  res.json({ success: true, message: "Vendor updated", data: updated });
});

// DELETE vendor
vendorsRouter.delete('/:id', (req, res) => {
  const ok = db.deleteVendor(req.params.id);
  if (!ok) return res.status(404).json({ success: false, message: "Vendor not found" });
  res.json({ success: true, message: "Vendor removed" });
});
