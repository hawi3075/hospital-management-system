import { useEffect, useState } from 'react';
import { ArrowUpRight, CalendarDays, ClipboardList, Users } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import { normalizeRole, roleTitles } from '../routes/roleConfig';

const dashboardCopy = {
  PATIENT: { eyebrow: 'Your care journey', title: 'A clearer view of your care.', subtitle: 'Appointments, records, results, and bills in one place.', links: [['appointments', 'Review appointments'], ['medical-record', 'Open medical record'], ['bills', 'Review bills']] },
  RECEPTIONIST: { eyebrow: 'Today at the front desk', title: 'Keep every arrival moving.', subtitle: 'Register patients, confirm visits, and keep the waiting room visible.', links: [['patients/new', 'Register patient'], ['appointments', 'Review appointments'], ['queue', 'Open queue']] },
  DOCTOR: { eyebrow: 'Clinical priorities', title: 'Start with the patients who need you.', subtitle: 'Review today\'s schedule and move consultations through care.', links: [['appointments', 'Review schedule'], ['patients', 'Find a patient'], ['consultations', 'Open consultations']] },
  NURSE: { eyebrow: 'Care team station', title: 'Coordinate bedside care.', subtitle: 'Keep assigned patients, observations, and medication tasks in view.', links: [['assigned-patients', 'Assigned patients'], ['vitals', 'Record vitals'], ['ward', 'Open ward board']] },
  LAB_TECHNICIAN: { eyebrow: 'Laboratory operations', title: 'Turn requests into verified results.', subtitle: 'Prioritize samples, processing, and results waiting for verification.', links: [['orders', 'Open doctor requests'], ['sample-collection', 'Collect samples'], ['verification', 'Verify results']] },
  RADIOLOGY_TECHNICIAN: { eyebrow: 'Imaging operations', title: 'Keep imaging requests moving.', subtitle: 'Manage requests, studies, reports, and verification from one workspace.', links: [['requests', 'Review requests'], ['processing', 'Open processing'], ['reports', 'Review reports']] },
  PHARMACIST: { eyebrow: 'Pharmacy operations', title: 'Dispense safely and stay ahead of stock.', subtitle: 'Review prescriptions and inventory signals before the next handoff.', links: [['prescriptions', 'Review prescriptions'], ['dispensing', 'Open dispensing'], ['inventory', 'Review inventory']] },
  CASHIER: { eyebrow: 'Financial operations', title: 'Make every payment accountable.', subtitle: 'Review invoices, outstanding balances, and today\'s collection activity.', links: [['invoices', 'Review invoices'], ['payments', 'Record payment'], ['outstanding', 'Open outstanding balances']] },
  HOSPITAL_ADMIN: { eyebrow: 'Hospital operations', title: 'See the hospital as one system.', subtitle: 'Coordinate people, capacity, clinical operations, and financial activity.', links: [['patients', 'Review patients'], ['users', 'Manage users'], ['audit-logs', 'Open audit log']] },
  SUPER_ADMIN: { eyebrow: 'Platform control', title: 'Keep every hospital healthy.', subtitle: 'Manage global users, security, organizations, and system health.', links: [['hospitals', 'Manage hospitals'], ['users', 'Review users'], ['system-health', 'Check system health']] },
};

export default function RoleDashboard() {
  const { role } = useParams();
  const currentRole = normalizeRole(role?.toUpperCase());
  const copy = dashboardCopy[currentRole] || dashboardCopy.HOSPITAL_ADMIN;
  const [patientCount, setPatientCount] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    apiClient.get('/patients').then((response) => {
      if (active) setPatientCount(response.data.count ?? response.data.data?.length ?? 0);
    }).catch(() => {
      if (active) setError('Live patient metrics are unavailable right now.');
    });
    return () => { active = false; };
  }, []);

  const metrics = currentRole === 'PATIENT'
    ? [['Next appointment', 'Review schedule', CalendarDays], ['Medical record', 'Available securely', ClipboardList], ['Care team', 'Connected services', Users]]
    : [['Patients in system', patientCount === null ? 'Loading...' : patientCount, Users], ['Today\'s work', 'Open your queue', ClipboardList], ['Notifications', 'Review updates', CalendarDays]];

  return <section className="dashboard-page"><div className="page-heading"><div><span className="eyebrow">{copy.eyebrow}</span><h1>{copy.title}</h1><p>{copy.subtitle}</p></div><span className="role-pill">{roleTitles[currentRole] || currentRole}</span></div>{error && <div className="inline-error">{error}</div>}<div className="metric-grid dashboard-metrics">{metrics.map(([label, value, Icon]) => <article className="metric-card" key={label}><Icon size={19} /><span>{label}</span><strong>{value}</strong></article>)}</div><div className="dashboard-grid"><article className="content-panel"><div className="panel-heading"><div><span className="section-label">Next actions</span><h2>Move work forward</h2></div><ArrowUpRight size={19} /></div><div className="action-list">{copy.links.map(([to, label]) => <Link key={to} to={`/workspace/${currentRole.toLowerCase()}/${to}`}><span>{label}</span><ArrowUpRight size={17} /></Link>)}</div></article><article className="content-panel operational-panel"><span className="section-label">System status</span><h2>CarePulse services</h2><p>Authentication, clinical records, and operational services are connected to the hospital API.</p><div className="service-status"><span className="status-dot" /> API connection monitored</div></article></div></section>;
}
