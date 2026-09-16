import { useState } from 'react';

const workspaceDetails = {
  HOSPITAL_MANAGER: { title: 'Operations overview', subtitle: 'Keep the hospital moving with a live view of capacity, staffing, and performance.', metrics: [['84%', 'Bed occupancy'], ['18', 'Open shifts'], ['96%', 'Service level']], sections: ['Capacity planning', 'Staff coverage', 'Performance reports'] },
  DOCTOR: { title: 'Clinical workspace', subtitle: 'Review your clinical queue, patient history, and follow-up priorities.', metrics: [['12', 'Today\'s visits'], ['04', 'Lab results'], ['07', 'Follow-ups']], sections: ['Today\'s appointments', 'Patient records', 'Consultation notes'] },
  NURSE: { title: 'Care team station', subtitle: 'Coordinate bedside care, observations, and handoffs across your ward.', metrics: [['24', 'Assigned patients'], ['08', 'Observations due'], ['03', 'Handoffs']], sections: ['Ward census', 'Vitals and observations', 'Shift handover'] },
  RECEPTIONIST: { title: 'Front desk workspace', subtitle: 'Make every arrival, booking, and patient handoff feel effortless.', metrics: [['34', 'Appointments'], ['09', 'Waiting room'], ['06', 'New registrations']], sections: ['Appointment queue', 'Patient registration', 'Check-in desk'] },
  PHARMACIST: { title: 'Pharmacy workspace', subtitle: 'Keep prescriptions moving safely from order to dispense.', metrics: [['28', 'Pending orders'], ['11', 'Low stock items'], ['97%', 'Dispensed today']], sections: ['Prescription queue', 'Inventory watch', 'Dispensing history'] },
  LAB_TECHNICIAN: { title: 'Laboratory workspace', subtitle: 'Prioritize specimens and publish accurate results to the care team.', metrics: [['19', 'Samples received'], ['07', 'In processing'], ['14', 'Results released']], sections: ['Specimen queue', 'Results to verify', 'Test catalog'] },
  BILLING_EXECUTIVE: { title: 'Revenue workspace', subtitle: 'Track invoices, payments, and outstanding balances with confidence.', metrics: [['$24.8k', 'Collected today'], ['31', 'Open invoices'], ['92%', 'Collection rate']], sections: ['Invoice queue', 'Payments received', 'Insurance claims'] },
};

export default function RoleWorkspace({ user, onLogout }) {
  const [activeSection, setActiveSection] = useState(0);
  const content = workspaceDetails[user.role] || workspaceDetails.HOSPITAL_MANAGER;
  const roleLabel = user.role.replaceAll('_', ' ');

  return <main className="workspace-shell">
    <aside className="workspace-sidebar"><div className="brand-mark">N<span>/</span>S</div><div className="sidebar-copy"><span className="eyebrow">Northstar HMS</span><strong>{roleLabel}</strong></div><nav>{content.sections.map((section, index) => <button key={section} className={activeSection === index ? 'active' : ''} onClick={() => setActiveSection(index)}><span>0{index + 1}</span>{section}</button>)}</nav><button className="sidebar-logout" onClick={onLogout}>Sign out</button></aside>
    <section className="workspace-main"><header className="workspace-header"><div><span className="eyebrow">{roleLabel} / workspace</span><h1>{content.title}</h1><p>{content.subtitle}</p></div><div className="profile-chip"><span>{user.username?.slice(0, 1).toUpperCase() || 'U'}</span>{user.username || 'User'}</div></header><div className="metric-grid">{content.metrics.map(([value, label]) => <article className="metric-card" key={label}><strong>{value}</strong><span>{label}</span></article>)}</div><div className="detail-panel"><div><span className="section-label">Active detail</span><h2>{content.sections[activeSection]}</h2></div><p>Live records for this area will appear here as your team completes daily work. Use the navigation to move between your role’s operational views.</p><button className="primary-action compact">Open detail view <span>→</span></button></div><div className="workspace-note"><span className="status-dot" /> All systems operational <span>Last synced just now</span></div></section>
  </main>;
}