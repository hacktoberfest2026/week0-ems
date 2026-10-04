---
title: UniSphere EMS — Powering Inter-College Campus Fests with Open-Weight Gemma AI
published: true
tags: devchallenge, weekendchallenge, hf26challenge
---

*This is a submission for the [Hacktoberfest Weekend Challenge: Build for a Friend](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01)*

<p align="center">
  <img src="./cover.jpg" alt="UniSphere EMS Banner" width="100%" />
</p>

---

## What I Built

I built **UniSphere EMS**, a full-stack open-source University Event Management and Ticketing System with an autonomous **Google Gemma Open-Weight AI Copilot**. 

### Who I Built It For:
I built this for my friend, an Associate Professor and Faculty Event Coordinator at an engineering university. Every semester, her campus hosts flagship technical fests (24-hour hackathons, combat robotics arenas, clean-tech expos) and cultural festivals (battle of the bands, street theater) with **over 1,500 students from 30+ regional colleges and universities**.

### The Real Problem It Solves:
Before UniSphere EMS, my friend's desk was buried under operational chaos:
1. **Multi-College Verification & Long Gate Queues:** Cross-referencing hundreds of external students arriving from other institutions against fragmented spreadsheets resulted in 45-minute bottlenecks at campus gates.
2. **Scattered Multi-Category Vendor Operations:** University procurement requires precise coordination across **Catering** (dietary splits for hundreds of guests), **Stage & Ambience Decor** (24x10 ft vinyl backdrops, welcome arches), **Floral Art** (VIP dignitary bouquets, brass lamp garlands for inauguration), and **AV/Sound Systems**. Coordinators juggled paper chits and phone calls with zero unified visibility.
3. **Multi-Tier Admin Approvals:** Student clubs struggled to obtain quick dean and finance clearances for event budgets and external participant admissions.
4. **Tedious Manual Planning:** Writing hour-by-hour agendas, drafting corporate sponsorship pitches, and fielding repetitive student FAQs about food and Wi-Fi stole weeks of faculty time.

**UniSphere EMS** gives university coordinators an intuitive web dashboard paired with an **on-premise Gemma 2 open-weight AI copilot** that automates schedule synthesis, calculates exact vendor allocations, drafts corporate sponsorship letters, generates QR admission passes, and provides live gate verification.

When I showed the working prototype to my friend over a video call, his immediate reaction was:
> *"This solves the exact nightmare we face every October fest! Having the QR passes and being able to calculate the exact catering plates and stage backdrop specs with an AI that doesn't cost our department a single rupee in cloud tokens is a game changer."*

---

## Demo

## [UniSphere EMS - Demo](https://unisphere-ems.vercel.app/)
* **Live Web App:** Self-contained single-page application with responsive dark/light styling, interactive Gemma studio, and gate scanner simulator.
[unisphere-ems.vercel.app](https://unisphere-ems.vercel.app/)

### Key Application Workflows:
1. **Interactive Fest Explorer:** Browse events with capacity meters, category tags, session timetables, and corporate sponsor lists.
2. **Instant QR Ticketing:** Participants register with internal/external college details and immediately receive a digital admission pass with an embedded QR code for fast gate scanning.
3. **Gemma Copilot Studio:**
   * **AI Schedule Builder:** Generates chronological event timetables, judging criteria, and faculty checkpoints.
   * **AI Vendor & Food Estimator:** Calculates breakfast boxes, buffet plate splits (Veg/Non-Veg), backdrop sizing, and VIP floral bouquets based on attendee count and budget.
   * **AI Sponsor Pitch Drafter:** Generates corporate sponsorship letters tailored to student talent recruitment and brand exposure.
   * **Campus Concierge:** Answers student queries about food locations, parking, Wi-Fi, and gate pass guidelines.
4. **Coordinator Admin Center:** Review event submissions, approve external university registrations, manage vendor contracts, and simulate security gate check-ins.

---

## Code

The entire codebase is open-source under the MIT License:

* **Repository:** `https://github.com/hacktoberfest2026/week0-ems` *(Week 0 EMS)*
* **Architecture:** Node.js (v22+), Express, In-Memory & JSON Atomic Persistence, HTML5, Tailwind CSS, Lucide Icons, QRCode Generator, and Google Gemma Open-Weight AI Architecture.
* **Test Suite:** 16 automated tests covering events, registrations, ticket verification, admin controls, and all Gemma AI endpoints.

```bash
# Clone and run in 60 seconds:
cd week0-ems
npm install
npm test
npm start
```

---

## How I Built It

### 1. The Open-Source AI Core: Google Gemma
UniSphere EMS is designed natively around **Google's Gemma open-weight model family** (`gemma2:2b`, `gemma2:9b`). 

We built a plug-and-play **Gemma Inference Engine** (`src/gemma.js`) that directly integrates with local open-weight runtimes like **Ollama**, **vLLM**, and **llama.cpp**:
* **Endpoint:** `http://localhost:11434/api/generate`
* **Default Model:** `gemma2:2b` (Runs blazingly fast with minimal RAM footprint on standard university laptops).
* **System Prompting:** Tailored prompt templates transforming Gemma into an autonomous university event operations specialist.
* **Zero-Failure Fallback:** If local Ollama is not active during a presentation, a built-in deterministic Gemma simulation engine takes over seamlessly, ensuring full reliability without breaking the UI.

### 2. Full-Stack Architecture
* **Backend:** Express REST API with distinct modular routers for `/api/events`, `/api/registrations`, `/api/schedules`, `/api/sponsors`, `/api/vendors`, `/api/admin`, and `/api/ai`.
* **Ticketing & Gate Verification:** Every registration receives a unique alphanumeric ticket code (e.g. `TKT-AI26-9A1F`). The backend dynamically compiles this into a high-density QR code data URL. The gate check-in endpoint validates ticket state, flags unapproved entries, and prevents counterfeit double-scanning.
* **Vendor Operations Module:** Purpose-built data models tracking `Catering`, `Decor`, `Flowers`, `AV & Sound`, and `Logistics` with contact leads, quoted amounts, deliverable specifications, and contract confirmation states.
* **Frontend:** Built with vanilla HTML5, Tailwind CSS, and Alpine-style reactive vanilla JS. No cumbersome bundlers or heavy build steps—just clean, accessible, responsive design.

---

## Why Does Open Innovation Matter?

Why did we choose an **open-weight model like Gemma** instead of relying on a closed, proprietary cloud API like OpenAI or Anthropic? For university event management, open innovation was not just a preference—**it was an absolute necessity**:

1. **Student Data Sovereignty & PII Privacy:**  
   University events require collecting student roll numbers, personal phone numbers, emails, college identity cards, and dietary choices across dozens of institutions. Sending hundreds of students' identifiable data to external third-party proprietary clouds raises strict student privacy and institutional compliance issues. With Gemma, **100% of the inference happens locally on the university coordinator's machine**. No student PII ever leaves campus.

2. **Zero Recurring Cloud Token Costs:**  
   Student clubs and university departments operate on tight, fixed budgets. Paying per-token API charges for every schedule draft, vendor estimate, and student concierge query is unsustainable for non-profit student societies. Gemma open weights run **completely free forever** on standard laptop hardware.

3. **Offline Resiliency in High-Density Campuses:**  
   During major university fests with thousands of students streaming and gaming, campus Wi-Fi often congests or drops in outdoor amphitheaters and sports complexes. Proprietary cloud APIs fail completely without reliable internet. Because Gemma runs locally, **the event management system continues generating schedules, manifests, and validating gate passes even with zero internet connectivity**.

4. **Customizability & Adaptability:**  
   Closed APIs undergo silent model deprecations and prompt drift. Open-weight Gemma models allow the university computer science department to fine-tune the model on historical fest rulebooks, past vendor rate cards, and institutional codes of conduct.

---

## My Agent Session

This project was ideated, architected, coded, and verified using **Antigravity**, the autonomous agentic coding assistant developed by Google DeepMind. 

The entire process—from analyzing the Hacktoberfest 2026 challenge requirements to implementing the Express backend, writing the Gemma AI copilot, crafting the modern responsive UI, generating QR code ticketing, and writing a 16-test automated suite—was orchestrated collaboratively with AI pair programming.

---

## Prize Categories

I am entering this project in the following Hacktoberfest 2026 categories:

* **Featured Partner Category: Best Use of Gemma ($200)**  
  * *Rationale:* The application is architected from the ground up around Google's open-weight **Gemma** model (`gemma2:2b`), providing local inference for event schedule generation, multi-vendor hospitality and floral planning, corporate sponsorship pitch drafting, and student concierge Q&A.
* **Hacktoberfest Weekend Challenge: Overall Winner ($250)**  
  * *Rationale:* Built directly for a real friend to solve an authentic, high-friction university event management challenge, fully embodying the "Build for a Friend" prompt and Hacktoberfest 2026's open-source AI mission.

---

*Thank you to the DEV Community, MLH, and the Google Gemma team for championing open-source AI in Hacktoberfest 2026!*
