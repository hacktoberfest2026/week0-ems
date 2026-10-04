/**
 * UniSphere EMS - Application Controller
 * High-polish SaaS Theme matching reference designs
 * Features: Dashboard Widgets, Pastel Event Cards, Fast Gate Check-in,
 * Vendors Procurement (Catering, Decor, Flowers, AV), Gemma AI Studio,
 * System Settings & University Support Helpdesk.
 */

class AppController {
  constructor() {
    this.events = [];
    this.activeView = 'dashboard';
    this.eventFilterTab = 'active';
    this.recentTicketCode = null;

    document.addEventListener('DOMContentLoaded', () => {
      this.init();
    });
  }

  async init() {
    this.loadSettings();
    await this.loadEvents();
    await this.loadStats();
    await this.renderEventsTable();
    await this.renderVendorsTable();
    await this.renderSponsorsTable();
    await this.renderParticipantTasks();
    this.refreshIcons();

    // Close popovers on click outside
    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('profile-dropdown');
      if (dropdown && !dropdown.contains(e.target) && !e.target.closest('[onclick*="toggleProfileDropdown"]')) {
        dropdown.classList.add('hidden');
      }
    });
  }

  refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  showToast(title, message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const colors = {
      success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
      error: 'border-rose-200 bg-rose-50 text-rose-800',
      warning: 'border-amber-200 bg-amber-50 text-amber-800',
      info: 'border-purple-200 bg-purple-50 text-purple-800'
    };

    const toast = document.createElement('div');
    toast.className = `pointer-events-auto p-4 rounded-2xl border shadow-xl flex items-start gap-3 max-w-sm transition-all transform duration-300 translate-y-2 opacity-0 ${colors[type] || colors.info}`;
    toast.innerHTML = `
      <div class="mt-0.5 font-bold">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</div>
      <div class="flex-1 text-xs">
        <p class="font-bold">${title}</p>
        <p class="text-slate-600 mt-0.5">${message}</p>
      </div>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.remove('translate-y-2', 'opacity-0'));

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Navigation
  navigate(viewId) {
    this.activeView = viewId;
    const views = ['dashboard', 'events', 'tasks', 'vendors', 'sponsors', 'tickets', 'scanner', 'gemma', 'settings', 'support'];
    
    views.forEach(v => {
      const el = document.getElementById(`view-${v}`);
      const btn = document.getElementById(`nav-${v}`);
      if (el) el.classList.toggle('hidden', v !== viewId);
      if (btn) {
        if (v === viewId) {
          btn.className = "sidebar-item active w-full";
        } else {
          btn.className = "sidebar-item w-full";
        }
      }
    });

    if (viewId === 'events') {
      this.renderEventsPastelCards();
      this.renderEventsTable();
    }
    if (viewId === 'vendors') {
      this.renderVendorsTable();
    }
    if (viewId === 'tasks') {
      this.renderParticipantTasks();
    }
    if (viewId === 'sponsors') {
      this.renderSponsorsTable();
    }
    if (viewId === 'settings') {
      this.loadSettings();
    }
    if (viewId === 'tickets' && this.recentTicketCode) {
      document.getElementById('ticket-search-code').value = this.recentTicketCode;
      this.fetchTicketPass();
    }

    this.refreshIcons();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleProfileDropdown() {
    const d = document.getElementById('profile-dropdown');
    if (d) d.classList.toggle('hidden');
    this.refreshIcons();
  }

  toggleNotifications() {
    this.showToast('Notifications', 'All 4 inter-college event tracks are operating on schedule.', 'info');
  }

  handleGlobalSearch(query) {
    const q = query.toLowerCase();
    if (this.activeView === 'events' || this.activeView === 'dashboard') {
      this.renderEventsTable(q);
    }
  }

  // Load Events Data
  async loadEvents() {
    try {
      const res = await fetch('/api/events');
      const json = await res.json();
      if (json.success) {
        this.events = json.data;
        this.renderEventsPastelCards();
        this.renderEventsTable();
      }
    } catch (e) {
      console.warn('Failed to load events:', e);
    }
  }

  async loadStats() {
    try {
      const res = await fetch('/api/admin/stats');
      const json = await res.json();
      if (json.success) {
        const s = json.data;
        const activeCount = document.getElementById('badge-active-count');
        const pendingCount = document.getElementById('badge-pending-count');
        if (activeCount) activeCount.textContent = s.approvedEvents;
        if (pendingCount) pendingCount.textContent = s.pendingEvents;
      }
    } catch (e) {
      console.warn('Failed to load stats:', e);
    }
  }

  // Render Pastel Cards (Image 1 & 2)
  renderEventsPastelCards() {
    const container = document.getElementById('events-pastel-cards');
    if (!container) return;

    const pastels = [
      { class: 'card-pastel-pink', icon: '💻', iconBg: 'bg-pink-100 text-pink-600', badgeBorder: 'border-pink-200 text-pink-700', barBg: 'bg-pink-500', barTrack: 'bg-pink-200/70' },
      { class: 'card-pastel-blue', icon: '🤖', iconBg: 'bg-sky-100 text-sky-600', badgeBorder: 'border-sky-200 text-sky-700', barBg: 'bg-sky-500', barTrack: 'bg-sky-200/70' },
      { class: 'card-pastel-peach', icon: '🎸', iconBg: 'bg-amber-100 text-amber-600', badgeBorder: 'border-amber-200 text-amber-700', barBg: 'bg-amber-500', barTrack: 'bg-amber-200/70' },
      { class: 'card-pastel-teal', icon: '🌿', iconBg: 'bg-teal-100 text-teal-600', badgeBorder: 'border-teal-200 text-teal-700', barBg: 'bg-teal-500', barTrack: 'bg-teal-200/70' }
    ];

    container.innerHTML = this.events.slice(0, 4).map((e, idx) => {
      const p = pastels[idx % pastels.length];
      const percent = Math.min(100, Math.round(((e.registeredCount || 2) / e.maxCapacity) * 100));
      return `
        <div class="${p.class} p-5 rounded-3xl space-y-4 shadow-sm hover:shadow-md transition-all cursor-pointer" onclick="app.openEventDetails('${e.id}')">
          <div class="flex items-center justify-between">
            <div class="w-10 h-10 rounded-2xl ${p.iconBg} flex items-center justify-center font-bold text-base">
              ${p.icon}
            </div>
            <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/80 border ${p.badgeBorder}">
              ${e.date}
            </span>
          </div>
          <div>
            <h3 class="font-extrabold text-base text-slate-900 line-clamp-1">${e.title}</h3>
            <p class="text-xs text-slate-500 mt-0.5 font-mono">Capacity: ${e.registeredCount || 0} / ${e.maxCapacity}</p>
          </div>
          <div class="space-y-1.5">
            <div class="flex justify-between text-xs font-bold text-slate-700">
              <span>Progress</span>
              <span>${percent}%</span>
            </div>
            <div class="w-full h-1.5 ${p.barTrack} rounded-full overflow-hidden">
              <div class="h-full ${p.barBg} rounded-full" style="width: ${percent}%"></div>
            </div>
          </div>
          <div class="flex items-center justify-between pt-2">
            <span class="text-[11px] text-slate-400 font-medium">${e.coordinator}</span>
            <div class="flex -space-x-2">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80" class="w-6 h-6 rounded-full border border-white object-cover">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80" class="w-6 h-6 rounded-full border border-white object-cover">
            </div>
          </div>
        </div>
      `;
    }).join('');

    this.refreshIcons();
  }

  // Filter Event Table Tabs (Active / Pending)
  filterEventTable(tab) {
    this.eventFilterTab = tab;
    const btnActive = document.getElementById('btn-tab-active');
    const btnPending = document.getElementById('btn-tab-pending');

    if (tab === 'active') {
      btnActive.className = "px-3 py-1 rounded-xl text-xs font-bold bg-primary-100 text-primary-800";
      btnPending.className = "px-3 py-1 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100";
    } else {
      btnActive.className = "px-3 py-1 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100";
      btnPending.className = "px-3 py-1 rounded-xl text-xs font-bold bg-primary-100 text-primary-800";
    }
    this.renderEventsTable();
  }

  // Render Table (Reference Image 1)
  async renderEventsTable(searchTerm = '') {
    const tbody = document.getElementById('events-table-body');
    if (!tbody) return;

    const catFilter = document.getElementById('event-type-filter')?.value || 'all';

    let list = this.events;
    if (this.eventFilterTab === 'active') {
      list = list.filter(e => e.status === 'approved');
    } else {
      list = list.filter(e => e.status === 'pending_approval');
    }

    if (catFilter !== 'all') {
      list = list.filter(e => e.category === catFilter);
    }
    if (searchTerm) {
      list = list.filter(e => e.title.toLowerCase().includes(searchTerm) || e.venue.toLowerCase().includes(searchTerm));
    }

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-slate-400">No events found under this view.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(e => `
      <tr class="hover:bg-slate-50/70 transition-colors">
        <td class="p-3.5 font-bold text-slate-900 cursor-pointer hover:text-primary-600" onclick="app.openEventDetails('${e.id}')">
          ${e.title}
        </td>
        <td class="p-3.5 text-xs text-slate-500 font-mono">${e.date}</td>
        <td class="p-3.5">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold ${e.category === 'Technical' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}">
            ${e.category}
          </span>
        </td>
        <td class="p-3.5 text-xs">
          <div class="flex items-center gap-2">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80" class="w-6 h-6 rounded-full object-cover">
            <span class="text-slate-700 font-medium">${e.coordinator}</span>
          </div>
        </td>
        <td class="p-3.5 text-xs font-mono font-bold text-slate-800">
          ${e.registeredCount || 0} / ${e.maxCapacity}
        </td>
        <td class="p-3.5">
          <span class="px-2.5 py-1 rounded-full text-xs font-bold ${e.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}">
            ${e.status === 'approved' ? 'Upcoming' : 'Pending'}
          </span>
        </td>
        <td class="p-3.5 text-right space-x-1">
          <button onclick="app.openRegistrationModal('${e.id}')" class="px-2.5 py-1 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 font-bold text-xs transition-colors">
            Register
          </button>
          <button onclick="app.openEventDetails('${e.id}')" class="text-slate-400 hover:text-slate-700 p-1">
            <i data-lucide="more-vertical" class="w-4 h-4"></i>
          </button>
        </td>
      </tr>
    `).join('');

    this.refreshIcons();
  }

  // Render Vendors Table (Image 3)
  async renderVendorsTable() {
    const tbody = document.getElementById('vendors-table-body');
    if (!tbody) return;

    try {
      const res = await fetch('/api/vendors');
      const json = await res.json();
      if (json.success) {
        const list = json.data;

        tbody.innerHTML = list.map(v => `
          <tr class="hover:bg-slate-50/70 transition-colors">
            <td class="p-3.5">
              <span class="px-2.5 py-1 rounded-full text-xs font-bold ${
                v.category === 'Catering' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                v.category === 'Flowers' ? 'bg-pink-50 text-pink-700 border border-pink-200' :
                v.category === 'Decor' ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
              }">${v.category}</span>
            </td>
            <td class="p-3.5">
              <strong class="text-slate-900">${v.vendorName}</strong>
              <p class="text-xs text-slate-400 font-mono">${v.contactPerson} (${v.phone})</p>
            </td>
            <td class="p-3.5 font-mono text-xs text-slate-500">${v.eventId}</td>
            <td class="p-3.5 text-xs text-slate-600 max-w-xs">${v.deliverables}</td>
            <td class="p-3.5 font-mono font-extrabold text-slate-900">₹${v.quotedAmount.toLocaleString()}</td>
            <td class="p-3.5">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold ${v.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}">
                ${v.status}
              </span>
            </td>
            <td class="p-3.5 text-right">
              <button onclick="app.deleteVendor('${v.id}')" class="text-slate-400 hover:text-rose-600 p-1">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </td>
          </tr>
        `).join('');

        this.refreshIcons();
      }
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="7" class="p-4 text-center text-rose-500">Failed to load vendors</td></tr>`;
    }
  }

  // Render Tasks & Participant Approvals
  async renderParticipantTasks() {
    const tbody = document.getElementById('tasks-table-body');
    if (!tbody) return;

    const filter = document.getElementById('task-filter-status')?.value || 'all';

    try {
      const res = await fetch('/api/registrations');
      const json = await res.json();
      if (json.success) {
        let list = json.data;
        if (filter === 'pending') list = list.filter(r => r.status === 'pending');
        if (filter === 'approved') list = list.filter(r => r.status === 'approved');

        tbody.innerHTML = list.map(r => `
          <tr class="hover:bg-slate-50/70 transition-colors">
            <td class="p-3.5">
              <span class="font-mono text-xs font-bold text-primary-600">${r.ticketCode}</span>
              <p class="font-bold text-slate-900 text-sm mt-0.5">${r.fullName}</p>
              <p class="text-xs text-slate-400 font-mono">${r.email}</p>
            </td>
            <td class="p-3.5 text-xs">
              <strong class="text-slate-800">${r.collegeName}</strong>
              <p class="text-slate-400 font-mono mt-0.5">${r.collegeType} (ID: ${r.studentId})</p>
            </td>
            <td class="p-3.5 text-xs font-medium text-slate-700">${r.eventTitle}</td>
            <td class="p-3.5 text-xs text-slate-500 font-mono">🍽️ ${r.dietaryPreference}</td>
            <td class="p-3.5">
              <span class="px-2.5 py-1 rounded-full text-xs font-bold ${r.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}">
                ${r.status}
              </span>
              ${r.checkedIn ? '<span class="ml-1 text-xs text-emerald-600 font-bold">✓ Admitted</span>' : ''}
            </td>
            <td class="p-3.5 text-right space-x-1">
              ${r.status !== 'approved' ? `
                <button onclick="app.updateParticipantStatus('${r.id}', 'approved')" class="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors">Approve</button>
                <button onclick="app.updateParticipantStatus('${r.id}', 'rejected')" class="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors">Reject</button>
              ` : `
                <button onclick="app.updateParticipantStatus('${r.id}', 'pending')" class="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs">Revoke</button>
              `}
            </td>
          </tr>
        `).join('');

        this.refreshIcons();
      }
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-rose-500">Failed to load tasks</td></tr>`;
    }
  }

  async updateParticipantStatus(regId, newStatus) {
    try {
      const res = await fetch(`/api/admin/registrations/${regId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const json = await res.json();
      if (json.success) {
        this.showToast('Registration Updated', json.message, 'success');
        await this.renderParticipantTasks();
        await this.loadStats();
      }
    } catch (e) {
      this.showToast('Error', e.message, 'error');
    }
  }

  // Render Sponsors Table
  async renderSponsorsTable() {
    const tbody = document.getElementById('sponsors-table-body');
    if (!tbody) return;

    try {
      const res = await fetch('/api/sponsors');
      const json = await res.json();
      if (json.success) {
        tbody.innerHTML = json.data.map(sp => `
          <tr class="hover:bg-slate-50/70 transition-colors">
            <td class="p-3.5 font-bold text-slate-900">${sp.companyName}</td>
            <td class="p-3.5"><span class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">${sp.tier}</span></td>
            <td class="p-3.5 font-mono font-extrabold text-emerald-600">₹${sp.contributionAmount.toLocaleString()}</td>
            <td class="p-3.5 text-xs text-slate-600">${sp.contactPerson}<br><span class="font-mono text-slate-400">${sp.contactEmail}</span></td>
            <td class="p-3.5 text-xs text-slate-500 max-w-xs">${sp.perks}</td>
            <td class="p-3.5 text-right">
              <button onclick="app.deleteSponsor('${sp.id}')" class="text-slate-400 hover:text-rose-600 p-1">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </td>
          </tr>
        `).join('');
        this.refreshIcons();
      }
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-rose-500">Failed to load sponsors</td></tr>`;
    }
  }

  // Gate Scanner Simulator
  async scanGateTicket() {
    const input = document.getElementById('gate-scanner-input');
    const resultBox = document.getElementById('gate-scan-result');
    const code = input.value.trim().toUpperCase();

    if (!code) {
      resultBox.innerHTML = `<span class="text-amber-600 font-bold">Please enter a ticket code</span>`;
      return;
    }

    resultBox.innerHTML = `<span class="text-slate-500">Scanning ticket ${code}...</span>`;

    try {
      const res = await fetch('/api/registrations/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketCode: code })
      });
      const json = await res.json();

      if (json.success) {
        resultBox.innerHTML = `
          <div class="text-emerald-700 text-left w-full space-y-1">
            <p class="font-bold flex items-center gap-1.5">✓ PASS VERIFIED — ADMISSION GRANTED</p>
            <p class="text-slate-900 font-semibold text-xs">${json.message}</p>
            <p class="text-slate-500 text-xs font-mono">College: ${json.registration.collegeName}</p>
          </div>
        `;
        this.showToast('Admission Granted', `Welcome ${json.registration.fullName}!`, 'success');
      } else {
        const isDuplicate = json.alreadyCheckedIn;
        resultBox.innerHTML = `
          <div class="${isDuplicate ? 'text-amber-700' : 'text-rose-700'} text-left w-full space-y-1">
            <p class="font-bold">✕ ${isDuplicate ? 'DUPLICATE SCAN ALERT' : 'ADMISSION DENIED'}</p>
            <p class="text-slate-600 text-xs">${json.message}</p>
          </div>
        `;
        this.showToast('Check-in Alert', json.message, isDuplicate ? 'warning' : 'error');
      }
    } catch (e) {
      resultBox.innerHTML = `<span class="text-rose-600">Verification error: ${e.message}</span>`;
    }
  }

  // Open Event Details Modal
  async openEventDetails(eventId) {
    const modal = document.getElementById('event-details-modal');
    const content = document.getElementById('event-modal-content');
    const regBtn = document.getElementById('event-modal-register-btn');

    content.innerHTML = `
      <div class="py-12 text-center text-slate-400">
        <i data-lucide="loader" class="w-6 h-6 animate-spin mx-auto mb-2 text-primary-600"></i>
        <p>Loading event timetable, sponsors & vendors...</p>
      </div>
    `;
    modal.classList.remove('hidden');
    this.refreshIcons();

    try {
      const res = await fetch(`/api/events/${eventId}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      const e = json.data;
      regBtn.onclick = () => {
        this.closeModal('event-details-modal');
        this.openRegistrationModal(e.id);
      };

      content.innerHTML = `
        <div class="space-y-5">
          <div class="flex justify-between items-start">
            <div>
              <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-primary-50 text-primary-700 border border-primary-100">
                ${e.category}
              </span>
              <h2 class="text-2xl font-extrabold text-slate-900 mt-2">${e.title}</h2>
              <p class="text-xs text-slate-500 mt-0.5">Organized by: <strong class="text-slate-700">${e.organizer}</strong></p>
            </div>
            <div class="text-right font-mono text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <p class="font-bold text-primary-600">📅 ${e.date}</p>
              <p class="text-slate-500 mt-0.5">📍 ${e.venue}</p>
            </div>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h4 class="font-bold text-slate-900 mb-1">Overview</h4>
            <p>${e.description}</p>
            <p class="text-xs text-slate-500 mt-2 font-mono">Faculty Lead: ${e.coordinator} (${e.coordinatorContact})</p>
          </div>

          <div class="space-y-2.5">
            <h4 class="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <i data-lucide="clock" class="w-4 h-4 text-primary-600"></i> Timetable & Agenda
            </h4>
            ${e.schedules && e.schedules.length > 0 ? e.schedules.map(s => `
              <div class="p-3 bg-white border border-slate-100 rounded-xl text-xs flex justify-between items-center shadow-xs">
                <div>
                  <span class="font-mono text-primary-600 font-bold">${s.time}</span>
                  <p class="font-bold text-slate-800 text-sm mt-0.5">${s.title}</p>
                  <p class="text-slate-400 mt-0.5 font-mono text-xs">Lead: ${s.speakerOrLead} | Room: ${s.venue}</p>
                </div>
              </div>
            `).join('') : '<p class="text-xs text-slate-400 italic">No formal schedule registered yet.</p>'}
          </div>
        </div>
      `;

      this.refreshIcons();
    } catch (err) {
      content.innerHTML = `<p class="text-rose-500 text-sm">Failed to load details: ${err.message}</p>`;
    }
  }

  openRegistrationModal(eventId) {
    const event = this.events.find(e => e.id === eventId);
    if (!event) return;

    document.getElementById('reg-event-id').value = event.id;
    document.getElementById('reg-event-title').value = event.title;
    document.getElementById('registration-modal').classList.remove('hidden');
    this.refreshIcons();
  }

  onCollegeTypeChange(type) {
    const input = document.getElementById('reg-college-name');
    if (type.includes('Internal')) {
      input.value = 'Apex University of Science & Technology';
    } else {
      input.value = '';
      input.placeholder = 'e.g. Madras Institute of Technology (Anna Univ)';
    }
  }

  // Registration Submit
  async submitRegistration(ev) {
    ev.preventDefault();
    const btn = document.getElementById('btn-submit-reg');
    btn.disabled = true;
    btn.textContent = 'Processing...';

    const payload = {
      eventId: document.getElementById('reg-event-id').value,
      fullName: document.getElementById('reg-name').value,
      studentId: document.getElementById('reg-student-id').value,
      email: document.getElementById('reg-email').value,
      phone: document.getElementById('reg-phone').value,
      collegeType: document.getElementById('reg-college-type').value,
      collegeName: document.getElementById('reg-college-name').value,
      department: document.getElementById('reg-department').value,
      dietaryPreference: document.getElementById('reg-diet').value
    };

    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();

      if (json.success) {
        this.closeModal('registration-modal');
        this.recentTicketCode = json.data.ticketCode;
        this.showToast('Registration Confirmed', json.message, 'success');
        this.navigate('tickets');
        this.renderTicketPass(json.data);
        await this.loadEvents();
      } else {
        this.showToast('Registration Error', json.message, 'error');
      }
    } catch (e) {
      this.showToast('Network Error', e.message, 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Complete Registration & Issue Pass';
    }
  }

  // Retrieve Ticket Pass
  async fetchTicketPass() {
    const code = document.getElementById('ticket-search-code').value.trim();
    if (!code) {
      this.showToast('Input Required', 'Please enter a ticket code', 'warning');
      return;
    }

    const container = document.getElementById('ticket-pass-container');
    container.innerHTML = `
      <div class="p-8 text-center text-slate-400">
        <i data-lucide="loader" class="w-6 h-6 animate-spin mx-auto mb-2 text-primary-600"></i>
        <p>Retrieving pass...</p>
      </div>
    `;
    this.refreshIcons();

    try {
      const res = await fetch(`/api/registrations/ticket/${encodeURIComponent(code)}`);
      const json = await res.json();
      if (json.success) {
        this.renderTicketPass(json.data);
      } else {
        container.innerHTML = `
          <div class="p-6 text-center text-rose-600 bg-rose-50 border border-rose-100 rounded-3xl">
            <p class="font-bold">Ticket Not Found</p>
            <p class="text-xs text-slate-500 mt-1">${json.message}</p>
          </div>
        `;
      }
    } catch (e) {
      container.innerHTML = `<p class="text-rose-500 text-center">Failed to fetch ticket: ${e.message}</p>`;
    }
  }

  // Render Digital Boarding Pass
  renderTicketPass(ticket) {
    const container = document.getElementById('ticket-pass-container');
    const isApproved = ticket.status === 'approved';

    container.innerHTML = `
      <div class="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-app">
        <!-- Header -->
        <div class="p-6 bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 border-b border-slate-100 flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-white text-primary-600 flex items-center justify-center font-bold text-lg shadow-sm">
              🎟️
            </div>
            <div>
              <span class="text-[10px] font-mono uppercase font-bold text-primary-600">Digital Admission Pass</span>
              <h3 class="text-lg font-extrabold text-slate-900">${ticket.eventTitle}</h3>
            </div>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-bold ${isApproved ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}">
            ${ticket.status}
          </span>
        </div>

        <div class="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div class="md:col-span-8 space-y-4 text-xs sm:text-sm">
            <div class="grid grid-cols-2 gap-4 pb-3 border-b border-slate-100">
              <div>
                <p class="text-xs text-slate-400 uppercase font-mono">Participant</p>
                <p class="text-base font-bold text-slate-900">${ticket.fullName}</p>
                <p class="text-xs text-slate-400 font-mono mt-0.5">${ticket.studentId}</p>
              </div>
              <div>
                <p class="text-xs text-slate-400 uppercase font-mono">Ticket Code</p>
                <p class="text-base font-mono font-extrabold text-primary-600 tracking-wide">${ticket.ticketCode}</p>
                <p class="text-xs text-slate-500 mt-0.5">🍽️ ${ticket.dietaryPreference}</p>
              </div>
            </div>

            <div>
              <p class="text-xs text-slate-400 uppercase font-mono">University</p>
              <p class="font-bold text-slate-800">${ticket.collegeName}</p>
              <p class="text-xs text-slate-400 font-mono mt-0.5">${ticket.collegeType}</p>
            </div>
          </div>

          <div class="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            ${ticket.qrCode ? `
              <div class="p-2 bg-white rounded-xl shadow-xs mb-2">
                <img src="${ticket.qrCode}" alt="Ticket QR" class="w-32 h-32">
              </div>
            ` : ''}
            <p class="text-[11px] font-mono text-slate-400">Scan at Entrance Gate</p>
            <p class="text-xs font-mono font-bold text-primary-600 mt-0.5">${ticket.ticketCode}</p>
          </div>
        </div>

        <div class="px-6 py-3 bg-slate-50/70 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
          <span>Carry physical college ID card along with this pass.</span>
          <button onclick="window.print()" class="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50">
            Print Pass
          </button>
        </div>
      </div>
    `;

    this.refreshIcons();
  }

  // Gemma AI Studio Tabs
  setGemmaTab(tabId) {
    ['schedule', 'vendors', 'sponsors', 'concierge'].forEach(t => {
      const panel = document.getElementById(`gemma-panel-${t}`);
      const btn = document.getElementById(`gemma-tab-${t}`);
      if (panel) panel.classList.toggle('hidden', t !== tabId);
      if (btn) {
        if (t === tabId) {
          btn.className = "px-4 py-2 rounded-xl bg-primary-100 text-primary-800 font-bold text-xs";
        } else {
          btn.className = "px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs";
        }
      }
    });
  }

  async runGemmaSchedule() {
    const btn = document.getElementById('btn-run-schedule');
    const out = document.getElementById('gemma-schedule-result');
    btn.disabled = true;
    btn.textContent = 'Generating...';
    out.textContent = 'Gemma is synthesizing timetable, judging criteria, and faculty checkpoints...';

    const payload = {
      title: document.getElementById('gemma-sch-title').value,
      category: document.getElementById('gemma-sch-cat').value,
      durationHours: document.getElementById('gemma-sch-duration').value,
      venue: document.getElementById('gemma-sch-venue').value,
      attendeeCount: document.getElementById('gemma-sch-attendees').value
    };

    try {
      const res = await fetch('/api/ai/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        out.textContent = json.data.output;
        this.showToast('Gemma Synthesis Complete', 'Generated using Gemma 2 AI', 'success');
      }
    } catch (e) {
      out.textContent = `Error: ${e.message}`;
    } finally {
      btn.disabled = false;
      btn.textContent = 'Synthesize Schedule via Gemma';
    }
  }

  async runGemmaVendors() {
    const btn = document.getElementById('btn-run-vendors');
    const out = document.getElementById('gemma-vendor-result');
    btn.disabled = true;
    btn.textContent = 'Calculating...';
    out.textContent = 'Calculating catering buffet counts, stage backdrop sizing, and VIP floral decor...';

    const payload = {
      title: document.getElementById('gemma-vnd-title').value,
      attendeeCount: document.getElementById('gemma-vnd-attendees').value,
      budget: document.getElementById('gemma-vnd-budget').value
    };

    try {
      const res = await fetch('/api/ai/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        out.textContent = json.data.output;
        this.showToast('Manifest Generated', 'Estimated via Gemma 2 AI', 'success');
      }
    } catch (e) {
      out.textContent = `Error: ${e.message}`;
    } finally {
      btn.disabled = false;
      btn.textContent = 'Calculate Vendor Quotas';
    }
  }

  async runGemmaSponsors() {
    const btn = document.getElementById('btn-run-sponsors');
    const out = document.getElementById('gemma-sponsor-result');
    btn.disabled = true;
    btn.textContent = 'Drafting...';
    out.textContent = 'Formulating corporate sponsorship proposal...';

    const payload = {
      title: document.getElementById('gemma-spn-title').value,
      targetSponsor: document.getElementById('gemma-spn-target').value,
      sponsorTier: document.getElementById('gemma-spn-tier').value
    };

    try {
      const res = await fetch('/api/ai/sponsor-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        out.textContent = json.data.output;
        this.showToast('Proposal Drafted', 'Created via Gemma 2 AI', 'success');
      }
    } catch (e) {
      out.textContent = `Error: ${e.message}`;
    } finally {
      btn.disabled = false;
      btn.textContent = 'Draft Sponsorship Letter';
    }
  }

  async sendConciergeMessage() {
    const input = document.getElementById('concierge-input');
    const msg = input.value.trim();
    if (!msg) return;

    input.value = '';
    const history = document.getElementById('concierge-chat-history');
    
    // User message
    history.innerHTML += `
      <div class="flex items-start gap-2.5 justify-end">
        <div class="bg-primary-600 text-white p-3 rounded-2xl text-xs sm:text-sm max-w-[85%]">
          ${msg}
        </div>
      </div>
    `;

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      });
      const json = await res.json();
      if (json.success) {
        history.innerHTML += `
          <div class="flex items-start gap-2.5">
            <div class="w-6 h-6 rounded-full bg-purple-200 text-purple-800 flex items-center justify-center text-xs font-bold shrink-0">G</div>
            <div class="bg-white p-3 rounded-2xl border border-slate-100 text-slate-700 shadow-sm leading-relaxed whitespace-pre-line text-xs sm:text-sm max-w-[85%]">
              ${json.data.output}
            </div>
          </div>
        `;
      }
    } catch (e) {
      history.innerHTML += `<p class="text-rose-500 text-xs">Concierge unavailable.</p>`;
    }

    history.scrollTop = history.scrollHeight;
  }

  copyGemmaOutput(id) {
    const text = document.getElementById(id).innerText;
    navigator.clipboard.writeText(text);
    this.showToast('Copied', 'Gemma output copied to clipboard', 'info');
  }

  // Modals
  openNewEventModal() {
    document.getElementById('new-event-modal').classList.remove('hidden');
    this.refreshIcons();
  }

  openNewVendorModal() {
    const select = document.getElementById('vnd-event-select');
    select.innerHTML = this.events.map(e => `<option value="${e.id}">${e.title}</option>`).join('');
    document.getElementById('new-vendor-modal').classList.remove('hidden');
    this.refreshIcons();
  }

  openNewSponsorModal() {
    const select = document.getElementById('spn-event-select');
    select.innerHTML = this.events.map(e => `<option value="${e.id}">${e.title}</option>`).join('');
    document.getElementById('new-sponsor-modal').classList.remove('hidden');
    this.refreshIcons();
  }

  openNewTaskModal() {
    this.showToast('Task Planner', 'Tasks are automatically coordinated with festival departments.', 'info');
  }

  openSupportModal() {
    this.navigate('support');
  }

  loadSettings() {
    const defaults = {
      userName: 'Alex Morgan',
      userRole: 'Campus Event Manager & Faculty Lead',
      userEmail: 'alex.morgan@unisphere.edu',
      userDept: 'Student Affairs & Event Operations',
      univName: 'Apex Institute of Technology & Sciences',
      campusHub: 'Main Campus - Central Auditorium & Tech Quad',
      timezone: 'Asia/Kolkata (IST)',
      accessPolicy: 'open-verified',
      autoApproveHost: true,
      requireExternalId: true,
      qrWatermark: true,
      scannerFeedback: true,
      gemmaModel: 'gemma-2-9b-it',
      aiAutonomousSchedule: true,
      aiVendorGuardrails: true,
      aiCreativity: 0.4,
      alertGateInflow: true,
      alertSponsorMilestones: true,
      alertCateringThreshold: true
    };

    let saved = {};
    try {
      const raw = localStorage.getItem('unisphere_settings');
      if (raw) saved = JSON.parse(raw);
    } catch (e) {}

    const config = { ...defaults, ...saved };

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    };
    const setChecked = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.checked = Boolean(val);
    };

    setVal('settings-user-name', config.userName);
    setVal('settings-user-role', config.userRole);
    setVal('settings-user-email', config.userEmail);
    setVal('settings-user-dept', config.userDept);
    setVal('settings-univ-name', config.univName);
    setVal('settings-campus-hub', config.campusHub);
    setVal('settings-timezone', config.timezone);
    setVal('settings-access-policy', config.accessPolicy);
    setChecked('settings-auto-approve', config.autoApproveHost);
    setChecked('settings-require-id', config.requireExternalId);
    setChecked('settings-qr-watermark', config.qrWatermark);
    setChecked('settings-scanner-feedback', config.scannerFeedback);
    setVal('settings-gemma-model', config.gemmaModel);
    setChecked('settings-ai-schedule', config.aiAutonomousSchedule);
    setChecked('settings-ai-vendor', config.aiVendorGuardrails);
    setVal('settings-ai-creativity', config.aiCreativity);
    const tempVal = document.getElementById('temp-val');
    if (tempVal) tempVal.textContent = config.aiCreativity;
    setChecked('settings-alert-gate', config.alertGateInflow);
    setChecked('settings-alert-sponsor', config.alertSponsorMilestones);
    setChecked('settings-alert-catering', config.alertCateringThreshold);

    this.updateProfileUI(config.userName, config.userRole);
  }

  saveSettings(event) {
    if (event) event.preventDefault();

    const getVal = (id, fallback) => document.getElementById(id)?.value || fallback;
    const getChecked = (id, fallback) => {
      const el = document.getElementById(id);
      return el ? el.checked : fallback;
    };

    const config = {
      userName: getVal('settings-user-name', 'Alex Morgan'),
      userRole: getVal('settings-user-role', 'Campus Event Manager & Faculty Lead'),
      userEmail: getVal('settings-user-email', 'alex.morgan@unisphere.edu'),
      userDept: getVal('settings-user-dept', 'Student Affairs & Event Operations'),
      univName: getVal('settings-univ-name', 'Apex Institute of Technology & Sciences'),
      campusHub: getVal('settings-campus-hub', 'Main Campus - Central Auditorium & Tech Quad'),
      timezone: getVal('settings-timezone', 'Asia/Kolkata (IST)'),
      accessPolicy: getVal('settings-access-policy', 'open-verified'),
      autoApproveHost: getChecked('settings-auto-approve', true),
      requireExternalId: getChecked('settings-require-id', true),
      qrWatermark: getChecked('settings-qr-watermark', true),
      scannerFeedback: getChecked('settings-scanner-feedback', true),
      gemmaModel: getVal('settings-gemma-model', 'gemma-2-9b-it'),
      aiAutonomousSchedule: getChecked('settings-ai-schedule', true),
      aiVendorGuardrails: getChecked('settings-ai-vendor', true),
      aiCreativity: parseFloat(getVal('settings-ai-creativity', '0.4')),
      alertGateInflow: getChecked('settings-alert-gate', true),
      alertSponsorMilestones: getChecked('settings-alert-sponsor', true),
      alertCateringThreshold: getChecked('settings-alert-catering', true)
    };

    try {
      localStorage.setItem('unisphere_settings', JSON.stringify(config));
    } catch (e) {}

    this.updateProfileUI(config.userName, config.userRole);
    this.showToast('Settings Saved', 'University preferences and security policies updated successfully.', 'success');
  }

  updateProfileUI(name, role) {
    const headerName = document.getElementById('header-user-name');
    const headerRole = document.getElementById('header-user-role');
    const dropName = document.getElementById('dropdown-user-name');
    const dropRole = document.getElementById('dropdown-user-role');

    if (headerName) headerName.textContent = name;
    if (headerRole) headerRole.textContent = role.split('&')[0].trim();
    if (dropName) dropName.textContent = name;
    if (dropRole) dropRole.textContent = `${role.split('&')[0].trim()} at Apex Univ`;
  }

  resetSettingsToDefault() {
    try {
      localStorage.removeItem('unisphere_settings');
    } catch (e) {}
    this.loadSettings();
    this.showToast('Reset Complete', 'Application configuration restored to campus factory defaults.', 'info');
  }

  toggleFaq(faqId) {
    const el = document.getElementById(faqId);
    const icon = document.getElementById(`${faqId}-icon`);
    if (el) {
      el.classList.toggle('hidden');
      if (icon) {
        icon.classList.toggle('rotate-180');
      }
    }
  }

  submitSupportInquiry(event) {
    if (event) event.preventDefault();
    const dept = document.getElementById('support-dept')?.value || 'Central Operations';
    const subject = document.getElementById('support-subject')?.value || 'Campus Event Request';
    const name = document.getElementById('support-name')?.value || 'Alex Morgan';

    this.showToast(
      'Support Ticket Dispatched',
      `Ticket logged for ${dept}: "${subject}". Assigned to university event operations desk.`,
      'success'
    );
    const form = document.getElementById('support-form');
    if (form) form.reset();
    const nameInput = document.getElementById('support-name');
    if (nameInput) nameInput.value = name;
  }

  closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  }

  async submitNewEvent(ev) {
    ev.preventDefault();
    const payload = {
      title: document.getElementById('ev-title').value,
      category: document.getElementById('ev-category').value,
      date: document.getElementById('ev-date').value,
      time: document.getElementById('ev-time').value,
      venue: document.getElementById('ev-venue').value,
      coordinator: document.getElementById('ev-coordinator').value,
      budget: document.getElementById('ev-budget').value,
      maxCapacity: document.getElementById('ev-capacity').value,
      description: document.getElementById('ev-desc').value
    };

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        this.closeModal('new-event-modal');
        this.showToast('Event Created', 'Submitted for coordinator review', 'success');
        await this.loadEvents();
        await this.loadStats();
      }
    } catch (e) {
      this.showToast('Error', e.message, 'error');
    }
  }

  async submitNewVendor(ev) {
    ev.preventDefault();
    const payload = {
      eventId: document.getElementById('vnd-event-select').value,
      category: document.getElementById('vnd-category').value,
      quotedAmount: document.getElementById('vnd-quote').value,
      vendorName: document.getElementById('vnd-name').value,
      contactPerson: document.getElementById('vnd-contact').value,
      phone: document.getElementById('vnd-phone').value,
      deliverables: document.getElementById('vnd-deliverables').value
    };

    try {
      const res = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        this.closeModal('new-vendor-modal');
        this.showToast('Vendor Saved', 'Logged in vendor master', 'success');
        await this.renderVendorsTable();
      }
    } catch (e) {
      this.showToast('Error', e.message, 'error');
    }
  }

  async submitNewSponsor(ev) {
    ev.preventDefault();
    const payload = {
      eventId: document.getElementById('spn-event-select').value,
      companyName: document.getElementById('spn-name').value,
      tier: document.getElementById('spn-tier').value,
      contributionAmount: document.getElementById('spn-amount').value,
      contactEmail: document.getElementById('spn-email').value
    };

    try {
      const res = await fetch('/api/sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        this.closeModal('new-sponsor-modal');
        this.showToast('Sponsor Saved', 'Corporate sponsor logged', 'success');
        await this.renderSponsorsTable();
      }
    } catch (e) {
      this.showToast('Error', e.message, 'error');
    }
  }

  async deleteVendor(id) {
    if (!confirm('Remove this vendor requisition?')) return;
    try {
      const res = await fetch(`/api/vendors/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        this.showToast('Removed', 'Vendor removed', 'info');
        await this.renderVendorsTable();
      }
    } catch (e) {
      this.showToast('Error', e.message, 'error');
    }
  }

  async deleteSponsor(id) {
    if (!confirm('Remove this sponsor record?')) return;
    try {
      const res = await fetch(`/api/sponsors/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        this.showToast('Removed', 'Sponsor removed', 'info');
        await this.renderSponsorsTable();
      }
    } catch (e) {
      this.showToast('Error', e.message, 'error');
    }
  }

  async resetData() {
    if (!confirm('Reset all festival data back to original seed records?')) return;
    try {
      const res = await fetch('/api/admin/reset', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        this.showToast('Reset Complete', json.message, 'success');
        await this.loadEvents();
        await this.loadStats();
        await this.renderEventsTable();
        await this.renderVendorsTable();
        await this.renderParticipantTasks();
      }
    } catch (e) {
      this.showToast('Error', e.message, 'error');
    }
  }
}

const app = new AppController();
window.app = app;
