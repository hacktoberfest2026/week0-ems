import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { eventsRouter } from './routes/events.js';
import { schedulesRouter } from './routes/schedules.js';
import { sponsorsRouter } from './routes/sponsors.js';
import { vendorsRouter } from './routes/vendors.js';
import { registrationsRouter } from './routes/registrations.js';
import { adminRouter } from './routes/admin.js';
import { aiRouter } from './routes/ai.js';
import { gemma } from './gemma.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static assets
app.use(express.static(path.join(__dirname, '..', 'public')));

// Mount API routes
app.use('/api/events', eventsRouter);
app.use('/api/schedules', schedulesRouter);
app.use('/api/sponsors', sponsorsRouter);
app.use('/api/vendors', vendorsRouter);
app.use('/api/registrations', registrationsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/ai', aiRouter);

// Root fallback / SPA route
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start Server
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, async () => {
    console.log(`\n=============================================================`);
    console.log(`🎓 UniSphere EMS - University Event Management System`);
    console.log(`🚀 Powered by Google Gemma Open-Weight AI Architecture`);
    console.log(`🎯 Built for Hacktoberfest 2026: "Build for a Friend"`);
    console.log(`=============================================================`);
    console.log(`🌐 Server running at: http://localhost:${PORT}`);
    console.log(`📋 API Docs & Endpoints:`);
    console.log(`   - Events:        http://localhost:${PORT}/api/events`);
    console.log(`   - Registrations: http://localhost:${PORT}/api/registrations`);
    console.log(`   - Vendors:       http://localhost:${PORT}/api/vendors`);
    console.log(`   - Gemma AI:      http://localhost:${PORT}/api/ai/health`);
    console.log(`   - Admin Stats:   http://localhost:${PORT}/api/admin/stats`);

    // Check Gemma health on boot
    const health = await gemma.checkConnection();
    console.log(`🤖 Gemma AI Status: [${health.provider}]`);
    console.log(`💡 ${health.message}`);
    console.log(`=============================================================\n`);
  });
}

export default app;
