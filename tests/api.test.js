import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import app from '../src/server.js';
import { db } from '../src/db.js';

let server;
const PORT = 3099;
const BASE_URL = `http://localhost:${PORT}`;

describe('UniSphere EMS Comprehensive Test Suite', () => {

  before(async () => {
    process.env.PORT = PORT;
    db.init(); // Reset seed data for idempotent test runs
    // Ensure test ticket is not checked in
    const reg = db.getRegistrationByTicket('TKT-AI26-9A1F');
    if (reg) {
      reg.checkedIn = false;
      reg.checkedInAt = null;
    }
    await new Promise((resolve) => {
      server = app.listen(PORT, resolve);
    });
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  // 1. Events API
  test('GET /api/events should return list of campus events', async () => {
    const res = await fetch(`${BASE_URL}/api/events`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(Array.isArray(json.data));
    assert.ok(json.data.length >= 3);
  });

  test('GET /api/events/:id should return single event with relations (schedules, vendors, sponsors)', async () => {
    const res = await fetch(`${BASE_URL}/api/events/EVT-101`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.id, 'EVT-101');
    assert.ok(Array.isArray(json.data.schedules));
    assert.ok(Array.isArray(json.data.vendors));
    assert.ok(Array.isArray(json.data.sponsors));
    assert.ok(json.data.vendors.some(v => v.category === 'Catering'));
    assert.ok(json.data.vendors.some(v => v.category === 'Flowers'));
  });

  test('POST /api/events should create a new pending event', async () => {
    const newEvent = {
      title: 'Automated Test Drone Prix',
      category: 'Technical',
      date: '2026-10-25',
      venue: 'North Grounds',
      maxCapacity: 150,
      budget: 40000
    };
    const res = await fetch(`${BASE_URL}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent)
    });
    assert.strictEqual(res.status, 201);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.title, 'Automated Test Drone Prix');
    assert.strictEqual(json.data.status, 'pending_approval');
  });

  // 2. Registrations & Ticketing
  test('POST /api/registrations should create internal student registration with instant approval and QR pass', async () => {
    const regPayload = {
      eventId: 'EVT-101',
      fullName: 'Vikram Chandran',
      email: `vikram.${Date.now()}@university.edu`,
      studentId: 'AUST-23-EE-099',
      collegeType: 'Host University (Internal)',
      collegeName: 'Apex University of Science & Tech',
      department: 'Electrical Engg'
    };
    const res = await fetch(`${BASE_URL}/api/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regPayload)
    });
    assert.strictEqual(res.status, 201);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.status, 'approved');
    assert.ok(json.data.ticketCode.startsWith('TKT-'));
    assert.ok(json.data.qrCode.startsWith('data:image/png;base64'));
  });

  test('POST /api/registrations should queue external university students for approval', async () => {
    const regPayload = {
      eventId: 'EVT-102',
      fullName: 'Siddharth Rao',
      email: `sid.${Date.now()}@iitb.ac.in`,
      studentId: '22D0891',
      collegeType: 'External University',
      collegeName: 'IIT Bombay',
      department: 'Mechanical'
    };
    const res = await fetch(`${BASE_URL}/api/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regPayload)
    });
    assert.strictEqual(res.status, 201);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.status, 'pending');
  });

  test('GET /api/registrations/ticket/:ticketCode should return full ticket details and QR code', async () => {
    const res = await fetch(`${BASE_URL}/api/registrations/ticket/TKT-AI26-9A1F`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.ticketCode, 'TKT-AI26-9A1F');
    assert.ok(json.data.qrCode);
  });

  // 3. Gate Scanner & Admission Verification
  test('POST /api/registrations/checkin should admit an approved attendee and block duplicate entry', async () => {
    // 1st scan -> Approved
    const res1 = await fetch(`${BASE_URL}/api/registrations/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketCode: 'TKT-AI26-9A1F' })
    });
    const json1 = await res1.json();
    assert.strictEqual(res1.status, 200);
    assert.strictEqual(json1.success, true);
    assert.ok(json1.message.includes('Verified successfully'));

    // 2nd scan -> Duplicate entry alert
    const res2 = await fetch(`${BASE_URL}/api/registrations/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketCode: 'TKT-AI26-9A1F' })
    });
    const json2 = await res2.json();
    assert.strictEqual(res2.status, 400);
    assert.strictEqual(json2.success, false);
    assert.strictEqual(json2.alreadyCheckedIn, true);
  });

  test('POST /api/registrations/checkin should reject unapproved or invalid tickets', async () => {
    const res = await fetch(`${BASE_URL}/api/registrations/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketCode: 'TKT-AI26-4L9P' }) // pending ticket
    });
    assert.strictEqual(res.status, 400);
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.ok(json.message.includes('pending'));
  });

  // 4. Vendors & Sponsorships
  test('POST /api/vendors should record catering and floral decor requirements', async () => {
    const vendorPayload = {
      eventId: 'EVT-101',
      category: 'Flowers',
      vendorName: 'Floral Aura Express',
      contactPerson: 'Smt. Lakshmi',
      phone: '+91 99999 88888',
      quotedAmount: 6000,
      deliverables: '8 VIP guest garlands and entrance floral rangoli'
    };
    const res = await fetch(`${BASE_URL}/api/vendors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vendorPayload)
    });
    assert.strictEqual(res.status, 201);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.category, 'Flowers');
  });

  // 5. Admin Controls
  test('POST /api/admin/events/:id/status should approve a pending event', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/events/EVT-104/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved' })
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.status, 'approved');
  });

  test('GET /api/admin/stats should return comprehensive university fest analytics', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/stats`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data.totalEvents > 0);
    assert.ok(json.data.totalRegistrations > 0);
    assert.ok(json.data.totalBudget > 0);
  });

  // 6. Gemma AI Copilot Endpoints
  test('GET /api/ai/health should return Gemma model architecture information', async () => {
    const res = await fetch(`${BASE_URL}/api/ai/health`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.openSourceAiDetails.modelFamily.includes('Gemma'));
  });

  test('POST /api/ai/schedule should synthesize structured agenda via Gemma', async () => {
    const res = await fetch(`${BASE_URL}/api/ai/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'National Quantum AI Symposia',
        category: 'Technical',
        durationHours: 6,
        venue: 'Quantum Hall 3',
        attendeeCount: 180
      })
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data.output.includes('Schedule'));
    assert.ok(json.data.output.includes('Judging'));
  });

  test('POST /api/ai/vendors should calculate catering and decor quotas via Gemma', async () => {
    const res = await fetch(`${BASE_URL}/api/ai/vendors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Inter-College RoboWars 2026',
        category: 'Technical',
        attendeeCount: 400,
        budget: 80000
      })
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data.output.includes('Catering'));
    assert.ok(json.data.output.includes('Decor'));
    assert.ok(json.data.output.includes('Floral'));
  });

  test('POST /api/ai/sponsor-pitch should draft corporate proposal via Gemma', async () => {
    const res = await fetch(`${BASE_URL}/api/ai/sponsor-pitch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'InnovateX National Hackathon',
        targetSponsor: 'NVIDIA AI Labs',
        sponsorTier: 'Title Sponsor',
        expectedAttendees: 500
      })
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data.output.includes('Sponsorship Proposal'));
    assert.ok(json.data.output.includes('NVIDIA AI Labs'));
  });

  test('POST /api/ai/chat should respond to attendee questions via Gemma Concierge', async () => {
    const res = await fetch(`${BASE_URL}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Where is lunch served and what food is available?'
      })
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data.output.length > 20);
  });

});
