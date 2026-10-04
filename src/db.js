import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SEED_FILE = path.join(__dirname, '..', 'data', 'ems.json');
const DATA_FILE = process.env.VERCEL
  ? path.join('/tmp', 'ems.json')
  : SEED_FILE;

const INITIAL_DATA = {
  events: [
    {
      id: "EVT-101",
      title: "InnovateX: National 24-Hour AI & Agent Hackathon",
      category: "Technical",
      description: "Premier inter-college hackathon focusing on open-source AI, autonomous agents, and campus automation. Open to undergraduate and postgraduate teams across universities.",
      date: "2026-10-16",
      endDate: "2026-10-17",
      time: "09:00 AM - 09:00 AM",
      venue: "APJ Abdul Kalam Computing Complex (Labs 1-4)",
      organizer: "Dept of Computer Science & Engineering",
      coordinator: "Dr. Priya Raman (Assoc. Prof)",
      coordinatorContact: "priya.raman@university.edu",
      maxCapacity: 300,
      registeredCount: 4,
      status: "approved", // draft, pending_approval, approved, rejected
      budget: 85000,
      bannerUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: "EVT-102",
      title: "RoboClash: Inter-University Combat Robotics League",
      category: "Technical",
      description: "High-octane 15kg & 30kg remote-controlled and autonomous robot combat tournament featuring wired and wireless arenas.",
      date: "2026-10-17",
      endDate: "2026-10-17",
      time: "10:00 AM - 05:30 PM",
      venue: "University Indoor Sports Arena",
      organizer: "Robotics & Mechatronics Society",
      coordinator: "Prof. Rajesh Verma",
      coordinatorContact: "rajesh.v@university.edu",
      maxCapacity: 500,
      registeredCount: 2,
      status: "approved",
      budget: 120000,
      bannerUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: "EVT-103",
      title: "SoundWave 2026: Battle of the College Bands",
      category: "Cultural",
      description: "Annual multi-genre music competition uniting college acoustic, rock, fusion, and metal bands from all southern universities.",
      date: "2026-10-18",
      endDate: "2026-10-18",
      time: "05:00 PM - 10:00 PM",
      venue: "Main Campus Open Air Amphitheatre",
      organizer: "University Cultural Committee",
      coordinator: "Dr. Sneha Nair",
      coordinatorContact: "sneha.nair@university.edu",
      maxCapacity: 1200,
      registeredCount: 3,
      status: "approved",
      budget: 150000,
      bannerUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: "EVT-104",
      title: "GreenTech & Drone Innovation Expo",
      category: "Technical",
      description: "Exhibition and design competition on sustainable clean-tech, electric mobility, and autonomous agricultural surveillance drones.",
      date: "2026-10-19",
      endDate: "2026-10-19",
      time: "10:00 AM - 04:00 PM",
      venue: "Dr. Vikram Sarabhai Innovation Pavilion",
      organizer: "Dept of Electrical & Aerospace Engg",
      coordinator: "Prof. M. K. Sundaram",
      coordinatorContact: "sundaram.mk@university.edu",
      maxCapacity: 350,
      registeredCount: 1,
      status: "pending_approval",
      budget: 65000,
      bannerUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: "EVT-105",
      title: "NatyaManch: All-India Street Play & Mime Carnival",
      category: "Cultural",
      description: "Socially conscious street theater, nukkad natak, and mime competition addressing real-world environmental and civic themes.",
      date: "2026-10-20",
      endDate: "2026-10-20",
      time: "02:00 PM - 06:30 PM",
      venue: "Central Library Quadrangle & Lawns",
      organizer: "Fine Arts & Drama Society",
      coordinator: "Prof. Aravind Swamy",
      coordinatorContact: "aravind.s@university.edu",
      maxCapacity: 600,
      registeredCount: 1,
      status: "pending_approval",
      budget: 45000,
      bannerUrl: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=800&auto=format&fit=crop&q=60"
    }
  ],
  schedules: [
    {
      id: "SCH-001",
      eventId: "EVT-101",
      title: "Check-in, Kit Distribution & Hardware Lab Access",
      time: "08:30 AM - 09:30 AM",
      venue: "Main Hall Desk",
      speakerOrLead: "Student Volunteer Team",
      notes: "Verify external college ID cards and allocate lab workstation pods."
    },
    {
      id: "SCH-002",
      eventId: "EVT-101",
      title: "Inaugural Keynote: Building with Open-Weight Models & Gemma",
      time: "09:30 AM - 10:15 AM",
      venue: "Auditorium Hall 1",
      speakerOrLead: "Dr. K. Balaji (AI Research Lead, DeepTech Labs)",
      notes: "Live streaming to Labs 2, 3, and 4."
    },
    {
      id: "SCH-003",
      eventId: "EVT-101",
      title: "Hackathon Hacking Kickoff & Problem Statements Released",
      time: "10:30 AM",
      venue: "Computing Labs 1 - 4",
      speakerOrLead: "Jury Panel",
      notes: "24-hour countdown clock initiated."
    },
    {
      id: "SCH-004",
      eventId: "EVT-101",
      title: "Midnight Snack & Mentor Pitch Review (Round 1)",
      time: "11:30 PM - 01:00 AM",
      venue: "Computing Labs 1 - 4",
      speakerOrLead: "Industry Mentors",
      notes: "Initial codebase check and feasibility evaluation."
    },
    {
      id: "SCH-005",
      eventId: "EVT-101",
      title: "Final Code Freeze & Project Demos to Jury",
      time: "10:30 AM - 01:00 PM (Day 2)",
      venue: "Main Auditorium",
      speakerOrLead: "Distinguished Jury Panel",
      notes: "3-min live demo + 2-min Q&A per finalist team."
    },
    {
      id: "SCH-006",
      eventId: "EVT-102",
      title: "Bot Safety Inspection & Weight Scrutiny",
      time: "09:30 AM - 10:30 AM",
      venue: "Pit Area, Sports Complex",
      speakerOrLead: "Technical Inspection Scrutineers",
      notes: "Battery fail-safe test and radio signal validation."
    },
    {
      id: "SCH-007",
      eventId: "EVT-102",
      title: "Round 1 Eliminators: 15kg Featherweight Category",
      time: "11:00 AM - 01:30 PM",
      venue: "Enclosed Combat Pit",
      speakerOrLead: "Referee Panel",
      notes: "3-minute bouts, double elimination bracket."
    },
    {
      id: "SCH-008",
      eventId: "EVT-103",
      title: "Sound Check & Acoustic Level Tuning",
      time: "03:00 PM - 04:45 PM",
      venue: "Amphitheatre Stage",
      speakerOrLead: "Sound Engineer (AcousticPro)",
      notes: "Strict 10-minute sound check limit per band."
    },
    {
      id: "SCH-009",
      eventId: "EVT-103",
      title: "Live Band Performances & Headliner Act",
      time: "05:00 PM - 09:30 PM",
      venue: "Amphitheatre Stage",
      speakerOrLead: "Competing Bands + Guest Band 'The Resonance'",
      notes: "Crowd control and wristband verification enforced."
    }
  ],
  sponsors: [
    {
      id: "SPN-001",
      eventId: "EVT-101",
      companyName: "CloudScale Technologies",
      tier: "Title Sponsor",
      contributionAmount: 45000,
      contactPerson: "Vikram Malhotra",
      contactEmail: "partnerships@cloudscale.io",
      logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=60",
      perks: "Exclusive banner at stage, keynote slot, campus recruitment booth, logo on all badges."
    },
    {
      id: "SPN-002",
      eventId: "EVT-101",
      companyName: "NeuralBytes AI",
      tier: "AI Platform Partner",
      contributionAmount: 25000,
      contactPerson: "Anita Deshmukh",
      contactEmail: "anita@neuralbytes.ai",
      logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=60",
      perks: "API credits for participants, special track sponsor, logo on website and certificates."
    },
    {
      id: "SPN-003",
      eventId: "EVT-102",
      companyName: "Apex Motors & Automation",
      tier: "Platinum Sponsor",
      contributionAmount: 50000,
      contactPerson: "Suresh Babu",
      contactEmail: "suresh.b@apexmotors.in",
      logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=60",
      perks: "Arena perimeter branding, trophy presentation, pre-placement interview access."
    },
    {
      id: "SPN-004",
      eventId: "EVT-103",
      companyName: "RedBull Student Energy",
      tier: "Beverage & Experience Partner",
      contributionAmount: 30000,
      contactPerson: "Meera Sen",
      contactEmail: "meera.sen@energyevents.com",
      logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=60",
      perks: "Exclusive energy drink sampling booth, DJ intermission sponsorship, banner coverage."
    }
  ],
  vendors: [
    {
      id: "VND-001",
      eventId: "EVT-101",
      category: "Catering",
      vendorName: "Royal Feast University Catering",
      contactPerson: "Chef Gurumurthy",
      phone: "+91 98401 23456",
      quotedAmount: 38000,
      status: "Confirmed",
      deliverables: "300 participant breakfast boxes, midnight coffee/tea stations (2 rounds), 350 buffet lunches (Veg & Non-Veg)."
    },
    {
      id: "VND-002",
      eventId: "EVT-101",
      category: "Decor",
      vendorName: "Majestic Stagecraft & Backdrops",
      contactPerson: "Farhan Qureshi",
      phone: "+91 98402 34567",
      quotedAmount: 18000,
      status: "Confirmed",
      deliverables: "24x10 ft main stage vinyl backdrop, entry arch at IT block, 6 directional standees, podium wrap."
    },
    {
      id: "VND-003",
      eventId: "EVT-101",
      category: "Flowers",
      vendorName: "Bloom & Petals Floral Art",
      contactPerson: "Geetha Kumari",
      phone: "+91 98403 45678",
      quotedAmount: 4500,
      status: "Confirmed",
      deliverables: "6 premium fresh orchid bouquets for chief guests & jury, dais table floral arrangement, traditional brass lamp garland."
    },
    {
      id: "VND-004",
      eventId: "EVT-101",
      category: "AV & Sound",
      vendorName: "AcousticPro Systems",
      contactPerson: "David Anthony",
      phone: "+91 98404 56789",
      quotedAmount: 15000,
      status: "Confirmed",
      deliverables: "Dual 4K Laser projectors, 4 cordless handheld mics, 2 lapel mics, sound mixer, lab audio broadcast."
    },
    {
      id: "VND-005",
      eventId: "EVT-102",
      category: "Catering",
      vendorName: "Royal Feast University Catering",
      contactPerson: "Chef Gurumurthy",
      phone: "+91 98401 23456",
      quotedAmount: 42000,
      status: "Pending Quote",
      deliverables: "450 buffet lunch plates, electrolyte drink coolers for pit crews, 100 referee refreshment packs."
    },
    {
      id: "VND-006",
      eventId: "EVT-103",
      category: "AV & Sound",
      vendorName: "SoundSphere Concert Rigging",
      contactPerson: "Karthik R.",
      phone: "+91 98405 67890",
      quotedAmount: 65000,
      status: "Confirmed",
      deliverables: "Full concert line-array sound system, 24-channel digital stage console, intelligent moving head beam lights, haze machines."
    },
    {
      id: "VND-007",
      eventId: "EVT-103",
      category: "Decor",
      vendorName: "Majestic Stagecraft & Backdrops",
      contactPerson: "Farhan Qureshi",
      phone: "+91 98402 34567",
      quotedAmount: 28000,
      status: "Pending Quote",
      deliverables: "Amphitheatre perimeter crowd barricades (200m), VIP enclosure tenting, backstage green room partition decor."
    }
  ],
  registrations: [
    {
      id: "REG-2026-001",
      ticketCode: "TKT-AI26-9A1F",
      eventId: "EVT-101",
      eventTitle: "InnovateX: National 24-Hour AI & Agent Hackathon",
      fullName: "Rohan Srinivasan",
      email: "rohan.s@mitindia.edu",
      phone: "+91 98765 43210",
      collegeType: "External University",
      collegeName: "Madras Institute of Technology, Anna University",
      studentId: "2023CSE1042",
      department: "Computer Technology",
      yearOfStudy: "3rd Year",
      teamName: "NeuralForge",
      role: "Team Leader",
      dietaryPreference: "Vegetarian",
      status: "approved", // pending, approved, rejected
      checkedIn: false,
      checkedInAt: null,
      createdAt: "2026-10-03T10:15:00Z"
    },
    {
      id: "REG-2026-002",
      ticketCode: "TKT-AI26-3B8C",
      eventId: "EVT-101",
      eventTitle: "InnovateX: National 24-Hour AI & Agent Hackathon",
      fullName: "Ananya Iyer",
      email: "ananya.iyer@vit.ac.in",
      phone: "+91 98765 43211",
      collegeType: "External University",
      collegeName: "Vellore Institute of Technology (VIT Vellore)",
      studentId: "22BCE0891",
      department: "Computer Science",
      yearOfStudy: "4th Year",
      teamName: "GemmaSquad",
      role: "Participant",
      dietaryPreference: "Non-Vegetarian",
      status: "approved",
      checkedIn: true,
      checkedInAt: "2026-10-04T08:45:00Z",
      createdAt: "2026-10-03T11:20:00Z"
    },
    {
      id: "REG-2026-003",
      ticketCode: "TKT-AI26-7K2D",
      eventId: "EVT-101",
      eventTitle: "InnovateX: National 24-Hour AI & Agent Hackathon",
      fullName: "Karthik Subramanian",
      email: "karthik.subra@university.edu",
      phone: "+91 98765 43212",
      collegeType: "Host University (Internal)",
      collegeName: "Apex University of Science & Tech",
      studentId: "AUST-23-CS-041",
      department: "Information Science",
      yearOfStudy: "3rd Year",
      teamName: "ApexAgents",
      role: "Participant",
      dietaryPreference: "Vegetarian",
      status: "approved",
      checkedIn: false,
      checkedInAt: null,
      createdAt: "2026-10-03T12:00:00Z"
    },
    {
      id: "REG-2026-004",
      ticketCode: "TKT-AI26-4L9P",
      eventId: "EVT-101",
      eventTitle: "InnovateX: National 24-Hour AI & Agent Hackathon",
      fullName: "Devika Nair",
      email: "devika.n@nitt.edu",
      phone: "+91 98765 43213",
      collegeType: "External University",
      collegeName: "National Institute of Technology (NIT Trichy)",
      studentId: "114122031",
      department: "Data Science & AI",
      yearOfStudy: "2nd Year",
      teamName: "OpenMatrix",
      role: "Team Leader",
      dietaryPreference: "Vegetarian",
      status: "pending",
      checkedIn: false,
      checkedInAt: null,
      createdAt: "2026-10-04T09:30:00Z"
    },
    {
      id: "REG-2026-005",
      ticketCode: "TKT-RB26-8V1Q",
      eventId: "EVT-102",
      eventTitle: "RoboClash: Inter-University Combat Robotics League",
      fullName: "Mohammed Sameer",
      email: "sameer.m@psgtech.ac.in",
      phone: "+91 98765 43214",
      collegeType: "External University",
      collegeName: "PSG College of Technology, Coimbatore",
      studentId: "22M108",
      department: "Mechanical & Mechatronics",
      yearOfStudy: "3rd Year",
      teamName: "TitanBots",
      role: "Driver / Bot Captain",
      dietaryPreference: "Non-Vegetarian",
      status: "approved",
      checkedIn: false,
      checkedInAt: null,
      createdAt: "2026-10-03T15:45:00Z"
    },
    {
      id: "REG-2026-006",
      ticketCode: "TKT-SW26-2F5X",
      eventId: "EVT-103",
      eventTitle: "SoundWave 2026: Battle of the College Bands",
      fullName: "Tanya Jennifer",
      email: "tanya.j@loyolacollege.edu",
      phone: "+91 98765 43215",
      collegeType: "External University",
      collegeName: "Loyola College Autonomous, Chennai",
      studentId: "23-EL-019",
      department: "Visual Communication",
      yearOfStudy: "2nd Year",
      teamName: "The Electric Echoes",
      role: "Lead Vocalist",
      dietaryPreference: "Vegetarian",
      status: "approved",
      checkedIn: false,
      checkedInAt: null,
      createdAt: "2026-10-03T18:10:00Z"
    }
  ],
  adminSettings: {
    universityName: "Apex University of Science & Technology",
    campusLocation: "Knowledge Enclave, South Campus",
    requireApprovalForExternalStudents: true,
    requireApprovalForNewEvents: true,
    allowedDomains: ["university.edu"],
    contactHelpline: "+91 44 2828 9000",
    supportEmail: "events.admin@university.edu"
  }
};

class Database {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else if (fs.existsSync(SEED_FILE)) {
        const raw = fs.readFileSync(SEED_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        this.persist();
      } else {
        this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
        this.persist();
      }
    } catch (err) {
      console.warn('Error reading data file, falling back to initial seed data:', err.message);
      this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
      this.persist();
    }
  }

  persist() {
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database:', err.message);
    }
  }

  // Events
  getEvents(filters = {}) {
    let list = this.data.events;
    if (filters.status) {
      list = list.filter(e => e.status === filters.status);
    }
    if (filters.category) {
      list = list.filter(e => e.category.toLowerCase() === filters.category.toLowerCase());
    }
    return list;
  }

  getEventById(id) {
    return this.data.events.find(e => e.id === id);
  }

  createEvent(eventData) {
    const id = `EVT-${Date.now().toString().slice(-4)}`;
    const newEvent = {
      id,
      registeredCount: 0,
      status: this.data.adminSettings.requireApprovalForNewEvents ? "pending_approval" : "approved",
      createdAt: new Date().toISOString(),
      ...eventData
    };
    this.data.events.push(newEvent);
    this.persist();
    return newEvent;
  }

  updateEvent(id, updates) {
    const idx = this.data.events.findIndex(e => e.id === id);
    if (idx === -1) return null;
    this.data.events[idx] = { ...this.data.events[idx], ...updates, updatedAt: new Date().toISOString() };
    this.persist();
    return this.data.events[idx];
  }

  deleteEvent(id) {
    const idx = this.data.events.findIndex(e => e.id === id);
    if (idx === -1) return false;
    this.data.events.splice(idx, 1);
    // Also cleanup linked schedules, vendors, sponsors, registrations
    this.data.schedules = this.data.schedules.filter(s => s.eventId !== id);
    this.data.vendors = this.data.vendors.filter(v => v.eventId !== id);
    this.data.sponsors = this.data.sponsors.filter(sp => sp.eventId !== id);
    this.persist();
    return true;
  }

  // Schedules
  getSchedules(eventId) {
    if (eventId) {
      return this.data.schedules.filter(s => s.eventId === eventId);
    }
    return this.data.schedules;
  }

  addSchedule(scheduleData) {
    const id = `SCH-${Date.now().toString().slice(-4)}`;
    const newSchedule = { id, ...scheduleData };
    this.data.schedules.push(newSchedule);
    this.persist();
    return newSchedule;
  }

  deleteSchedule(id) {
    const idx = this.data.schedules.findIndex(s => s.id === id);
    if (idx === -1) return false;
    this.data.schedules.splice(idx, 1);
    this.persist();
    return true;
  }

  // Sponsors
  getSponsors(eventId) {
    if (eventId) {
      return this.data.sponsors.filter(s => s.eventId === eventId);
    }
    return this.data.sponsors;
  }

  addSponsor(sponsorData) {
    const id = `SPN-${Date.now().toString().slice(-4)}`;
    const newSponsor = { id, ...sponsorData };
    this.data.sponsors.push(newSponsor);
    this.persist();
    return newSponsor;
  }

  deleteSponsor(id) {
    const idx = this.data.sponsors.findIndex(s => s.id === id);
    if (idx === -1) return false;
    this.data.sponsors.splice(idx, 1);
    this.persist();
    return true;
  }

  // Vendors
  getVendors(eventId) {
    if (eventId) {
      return this.data.vendors.filter(v => v.eventId === eventId);
    }
    return this.data.vendors;
  }

  addVendor(vendorData) {
    const id = `VND-${Date.now().toString().slice(-4)}`;
    const newVendor = { id, status: "Pending Quote", ...vendorData };
    this.data.vendors.push(newVendor);
    this.persist();
    return newVendor;
  }

  updateVendor(id, updates) {
    const idx = this.data.vendors.findIndex(v => v.id === id);
    if (idx === -1) return null;
    this.data.vendors[idx] = { ...this.data.vendors[idx], ...updates };
    this.persist();
    return this.data.vendors[idx];
  }

  deleteVendor(id) {
    const idx = this.data.vendors.findIndex(v => v.id === id);
    if (idx === -1) return false;
    this.data.vendors.splice(idx, 1);
    this.persist();
    return true;
  }

  // Registrations & Ticketing
  getRegistrations(filters = {}) {
    let list = this.data.registrations;
    if (filters.eventId) {
      list = list.filter(r => r.eventId === filters.eventId);
    }
    if (filters.status) {
      list = list.filter(r => r.status === filters.status);
    }
    if (filters.collegeType) {
      list = list.filter(r => r.collegeType === filters.collegeType);
    }
    return list;
  }

  getRegistrationByTicket(ticketCode) {
    return this.data.registrations.find(r => r.ticketCode === ticketCode);
  }

  createRegistration(regData) {
    const id = `REG-2026-${Date.now().toString().slice(-4)}`;
    const eventPrefix = regData.eventTitle ? regData.eventTitle.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X') : 'EVT';
    const randSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const ticketCode = `TKT-${eventPrefix}26-${randSuffix}`;

    // Auto approval rule: internal host university is approved immediately; external may require admin review
    const isInternal = regData.collegeType === "Host University (Internal)";
    const initialStatus = isInternal || !this.data.adminSettings.requireApprovalForExternalStudents ? "approved" : "pending";

    const newReg = {
      id,
      ticketCode,
      status: initialStatus,
      checkedIn: false,
      checkedInAt: null,
      createdAt: new Date().toISOString(),
      ...regData
    };

    this.data.registrations.push(newReg);

    // Update event registered count if approved
    if (initialStatus === "approved") {
      const event = this.getEventById(regData.eventId);
      if (event) {
        event.registeredCount = (event.registeredCount || 0) + 1;
      }
    }

    this.persist();
    return newReg;
  }

  updateRegistrationStatus(id, newStatus) {
    const reg = this.data.registrations.find(r => r.id === id);
    if (!reg) return null;
    const oldStatus = reg.status;
    reg.status = newStatus;

    // Adjust event counter
    const event = this.getEventById(reg.eventId);
    if (event) {
      if (oldStatus !== "approved" && newStatus === "approved") {
        event.registeredCount = (event.registeredCount || 0) + 1;
      } else if (oldStatus === "approved" && newStatus !== "approved") {
        event.registeredCount = Math.max(0, (event.registeredCount || 1) - 1);
      }
    }

    this.persist();
    return reg;
  }

  checkInTicket(ticketCode) {
    const reg = this.getRegistrationByTicket(ticketCode);
    if (!reg) {
      return { success: false, message: "Invalid Ticket Code. No matching registration found." };
    }
    if (reg.status !== "approved") {
      return { success: false, message: `Ticket ${ticketCode} is in '${reg.status}' status and cannot be admitted.` };
    }
    if (reg.checkedIn) {
      return { 
        success: false, 
        alreadyCheckedIn: true, 
        message: `Already checked in at ${new Date(reg.checkedInAt).toLocaleTimeString()}! Duplicate entry alert.`,
        registration: reg 
      };
    }

    reg.checkedIn = true;
    reg.checkedInAt = new Date().toISOString();
    this.persist();
    return { 
      success: true, 
      message: `Verified successfully! Welcome ${reg.fullName} (${reg.collegeName}).`, 
      registration: reg 
    };
  }

  // Admin summary statistics
  getStatistics() {
    const totalEvents = this.data.events.length;
    const approvedEvents = this.data.events.filter(e => e.status === "approved").length;
    const pendingEvents = this.data.events.filter(e => e.status === "pending_approval").length;
    const totalRegistrations = this.data.registrations.length;
    const approvedRegistrations = this.data.registrations.filter(r => r.status === "approved").length;
    const pendingRegistrations = this.data.registrations.filter(r => r.status === "pending").length;
    const externalParticipants = this.data.registrations.filter(r => r.collegeType === "External University").length;
    const internalParticipants = this.data.registrations.filter(r => r.collegeType === "Host University (Internal)").length;
    const checkedInCount = this.data.registrations.filter(r => r.checkedIn).length;

    const totalBudget = this.data.events.reduce((sum, e) => sum + (Number(e.budget) || 0), 0);
    const totalSponsorship = this.data.sponsors.reduce((sum, s) => sum + (Number(s.contributionAmount) || 0), 0);
    const totalVendorQuotes = this.data.vendors.reduce((sum, v) => sum + (Number(v.quotedAmount) || 0), 0);

    return {
      totalEvents,
      approvedEvents,
      pendingEvents,
      totalRegistrations,
      approvedRegistrations,
      pendingRegistrations,
      externalParticipants,
      internalParticipants,
      checkedInCount,
      totalBudget,
      totalSponsorship,
      totalVendorQuotes,
      settings: this.data.adminSettings
    };
  }
}

export const db = new Database();
