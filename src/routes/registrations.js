import express from 'express';
import QRCode from 'qrcode';
import { db } from '../db.js';

export const registrationsRouter = express.Router();

// GET all registrations
registrationsRouter.get('/', (req, res) => {
  const { eventId, status, collegeType } = req.query;
  const list = db.getRegistrations({ eventId, status, collegeType });
  res.json({ success: true, count: list.length, data: list });
});

// GET single ticket by ticketCode with generated QR code
registrationsRouter.get('/ticket/:ticketCode', async (req, res) => {
  const reg = db.getRegistrationByTicket(req.params.ticketCode);
  if (!reg) {
    return res.status(404).json({ success: false, message: "Ticket not found" });
  }

  const event = db.getEventById(reg.eventId);

  try {
    // Generate QR code data URL encoding ticket payload
    const qrPayload = JSON.stringify({
      ticketCode: reg.ticketCode,
      name: reg.fullName,
      college: reg.collegeName,
      event: reg.eventTitle,
      status: reg.status
    });
    const qrCodeDataUrl = await QRCode.toDataURL(qrPayload, {
      errorCorrectionLevel: 'H',
      margin: 2,
      color: {
        dark: '#1e293b',
        light: '#ffffff'
      }
    });

    res.json({
      success: true,
      data: {
        ...reg,
        eventVenue: event?.venue || "University Campus",
        eventDate: event?.date || "2026-10-16",
        eventTime: event?.time || "09:00 AM",
        qrCode: qrCodeDataUrl
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to generate QR pass", error: err.message });
  }
});

// POST register for an event
registrationsRouter.post('/', async (req, res) => {
  const {
    eventId,
    fullName,
    email,
    phone,
    collegeType,
    collegeName,
    studentId,
    department,
    yearOfStudy,
    teamName,
    role,
    dietaryPreference
  } = req.body;

  if (!eventId || !fullName || !email || !collegeName || !studentId) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: eventId, fullName, email, collegeName, studentId"
    });
  }

  const event = db.getEventById(eventId);
  if (!event) {
    return res.status(404).json({ success: false, message: "Event not found" });
  }

  // Prevent duplicate registration for the same email in this event
  const existing = db.getRegistrations({ eventId }).find(r => r.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({
      success: false,
      message: `Participant with email ${email} is already registered for this event. Ticket code: ${existing.ticketCode}`,
      ticketCode: existing.ticketCode
    });
  }

  const newReg = db.createRegistration({
    eventId,
    eventTitle: event.title,
    fullName,
    email,
    phone: phone || "Not Provided",
    collegeType: collegeType || "External University",
    collegeName,
    studentId,
    department: department || "General",
    yearOfStudy: yearOfStudy || "Not Specified",
    teamName: teamName || "Solo Participant",
    role: role || "Participant",
    dietaryPreference: dietaryPreference || "Vegetarian"
  });

  // Generate QR code for immediate display
  const qrPayload = JSON.stringify({
    ticketCode: newReg.ticketCode,
    name: newReg.fullName,
    college: newReg.collegeName,
    event: newReg.eventTitle,
    status: newReg.status
  });
  const qrCodeDataUrl = await QRCode.toDataURL(qrPayload, { margin: 2 });

  res.status(201).json({
    success: true,
    message: newReg.status === "approved"
      ? "Registration confirmed! Your digital admission pass is ready."
      : "Registration received and queued for coordinator approval (external university participant).",
    data: {
      ...newReg,
      qrCode: qrCodeDataUrl
    }
  });
});

// POST Gate Check-in verification
registrationsRouter.post('/checkin', (req, res) => {
  const { ticketCode } = req.body;
  if (!ticketCode) {
    return res.status(400).json({ success: false, message: "Missing ticketCode parameter" });
  }

  const result = db.checkInTicket(ticketCode.trim().toUpperCase());
  if (!result.success) {
    return res.status(400).json(result);
  }

  res.json(result);
});
